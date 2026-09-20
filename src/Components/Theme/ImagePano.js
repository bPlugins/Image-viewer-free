import { useEffect } from "react";
import { pano } from "../../utils/functions";

const ImagePano = ({attributes,clientId}) => {
  const { viewerType,  magnify,  img, autoRotate, rotateSpeed, hideControl, width, height } = attributes;

  useEffect(() => {
      if (viewerType === 'pano') {
          // pano() returns a teardown — required so a stale invocation (the
          // block editor's React 18 StrictMode runs this effect twice per
          // mount) can't still insert a second Panolens canvas after a
          // newer one has already built its own. See functions.js.
          return pano(clientId, img, autoRotate, rotateSpeed, hideControl);
      }

    }, [ viewerType, magnify,autoRotate,img,rotateSpeed,hideControl, width, height]);

  return (
        <div className="bpivbPanorama">
            {/* Render Panorama viewer */}
        </div>
  )
}

export default ImagePano;


