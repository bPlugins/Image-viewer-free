import { __ } from "@wordpress/i18n";

export const generalStyleTabs = [
  { name: "general", title: __("General", "image-viewer") },
];

export const targetShape = [
  { label: __("Rectangle", "image-viewer"), value: "rect" },
  { label: __("Circle", "image-viewer"), value: "circle" },
  // { label: __("Square", "image-viewer"), value: "square" },
  { label: __("Hexagon", "image-viewer"), value: "hexagon" },
  { label: __("Octagon", "image-viewer"), value: "octagon" },
];

export const zoomContainOpt = [
  { label: __("Null", "image-viewer"), value: "null" },
  { label: __("In Side", "image-viewer"), value: "inside" },
  { label: __("Out Side", "image-viewer"), value: "outside" },
];

//Top menu ThemePreview Option
export const themePreview = [
  {
    label: "Zoom",
    value: "zoom",
    tooltip: "Zoom",
  },
  {
    label: "Magnify",
    value: "magnify",
    tooltip: "Magnify",
  },
  {
    label: "Map",
    value: "map",
    tooltip: "Map",
  },
  {
    label: "Pano or Rotation",
    value: "pano",
    tooltip: "Pano or Rotation",
  },
];

// All StyleCSS
export const allStyles = {
  zoom: {
    disablePan: false,
    disableZoom: false,
    disableXAxis: false,
    disableYAxis: false,
    duration: 200,
    panOnlyWhenZoomed: false,
    startScale: 1,
    step: 0.3,
    contain: 'null',
    border: {
      color: '#11d67400',
      width: '2px',
      style: 'solid',
    },
  },
  magnify: {
    shadow: [
      {
        hOffset: '0px',
        vOffset: '0px',
        blur: '0px',
        spreed: '7px',
        color: 'rgba(255, 255, 255, 0.85)',
        isInset: true,
      },
    ],
    speed: 200,
    timeOut: -1,
    finalWidth: 500,
    finalHeight: 500,
    magnifieWidth: 500,
    magnifieHeight: 500,
    limitBounds: true,
    height: 200,
  },
  maps: [
    {
      mapColor: '#ddd6',
      mapBorder: {
        color: '#080714e0',
        width: '0px',
        style: 'solid',
      },
      mapShow: false,
      top: 100,
      left: 100,
      width: 100,
      height: 100,
      shape: 'rect',
      link: 'https://bplugins.com/',
      title: 'bPlugins',
      target: '_blank',
    },
  ],
  width: '100%',
  height: '320px',
  autoRotate: true,
  rotateSpeed: 2,
  hideControl: true,
  autoPlay: true,
};

//All Theme Style Options
export const viewerTypeOpt = [
  { label: __("Zoom", "image-viewer"), value: "zoom" },
  { label: __("Magnify", "image-viewer"), value: "magnify" },
  { label: __("Map", "image-viewer"), value: "map" },
  { label: __("Pano or Rotation", "image-viewer"), value: "pano" },
];
