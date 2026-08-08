import ZoomImage from "../Components/Theme/ZoomImage";
import ImageMagnify from "../Components/Theme/ImageMagnify";
import ImagePano from "../Components/Theme/ImagePano";
import ImageMapFront from "./ImageMapFront";

const themeMap = {
  zoom: ZoomImage,
  magnify: ImageMagnify,
  pano: ImagePano,
  map: ImageMapFront,
};

const Viewer = ({ attributes, clientId, imageMapEle }) => {
  const { viewerType } = attributes;

  const SelectedComponent = themeMap[viewerType];

  if (SelectedComponent) {
    return <SelectedComponent attributes={attributes} clientId={clientId} imageMapEle={imageMapEle} />;
  }
  return <p>No viewer found for type: {viewerType}</p>;
};

export default Viewer;
