
var covidCases = null;
var counties = null;
var selectedCovid = "none";
var selectedMobility = "none";
var mobilityDate = null;
var mobilityFips = null;
var currentWeek = 15;
var firstTime = true;

function main() {
	var { svg, width, height } = initSVG();

	// Map drawing function
	// Data from "https://github.com/topojson/us-atlas"
	fetchData().then(function (data) {
		// console.log(data);

		counties = data[0];
		covidCases = data[1];
		mobilityDate = data[2];
		mobilityFips = data[3];

		initCovidCasesMap(svg, width, height, counties, covidCases);
	});
}

function initCovidCasesMap(svg, width, height, counties, covidCases) {
	var fips_to_name = {};

	var selectedID = 0;
	var readyForUpdate = true
	var play = false
	var selectedPosition = [0,0]
	var displayCases = false;
	var displayMobility = false;

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
		.attr("transform", `translate(${500}, 0)`);
	var counties = mapGroup.selectAll('county')
		.data(countiesData)
		.enter()
		.append('path')
		.attr('class', 'county')
		.attr('fill', 'white')
		.attr('stroke', 'lightgray')
		.attr('d', path)
		.attr('id', function (d, i) { return d.id; });

		
	// SPIKES FOR CASES
	var spikes = svg.append("g")
		.attr("transform", `translate(${500}, 0)`)
		.attr("class", "spikes")
		.selectAll("spikes")
		.data(countiesData)
		.enter()
		.append("path")
		.attr("fill", "red")
		.attr("fill-opacity", 0.1)
		.attr("opacity", 0)
		.attr("transform", function(d) {
			if (isNaN(path.centroid(d)[0]))
			{
				return "translate(0,0)";
			}
			return "translate(" + path.centroid(d) + ")";
			})
		.attr("d", function (d, i) {
			d3.select('#currentDate').text(Object.keys(covidCases)[currentWeek]);
			var cases = calculateSpikeLength(d, covidCases, currentWeek, displayCases);
			return spike(cases)
		});

	var graphs = new Graphs(svg);
	var legend = new Legend(svg);
	var popup = new Popup(svg);

	// Logic for clicking in map
	counties.on('click', function (d) {
		
		// Clear last selection
		d3.selectAll('.county')
			.attr('fill', function (d, i)
			{
				return calculateColor(d, mobilityDate, currentWeek, displayMobility);
			});

		// Select new state
		d3.select(this)
			.attr('fill', 'red');
		selectedID = this.id;
		selectedPosition = path.centroid(d3.select(this).datum())
		selectedPosition[0] += 500

		// Update chart popup
		popup.onClick(d, width, height, fips_to_name, covidCasesFor(selectedID), selectedPosition);
		graphs.onClick(d, width, height, fips_to_name, mobilityFips[selectedID])
	});

	d3.select('#currentDate').text(Object.keys(covidCases)[currentWeek]);
	d3.select('#play').on('click', function(d)
	{
		if (play)
		{
			play = false;
			this.value = "Play"
			document.getElementById('weekSlider').disabled = false
		}
		else
		{
			play = true;
			this.value = "Stop"
			document.getElementById('weekSlider').disabled = true
		}
	});

	d3.select('#weekSlider').on('change', function (d) {
		var week = +this.value;
		if (play === false)
		{
			currentWeek = +week;
		}

		d3.selectAll('.county')
			.attr('fill', function (d, i) {
				color = 'red';
				d3.select('#currentDate').text(Object.keys(mobilityDate)[currentWeek]);
				if (d.id != selectedID) {
					color = calculateColor(d, mobilityDate, currentWeek, displayMobility);
				}

				return color;
			});

			// SPIKES FOR CASES
			svg.selectAll(".spikes").selectAll("path")
			.attr("opacity", function(d)
			{
				if (isNaN(path.centroid(d)[0]))
				{
					return 0;
				}
				d3.select('#currentDate').text(Object.keys(covidCases)[currentWeek]);
				var cases = calculateSpikeLength(d, covidCases, currentWeek, displayCases);
				cases = Math.min(cases*10, 1.0)
				return cases
			})
			.attr("transform", function(d) {
				if (isNaN(path.centroid(d)[0]))
				{
					return "translate(0,0)";
				}

				return "translate(" + path.centroid(d) + ")";
				})
			.attr("d", function (d, i) {
				d3.select('#currentDate').text(Object.keys(covidCases)[currentWeek]);
				var cases = calculateSpikeLength(d, covidCases, currentWeek, displayCases);
				return spike(cases)
			});
			if (selectedCovid == 'deaths')
			{
				svg.selectAll(".spikes").selectAll("path").attr('class', 'spikes deaths_spikes')
			}
			else
			{
				svg.selectAll(".spikes").selectAll("path").attr('class', 'spikes cases_spikes')
			}

	});

var covidOptions = ["none","cases", "deaths"]
var mobilityOptions = ["none","retail", "grocery", "parks", "transit", "workplaces", "residential"]


//cases or deaths
d3.select("#mobilityDrop")
      .selectAll('mobilityDrop')
      .data(mobilityOptions)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button
d3.select('#mobilityDrop').property('value', 'retail')

//cases or deaths
d3.select("#optionDrop")
      .selectAll('myOptions')
      .data(covidOptions)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button
d3.select('#optionDrop').property('value', 'cases')

d3.select('#mobilityDrop').on('change', function (d) {
	selectedMobility = document.getElementById('mobilityDrop').value;
	
	if(selectedMobility=="none")
		displayMobility = false;
	else
		displayMobility = true;

		d3.selectAll('.county')
			.attr('fill', function (d, i) {
				color = 'red';
				d3.select('#currentDate').text(Object.keys(mobilityDate)[currentWeek]);
				if (d.id != selectedID) {
					color = calculateColor(d, mobilityDate, currentWeek, displayMobility);
				}

				return color;
			});

			d3.select("#weekSlider").dispatch("change");
	});

	d3.select('#optionDrop').on('change', function (d) {
		selectedCovid = document.getElementById('optionDrop').value;
		
		if(selectedCovid=="none")
			displayCases = false;
		else
			displayCases = true;

		console.log(selectedCovid);
		console.log(displayCases);
		d3.select("#weekSlider").dispatch("change");

	});

	d3.timer(function(d)
	{
		popup.update()
		graphs.update()
		if (readyForUpdate && play)
		{
			currentWeek = (currentWeek + 1) % 30
			d3.select('#weekSlider').property('value', currentWeek)
			d3.select('#weekSlider').on('change')();
		}
		if (firstTime)
		{
			d3.select('#mobilityDrop').on('change')();
			d3.select('#optionDrop').on('change')();
			firstTime = false;
		}
	})
}

function initSVG() {
	var svgWidth = 2000;
	var svgHeight = 1400;

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
		// .call(responsivefy);

	svg.call(responsivefy);
	return { svg, width, height };
}

// Get color
function getColor(d) {
	return	d >= 100 ? '#00ff00' :
			d >= 50  ? '#4eff4e' :
			d >= 25 ? '#a7ffa7' :
			d >= 10 ? '#d1ffd1' :
			d <= -100   ? '#ffff00' :
			d <= -50   ? '#ffff6d' :
			d <= -20   ? '#ffffa4' :
			d <= -10   ? '#ffffdb' :
			 '#ffffff';
}
// Calculate color of county
function calculateColor(d, data, week, displayMobility) {
	value = 0;
	var pick=null;

	switch (selectedMobility) {
	case "retail":
		pick = 0;
		break;
	case "grocery":
		pick = 1;
		break;
	case "parks":
		pick = 2;
		break;
	case "transit":
		pick = 3;
		break;
	case "workplaces":
		pick = 4;
		break;
	case "residential":
		pick = 5;
		break;
	}

	date = Object.keys(data)[week]
	if (data[date] != null && d.id in data[date]) {
		value = data[date][d.id][pick];
	}
	if (displayMobility)
	{
		// return d3.interpolateLab('lightgray', '#6e016b')(value);
		//console.log(value);
		if (isNaN(value))
		{
			value = 0
		}
		return getColor(+value);
	}
	return 'white';
}

function calculateRadius(d, data, week, displayCases) {


	if (!displayCases)
	{
		// return d3.interpolateLab('lightgray', '#6e016b')(value);
		return 0;
	}

	value = 0;
	date = Object.keys(data)[week]
	var pick = 0;
	if (selectedCovid == "cases")
		pick=0;
	else
		pick=1;




	if (data != null && d.id in data[date]) {
		value = data[date][d.id][pick] / 1000;
	}
	//console.log(value);
	return value;
}

function calculateSpikeLength(d, data, week, displayCases) {
	value = 0;
	if(!displayCases)
		return 0;
	var pick = 0;
	if (selectedCovid == "cases")
		pick=0;
	else
		pick=1;

	date = Object.keys(data)[week]
	if (d.id in data[date]) {
		value = data[date][d.id][pick] / 1000;
	}
	return value * 1.5;
}

// length = d3.scaleLinear([0, d3.max(data, d => d.value)], [0, 200])

spike = (length, width = 7) => `M${-width / 2},0L0,${-length}L${width / 2},0`

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

