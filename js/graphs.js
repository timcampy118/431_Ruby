class Graph
{
	constructor(svg)
	{
		this.graphGroup = svg.append('g');
		this.background = this.graphGroup.append('rect')
			.attr('class', 'graph')
		this.chart = this.graphGroup.append('path')
			.attr('class', 'graph')
		this.chartXAxis = this.graphGroup.append('g')
			.attr('class', 'graph')
			.attr('color', 'white')
		this.chartYAxis = this.graphGroup.append('g')
			.attr('class', 'graph')
			.attr('color', 'white')
		this.title = this.graphGroup.append('text')
			.attr('color', 'white')
		this.titleYAxis = this.graphGroup.append('text')
			.attr('color', 'white')
	}

	onClick (d, width, height, index, data)
	{
		d3.selectAll('.graph').attr('visibility', 'visible')
		if (data === undefined)
		{
			d3.selectAll('.graph').attr('visibility', 'hidden')
			return
		}

		const boxDim = {x: 250, y: 150};
		const chartMargins = {
			left: 45,
			right: 10,
			top: 30,
			bottom: 20
		};

		var offsetX = Math.floor(index % 2) * (boxDim.x + 5) + 10
		var offsetY = Math.floor(index / 2) * (boxDim.y + 5)
		var x = Math.min(Math.max(offsetX, 0), width);
		var y = Math.min(Math.max(offsetY, 0), height);

		// Date scale
		var xScale = d3.scaleTime()
			.domain(d3.extent(Object.keys(data), function(d){return d3.timeParse('%Y-%m-%d')(d)}))
			.range([x + chartMargins.left, x + boxDim.x - chartMargins.right])

		var yScale = d3.scaleLinear()
			.domain([d3.min(Object.values(data), function(d){return +d[index]}), d3.max(Object.values(data), function(d){return +d[index]})])
			.range([y + boxDim.y - chartMargins.bottom, y + chartMargins.top])
		this.chartXAxis
			.attr('transform', 'translate(0, ' + (y + boxDim.y - chartMargins.bottom) + ')')
			.call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b')))
		this.chartYAxis
			.attr('transform', 'translate(' + (x + chartMargins.left) + ', '+ 0 + ')')
			.call(d3.axisLeft(yScale).ticks(5).tickFormat(function(d){
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
			.attr('opacity', '0.7');

		// Text
		var titleText = Object.keys(categories)[index]
		this.title
			.attr('x', `${x + 4}`)
			.attr('y', `${y + 14}`)
			.text(titleText)
			.attr('font-weight', 'bold')
			.attr('fill', 'white');
		var yCenter = (boxDim.y - chartMargins.bottom - chartMargins.top)/2 + chartMargins.top + y
		this.titleYAxis
			.style('text-anchor', 'middle')
			.text("% change")
			.attr('transform', 'translate('+(x+15)+','+yCenter+') rotate(270)')
			.attr('fill', 'white');

		// Chart
		var keys = Object.keys(data).sort()
		this.chart
			.datum(Object.keys(data))
			.attr('stroke-width', 2)
			.attr('stroke', 'white')
			.attr('fill', 'none')
			.attr('d', d3.line()
				.x(function(d,i){
					return xScale(d3.timeParse('%Y-%m-%d')(keys[i]));
				})
				.y(function(d,i){

					return yScale(+data[keys[i]][index]);
				})
			)
		this.clickTime = Date.now()
	}

	update()
	{
		var lineLength = this.chart.node().getTotalLength()
		var t = Math.min((Date.now() - this.clickTime) / 1000, 1.0)
		this.chart
			.attr('stroke-dasharray', lineLength + ' ' + lineLength)
			.attr('stroke-dashoffset', d3.interpolateNumber(0, lineLength)(1.0-t))
	}
}

class Graphs
{
	constructor(svg)
	{
		this.graphs = []
		for (var i = 0; i < 6; i++)
		{
			this.graphs.push(new Graph(svg))
		}
	}

	onClick (d, width, height, fips_to_name, data)
	{
		console.log(data)
		for (var i = 0; i < this.graphs.length; i++)
		{
			this.graphs[i].onClick(d, width, height, i, data);
		}
	}

	update()
	{
		for (var i = 0; i < this.graphs.length; i++)
		{
			this.graphs[i].update();
		}
	}
}