import { useEffect, useRef, useState } from "react";
import { zoomInt } from "../../utils/functions";

const ZoomImage = ({ attributes }) => {
  const { zoom, cId, img, viewerType } = attributes;
  const {
    disablePan = false,
    disableZoom = false,
    disableXAxis = false,
    disableYAxis = false,
    startScale = 1,
    step = 0.3,
  } = zoom || {};

  const panZoomRef = useRef(null);
  const wrapperRef = useRef(null);
  const outerRef = useRef(null);

  // null = not yet detected, true = editor iframe, false = frontend
  const [isEditor, setIsEditor] = useState(null);

  // Refs for editor native zoom/pan (avoids re-renders during interaction)
  const scaleRef = useRef(startScale || 1);
  const posRef = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // ── 1. Detect editor vs frontend (apiVersion 2 & 3 compatible) ─────────────
  useEffect(() => {
    const elem = wrapperRef.current;
    if (!elem) return;

    // apiVersion 2: block render হয় admin DOM-এ, ownerDocument === window.document
    // apiVersion 3: block render হয় iframe-এর ভেতরে, ownerDocument !== window.document
    const isWpEditor =
      elem.ownerDocument !== window.document || // apiVersion 3 iframe
      !!window?.wp?.blockEditor; // apiVersion 2 fallback

    setIsEditor(isWpEditor);
  }, []);

  // ── 2. Frontend: Panzoom (works fine outside iframe) ─────────────────────
  useEffect(() => {
    if (isEditor !== false || viewerType !== "zoom") return;

    let rafId1, rafId2;
    const elem = wrapperRef.current;
    if (!elem) return;

    const win = elem.ownerDocument?.defaultView || window;
    rafId1 = win.requestAnimationFrame(() => {
      rafId2 = win.requestAnimationFrame(() => {
        const el = wrapperRef.current;
        if (el && el.parentElement) {
          zoomInt(zoom, el, (pan) => {
            panZoomRef.current = pan;
          });
        }
      });
    });

    return () => {
      cancelAnimationFrame(rafId1);
      cancelAnimationFrame(rafId2);
      if (panZoomRef.current) {
        try {
          if (panZoomRef.current.parent) {
            panZoomRef.current.parent.removeEventListener(
              "wheel",
              panZoomRef.current.zoomWithWheel,
            );
          }
          panZoomRef.current.destroy();
        } catch (e) {
          /* destroy may fail if already gone */
        }
        panZoomRef.current = null;
        if (wrapperRef.current) {
          wrapperRef.current.style.transform = "";
          wrapperRef.current.style.transformOrigin = "";
          wrapperRef.current.style.cursor = "";
          wrapperRef.current.style.transition = "";
        }
      }
    };
  }, [
    isEditor,
    viewerType,
    disablePan,
    disableZoom,
    disableXAxis,
    disableYAxis,
    startScale,
    step,
  ]);

  // ── 3. Editor: wheel zoom listener ───────────────────────────────────────
  useEffect(() => {
    if (isEditor !== true || viewerType !== "zoom") return;
    const outer = outerRef.current;
    if (!outer) return;

    const handleWheel = (e) => {
      if (disableZoom) return;
      e.preventDefault();
      const dir = e.deltaY < 0 ? 1 : -1;
      scaleRef.current = Math.min(
        Math.max(scaleRef.current + dir * (step || 0.3), 0.125),
        12,
      );
      applyTransform();
    };

    outer.addEventListener("wheel", handleWheel, { passive: false });
    return () => outer.removeEventListener("wheel", handleWheel);
  }, [isEditor, viewerType, disableZoom, step]);

  // ── 4. Reset when startScale changes ─────────────────────────────────────
  useEffect(() => {
    if (isEditor !== true) return;
    scaleRef.current = startScale || 1;
    posRef.current = { x: 0, y: 0 };
    applyTransform();
  }, [isEditor, startScale]);

  // ── 5. Editor: Global drag listeners on ownerDocument ────────────────────
  // এই approach-এ cursor image-এর বাইরে গেলেও drag কাজ করে
  // কারণ mousemove/mouseup listener টা document-এ থাকে, element-এ নয়
  useEffect(() => {
    if (isEditor !== true || viewerType !== "zoom") return;
    const outer = outerRef.current;
    if (!outer) return;

    // ownerDocument ব্যবহার করছি — apiVersion 3 (iframe doc) ও apiVersion 2 (admin doc) উভয়েই কাজ করবে
    const doc = outer.ownerDocument || document;

    const handleMouseMove = (e) => {
      if (!dragging.current || disablePan) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      dragStart.current = { x: e.clientX, y: e.clientY };
      if (!disableXAxis) posRef.current.x += dx;
      if (!disableYAxis) posRef.current.y += dy;
      applyTransform();
    };

    const handleMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      applyTransform();
    };

    // document-এ attach করলে cursor element-এর বাইরে গেলেও drag চলতে থাকে
    doc.addEventListener("mousemove", handleMouseMove);
    doc.addEventListener("mouseup", handleMouseUp);

    return () => {
      doc.removeEventListener("mousemove", handleMouseMove);
      doc.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isEditor, viewerType, disablePan, disableXAxis, disableYAxis]);

  // Applies CSS transform directly to DOM (no React re-render needed)
  const applyTransform = () => {
    const elem = wrapperRef.current;
    if (!elem) return;
    const { x, y } = posRef.current;
    const sc = scaleRef.current;
    elem.style.transform = `scale(${sc}) translate(${x / sc}px, ${y / sc}px)`;
    elem.style.transformOrigin = "50% 50%";
    if (!disableZoom || !disablePan) {
      elem.style.cursor = dragging.current
        ? "grabbing"
        : sc > 1 && !disablePan
        ? "grab"
        : !disableZoom
        ? "zoom-in"
        : "default";
    }
  };

  // ── 6. mousedown — শুধু drag শুরু করার জন্য (element-এ থাকলেই চলবে) ──────
  const handleMouseDown = (e) => {
    if (!isEditor || disablePan) return;
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  };

  return (
    <div
      className="bpivb-zoom-wapper"
      ref={outerRef}
      style={{
        overflow: "hidden",
        width: "100%",
        position: "relative",
      }}
      onMouseDown={isEditor ? handleMouseDown : undefined}
      // onMouseMove ও onMouseUp এখন document-এ — JSX থেকে সরানো হয়েছে
      // cursor image-এর বাইরে গেলেও drag চলতে থাকবে
    >
      <div
        id={`panzoom-${cId}`}
        ref={wrapperRef}
        style={
          isEditor
            ? { userSelect: "none", width: "100%", height: "100%" }
            : { width: "100%", height: "100%" }
        }
      >
        <img src={img?.url} alt={img?.title || "Zoomable image"} />
      </div>
    </div>
  );
};

export default ZoomImage;
