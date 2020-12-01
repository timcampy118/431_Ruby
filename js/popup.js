class Popup
{
	constructor (svg)
	{
		this.popupGroup = svg.append('g');

		// Popup background
		this.background = this.popupGroup.append('rect')
			.attr('class', 'popup')

		// Popup text
		this.countyName = this.popupGroup.append('text')
			.attr('class', 'popup primary_text')
		this.casesLabel = this.popupGroup.append('text')
			.attr('class', 'popup')
		this.deathsLabel = this.popupGroup.append('text')
			.attr('class', 'popup')

		// Exit button
		this.exitButton = this.popupGroup.append('g')
			.attr('class', 'popup')
		this.exitButtonText = this.exitButton.append('text')
			.attr('class', 'popup primary_text')
			.text('x')
		this.exitButtonBackground = this.exitButton.append('rect')
			.attr('class', 'popup')
			.attr('opacity', 0)
			.on('click', function(d)
				{
					d3.selectAll('.popup').attr('visibility', 'hidden')
				});

		// Chart
		this.chart = this.popupGroup.append('path')
			.attr('class', 'popup')
		this.chartDeaths = this.popupGroup.append('path')
			.attr('class', 'popup')
		this.chartXAxis = this.popupGroup.append('g')
			.attr('class', 'popup')
			.attr('color', 'white')
		this.chartYAxis = this.popupGroup.append('g')
			.attr('class', 'popup')
			.attr('color', 'white')
		this.chartYAxisDeaths = this.popupGroup.append('g')
			.attr('class', 'popup')
			.attr('color', 'orange')
		this.clickTime = 0
	}

	onClick (d, width, height, fips_to_name, data, selectedPosition)
	{
		d3.selectAll('.popup').attr('visibility', 'visible')

		const boxDim = {x: 300, y: 150};
		const minX = 250 * 2 + 50;
		const chartMargins = {
			left: 30,
			right: 30,
			top: 30,
			bottom: 20
		};

		var offsetX = selectedPosition[0]
		var offsetY = selectedPosition[1]
		var x = Math.min(Math.max(offsetX - boxDim.x/2, minX), width);
		var y = Math.min(Math.max(offsetY - boxDim.y-10, 0), height);

		// Date scale
		var xScale = d3.scaleTime()
			.domain(d3.extent(Object.keys(data), function(d){return d3.timeParse('%Y-%m-%d')(d)}))
			.range([x + chartMargins.left, x + boxDim.x - chartMargins.right])

		var yScale = d3.scaleLinear()
			.domain([d3.min(Object.values(data), function(d){return +d[0]}), d3.max(Object.values(data), function(d){return +d[0]})])
			.range([y + boxDim.y - chartMargins.bottom, y + chartMargins.top])

		var yScaleDeaths = d3.scaleLinear()
			.domain([d3.min(Object.values(data), function(d){return +d[1]}), d3.max(Object.values(data), function(d){return +d[1]})])
			.range([y + boxDim.y - chartMargins.bottom, y + chartMargins.top])

		this.chartXAxis
			.attr('transform', 'translate(0, ' + (y + boxDim.y - chartMargins.bottom) + ')')
			.call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat('%b')))
		this.chartYAxis
			.attr('transform', 'translate(' + (x + chartMargins.left) + ', '+ 0 + ')')
			.call(d3.axisLeft(yScale).ticks(5).tickFormat(function(d){
				if (d >= 1000)
				{
					d = d / 1000 + 'k';
				}
				return d;
			}))
		this.chartYAxisDeaths
			.attr('transform', 'translate(' + (x + boxDim.x - chartMargins.right) + ', '+ 0 + ')')
			.call(d3.axisRight(yScaleDeaths).ticks(5).tickFormat(function(d){
				if (d >= 1000)
				{
					d = d / 1000 + 'k';
				}
				return d;
			}))

		// Background
		this.background
			.attr('x', `${x}`)
			.attr('y', `${y}`)
			.attr('width', `${boxDim.x}`)
			.attr('height', `${boxDim.y}`)
			.attr('fill', 'black')
			.attr('opacity', '0.8');

		// Text
		this.countyName
			.attr('x', `${x + 4}`)
			.attr('y', `${y + 14}`)
			.text(`${fips_to_name[d.srcElement.id]}`)
			.style('font-weight', 'bold')
		this.casesLabel
			.attr('x', `${x + 100}`)
			.attr('y', `${y + 14}`)
			.html('&mdash; cases')
			.attr('fill', 'white');
		this.deathsLabel
			.attr('x', `${x + 190}`)
			.attr('y', `${y + 14}`)
			.html('&mdash; deaths')
			.attr('fill', 'orange');

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
		this.chartDeaths
			.datum(Object.keys(data))
			.attr('stroke-width', 2)
			.attr('stroke', 'orange')
			.attr('fill', 'none')
			.attr('d', d3.line()
				.x(function(d,i){
					return xScale(d3.timeParse('%Y-%m-%d')(Object.keys(data)[i]));
				})
				.y(function(d,i){
					return yScaleDeaths(+Object.values(data)[i][1]);
				})
			)
		this.clickTime = Date.now()

		// Exit button
		this.exitButtonText
			.attr('x', `${x + boxDim.x - 10}`)
			.attr('y', `${y + 10}`)
		this.exitButtonBackground
			.attr('x', `${x + boxDim.x - 15}`)
			.attr('y', `${y}`)
			.attr('width', '15')
			.attr('height', '15')

	}

	update()
	{
		var lineLength = this.chart.node().getTotalLength()
		var lineLengthDeaths = this.chartDeaths.node().getTotalLength()
		var t = Math.min((Date.now() - this.clickTime) / 1000, 1.0)
		this.chart
			.attr('stroke-dasharray', lineLength + ' ' + lineLength)
			.attr('stroke-dashoffset', d3.interpolateNumber(0, lineLength)(1.0-t))
		this.chartDeaths
			.attr('stroke-dasharray', lineLengthDeaths + ' ' + lineLengthDeaths)
			.attr('stroke-dashoffset', d3.interpolateNumber(0, lineLengthDeaths)(1.0-t))
	}
}
