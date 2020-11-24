
class Legend
{
    constructor(svg)
    {
        // Legend *********************************************************************
        // dropdown button switch
        var T = 3;

        // legend variables for cases
        var casesLegendNum = ["+10,000", "+500", "+200", "+100", "+50", "+10", "+1", "No Cases"]
        var casesLegendCol = ["#4d004b", "#810f7c", "#88419d", "#8c6bb1", "#8c96c6", "#9ebcda", "#bfd3e6", "#f7fcfd"]

        // legend variables for deaths
        var deathsLegendNum = ["-10,000", "-500", "-200", "-100", "-50", "-10", "-1", "No Deaths"]
        var deathsLegendCol = ["#7f0000", "#b30000", "#d7301f", "#ef6548", "#fc8d59", "#fdbb84", "#fdd49e", "#fff7ec"]

        // legend variables for mobility
        var mobilityLegendNum = ["+100%", "+50%", "+25%", "+10%", "0%", "-10%", "-20%", "-50%", "-100%"]
        var mobilityLegendCol = ["#00ff00", "#4eff4e", "#a7ffa7", "#d1ffd1", "#ffffff", "#ffffdb", "#ffffa4", "#ffff6d", "#ffff00"]

        var theLegendNames = ["Cases", "Deaths", "Mobility Change"]

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

        // setting some variables to position our legend
        var xLegend_Pos = 1400;
        var xLegend_textPos = xLegend_Pos + 20;

        var yLegend_Pos = 200;
        var yLegend_Pos_Offset = yLegend_Pos;

        // Handmade legend
        for (var key in legNum){
            svg.append("circle").attr("cx",xLegend_Pos).attr("cy",yLegend_Pos_Offset).attr("r", 6).style("fill", legCol[key]).style("stroke", "black")
            svg.append("text").attr("x", xLegend_textPos).attr("y", yLegend_Pos_Offset).text(legNum[key]).style("font-size", "15px").attr("alignment-baseline","middle")
            yLegend_Pos_Offset = yLegend_Pos_Offset + 20;
        }
        var legRectangle = svg.append("rect") // outline for legend
                                    .attr("x", xLegend_Pos-25)
                                    .attr("y", yLegend_Pos-25)
                                    .attr("rx", 20)
                                    .attr("ry", 20)
                                    .attr("width", 150)
                                    .attr("height", 205)
                                    .style("fill-opacity", 0)
                                    .style("stroke-width", 3)
                                    .style("stroke", "black");

        // Legend Title
        var legTitle = svg.append("text")
                        .attr("x", xLegend_Pos-25)
                        .attr("y", yLegend_Pos-37)
                        .text(legendName)
                        .style("font-size", "16px")
                        .style('font-weight', 'bold')
                        .attr("alignment-baseline","middle");

        /*var legendBackdrop = svg.append("rect")
                                .attr("x",xLegend_Pos-25)
                                .attr("y", yLegend_Pos-75)
                                .attr("rx", 20)
                                .attr("ry", 20)
                                .attr("width", 150)
                                .attr("height",50)
                                .style("fill",  "#bcbddc")
                                .style("fill-opacity", 0.50)
                                .style("stroke-width", 2)
                                .style("stroke", "#756bb1");*/
    }
}






