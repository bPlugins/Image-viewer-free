import { useEffect, useState } from 'react';
const $ = jQuery;

const ImageMagnify = ({ attributes }) => {
  const { viewerType, magnify, cId, img } = attributes;
  const [magnifyEle, setMagnifyEle] = useState(null);

  // block.json ships finalWidth/finalHeight defaulted to 500/500 (a
  // placeholder, not a real size) on every block instance. This block is
  // responsive (width: 100%), so its actual rendered size is almost never
  // 500x500 — and magnify.js uses finalWidth/finalHeight, not the image's
  // real size, to compute the area where the lens can even appear. Left at
  // 500/500, that mismatch makes large parts of the real image (whatever
  // falls outside the assumed 500x500 box) never trigger the lens at all —
  // verified live: with an image rendered at 645x361, hovering the right
  // ~40% and top ~30% of the image showed nothing. Omitting the data
  // attribute makes magnify.js fall back to measuring the image's actual
  // on-screen size instead — correct for the untouched default. A user who
  // deliberately sets a different Final Width/Height is still honored as-is.
  const finalWidthIsDefault = !magnify?.finalWidth || magnify.finalWidth === 500;
  const finalHeightIsDefault = !magnify?.finalHeight || magnify.finalHeight === 500;

  useEffect(() => {
    // আগের instance destroy করো
    if (magnifyEle) {
      magnifyEle.destroy();
      setMagnifyEle(null); // state clear করো
    }

    // সবসময় নতুন করে init করো (else if → if)
    // তাহলে settings change হলে destroy + reinit দুটোই হবে
    if (viewerType === 'magnify') {
      const doc = document.querySelector('iframe[name="editor-canvas"]')?.contentWindow?.document || document;
      const imgEle = doc.querySelector(`.magnify-${cId} img`) || document.querySelector(`.magnify-${cId} img`);

      if (imgEle) {
        const magnifyInstance = $(imgEle).magnify();
        setMagnifyEle(magnifyInstance);
      }
    }
  }, [viewerType, magnify, img?.url]);

  return (
    <div>
      <div className={`magnify-${cId}`}>
        <img
          src={img?.url}
          alt={img?.title}
          data-magnify-src={img?.url}
          data-magnify-speed={magnify?.speed}
          data-magnify-timeout={magnify?.timeOut} //ata just  frontend aer tablete aer mobile kaj kore
          // touchBottomOffset='0'
          {...(!finalWidthIsDefault ? { 'data-magnify-finalwidth': magnify.finalWidth } : {})}
          {...(!finalHeightIsDefault ? { 'data-magnify-finalheight': magnify.finalHeight } : {})}
          {...(magnify?.magnifieWidth ? { 'data-magnify-magnifiedwidth': magnify.magnifieWidth } : {})}
          {...(magnify?.magnifieHeight ? { 'data-magnify-magnifiedheight': magnify.magnifieHeight } : {})}
          data-magnify-limitbounds={magnify?.limitBounds ? 'true' : 'false'}
          data-magnify-mobilecloseevent="touchstart"
        />
      </div>
    </div>
  );
};

export default ImageMagnify;
