function createPopup (popupGroup)
{
	// Popup background
	popupGroup.append('rect')

	// Popup text
	popupGroup.append('text')
}

function updatePopup (d, popupGroup, width, height) {
	const chartPopupDim = [200, 100];

	var x = Math.min(Math.max(d.offsetX - chartPopupDim[0]/2, 0), width);
	var y = Math.min(Math.max(d.offsetY - chartPopupDim[1]/2, 0), height);

	// Background
	popupGroup.selectAll('rect')
		.attr('x', `${x}`)
		.attr('y', `${y}`)
		.attr('width', `${chartPopupDim[0]}`)
		.attr('height', `${chartPopupDim[1]}`)
		.attr('fill', 'black')
		.attr('opacity', '0.5');

	// Text
	popupGroup.selectAll('text')
		.attr('x', `${x + 4}`)
		.attr('y', `${y + 14}`)
		.text(`${d.srcElement.id}`)
		.attr('fill', 'white');

	return popupGroup;
}
