class Popup
{
	constructor (svg)
	{
		this.popupGroup = svg.append('g');

		// Popup background
		this.background = this.popupGroup.append('rect')

		// Popup text
		this.countyName = this.popupGroup.append('text')
	}

	update (d, width, height, fips_to_name)
	{
		const chartPopupDim = [200, 100];

		var x = Math.min(Math.max(d.offsetX - chartPopupDim[0]/2, 0), width);
		var y = Math.min(Math.max(d.offsetY - chartPopupDim[1]-10, 0), height);

		// Background
		this.background
			.attr('x', `${x}`)
			.attr('y', `${y}`)
			.attr('width', `${chartPopupDim[0]}`)
			.attr('height', `${chartPopupDim[1]}`)
			.attr('fill', 'black')
			.attr('opacity', '0.7');

		// Text
		this.countyName
			.attr('x', `${x + 4}`)
			.attr('y', `${y + 14}`)
			.text(`${fips_to_name[d.srcElement.id]}`)
			.attr('fill', 'white');
	}
}
