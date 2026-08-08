import { useEffect } from "react";
import { pano } from "../../utils/functions";

const ImagePano = ({attributes,clientId}) => {
  const { viewerType,  magnify,  img, autoRotate, rotateSpeed, hideControl, width, height } = attributes;

  useEffect(() => {
      if (viewerType === 'pano') {
          pano(clientId, img, autoRotate, rotateSpeed, hideControl);
      }

    }, [ viewerType, magnify,autoRotate,img,rotateSpeed,hideControl, width, height]);

  return (
        <div className="bpivbPanorama">
            {/* Render Panorama viewer */}
        </div>
  )
}

export default ImagePano;


