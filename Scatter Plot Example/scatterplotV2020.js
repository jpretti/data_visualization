/*(i) pan + drag: The user can click one of the country circles 
and drag in the direction they wish. X and Y will show negative*/

/*(ii) zoom-in/out: While hovered over a country circle the user can
zoom in or out by dragging their fingers in and out on a trackpad. 
Additionally, the user can double click on a country cirlce to zoom
in. */

/*BONUS - There is a reset button if you zoom in too much or want
to quickly get back to normal view */

/*(iii) country name/tooltip: The name of country is always displayed. 
When hovered with mouse, a tooltip appears showing the required info. 
As requested for Assignment B, country names get bigger when zoomed in and move with the circles. The
tooltip stays they same size no matter how much the user zooms in or 
out and the location moves with the circles.*/

/*BONUS - When the user hovers over a country circle, it highlights
in orange to indicate that is the circle currently selected. */








/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */  

    //Define Margin
    var margin = {left: 50, right: 80, top: 50, bottom: 50 }, 
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    //Define Color
    //Used scaleOrdinal to show different colors from schemeAccent
    var colors = d3.scaleOrdinal(d3.schemeAccent);

    //Define SVG
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Define Scales   
    var xScale = d3.scaleLinear()
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .range([height, 0]);

    //Added a z scale to measure the area of the circles
    //Read that sclaeSqrt() was good to use when showing area
    var zScale = d3.scaleSqrt()
        .domain([0, 100])
        .range([0, 50]);
        
    //Define Axis (changed to v5)
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    //Getting data from each column of csv file
    function rowConverter(data) {
        return {
            gdp : +data.gdp,
            epc : +data.ecc,
            country: data.country,
            population: +data.population,
            area: data.ec
        }
    }

d3.csv("scatterdata.csv",rowConverter).then(function(scatterdataset){
    
    //Setting domains, used nice() in order to display final tick marks
    xScale.domain([0,d3.max(scatterdataset, function(d) {return d.gdp; })]).nice();
    yScale.domain([0,d3.max(scatterdataset, function(d) {return d.epc; })]).nice();
    //Just used 5th column (area) because it was already defined rather than calculate
    zScale.domain([0,d3.max(scatterdataset, function(d) {return d.area; })]);
    
    
   //creating a group
    var g = svg.append("g");
    
    //Draw Scatterplot
    g.selectAll(".dot")
        .data(scatterdataset)
        //adding the country circles
        .enter().append("circle")
        .attr("class", "dot")
        // setting radius of each circle
        .attr("r", function(d) {return zScale(d.area);})
        //determining where on the x axis the circle goes based on column gdp
        .attr("cx", function(d) {return xScale(d.gdp);})
        //determining where on the y axis the circle goes based on column epc
        .attr("cy", function(d) {return yScale(d.epc);})
        //giving each circle a color
        .attr("fill", function (d) { return colors(d.country); })
        //Add .on("mouseover", .....
        //Add Tooltip.html with transition and style
        .on("mouseover", function(d){
            //Update the tooltip position and value
            d3.select("#tooltip")
              .style("left", (d3.event.pageX+15) + "px")		
              .style("top", (d3.event.pageY - 28) + "px")
            //Sending the column data over to the html to use in tooltip display
              .select("#country").text(d.country)
            d3.select("#tooltip").select("#gdp").text(d.gdp)
            d3.select("#tooltip").select("#epc").text(d.epc)
            d3.select("#tooltip").select("#population").text(d.population)
            d3.select("#tooltip").select("#area").text(d.area)
            //Show the tooltip because it is usually hidden
            d3.select("#tooltip").classed("hidden", false);
        })
        //Then Add .on("mouseout", ....
        .on("mouseout", function() {
            //Hide the tooltip
            d3.select("#tooltip").classed("hidden", true);
        });

    //Draw Country Names
    g.selectAll(".text")
        .data(scatterdataset)
        .enter().append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        //x and y coordinates of text based on center of circle
        .attr("x", function(d) {return xScale(d.gdp);})
        .attr("y", function(d) {return yScale(d.epc);})
        .style("fill", "black")
        .text(function(d) {return d.country; });
  
    //rectangle legend box
    svg.append("rect")
        .attr("x", 600)
        .attr("y", 205)
        .attr("width", 200)
        .attr("height", 175);
    
    //Legend Title
    svg.append("text")
        .attr("x", 607)
        .attr("y", 375)
        .text("Total Energy Consumption")
        .style("fill", "green")
        .style("font-size", "16px")
    
    
    //small circle for legend
     svg.append("ellipse")
        .attr("cx", 750)
        .attr("cy", 220)
        .attr("rx", 7)
        .attr("ry", 7);
    
    //small circle title for legend
     svg.append("text")
        .attr("x", 607)
        .attr("y", 222)
        .text("1 Trillion BTUs")
    
    //Medium circle for legend
    svg.append("ellipse")
        .attr("cx", 750)
        .attr("cy", 250)
        .attr("rx", 18)
        .attr("ry", 18);
    
    //Medium Circle title for legend
    svg.append("text")
        .attr("x", 607)
        .attr("y", 252)
        .text("10 Trillion BTUs")
    
    //Big Circle for Legend
    svg.append("ellipse")
        .attr("cx", 750)
        .attr("cy", 312)
        .attr("rx", 40)
        .attr("ry", 40);
    
    //Big Circle title for legend
    svg.append("text")
        .attr("x", 607)
        .attr("y", 315)
        .text("100 Trillion BTUs")
    
    
    //Y Label
    svg.append("text")
        //rotating label 90 degrees
        .attr("transform", "rotate(-90)")
        //Move x axis label below x axis
        .attr("y", 0 - 35)
        //move x axis to center of x axis
        .attr("x", 0 - (height/2))
        //fix x axis labelto be centered
        .style("text-anchor", "middle")
        //.style("text-anchor", "middle")
        //write x axis label
        .text("Energy Consumption per Capita (in Million BTUs per person)")
        .attr("font-size", "12px");
    
    //X Label
    svg.append("text")
        //Move x axis label below x axis
        .attr("y", height + 35)
        //move x axis to center of x axis
        .attr("x", width/2)
        //fix x axis labelto be centered
        .style("text-anchor", "middle")
        //.style("text-anchor", "middle")
        //write x axis label
        .text("GDP (in Trillion US Dollars) in 2010")
        .attr("font-size", "12px");
    
    //zoom+drag+pan functionality here
    var zoom = d3.zoom()
        .scaleExtent([1, 5])
        .on("zoom", zoomed);

    //creating a x and y group to scale when zoomed
    var gX = svg.append("g")
        .attr("class", "axis axis--xScale")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    var gY = svg.append("g")
        .attr("class", "axis axis--yScale")
        .call(yAxis);
    
    //reset button
    d3.select("button")
        .on("click", resetted)
        //button turns blue when clicked
        .style("fill", "blue");
    
    svg.call(zoom);
    
    //function to zoom+pan+drag
    function zoomed() {
      g.attr("transform", d3.event.transform);
      gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
      gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
    }
    
    //function to reset, used in button
    function resetted() {
        svg.transition()
          .duration(750)
          .call(zoom.transform, d3.zoomIdentity);
    }   

});
