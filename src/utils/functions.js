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
  const {disablePan, disableZoom,disableXAxis, disableYAxis,duration, startScale, step} = zoom;
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

      panOnlyWhenZoomed: false,
      pinchAndPan: true,
      relative: false,
      startX: 0,
      startY: 0,
      startScale, // ok
      step, // ok
      contain: null,
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

export const pano = (clientId, img, autoRotate, rotateSpeed, hideControl) => {
  const doc = getEditorDoc();
  const panoContainer =
    doc.querySelector(`#${clientId} .bpivbPanorama`) ||
    document.querySelector(`#${clientId} .bpivbPanorama`);
  if (!panoContainer) return;

  panoContainer.innerHTML = "";

  if (!img?.url || !window.BPIVB_REST) return;

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
    .then((blob) => {
      const imageSource = URL.createObjectURL(blob);

      /*DO NOT TOUCH – as requested */
      const panorama = new PANOLENS.ImagePanorama(imageSource);
      const viewer = new PANOLENS.Viewer({
        container: panoContainer,
        autoRotate,
        autoRotateSpeed: rotateSpeed,
        controlBar: hideControl,
      });
      viewer.add(panorama);

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
    })
    .catch((err) => {
      console.error("Panorama load failed:", err);
    });
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
