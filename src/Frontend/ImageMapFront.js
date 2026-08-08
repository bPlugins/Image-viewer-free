const ImageMapFront = ({ attributes }) => {
  const { maps, img, cId } = attributes;

  const getShapeStyle = (shape) => {
    switch (shape) {
      case "circle":
        return { clipPath: "circle(50% at 50% 50%)" };
      case "rect":
        return { borderRadius: "0" };
      case "hexagon":
        return {
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
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
    <div className="bpivbImageMap" style={{ position: "relative" }}>
      <img src={img?.url} useMap={`#image-map-${cId}`} />

      {/* UI overlay shapes (visible) */}
      {maps.map((map, index) => {
        const { width, height, top, left, mapColor, mapBorder, shape,mapShow } = map;
        // Only render if mapShow is false
        if (!mapShow) return null;
        // Only render if mapShow is true
        return (
          <div
            key={"overlay-" + index}
            style={{
              position: "absolute",
              top,
              left,
              width: width + "px",
              height: height + "px",
              background: mapColor,
              border: `${mapBorder?.width} ${mapBorder?.style} ${mapBorder?.color}`,
              pointerEvents: "none", // lets clicks go to area
              zIndex: 20,
              ...getShapeStyle(shape),
            }}
          ></div>
        );
      })}

      {/* CLICKABLE MAP AREA */}
      <map name={`image-map-${cId}`}>
        {maps.map((map, index) => {
          const { width, height, top, left, link, title, target } = map;
          return (
            <area
              key={"area-" + index}
              shape="rect"
              coords={`${left},${top},${left + width},${top + height}`}
              href={link}
              alt={title}
              title={title}
              target={target}
              style={{ outline: 'none'}}
            />
          );
        })}
      </map>
    </div>
  );
};

export default ImageMapFront;

