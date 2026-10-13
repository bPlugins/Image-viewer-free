import { useState } from "react";

// Visually hides the map areas' description text from sighted users while
// keeping it in the DOM (not display:none, which most screen readers skip)
// so aria-describedby can reliably reach it regardless of the active theme's
// own CSS (no dependency on a theme shipping .screen-reader-text). The same
// element doubles as the visible tooltip below — it just gets unhidden and
// positioned instead of staying clipped.
const visuallyHiddenStyle = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
};

// top/left/width/height are percentages (0-100) of the image's rendered
// box (see ResizableDragable.js for why). Clamp defensively so a hotspot
// never renders outside the image — including the block.json factory
// default (100/100/100/100), which as a percentage would otherwise sit
// entirely past the bottom-right corner until the editor repositions it.
const clampBox = ({ top, left, width, height }) => {
  const w = Math.min(Math.max(width, 0), 100);
  const h = Math.min(Math.max(height, 0), 100);
  const l = Math.min(Math.max(left, 0), 100 - w);
  const t = Math.min(Math.max(top, 0), 100 - h);
  return { top: t, left: l, width: w, height: h };
};

const ImageMapFront = ({ attributes }) => {
  const { maps, img, cId } = attributes;
  // Tracks which hotspot is hovered/focused so its tooltip can be shown
  // instantly via React state — the native `title` attribute only shows
  // after the browser's own ~1s hover delay, which is what this replaces.
  const [activeIndex, setActiveIndex] = useState(null);

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
      <img src={img?.url} alt={img?.title || ""} />

      {/* CLICKABLE HOTSPOT — an absolutely-positioned link sized/positioned
          in percentages, so it scales with the responsive image instead of
          drifting out of place (the previous <map>/<area> approach used
          fixed-pixel coords, which browsers do NOT rescale for a CSS-resized
          image — verified: a hotspot positioned in the editor at one width
          landed on the wrong part of the image at any other width, most
          visibly on mobile). Doubles as the visible colored overlay when
          "Show Map Area On Frontend" is on; transparent otherwise. */}
      {maps.map((map, index) => {
        const { link, title, target, mapColor, mapBorder, shape, mapShow } = map;
        const { top, left, width, height } = clampBox(map);
        const descId = `bpivb-map-area-desc-${cId}-${index}`;
        return (
          <a
            key={"hotspot-" + index}
            href={link}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            aria-label={title}
            aria-describedby={title ? descId : undefined}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(null)}
            style={{
              position: "absolute",
              top: top + "%",
              left: left + "%",
              width: width + "%",
              height: height + "%",
              display: "block",
              outline: "none",
              zIndex: 20,
              background: mapShow ? mapColor : "transparent",
              border: mapShow
                ? `${mapBorder?.width} ${mapBorder?.style} ${mapBorder?.color}`
                : "none",
              ...(mapShow ? getShapeStyle(shape) : {}),
            }}
          ></a>
        );
      })}

      {/* Hotspot markers — a small pulsing dot at each area's center, shown
          only when "Show Map Area On Frontend" is off. Without it, a visitor
          has no visual cue a hotspot exists until they stumble onto it by
          randomly hovering the image; when mapShow is on, the colored
          overlay above already serves that purpose, so this is skipped. */}
      {maps.map((map, index) => {
        const { mapShow } = map;
        if (mapShow) return null;
        const { top, left, width, height } = clampBox(map);
        return (
          <span
            key={"marker-" + index}
            className="bpivbMapMarker"
            style={{
              top: `calc(${top}% + ${height / 2}%)`,
              left: `calc(${left}% + ${width / 2}%)`,
            }}
          >
            <span className="bpivbMapMarkerPulse"></span>
            <span className="bpivbMapMarkerDot"></span>
          </span>
        );
      })}

      {/* Tooltip / aria-describedby text — kept in the DOM regardless of
          hover state so screen readers can always reach it. Visually
          hidden by default; shown instantly (no native title delay) when
          its hotspot is hovered or focused. */}
      {maps.map((map, index) => {
        const { title } = map;
        if (!title) return null;
        const { top, left } = clampBox(map);
        const isActive = activeIndex === index;
        return (
          <span
            key={"area-desc-" + index}
            id={`bpivb-map-area-desc-${cId}-${index}`}
            role="tooltip"
            style={
              isActive
                ? {
                    position: "absolute",
                    top: top + "%",
                    left: left + "%",
                    transform: "translateY(-100%) translateY(-6px)",
                    background: "rgba(0,0,0,0.85)",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    lineHeight: 1.4,
                    whiteSpace: "nowrap",
                    zIndex: 30,
                    pointerEvents: "none",
                  }
                : visuallyHiddenStyle
            }
          >
            {title}
          </span>
        );
      })}
    </div>
  );
};

export default ImageMapFront;
