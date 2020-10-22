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
d3.json("data/counties-10m.json").then(function(data) {
	console.log(data);

	var projection = d3.geoAlbersUsa();

	var path = d3.geoPath()
		.projection(projection);

	var counties = topojson.feature(data, data.objects.counties).features;
	console.log(counties)

	var p = svg.selectAll('county')
		.data(counties)
		.enter()
		.append('path')
		.attr('fill', 'lightgray')
		.attr('stroke', 'black')
		.attr('d', path);

});