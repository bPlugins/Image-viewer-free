import {
  PanelBody,
  ToggleControl,
  __experimentalNumberControl as NumberControl,
  __experimentalSpacer as Spacer,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { Notice, ShadowControl } from "../../../../../bpl-tools/Components";
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
      />

      <Notice className="mt10" status="info" isDismissible={false}>
        {__(
          "Timeout (ms) setting only applies on the frontend.",
          "image-viewer",
        )}
      </Notice>
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
      />
      <Notice className="mt10" status="info" isDismissible={false}>
        {__(
          "Final Width/Height should match the image's actual displayed size for the lens to track the cursor accurately. Since this block is responsive, leave both empty (0) unless the image is shown at a fixed size — the lens then measures the image's real on-screen size automatically.",
          "image-viewer",
        )}
      </Notice>

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
      />
      <Notice className="mt10" status="info" isDismissible={false}>
        {__(
          "Magnified Width/Height set the zoomed-in image size shown inside the lens.",
          "image-viewer",
        )}
      </Notice>

      <Spacer />
      <ToggleControl
        label={__("Limit Bounds", "image-viewer")}
        className="mt10"
        checked={!!magnify?.limitBounds}
        onChange={(val) => updateObject("magnify", "limitBounds", val)}
        __nextHasNoMarginBottom={true}
      />
      <Notice className="mt10" status="info" isDismissible={false}>
        {__(
          "When enabled, the lens stops at the image edges instead of following the cursor past them.",
          "image-viewer",
        )}
      </Notice>

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
