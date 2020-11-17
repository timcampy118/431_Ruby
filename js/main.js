
var covidCases = null;
var counties = null;
var selectedCovid = null;

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
	var displayCases = true;

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
	var mapGroup = svg.append('g')
	var counties = mapGroup.selectAll('county')
		.data(countiesData)
		.enter()
		.append('path')
		.attr('class', 'county')
		.attr('fill', function (d, i) { return calculateColor(d, covidCases, currentWeek, displayCases); })
		.attr('stroke', 'black')
		.attr('d', path)
		.attr('id', function (d, i) { return d.id; });

	var popup = new Popup(svg);

	// Logic for clicking in map
	counties.on('click', function (d) {
		console.log(d);

		// Clear last selection
		d3.selectAll('.county')
			.attr('fill', function (d, i) { return calculateColor(d, covidCases, currentWeek, displayCases); });

		// Select new state
		d3.select(this)
			.attr('fill', 'red');
		selectedID = this.id;

		// Update chart popup
		popup.onClick(d, width, height, fips_to_name, covidCasesFor(selectedID));
	});

	d3.select('#currentDate').text(Object.keys(covidCases)[currentWeek]);
	d3.select('#weekSlider').on('change', function (d) {
		var week = this.value;
		d3.selectAll('.county')
			.attr('fill', function (d, i) {
				color = 'red';
				currentWeek = week;
				d3.select('#currentDate').text(Object.keys(covidCases)[currentWeek]);
				if (d.id != selectedID) {
					color = calculateColor(d, covidCases, currentWeek, displayCases);
				}

				return color;
			});
	});

var covidOptions = ["cases", "deaths","none"]


	//cases or deaths
d3.select("#optionDrop")
      .selectAll('myOptions')
      .data(covidOptions)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button


d3.select('#optionDrop').on('change', function (d) {
	selectedCovid = document.getElementById('optionDrop').value;
	
	if(selectedCovid=="none")
		displayCases = false;
	else
		displayCases = true;

		d3.selectAll('.county')
			.attr('fill', function (d, i) {
				color = 'red';
				d3.select('#currentDate').text(Object.keys(covidCases)[currentWeek]);
				if (d.id != selectedID) {
					color = calculateColor(d, covidCases, currentWeek, displayCases);
				}

				return color;
			});
	});



	d3.timer(function(d)
	{
		popup.update()
	})
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


//CHANGE THIS
// Calculate color of county
function calculateColor(d, data, week, displayCases) {
	value = 0;
	var pick=null;

	if(selectedCovid=="cases")
		pick=0;
	else
		pick=1;



	date = Object.keys(data)[week]
	if (d.id in data[date]) {
		value = data[date][d.id][pick] / 1000;
	}
	if (displayCases)
	{
		return d3.interpolateLab('lightgray', 'green')(value);
	}
	return 'lightgray';
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