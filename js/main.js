var svgWidth = 1000
var svgHeight = 700

var chartMargin = {
	top: 10,
	bottom: 10,
	left: 10,
	right: 10
};

var width = svgWidth - chartMargin.left - chartMargin.right;
var height = svgHeight - chartMargin.top - chartMargin.bottom;

var svg = d3.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

// Map drawing function
// Data from "https://github.com/topojson/us-atlas"
d3.json("data/counties-10m.json").then(function (data) {
	console.log(data);

	var projection = d3.geoAlbersUsa();

	var path = d3.geoPath()
		.projection(projection);

	var countiesData = topojson.feature(data, data.objects.counties).features;
	console.log(countiesData);

	var counties = svg.selectAll('county')
		.data(countiesData)
		.enter()
		.append('path')
		.attr('fill', 'lightgray')
		.attr('stroke', 'black')
		.attr('d', path)
		.attr('id', function (d, i) { return d.properties.name; });

	counties.on('click', function (d) {
		console.log(d);

		// Clear last selection
		d3.selectAll('path')
			.attr('fill', 'lightgray');

		// Select new state
		d3.select(this)
			.attr('fill', 'red');

		// Chart popup
		var chartPopup = svg.selectAll('rect')
			.data(d, d => d);

		chartPopup.exit().remove();

		chartPopupDim = [200, 100]

		svg.append('rect')
			.attr('x', `${d.offsetX - chartPopupDim[0] / 2}`)
			.attr('y', `${d.offsetY - chartPopupDim[1] / 2}`)
			.attr('width', `${chartPopupDim[0]}`)
			.attr('height', `${chartPopupDim[1]}`)
			.merge(chartPopup)
			.attr('fill', 'black')
			.attr('opacity', '0.5');

		// Chart popup text
		var chartPopupText = svg.selectAll('text')
			.data(d, d => d);

		chartPopupText.exit().remove();

		svg.append('text')
			.attr('x', `${d.offsetX - chartPopupDim[0] / 2 + 4}`)
			.attr('y', `${d.offsetY - chartPopupDim[1] / 2 + 14}`)
			.text(`${d.srcElement.id}`)
			.attr('fill', 'white')
	})
});

