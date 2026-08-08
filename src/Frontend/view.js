import { createRoot } from "react-dom/client";
import "../style.scss";
import Style from "../Style";

import Viewer from "./Viewer";
import ImageMapFront from "./ImageMapFront";

// Block Directory
document.addEventListener("DOMContentLoaded", () => {
  const allBlockDirectory = document.querySelectorAll(
    ".wp-block-bpivb-image-viewer-directory",
  );
  allBlockDirectory.forEach((directory) => {
    const attributes = JSON.parse(directory.dataset.attributes);

    createRoot(directory).render(
      <>
        <Style attributes={attributes} id={directory.id} />
        <div className="bpivbImageViewer">
          <Render attributes={attributes} clientId={directory.id} />
        </div>
      </>,
    );

    directory?.removeAttribute("data-attributes");
  });
});

const Render = ({ attributes, clientId }) => {
  return (
    <Viewer
      attributes={attributes}
      clientId={clientId}
      MapComponent={ImageMapFront}
    />
  );
};
