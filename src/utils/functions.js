import Panzoom from "@panzoom/panzoom";
//helper functions
export const getEditorDoc = () => {
  return (
    document.querySelector('iframe[name="editor-canvas"]')?.contentDocument ||
    document.querySelector("iframe.editor-canvas__iframe")?.contentDocument ||
    document
  );
};

export const zoomInt = (zoom, elem, setPanZoom) => {
  const {disablePan, disableZoom,disableXAxis, disableYAxis,duration, startScale, step, panOnlyWhenZoomed, contain} = zoom;
  // block.json stores 'null' as the string "null" (a real `null` can't round-trip
  // through a serialized attribute), so translate it back for Panzoom here.
  const resolvedContain = !contain || contain === 'null' ? null : contain;
  if (!elem || !elem.parentElement) return;
  try {
    const pan = Panzoom(elem, {
      animate: false,
      canvas: false,

      // cursor: "move" ছিল — এখন dynamic করা হচ্ছে (নিচে event-এ)
      cursor: disableZoom ? "default" : "zoom-in",

      // Disable panning and zooming
      disablePan,
      disableZoom,

      // Pan only on the X or Y axes
      disableXAxis,
      disableYAxis,

      // Animation duration (ms)
      duration, // ok

      // CSS easing used for scale transition
      easing: "ease-in-out",

      // An array of elements to exclude
      exclude: [],

      // Or add the CSS class to element that should be excluded
      excludeClass: "panzoom-exclude",

      maxScale: 12,
      minScale: 0.125,

      // CSS overflow property
      overflow: "hidden",

      panOnlyWhenZoomed,
      pinchAndPan: true,
      relative: false,
      startX: 0,
      startY: 0,
      startScale, // ok
      step, // ok
      contain: resolvedContain,
      touchAction: "none",
    });

    // ── Dynamic cursor: zoom-in → grab → grabbing ────────────────────────
    // Panzoom events ব্যবহার করে editor-এর মতো cursor দেখানো হচ্ছে
    const updateCursor = (scale, isPanning) => {
      if (disableZoom && disablePan) return;
      if (isPanning) {
        elem.style.cursor = "grabbing";
      } else if (scale > 1 && !disablePan) {
        elem.style.cursor = "grab";
      } else if (!disableZoom) {
        elem.style.cursor = "zoom-in";
      } else {
        elem.style.cursor = "default";
      }
    };

    // drag শুরু হলে → grabbing
    elem.addEventListener("panzoomstart", () => {
      updateCursor(pan.getScale(), true);
    });

    // drag শেষ বা zoom হলে → grab বা zoom-in
    elem.addEventListener("panzoomend", () => {
      updateCursor(pan.getScale(), false);
    });

    elem.addEventListener("panzoomchange", () => {
      if (!pan.isPanning?.()) {
        updateCursor(pan.getScale(), false);
      }
    });

    setPanZoom(pan);
    const parent = elem.parentElement;
    pan.parent = parent;
    parent.addEventListener("wheel", pan.zoomWithWheel, { passive: false });
  } catch (err) {
    console.warn("[ZoomImage] Panzoom init failed:", err.message);
  }
};

/**
 * Builds the Panolens viewer inside the block's .bpivbPanorama container.
 *
 * Returns a teardown function the caller MUST invoke from its effect's
 * cleanup. Without it, two invocations of this function for the same mount
 * (which the block editor's React 18 StrictMode deliberately triggers once
 * per block, to surface exactly this kind of bug) each start their own
 * fetch()-based image load; if the first invocation's fetch resolves after
 * the second has already built its viewer, its `build()` call still fires
 * and adds a second Panolens canvas into the same container — two panoramas
 * stacked in the DOM for what is a single block. The teardown marks the
 * call stale (so a late `build()` becomes a no-op) and destroys any viewer
 * it already created (so its render loop doesn't keep running after the
 * effect that started it has been cleaned up).
 */
export const pano = (clientId, img, autoRotate, rotateSpeed, hideControl) => {
  const doc = getEditorDoc();
  const panoContainer =
    doc.querySelector(`#${clientId} .bpivbPanorama`) ||
    document.querySelector(`#${clientId} .bpivbPanorama`);
  if (!panoContainer) return () => {};

  panoContainer.innerHTML = "";

  let stale = false;
  let activeViewer = null;
  const teardown = () => {
    stale = true;
    if (activeViewer) {
      try {
        activeViewer.destroy();
      } catch (err) {
        // Already gone (container removed, viewer already disposed).
      }
      activeViewer = null;
    }
  };

  if (!img?.url) return teardown;

  /*
   * The proxy is a CORS workaround for cross-origin images (see
   * image-viewer-block.php for why its permission_callback must stay public).
   * It rejects anything that is not an http(s) URL, and only passes
   * jpeg/png/gif/webp.
   *
   * None of that is needed for an image the browser can already load itself —
   * a data URI, a blob, or a file from this site's own media library, which is
   * where a panorama almost always comes from. Those go straight to the
   * viewer. Only a genuinely cross-origin image still needs the proxy, and if
   * that request fails we try the URL directly rather than showing nothing.
   */
  const needsProxy = (url) => {
    if (/^(data|blob):/i.test(url)) {
      return false;
    }
    try {
      return new URL(url, window.location.href).origin !== window.location.origin;
    } catch (err) {
      return false;
    }
  };

  const build = (imageSource) => {
      // A superseded call (see the teardown docs above) must not touch the
      // DOM once it's stale — its fetch can still resolve after a newer
      // call already built its own viewer here.
      if (stale) return;

      /*DO NOT TOUCH – as requested */
      const panorama = new PANOLENS.ImagePanorama(imageSource);
      const viewer = new PANOLENS.Viewer({
        container: panoContainer,
        autoRotate,
        autoRotateSpeed: rotateSpeed,
        controlBar: hideControl,
      });
      viewer.add(panorama);
      activeViewer = viewer;

      const isEditor =
        !!document.querySelector('iframe[name="editor-canvas"]') ||
        !!document.querySelector('iframe.editor-canvas__iframe') ||
        !!window?.wp?.blockEditor;

      if (isEditor) {
        const iframeDoc = panoContainer.ownerDocument;
        if (iframeDoc && iframeDoc !== document) {
          const eventsToForward = [
            "mousemove",
            "mouseup",
            "pointermove",
            "pointerup"
          ];

          eventsToForward.forEach((eventName) => {
            iframeDoc.addEventListener(eventName, (e) => {
              const clonedEvent = new e.constructor(e.type, e);
              document.dispatchEvent(clonedEvent);
            }, { passive: true });
          });
        }
      }
  };

  if (!needsProxy(img.url)) {
    build(img.url);
    return teardown;
  }

  if (!window.BPIVB_REST) {
    build(img.url);
    return teardown;
  }

  const apiUrl = `${
    window.BPIVB_REST.root
  }bpivb/v1/image-proxy?url=${encodeURIComponent(img.url)}`;
  fetch(apiUrl, {
    method: "GET",
    headers: { "X-WP-Nonce": window.BPIVB_REST.nonce },
    credentials: "same-origin",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Image proxy request failed");
      }
      return res.blob();
    })
    .then((blob) => build(URL.createObjectURL(blob)))
    .catch(() => {
      // The proxy refused it (an unsupported format, a network error).
      // The image may still load directly, so try before giving up.
      build(img.url);
    });

  return teardown;
};

export const updateStyle = (newStyle, attributes, setAttributes, allStyles) => {
  const newData = allStyles[newStyle] || {};
  if (newStyle === "zoom") {
    setAttributes({
      viewerType: newStyle,
      [newStyle]: {
        ...attributes[newStyle],
        ...newData,
      },
    });
  } else if (newStyle === "magnify") {
    setAttributes({
      viewerType: newStyle,
      [newStyle]: {
        ...attributes[newStyle],
        ...newData,
      },
    });
  } else if (newStyle === "map") {
    setAttributes({
      viewerType: newStyle,
      maps: allStyles?.maps,
    });
  } else if (newStyle === "pano") {
    setAttributes({
      viewerType: newStyle,
      width: allStyles?.width || "100%",
      height: allStyles?.height || "320px",
      autoRotate: allStyles?.autoRotate || true,
      rotateSpeed: allStyles?.rotateSpeed || 2,
      hideControl: allStyles?.hideControl || true,
      autoPlay: allStyles?.autoPlay || true,
    });
  }
};
