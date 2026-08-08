import { __ } from '@wordpress/i18n';
import { InspectorControls, BlockControls } from '@wordpress/block-editor';
import { TabPanel, Dashicon, ToolbarGroup, ToolbarButton } from '@wordpress/components';

// Settings Components
import { tabController } from '../../../../bpl-tools/utils/functions';
import { allStyles, generalStyleTabs, themePreview } from '../../utils/options';
import Zoom from './General/Zoom';
import Magnify from './General/Magnify';
import Pano from './General/Pano';
import Map from './General/Map';
import Type from './General/Type';
import { updateStyle } from '../../utils/functions';
import ThemeSwitcher from '../themeSwitcher/ThemeSwitcher';
import { AdvertiseCard } from '../../../../bpl-tools/ProControls';

const PRICING_FALLBACK = 'https://bplugins.com/products/image-viewer/pricing';

// Go to the dashboard's own #/pricing route when the user can actually reach it;
// otherwise fall back to the public product pricing page. Both open in a new tab.
const getPricingLink = () => window.BPIVB_PRICING?.dashboard || window.BPIVB_PRICING?.external || PRICING_FALLBACK;

const Settings = ({ attributes, setAttributes, activeIndex, addPosition, removePosition, updateItem, device }) => {
  const { viewerType, magnify, zoom, maps } = attributes;

  // update object
  const updateObject = (attr, key, val) => {
    const newAttr = { ...attributes[attr] };
    newAttr[key] = val;
    setAttributes({ [attr]: newAttr });
  };

  const supportsItems = ['map'].includes(viewerType);
  return (
    <>
      <InspectorControls>
        <TabPanel className="bpivbTabPanel bPlTabPanel" activeClass="activeTab" tabs={generalStyleTabs} onSelect={tabController}>
          {tab => (
            <>
              {'general' === tab.name && (
                <>
                  <Type attributes={attributes} setAttributes={setAttributes} />
                  {viewerType === 'map' && <Map updateItem={updateItem} maps={maps} activeIndex={activeIndex} removePosition={removePosition} addPosition={addPosition} device={device} />}
                  {viewerType === 'zoom' && <Zoom updateObject={updateObject} zoom={zoom} />}
                  {viewerType === 'magnify' && <Magnify updateObject={updateObject} magnify={magnify} setAttributes={setAttributes} />}
                  {viewerType === 'pano' && <Pano attributes={attributes} setAttributes={setAttributes} />}
                </>
              )}
            </>
          )}
        </TabPanel>

        <AdvertiseCard planLink={getPricingLink()} />
      </InspectorControls>
      {/* !update */}
      <BlockControls>
        {supportsItems && (
          <ToolbarGroup className="bPlToolbar">
            <ToolbarButton label={__('Add New Item', 'image-viewer')} onClick={addPosition}>
              <Dashicon icon="plus" size={23} />
            </ToolbarButton>
          </ToolbarGroup>
        )}

        {/* ThemeSwitcher  */}
        <ThemeSwitcher themes={themePreview} value={viewerType} isTooltip={true} visibleCount={7} buttonLabel="More Themes" onChange={val => updateStyle(val, attributes, setAttributes, allStyles)} />
      </BlockControls>
    </>
  );
};
export default Settings;
