// export const pano = (clientId, img, autoRotate, rotateSpeed, hideControl) => {
//   const doc =
//     document.querySelector('iframe[name="editor-canvas"]')?.contentDocument ||
//     document.querySelector("iframe.editor-canvas__iframe")?.contentDocument ||
//     document;

//   const panoContainer =
//     doc.querySelector(`#${clientId} .bpivbPanorama`) ||
//     document.querySelector(`#${clientId} bpivbPanorama`);
//   if (!panoContainer) return;

//   panoContainer.innerHTML = "";

//   if (!img?.url || !window.BPIVB_REST) return;

//   const apiUrl = `${
//     window.BPIVB_REST.root
//   }bpivb/v1/image-proxy?url=${encodeURIComponent(img.url)}`;
//   fetch(apiUrl, {
//     method: "GET",
//     headers: { "X-WP-Nonce": window.BPIVB_REST.nonce },
//     credentials: "same-origin",
//   })
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error("Image proxy request failed");
//       }
//       return res.blob();
//     })
//     .then((blob) => {
//       const imageSource = URL.createObjectURL(blob);

//       /*DO NOT TOUCH – as requested */
//       const panorama = new PANOLENS.ImagePanorama(imageSource);
//       const viewer = new PANOLENS.Viewer({
//         container: panoContainer,
//         autoRotate,
//         autoRotateSpeed: rotateSpeed,
//         controlBar: hideControl,
//       });
//       viewer.add(panorama);

//       // Fix for Editor: prevent Panolens from scrolling/zooming/dragging when cursor is outside the block
//       const isEditor =
//         !!document.querySelector('iframe[name="editor-canvas"]') ||
//         !!window?.wp?.blockEditor;
//       if (isEditor && viewer.OrbitControls) {
//         viewer.OrbitControls.noZoom = true; // default: zoom বন্ধ

//         panoContainer.addEventListener("mouseenter", () => {
//           viewer.OrbitControls.noZoom = false;   // zoom চালু
//           viewer.OrbitControls.enabled = true;   // controls চালু
//         });

//         panoContainer.addEventListener("mouseleave", (e) => {
//           viewer.OrbitControls.noZoom = true;    // zoom বন্ধ

//           // Three.js OrbitControls-এর প্রতিটি event handler-এর
//           // শুরুতে `if (!scope.enabled) return;` আছে।
//           // তাই enabled=false করলেই সাথে সাথে সব mousemove থামে।
//           viewer.OrbitControls.enabled = false;

//           // Belt-and-suspenders: উভয় document-এ fake mouseup পাঠাও
//           // (iframe context + main document — যেকোনো একটা কাজ করবে)
//           const fakeUp = new MouseEvent("mouseup", {
//             bubbles: true, cancelable: true,
//             clientX: e.clientX, clientY: e.clientY,
//           });
//           const ownerDoc = panoContainer.ownerDocument || document;
//           ownerDoc.dispatchEvent(fakeUp);
//           if (ownerDoc !== document) {
//             document.dispatchEvent(fakeUp);
//           }
//         });
//       }
//     })
//     .catch((err) => {
//       console.error("Panorama load failed:", err);
//     });
// };

// All Styles Function
