/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */


/* ----------------------------------------------------------------------------
File: BarGraphSample.js
Contructs the Bar Graph using D3
80 characters perline, avoid tabs. Indet at 4 spaces. See google style guide on
JavaScript if needed.
-----------------------------------------------------------------------------*/ 

// Search "D3 Margin Convention" on Google to understand margins.
// Add comments here in your own words to explain the margins below
// setting the margin, width and height 
// margin indicates the space around edges of screen
// width and height referenced later in the svg and setting the scales
var margin = {top: 10, right: 40, bottom: 150, left: 50},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    

// Define SVG. "g" means group SVG elements together.
// Scalable Vector Graphics
// Add comments here in your own words to explain this segment of code
// Creates the SVG element in which to place all the shapes
// Using var allows us to capture the reference handed back by append().
var svg = d3.select("body").append("svg")
    // setting the width of the svg based on inner dimension of margins
    .attr("width", width + margin.left + margin.right)
    //setting the height of the svg based on inner dimension of margins
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* --------------------------------------------------------------------
SCALE and AXIS are two different methods of D3. See D3 API Refrence and 
look up SVG AXIS and SCALES. See D3 API Refrence to understand the 
difference between Ordinal vs Linear scale.
----------------------------------------------------------------------*/ 

// Define X and Y SCALE.
// Add comments in your own words to explain the code below
//creating a dynamic ordinal scale and setting the range (rounded output) and adding padding
var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);

//creating a dynamic linear scale and setting range (output)
var yScale = d3.scaleLinear().range([height, 0]);

// Define X and Y AXIS
// Define tick marks on the y-axis as shown on the output with an interval of 5 and $ sign
var xAxis = d3.axisBottom(xScale);

var yAxis = d3.axisLeft(yScale)
    // incredment y axis values by 5
    .ticks(5);

// Added in order to format y axis as currency
var formatAsMoney = d3.format("$0");

yAxis.tickFormat(formatAsMoney)






/* --------------------------------------------------------------------
To understand how to import data. See D3 API refrence on CSV. Understand
the difference between .csv, .tsv and .json files. To import a .tsv or
.json file use d3.tsv() or d3.json(), respectively.
----------------------------------------------------------------------*/ 

// data.csv contains the country name(key) and its GDP(value)
// d.key and d.value are very important commands
// You must provide comments here to demonstrate your understanding of these commands
// Assigning the values in the 2 data columns, country & gdp
// Assigning country to key
// Assigning gdp to value
function rowConverter(data) {
    return {
        key : data.country,
        value : +data.gdp
    }
}

// using data from GDP2020TrillionUSDollars.csv
d3.csv("GDP2020TrillionUSDollars.csv",rowConverter).then(function(data){
    
    // Return X and Y SCALES (domain). See Chapter 7:Scales (Scott M.) 
    // setting the domain of both the x and y axis using key and value
    // key is data in country column
    // value is data in gdp column
    xScale.domain(data.map(function(d){ return d.key; }));
    yScale.domain([0,d3.max(data, function(d) {return d.value; })]);
    
    // Creating rectangular bars to represent the data. 
    // Add comments to explain the code below
    // creates a rectangle for each data point
    // Each rect must have an x, y, width, and height
    svg.selectAll("rect")
        // binds data to elements about to be created
        .data(data)
        // returns a placeholder reference to the new element
        .enter()
        // adds a rectangle to the DOM
        .append("rect")
        // makes the rectangle transition onto page and sets duration for animation
        .transition().duration(1000)
        // delays transition
        .delay(function(d,i) {return i * 200;})
        //creating x coordinates of rectangles
        .attr("x", function(d) {
            //return scaled value for x
            return xScale(d.key);
        })
        //creating y coordinates of rectangles
        .attr("y", function(d) {
            //return scales value for y
            return yScale(d.value);
        })
        //setting width of rectangles
        .attr("width", xScale.bandwidth())
        //setting height of rectangles
        .attr("height", function(d) {
            return height- yScale(d.value);
        })
        // create increasing to decreasing shade of blue as shown on the output
        .attr("fill", function(d) {
            return "rgb(0, 0, " + Math.round(d.value * 100) + ")";
        });
    
    // Label the data values(d.value)
    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        //extended code to include a data value within each text element
        .text(function(d){
            return d.value;
        })
        // positioning the labels via x and y scaled coordinates
        .attr("x", function(d) {
            // getting label aligned correctly along x axis so it can be centered later
            return (xScale(d.key) + xScale.bandwidth(d.key)/2);
        })
        .attr("y", function(d) {
            return yScale(d.value) + 14;
        })
        // added style to put labels in each blue rect with even spacing
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "white");
  
    
    // Draw xAxis and position the label at -60 degrees as shown on the output 
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .style("text-anchor", "end")
        .attr("font-size", "10px")
        // positioning the x axis labels down 60 degrees
        .attr("transform", "rotate(-60)");
        
    
    // Draw yAxis and position the label
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    
    // yAxis Label
    svg.append("text")
        // rotate label 90 degrees
        .attr("transform", "rotate(-90)")
        // adjust to left of y axis based on inner dimension of left margin
        .attr("y", 0 - margin.left)
        // center along y axis
        .attr("x", 0 - (height / 2))
        // bring onto screen fully
        .attr("dy", ".8em")
        // set label in middle
        .style("text-anchor", "middle")
        // Label Text
        .text("Trillions of US Dollars ($)")
        .style("font-weight", "bold");       
      
});
