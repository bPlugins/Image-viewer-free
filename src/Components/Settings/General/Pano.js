import { __ } from "@wordpress/i18n";
import { PanelBody, RangeControl, ToggleControl } from "@wordpress/components";
import { Label } from "../../../../../bpl-tools/Components";

const Pano = ({ attributes, setAttributes }) => {
  const { autoRotate, rotateSpeed, hideControl } = attributes;
  return (
    <PanelBody
      className="bPlPanelBody"
      title={__("Panorama Options", "image-viewer")}
      initialOpen={false}
    >
      <ToggleControl
        className="mt20"
        label="Auto Rotate"
        checked={autoRotate}
        onChange={(val) => setAttributes({ autoRotate: val })}
        __nextHasNoMarginBottom={true}
      />

      {autoRotate && (
        <>
          <Label>{__("Auto Rotate Speed:", "image-viewer")}</Label>
          <RangeControl
            value={rotateSpeed}
            onChange={(val) => setAttributes({ rotateSpeed: val })}
            min={-100}
            max={100}
            step={1}
            help={__("Negative values rotate the opposite direction.", "image-viewer")}
          />
        </>
      )}

      <ToggleControl
        className="mt20"
        label="Hide Control"
        checked={hideControl}
        onChange={(val) => setAttributes({ hideControl: val })}
        __nextHasNoMarginBottom={true}
      />
    </PanelBody>
  );
};
export default Pano;
