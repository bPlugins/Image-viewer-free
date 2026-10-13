import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// `value`'s top/left/width/height are *percentages* (0-100) of the parent
// container (.bpivbImageMap, which always matches the image's rendered
// box) — not pixels. That's what keeps a hotspot aligned with the same
// point on the image at any viewport width, since the responsive image
// itself is sized in percentages too.
//
// The rendered pixel box is always *derived* from `value` + the container's
// current size — there is no local state mirroring `value` between drags.
// An earlier version kept local `offset`/`dimension` state in sync with
// `value` via one effect, and reported it back via another; because
// `onChange` round-trips through the parent block's `setAttributes` (an
// async store update, not a same-tick state update), the two effects could
// observe `value` and the container size at inconsistent points in time and
// never converge — an infinite render loop, hit in testing. Deriving the box
// from props on every render removes the loop entirely: there's nothing to
// get out of sync when idle. Local state (`liveBox`) is only used for the
// duration of an active drag/resize gesture, and is cleared (committing via
// onChange) on mouseup.
const round2 = n => Math.round(n * 100) / 100;

// Keeps the box fully inside the image — including the block.json factory
// default (100/100/100/100), which as a percentage would otherwise place
// a brand-new hotspot entirely past the bottom-right corner, invisible and
// unreachable until dragged. (block.json's default itself is left alone —
// only how it's interpreted here changes.)
const clampBox = ({ top, left, width, height }) => {
  const w = Math.min(Math.max(width, 0), 100);
  const h = Math.min(Math.max(height, 0), 100);
  const l = Math.min(Math.max(left, 0), 100 - w);
  const t = Math.min(Math.max(top, 0), 100 - h);
  return { top: t, left: l, width: w, height: h };
};

const ResizableDraggable = ({ value = { width: 20, height: 20, top: 20, left: 20 }, bgColor = '', shape, mapBorder, onChange = () => {}, ...props }) => {
  const resizable = useRef(null);
  const resizeHandle = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [liveBox, setLiveBox] = useState(null); // pixels, only while dragging/resizing

  // .bpivbImageMap has no definite height of its own — it's only ever as
  // tall as its <img>, whose own height:100% resolves to nothing until the
  // image has actually loaded. Track the container's real size with a
  // ResizeObserver so the percentage conversion below has something valid
  // to convert against as soon as it's available.
  useLayoutEffect(() => {
    const parent = resizable.current?.parentNode;
    if (!parent) return;
    const measure = () => setContainerSize({ width: parent.offsetWidth, height: parent.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  const cw = containerSize.width || 0;
  const ch = containerSize.height || 0;

  const clampedValue = clampBox(value);
  const box =
    liveBox || {
      left: (clampedValue.left / 100) * cw,
      top: (clampedValue.top / 100) * ch,
      width: (clampedValue.width / 100) * cw,
      height: (clampedValue.height / 100) * ch,
    };

  const commit = px => {
    if (!cw || !ch) return;
    onChange({
      left: round2((px.left / cw) * 100),
      top: round2((px.top / ch) * 100),
      width: round2((px.width / cw) * 100),
      height: round2((px.height / ch) * 100),
    });
  };

  useEffect(() => {
    const handleResizeStart = e => {
      e.stopPropagation();
      const prevX = e.clientX;
      const prevY = e.clientY;
      const startBox = box;
      let current = startBox;

      const handleResize = e => {
        const parent = resizable.current.parentNode;
        const parentBoundingRect = parent.getBoundingClientRect();
        const boundingRect = resizable.current.getBoundingClientRect();
        let width = startBox.width + (e.clientX - prevX);
        let height = startBox.height + (e.clientY - prevY);
        if (parent.offsetWidth < width + (boundingRect.left - parentBoundingRect.left)) {
          width = current.width;
        }
        if (parent.offsetHeight < height + (boundingRect.top - parentBoundingRect.top)) {
          height = current.height;
        }
        current = { ...startBox, width, height };
        setLiveBox(current);
      };

      const doc = resizable.current?.ownerDocument || document;
      const handleResizeEnd = () => {
        commit(current);
        setLiveBox(null);
        doc.removeEventListener('mousemove', handleResize);
        doc.removeEventListener('mouseup', handleResizeEnd);
      };
      doc.addEventListener('mousemove', handleResize);
      doc.addEventListener('mouseup', handleResizeEnd);
    };

    const handleDragStart = e => {
      if (!resizable.current) return;
      const startBox = box;
      const boundingRect = resizable.current.getBoundingClientRect();
      const parentBoundingRect = resizable.current.parentNode.getBoundingClientRect();
      const offsetX = e.clientX - (boundingRect.left - parentBoundingRect.left);
      const offsetY = e.clientY - (boundingRect.top - parentBoundingRect.top);
      let current = startBox;

      const handleDrag = e => {
        const parent = resizable.current.parentNode;
        let left = e.clientX - offsetX;
        let top = e.clientY - offsetY;

        if (left <= 0) left = 0;
        if (startBox.width + left >= parent.offsetWidth) {
          left = parent.offsetWidth - startBox.width;
        }
        if (top < 0) top = 0;
        if (startBox.height + top >= parent.offsetHeight) {
          top = parent.offsetHeight - startBox.height;
        }

        current = { ...startBox, left, top };
        setLiveBox(current);
      };

      const doc = resizable.current?.ownerDocument || document;
      const handleDragEnd = () => {
        if (resizable.current) {
          resizable.current.style.cursor = 'move';
        }
        commit(current);
        setLiveBox(null);
        doc.removeEventListener('mousemove', handleDrag);
        doc.removeEventListener('mouseup', handleDragEnd);
      };

      resizable.current.style.cursor = 'grabbing';
      doc.addEventListener('mousemove', handleDrag);
      doc.addEventListener('mouseup', handleDragEnd);
    };

    resizeHandle.current?.addEventListener('mousedown', handleResizeStart);
    resizable.current?.addEventListener('mousedown', handleDragStart);

    return () => {
      resizeHandle.current?.removeEventListener('mousedown', handleResizeStart);
      resizable.current?.removeEventListener('mousedown', handleDragStart);
    };
    // Re-attach whenever the box this gesture should start from changes
    // (a resize/drag commit updates `value`; a container resize updates
    // cw/ch) — the handlers close over `box` at attach time, so a stale
    // closure would make the next drag jump from an outdated position.
  }, [cw, ch, value.left, value.top, value.width, value.height]);

  const getShapeStyle = shape => {
    switch (shape) {
      case 'circle':
        return { clipPath: 'circle(50% at 50% 50%)' };
      case 'rect':
        return { borderRadius: '0' };
      case 'hexagon':
        return {
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        };
      case 'octagon':
        return {
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
        };
      default:
        return {};
    }
  };

  return (
    <div
      ref={resizable}
      className="resizable-draggable"
      id="resizeMe"
      style={{
        width: box.width,
        height: box.height,
        zIndex: '99',
        border: `${mapBorder?.width} ${mapBorder?.style} ${mapBorder?.color}`,
        background: bgColor,
        left: box.left + 'px',
        top: box.top + 'px',
        ...getShapeStyle(shape),
      }}
      {...props}
    >
      <div
        ref={resizeHandle}
        id="resizeHandle"
        style={{
          width: '12px',
          height: '12px',
          background: '#333',
          position: 'absolute',
          bottom: '0',
          right: '0',
          cursor: 'nwse-resize',
        }}
      ></div>
    </div>
  );
};

export default ResizableDraggable;
