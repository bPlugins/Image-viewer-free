const Style = ({ attributes, id }) => {
	const { width, height, magnify, zoom } = attributes;

	const mainEl = `#${id}`;
	const magnifyp = `${mainEl} .magnify`;
	const magnifyLens = `${magnifyp} .magnify-lens`;
	const bpivbImageViewer = `${mainEl} .bpivbImageViewer`;

	//magnify Function
	const shadows = magnify?.shadow || [];
	const boxShadowValue  = shadows?.map((data) =>{
		const { hOffset = '0px', vOffset = '0px', blur = '0px', spreed = '7px', color = 'rgba(255, 255, 255, 0.85)', isInset = false } = data;
		let shadowStr = `${hOffset} ${vOffset} ${blur} ${spreed} ${color}`;
      if (isInset) {
          shadowStr += `, inset 0 0 40px 2px rgba(0,0,0,0.25)`;
      }
		return shadowStr;
	}).join(', ');


	//zoom Class
	const bpivbZoomWapper = `${bpivbImageViewer} .bpivb-zoom-wapper`;


  //map className
  // const bpivbImageMap = `${bpivbImageViewer} .bpivbImageMap`;
  // const resizableDraggable = `${bpivbImageMap} .resizable-draggable`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${mainEl} {
			text-align:center;
		}
   ${bpivbZoomWapper}{
	    border: ${zoom?.border?.width} ${zoom?.border?.style} ${zoom?.border?.color};
	  }

		${mainEl} .bpivbPanorama{
			height:${height};
			width:${width};
		}
		${magnifyLens}{
		   width: ${magnify?.height}px;
       height:${magnify?.height}px;
       box-shadow:${boxShadowValue};
		}
	`}} />;
}
export default Style;
