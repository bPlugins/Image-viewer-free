// !Adjusted with post.scss
import './post.scss';

window.copybpivbAdminShortcode = id => {
	var input = document.querySelector('#bpivbAdminShortcode-' + id + ' input');
	var tooltip = document.querySelector('#bpivbAdminShortcode-' + id + ' .tooltip');
	
	if (navigator.clipboard) {
		navigator.clipboard.writeText(input.value).then(() => {
			tooltip.innerHTML = wp.i18n.__('Copied Successfully!', 'image-viewer');
			setTimeout(() => {
				tooltip.innerHTML = wp.i18n.__('Copy To Clipboard', 'image-viewer');
			}, 1500);
		});
	} else {
		// Fallback for older browsers
		input.select();
		input.setSelectionRange(0, 30);
		document.execCommand('copy');
		tooltip.innerHTML = wp.i18n.__('Copied Successfully!', 'image-viewer');
		setTimeout(() => {
			tooltip.innerHTML = wp.i18n.__('Copy To Clipboard', 'image-viewer');
		}, 1500);
	}
}