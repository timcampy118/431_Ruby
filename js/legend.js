
// Legend *********************************************************************
// dropdown button switch
var T = 3;
console.log(T);

// select the svg area
var svg = d3.select("#legend_svg")

// legend variables for cases
var casesLegendNum = ["+10,000", "+500", "+200", "+100", "+50", "+10", "+1", "No Cases"]
var casesLegendCol = ["#4d004b", "#810f7c", "#88419d", "#8c6bb1", "#8c96c6", "#9ebcda", "#bfd3e6", "#f7fcfd"]

// legend variables for deaths
var deathsLegendNum = ["-10,000", "-500", "-200", "-100", "-50", "-10", "-1", "No Deaths"]
var deathsLegendCol = ["#7f0000", "#b30000", "#d7301f", "#ef6548", "#fc8d59", "#fdbb84", "#fdd49e", "#fff7ec"]

// legend variables for mobility
var mobilityLegendNum = ["+100", "+50", "+25", "+10", "0", "-10", "-20", "-50", "-100"]
var mobilityLegendCol = ["#00ff00", "#4eff4e", "#a7ffa7", "#d1ffd1", "#ffffff", "#ffffdb", "#ffffa4", "#ffff6d", "#ffff00"]

var theLegendNames = ["Cases", "Deaths", "Mobility"]

// This is where we change the data for the legend
if (T == 1){
    var legNum = casesLegendNum
    var legCol = casesLegendCol
    var legendName = theLegendNames[0]
}
if (T == 2){
    var legNum = deathsLegendNum
    var legCol = deathsLegendCol
    var legendName = theLegendNames[1]
}
if (T == 3){
    var legNum = mobilityLegendNum
    var legCol = mobilityLegendCol
    var legendName = theLegendNames[2]
}

console.log(legNum, legCol);

// setting some variables to position our legend
var xLegend_Pos = 30;
var xLegend_textPos = xLegend_Pos + 20;

var yLegend_Pos = 30;


// Handmade legend
for (key in legNum){
    svg.append("circle").attr("cx",xLegend_Pos).attr("cy",yLegend_Pos).attr("r", 6).style("fill", legCol[key]).style("stroke", "black")
    svg.append("text").attr("x", xLegend_textPos).attr("y", yLegend_Pos).text(legNum[key]).style("font-size", "15px").attr("alignment-baseline","middle")
    var yLegend_Pos = yLegend_Pos + 20;
}
var legRectangle = svg.append("rect") // outline for legend
                            .attr("x", 5)
                            .attr("y", 5)
                            .attr("rx", 20)
                            .attr("ry", 20)
                            .attr("width", 150)
                            .attr("height", 205)
                            .style("fill-opacity", 0)
                            .style("stroke-width", 3)
                            .style("stroke", "black");
// Legend Title 
var svg1 = d3.select("#legTitle_svg")
var legTitle = svg1.append("text")
                .attr("x", 50)
                .attr("y", 35)
                .text(legendName)
                .style("font-size", "20px")
                .attr("alignment-baseline","middle");

var legendBackdrop = svg1.append("rect")
                        .attr("x", 5)
                        .attr("y", 10)
                        .attr("rx", 20)
                        .attr("ry", 20)
                        .attr("width", 150)
                        .attr("height",50)
                        .style("fill",  "#bcbddc")
                        .style("fill-opacity", 0.50)
                        .style("stroke-width", 2)
                        .style("stroke", "#756bb1");



/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
// function myFunction() {
//     document.getElementById("test").classList.toggle("show");
//   }
  
//   // Close the dropdown menu if the user clicks outside of it
//   window.onclick = function(event) {
//     if (!event.target.matches('.dropbtn')) {
//       var dropdowns = document.getElementsByClassName("dropdown-content");
//       var i;
//       for (i = 0; i < dropdowns.length; i++) {
//         var openDropdown = dropdowns[i];
//         if (openDropdown.classList.contains('show')) {
//           openDropdown.classList.remove('show');
//         }
//       }
//     }
//   }




// var colButton = svg1.append("rect")
//                         .attr("x", 5)
//                         .attr("y", 5)
//                         .attr("rx", 20)
//                         .attr("ry", 20)
//                         .attr("width", 100)
//                         .attr("height", 120)
//                         .style("fill-opacity", 50)
//                         .style("fill", function(d){
//                             if(T == 1 ){return "red"}
//                             if(T == 2 ){return "green"}
//                             if(T == 3 ){return "blue"}
//                             else{return "gray"}
//                         })
//                         .style("stroke-width", 3)
//                         .style("stroke", "black");


