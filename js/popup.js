class Popup
{
	constructor (svg)
	{
		this.popupGroup = svg.append('g');

		// Popup background
		this.background = this.popupGroup.append('rect')

		// Popup text
		this.countyName = this.popupGroup.append('text')

		// Chart
		this.chart = this.popupGroup.append('path')
	}

	update (d, width, height, fips_to_name, data)
	{
		console.log(data)
		const boxDim = {x: 300, y: 150};
		const chartMargins = {
			left: 10,
			right: 10,
			top: 30,
			bottom: 10
		};

		var x = Math.min(Math.max(d.offsetX - boxDim.x/2, 0), width);
		var y = Math.min(Math.max(d.offsetY - boxDim.y-10, 0), height);

		// Date scale
		var xScale = d3.scaleTime()
			.domain(d3.extent(Object.keys(data), function(d){return d3.timeParse('%Y-%m-%d')(d)}))
			.range([x + chartMargins.left, x + boxDim.x - chartMargins.right])

		var yScale = d3.scaleLinear()
			.domain([d3.min(Object.values(data), function(d){return +d[0]}), d3.max(Object.values(data), function(d){return +d[0]})])
			.range([y + boxDim.y - chartMargins.bottom, y + chartMargins.top])


		// Background
		this.background
			.attr('x', `${x}`)
			.attr('y', `${y}`)
			.attr('width', `${boxDim.x}`)
			.attr('height', `${boxDim.y}`)
			.attr('fill', 'black')
			.attr('opacity', '0.7');

		// Text
		this.countyName
			.attr('x', `${x + 4}`)
			.attr('y', `${y + 14}`)
			.text(`${fips_to_name[d.srcElement.id]}`)
			.attr('fill', 'white');

		// Chart
		this.chart
			.datum(Object.keys(data))
			.attr('stroke-width', 2)
			.attr('stroke', 'white')
			.attr('fill', 'none')
			.attr('d', d3.line()
				.x(function(d,i){
					return xScale(d3.timeParse('%Y-%m-%d')(Object.keys(data)[i]));
				})
				.y(function(d,i){
					return yScale(+Object.values(data)[i][0]);
				})
			)
	}
}
