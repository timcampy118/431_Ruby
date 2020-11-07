
var covidCases = null;
var counties = null;

function main() {
	var { svg, width, height } = initSVG();



	// Map drawing function
	// Data from "https://github.com/topojson/us-atlas"
	fetchData().then(function (data) {
		// console.log(data);

		counties = data[0];
		covidCases = data[1];

		initCovidCasesMap(svg, width, height, counties, covidCases);

	});
}

function initCovidCasesMap(svg, width, height, counties, covidCases) {
	var fips_to_name = {};

	var currentWeek = 10;
	var selectedID = 0;

	// Create map
	var projection = d3.geoAlbersUsa();

	var path = d3.geoPath()
		.projection(projection);

	// Extract map from JSON
	var countiesData = topojson.feature(counties, counties.objects.counties).features;
	// console.log(countiesData);

	// Extract county data
	for (var i = 0; i < countiesData.length; i++) {
		fips_to_name[countiesData[i].id] = countiesData[i].properties.name;
	}

	// Create counties from map
	var counties = svg.selectAll('county')
		.data(countiesData)
		.enter()
		.append('path')
		.attr('fill', function (d, i) { return calculateColor(d, i, covidCases, currentWeek); })
		.attr('stroke', 'black')
		.attr('d', path)
		.attr('id', function (d, i) { return d.id; });



	var popupGroup = svg.append('g');
	createPopup(popupGroup);

	// Logic for clicking in map
	counties.on('click', function (d) {
		console.log(d);

		// Clear last selection
		d3.selectAll('path')
			.attr('fill', function (d, i) { return calculateColor(d, i, covidCases, currentWeek); });

		// Select new state
		d3.select(this)
			.attr('fill', 'red');
		selectedID = this.id;

		// Update chart popup
		updatePopup(d, popupGroup, width, height, fips_to_name);
	});

	d3.select('#currentDate').text(Object.keys(covidCases)[currentWeek]);
	d3.select('#weekSlider').on('change', function (d) {
		var week = this.value;
		d3.selectAll('path')
			.attr('fill', function (d, i) {
				color = 'red';
				currentWeek = week;
				d3.select('#currentDate').text(Object.keys(covidCases)[currentWeek]);
				if (d.id != selectedID) {
					color = calculateColor(d, i, covidCases, currentWeek);
				}

				return color;
			});
	});
}

function initSVG() {
	var svgWidth = 1000;
	var svgHeight = 700;

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

	svg.call(responsivefy);
	return { svg, width, height };
}

// Calculate color of county
function calculateColor(d, i, data, week) {
	value = 0;
	date = Object.keys(data)[week]
	if (d.id in data[date]) {
		value = data[date][d.id][0] / 1000;
	}
	return d3.interpolateLab('lightgray', 'green')(value);
}

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

(() => {
	main();
})()