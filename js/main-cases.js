
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
		console.log("covidCases:");
		console.log(covidCases);

		initCovidCasesMap(svg, width, height, counties, covidCases);

	});
}

function initCovidCasesMap(svg, width, height, counties, covidCases) {
	var fips_to_name = {};

	var currentWeek = 10;
	var selectedID = 0;
	var displayCases = true;

	// Create map
	var projection = d3.geoAlbersUsa();

	var path = d3.geoPath()
		.projection(projection);
	
	console.log("path:");
	console.log(path);

	// Extract map from JSON
	var countiesData = topojson.feature(counties, counties.objects.counties).features;
	console.log("countiesData:");
	console.log(countiesData);
	// console.log(countiesData);

	// Extract county data
	for (var i = 0; i < countiesData.length; i++) {
		fips_to_name[countiesData[i].id] = countiesData[i].properties.name;
	}

	// Create counties from map
	var mapGroup = svg.append('g')
	var counties = mapGroup.selectAll('county')
		.data(countiesData)
		.enter()
		.append('path')
		.attr('class', 'county')
		.attr('fill', function (d, i) { return "rgb(224, 224, 224)"; })
		.attr('stroke', 'white')
		.attr('d', path)
		.attr('id', function (d, i) { return d.id; });
		
		var circles = svg.append("g")
		.attr("class", "bubble")
		.selectAll("circle")
		.data(countiesData)
		.enter().append("circle")
		.attr('fill', "red")
		.attr("fill-opacity", 0.3)
		.attr('stroke', 'red')
		.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
		.attr("r", function (d, i) {
			radius = 0;
			d3.select('#currentDate').text(Object.keys(covidCases)[currentWeek]);
			if (d.id != selectedID) {
				radius = calculateRadius(d, covidCases, currentWeek, displayCases);
			}

			return radius;
		});

		d3.select('#currentDate').text(Object.keys(covidCases)[currentWeek]);
		
		d3.select('#weekSlider').on('change', function (d) {
			svg.selectAll("circle").remove();
			var week = this.value;
			var circles = svg.append("g")
				.attr("class", "bubble")
			.selectAll("circle")
				.data(countiesData)
			.enter().append("circle")
			.attr('fill', "red")
			.attr("fill-opacity", 0.3)
			.attr('stroke', 'red')
				.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
				.attr("r", function (d, i) {
			radius = 0;
			currentWeek = week;
			d3.select('#currentDate').text(Object.keys(covidCases)[currentWeek]);
			if (d.id != selectedID) {
				radius = calculateRadius(d, covidCases, currentWeek, displayCases);
			}

			return radius;
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
function calculateColor(d, data, week, displayCases) {
	value = 0;
	date = Object.keys(data)[week]
	if (d.id in data[date]) {
		value = data[date][d.id][0] / 1000;
	}
	if (displayCases)
	{
		return d3.interpolateLab('lightgray', 'green')(value);
	}
	return 'lightgray';
}

function calculateRadius(d, data, week, displayCases) {
	value = 0;
	date = Object.keys(data)[week]
	if (d.id in data[date]) {
		value = data[date][d.id][0] / 1000;
	}
	return value;
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