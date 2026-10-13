import {
  PanelBody,
  SelectControl,
  TextControl,
  __experimentalNumberControl as NumberControl,
  Button,
  __experimentalBorderControl as BorderControl,
  __experimentalSpacer as Spacer,
  ToggleControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { targetShape } from "../../../utils/options";
import { ColorControl } from "../../../../../bpl-tools/Components";

//device
const Map = ({
  updateItem,
  maps,
  activeIndex,
  removePosition,
  addPosition,
}) => {
  const {
    width: mapWidth,
    height: mapHeight,
    top,
    left,
    link,
    title,
    target,
    mapColor,
    shape,
    mapBorder,
    mapShow,
  } = maps[activeIndex] || {};

  return (
    <PanelBody
      className="bPlPanelBody"
      title={__("Maps Options", "image-viewer")}
      initialOpen={false}
    >
      <PanelBody
        className="bPlPanelBody"
        title={__(`Area-${activeIndex + 1} `, "image-viewer")}
        initialOpen={false}
      >
        <Spacer />
        <ToggleControl
          className="mt-20"
          label={__("Show Map Area On Frontend", "image-viewer")}
          checked={mapShow}
          __nextHasNoMarginBottom={true}
          onChange={(val) => {
            updateItem(activeIndex, val, "mapShow");
          }}
        />
        <Spacer />
        {mapShow && (
          <>
            <BorderControl
              label={
                <span className="my-border-control-label">
                  {__("Border :", "image-viewer")}
                </span>
              }
              value={mapBorder}
              onChange={(val) => {
                updateItem(activeIndex, val, "mapBorder");
              }}
            />
            <div style={{ marginTop: "20px" }}>
              <ColorControl
                style={{ marginTop: "20px" }}
                label={__("Map Color :", "image-viewer")}
                value={mapColor}
                onChange={(val) => {
                  updateItem(activeIndex, val, "mapColor");
                }}
                __next40pxDefaultSize={true}
              />
            </div>
          </>
        )}
        <Spacer />
        <SelectControl
          label={__("Shape Type", "image-viewer")}
          className="mt10"
          value={shape}
          onChange={(val) => updateItem(activeIndex, val, "shape")}
          options={targetShape}
          __next40pxDefaultSize={true}
          help={__(
            "Changing the shape or type may need the Width/Height below adjusted to display correctly.",
            "image-viewer",
          )}
        />

        <TextControl
          __nextHasNoMarginBottom={true}
          label={__("Link", "image-viewer")}
          className="mt10"
          value={link}
          onChange={(val) => {
            updateItem(activeIndex, val, "link");
          }}
          __next40pxDefaultSize={true}
        />

        <ToggleControl
          className="mt10"
          label={__("Open link in new tab", "image-viewer")}
          checked={target === "_blank"}
          onChange={(val) =>
            updateItem(activeIndex, val ? "_blank" : "_self", "target")
          }
        />

        <TextControl
          __nextHasNoMarginBottom={true}
          label={__("Title", "image-viewer")}
          className="mt10"
          value={title}
          onChange={(val) => {
            updateItem(activeIndex, val, "title");
          }}
          __next40pxDefaultSize={true}
        />

        <NumberControl
          label={__("Width (%)", "image-viewer")}
          labelPosition="side"
          className="mt10"
          min={0}
          max={100}
          value={mapWidth}
          onChange={(val) => updateItem(activeIndex, parseFloat(val), "width")}
          help={__(
            "Percent of the image's own width/height — not pixels — so the hotspot stays aligned with the image at any screen size.",
            "image-viewer",
          )}
        />

        <NumberControl
          label={__("Height (%)", "image-viewer")}
          labelPosition="side"
          className="mt10"
          min={0}
          max={100}
          value={mapHeight}
          onChange={(val) => updateItem(activeIndex, parseFloat(val), "height")}
        />

        <NumberControl
          label={__("Top (%)", "image-viewer")}
          labelPosition="side"
          className="mt10"
          min={0}
          max={100}
          value={top}
          onChange={(val) => updateItem(activeIndex, parseFloat(val), "top")}
        />

        <NumberControl
          label={__("Left (%)", "image-viewer")}
          labelPosition="side"
          className="mt10"
          min={0}
          max={100}
          value={left}
          onChange={(val) => updateItem(activeIndex, parseFloat(val), "left")}
        />

        <div className="itemAction bsbButtonArea mt20">
          {1 < maps.length && (
            <Button
              className="removeItem bsb-general-button"
              onClick={() => removePosition(activeIndex)}
            >
              {__("Remove", "image-viewer")}
            </Button>
          )}
        </div>
      </PanelBody>

      {/* Slide Add Button  */}
      <div className="addItem">
        <Button className="bsb-general-button" onClick={addPosition}>
          {__("Add New Map", "image-viewer")}
        </Button>
      </div>
    </PanelBody>
  );
};
export default Map;
