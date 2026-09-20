
import { PanelBody, RangeControl, SelectControl, ToggleControl,__experimentalBorderControl as BorderControl,__experimentalSpacer as Spacer } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { zoomContainOpt } from '../../../utils/options';

const Zoom = ({ updateObject, zoom }) => {
    //zoom
    const { disablePan, disableZoom, disableXAxis, disableYAxis, startScale, step, contain, border } = zoom;
    return <PanelBody className='bPlPanelBody' title={__('Zoom Options', 'image-viewer')} initialOpen={true}>

        <ToggleControl label={__('Disable Pan', 'image-viewer')} className='mt10' checked={disablePan} onChange={(val) => updateObject('zoom', 'disablePan', val)} __nextHasNoMarginBottom={ true } />

        <ToggleControl label={__('Disable Zoom', 'image-viewer')} className='mt10' checked={disableZoom}
            onChange={(val) => updateObject('zoom', 'disableZoom', val)} __nextHasNoMarginBottom={ true } />

        <ToggleControl label={__('Disable X Axis', 'image-viewer')} className='mt10' checked={disableXAxis}
            onChange={(val) => updateObject('zoom', 'disableXAxis', val)} __nextHasNoMarginBottom={ true } />

        <ToggleControl label={__('Disable Y Axis', 'image-viewer')} className='mt10' checked={disableYAxis}
            onChange={(val) => updateObject('zoom', 'disableYAxis', val)}  __nextHasNoMarginBottom={ true }/>

        <Spacer/>
        <BorderControl
            label={<span className="my-border-control-label">{__('Border :', 'image-viewer')}</span>}
            value={border}
            onChange={(val) => updateObject('zoom', 'border', val)}
        />
        <Spacer/>
        <RangeControl label={__('Start Scale', 'image-viewer')} className='mt10' value={startScale} onChange={(val) => updateObject('zoom', 'startScale', val)} />

        <RangeControl label={__('Step', 'image-viewer')} className='mt10' value={step} onChange={(val) => updateObject('zoom', 'step', val)} />

        <SelectControl
            label={__('Contain', 'image-viewer')}
            className='mt10'
            value={contain}
            options={zoomContainOpt}
            onChange={(val) => updateObject('zoom', 'contain', val)}
            __next40pxDefaultSize={true}
        />

    </PanelBody>
}
export default Zoom;