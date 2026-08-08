import { useEffect, useRef, useState } from "react";

const ResizableDraggable = ({value = { width: 100, height: 100, top: 50, left: 50}, bgColor = "", shape, mapBorder,onChange = () => { }, ...props}) =>{
  const { width = 100, height = 100, top = 50, left = 50 } = value;
  const resizable = useRef(null);
  const resizeHandle = useRef(null);
  const [offset, setOffset] = useState({ top: parseInt(top), left: parseInt(left)});
  const [dimension, setDimension] = useState({ width, height });


  useEffect(() => {
    if (value) {
      setOffset({ top: parseInt(value.top), left: parseInt(value.left) });
      setDimension({ width: value.width, height: value.height });
    }
  }, [value.top, value.left, value.width, value.height]);


  const [isResizing, setResizing] = useState(true);
  const [isDragging, setDragging] = useState(true);

  const containerDimension = useRef();

  useEffect(() => {
    if (resizable.current) {
      const height =
        resizable.current.parentNode.offsetHeight ||
        resizable.current.offsetHeight * 2;
      const width =
        resizable.current.parentNode.offsetWidth ||
        resizable.current.offsetWidth * 2;
      containerDimension.current = { height, width };
    }

    const handleResizeStart = (e) => {
      e.stopPropagation();
      const prevX = e.clientX;
      const prevY = e.clientY;
      const initialWidth = resizable.current.offsetWidth;
      const initialHeight = resizable.current.offsetHeight;
      const handleResize = (e) => {
        if (!isResizing) return;
        let newWidth = initialWidth + (e.clientX - prevX);
        const newHeight = initialHeight + (e.clientY - prevY);
        const parentBoundingRect = resizable.current.parentNode.getBoundingClientRect();
        const boundingRect = resizable.current.getBoundingClientRect();
        let width = dimension.width;
        if (resizable.current.parentNode.offsetWidth >= newWidth + (boundingRect.left - parentBoundingRect.left)) {
          resizable.current.style.width = newWidth + "px";
          width = newWidth;
          // setDimension({ ...dimension, width: newWidth });
        }

        if (resizable.current.parentNode.offsetHeight >= newHeight + (boundingRect.top - parentBoundingRect.top)) {
          resizable.current.style.height = newHeight + "px";
          setDimension({ width, height: newHeight });
        }
      };


      const doc = resizable.current?.ownerDocument || document;
      const handleResizeEnd = () => {
        setResizing(false);
        doc.removeEventListener("mousemove", handleResize);
        doc.removeEventListener("mouseup", handleResizeEnd);
      };
      setResizing(true);
      doc.addEventListener("mousemove", handleResize);
      doc.addEventListener("mouseup", handleResizeEnd);
    
    };

    const handleDragStart = (e) => {
      if (!resizable.current) return;
      const parentBoundingRect = resizable.current.parentNode.getBoundingClientRect();
      const boundingRect = resizable.current.getBoundingClientRect();
      const offsetX = e.clientX - (boundingRect.left - parentBoundingRect.left);
      const offsetY = e.clientY - (boundingRect.top - parentBoundingRect.top);

      const handleDrag = (e) => {
        const leftOffset = e.clientX - offsetX;
        const topOffset = e.clientY - offsetY;
        if (!isDragging) return;

        let left = leftOffset;
        if (leftOffset <= 0) {
          left = 0;
        }


        if (
          resizable.current.offsetWidth + leftOffset >=
          resizable.current.parentNode.offsetWidth
        ) {
          left =
            resizable.current.parentNode.offsetWidth - resizable.current.offsetWidth;
        }

        let top = topOffset;


        if (
          resizable.current.offsetHeight + topOffset >=
          resizable.current.parentNode.offsetHeight
        ) {
          top =
            resizable.current.parentNode.offsetHeight - resizable.current.offsetHeight;
        }
        if (top < 0) {
          top = 0;
        }

        resizable.current.style.left = left + "px";
        resizable.current.style.top = top + "px";

        setOffset({ top: parseInt(top), left: parseInt(left) });
      };

      const doc = resizable.current?.ownerDocument || document;

      const handleDragEnd = () => {
        if (resizable.current) {
          setDragging(false);
          resizable.current.style.cursor = "move";
          doc.removeEventListener("mousemove", handleDrag);
          doc.removeEventListener("mouseup", handleDragEnd);
        }
      };

      setDragging(true);
      resizable.current.style.cursor = "grabbing";
      doc.addEventListener("mousemove", handleDrag);
      doc.addEventListener("mouseup", handleDragEnd);

    };

    resizeHandle.current?.addEventListener("mousedown", handleResizeStart);
    resizable.current?.addEventListener("mousedown", handleDragStart);

    return () => {
      resizeHandle.current?.removeEventListener("mousedown", handleResizeStart);
      resizable.current?.removeEventListener("mousedown", handleDragStart);
    };
  }, []);

  useEffect(() => {
    onChange({ ...dimension, ...offset });
  }, [offset, dimension]);

  const getShapeStyle = (shape) => {
    switch (shape) {
      case "circle":
        return {clipPath: "circle(50% at 50% 50%)"};
      case "rect":
        return { borderRadius: "0"};
      case "hexagon":
        return {
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        };
      case "octagon":
        return {
          clipPath:
            "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
        };
      default:
        return {};
    }
  };

  return (
    <div ref={resizable}
    className="resizable-draggable"
    id="resizeMe"
    style={{
       width,
       height,
       zIndex: "99",
       border:`${mapBorder?.width} ${mapBorder?.style} ${mapBorder?.color}`,
       background:bgColor,
       left: typeof offsetLeft === "string" ? left : left + "px",
       top: typeof offsetTop === "string" ? top : top + "px",
       ...getShapeStyle(shape),
    }}
    {...props}
    >
      <div ref={resizeHandle} id="resizeHandle"       style={{
        width: "12px",
        height: "12px",
        background: "#333",
        position: "absolute",
        bottom: "0",
        right: "0",
        cursor: "nwse-resize",
      }}   ></div>
    </div>
  );
};

export default ResizableDraggable;

