import {
  PanelBody,
  SelectControl,
  __experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { allStyles, viewerTypeOpt } from "../../../utils/options";
import {
  InlineDetailMediaUpload,
  Label,
  Notice,
} from "../../../../../bpl-tools/Components";
import { perUnit, pxUnit } from "../../../../../bpl-tools/utils/options";
import { updateStyle } from "../../../utils/functions";

const Type = ({ attributes, setAttributes }) => {
  const { img, viewerType, width, height } = attributes;

  return (
    <>
      {/* Theme Style Control */}
      <PanelBody
        className="bPlPanelBody"
        title={__("Style Type ", "image-viewer")}
        initialOpen={true}
      >
        <SelectControl
          label={__("Type :", "image-viewer")}
          value={viewerType}
          __next40pxDefaultSize={true}
          labelPosition="side"
          options={viewerTypeOpt}
          onChange={(val) =>
            updateStyle(val, attributes, setAttributes, allStyles)
          }
        />
        <Notice status="info" isIcon={false}>
          {__(
            "💡 Note : When you change a style and save it, then switch to another style and come back to the previous one, the settings may temporarily revert to their default values. But don’t worry your saved changes aren’t lost, and everything will return to how it was when you reload the page.",
          )}
        </Notice>
      </PanelBody>
      <PanelBody
        className="bPlPanelBody"
        title={__("Image Source & Type", "image-viewer")}
        initialOpen={true}
      >
        <Label className="mb5">{__("Image:", "panorama-block")}</Label>
        <InlineDetailMediaUpload
          value={img}
          types={["image"]}
          onChange={(val) => setAttributes({ img: val })}
          placeholder={__("Enter Image URL", "panorama-block")}
        />
        {viewerType === "pano" && (
          <>
            <UnitControl
              className="mt20"
              label={__("Width:", "panorama-block")}
              labelPosition="left"
              value={width}
              onChange={(val) => setAttributes({ width: val })}
              units={[pxUnit(), perUnit()]}
            />
            <UnitControl
              className="mt10"
              label={__("Height:", "panorama-block")}
              labelPosition="left"
              value={height}
              onChange={(val) => setAttributes({ height: val })}
              units={[pxUnit(), perUnit()]}
            />
          </>
        )}
      </PanelBody>
    </>
  );
};
export default Type;
