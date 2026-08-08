import {
  PanelBody,
  __experimentalNumberControl as NumberControl,
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
