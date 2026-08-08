import ZoomImage from './Components/Theme/ZoomImage';
import ImageMagnify from './Components/Theme/ImageMagnify';
import ImagePano from './Components/Theme/ImagePano';
import ImageMap from './Components/Theme/ImageMap';

const Viewer = ({ attributes, clientId, setAttributes, setActiveIndex, updateItem }) => {
    const { viewerType } = attributes;
    return (
      <>
        {/* Render viewer based on viewerType */}
        {viewerType === "zoom" && <ZoomImage attributes={attributes} />}
        {viewerType === "magnify" && <ImageMagnify attributes={attributes} />}
        {viewerType === "map" && (
          // imageMapEle
          <ImageMap
            attributes={attributes}
            setAttributes={setAttributes}
            setActiveIndex={setActiveIndex}
            updateItem={updateItem}
          />
        )}

        {viewerType === "pano" && (
          <ImagePano attributes={attributes} clientId={clientId} />
        )}
      </>
    );
};

export default Viewer;
