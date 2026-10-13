import {
  PanelBody,
  ToggleControl,
  __experimentalNumberControl as NumberControl,
  __experimentalSpacer as Spacer,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { ShadowControl } from "../../../../../bpl-tools/Components";
import { updateData } from "../../../../../bpl-tools/utils/functions";

const Magnify = ({ updateObject, magnify, setAttributes }) => {
  return (
    <PanelBody
      className="bPlPanelBody"
      title={__("Magnify Options", "image-viewer")}
      initialOpen={false}
    >
      <NumberControl
        label={__("Speed-(ms)", "image-viewer")}
        labelPosition="side"
        className=""
        value={magnify?.speed}
        onChange={(val) => updateObject("magnify", "speed", val)}
      />

      <NumberControl
        label={__("TimeOut-(ms)", "image-viewer")}
        labelPosition="side"
        className="mt10"
        value={magnify?.timeOut}
        onChange={(val) => updateObject("magnify", "timeOut", val)}
        help={__("Applies on the frontend only.", "image-viewer")}
      />

      <NumberControl
        label={__("LensSize", "image-viewer")}
        labelPosition="side"
        className="mt10"
        value={magnify?.height}
        onChange={(val) => updateObject("magnify", "height", val)}
      />

      <Spacer />
      <NumberControl
        label={__("Final Width-(px)", "image-viewer")}
        labelPosition="side"
        className="mt10"
        value={magnify?.finalWidth}
        onChange={(val) => updateObject("magnify", "finalWidth", val)}
      />
      <NumberControl
        label={__("Final Height-(px)", "image-viewer")}
        labelPosition="side"
        className="mt10"
        value={magnify?.finalHeight}
        onChange={(val) => updateObject("magnify", "finalHeight", val)}
        help={__(
          "Leave both empty — the lens then measures the image's real on-screen size automatically. Set these only if the image is shown at a fixed pixel size.",
          "image-viewer",
        )}
      />

      <Spacer />
      <NumberControl
        label={__("Magnified Width-(px)", "image-viewer")}
        labelPosition="side"
        className="mt10"
        value={magnify?.magnifieWidth}
        onChange={(val) => updateObject("magnify", "magnifieWidth", val)}
      />
      <NumberControl
        label={__("Magnified Height-(px)", "image-viewer")}
        labelPosition="side"
        className="mt10"
        value={magnify?.magnifieHeight}
        onChange={(val) => updateObject("magnify", "magnifieHeight", val)}
        help={__(
          "Size of the zoomed-in image shown inside the lens.",
          "image-viewer",
        )}
      />

      <Spacer />
      <ToggleControl
        label={__("Limit Bounds", "image-viewer")}
        className="mt10"
        checked={!!magnify?.limitBounds}
        onChange={(val) => updateObject("magnify", "limitBounds", val)}
        __nextHasNoMarginBottom={true}
        help={__(
          "Stops the lens at the image edges. Turn off to let the lens reach the entire image, including the edges.",
          "image-viewer",
        )}
      />

      <Spacer />
      <ShadowControl
        className="mt20"
        label={__("Shadow:", "image-viewer")}
        value={magnify?.shadow}
        onChange={(newShadow) => {
          setAttributes({
            magnify: updateData(magnify, newShadow, "shadow"),
          });
        }}
        defaults={[
          {
            hOffset: "0px",
            vOffset: "0px",
            blur: "0px",
            spreed: "7px",
            color: "rgba(255, 255, 255, 0.85)",
            isInset: true,
          },
        ]}
      />
    </PanelBody>
  );
};
export default Magnify;
