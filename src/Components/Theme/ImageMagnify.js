/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
const $ = jQuery;

const ImageMagnify = ({attributes}) => {
const { viewerType,  magnify, cId, img,  } = attributes;
 const [magnifyEle, setMagnifyEle] = useState(null);

  useEffect(() => {
        // আগের instance destroy করো
        if (magnifyEle) {
            magnifyEle.destroy();
            setMagnifyEle(null);  // state clear করো
        }

        // সবসময় নতুন করে init করো (else if → if)
        // তাহলে settings change হলে destroy + reinit দুটোই হবে
        if (viewerType === "magnify") {
            const doc = document.querySelector('iframe[name="editor-canvas"]')?.contentWindow?.document || document;
            const imgEle = doc.querySelector(`.magnify-${cId} img`) || document.querySelector(`.magnify-${cId} img`);
            
            if (imgEle) {
                const magnifyInstance = $(imgEle).magnify();
                setMagnifyEle(magnifyInstance);
            }
        }
  },[viewerType, magnify, img?.url])

  return (
     <div >
        <div className={`magnify-${cId}`}>
          <img
              src={img?.url}
                  alt={img?.title}
                  data-magnify-src={img?.url}
                  data-magnify-speed={magnify?.speed}
                  data-magnify-timeout={magnify?.timeOut}  //ata just  frontend aer tablete aer mobile kaj kore
                  // touchBottomOffset='0'
                  {...(magnify?.finalWidth ? { 'data-magnify-finalwidth': magnify.finalWidth } : {})}
                  {...(magnify?.finalHeight ? { 'data-magnify-finalheight': magnify.finalHeight } : {})}
                  {...(magnify?.magnifieWidth ? { 'data-magnify-magnifiedwidth': magnify.magnifieWidth } : {})}
                  {...(magnify?.magnifieHeight ? { 'data-magnify-magnifiedheight': magnify.magnifieHeight } : {})}
                  data-magnify-limitbounds={magnify?.limitBounds ? 'true' : 'false'}
                  data-magnify-mobilecloseevent='touchstart'
          />
        </div>
     </div>
  )
}

export default ImageMagnify;
