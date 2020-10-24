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

var svg = d3.select("#content")
	.append("svg")
	.attr("width", width)
	.attr("height", height)
	.call(responsivefy);

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

	svg.call(responsivefy);

	var popupGroup = svg.append('g');
	createPopup(popupGroup);

	counties.on('click', function (d) {
		console.log(d);

		// Clear last selection
		d3.selectAll('path')
			.attr('fill', 'lightgray');

		// Select new state
		d3.select(this)
			.attr('fill', 'red');

		// Chart popup
		updatePopup(d, popupGroup, width, height);
	})
});

// Help with responsive chart
// source: https://brendansudol.com/writing/responsive-d3
function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

    // to register multiple listeners for same event type, 
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on("resize." + container.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
}