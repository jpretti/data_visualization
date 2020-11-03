//Code adapted but heavily altered from tutorial @ https://www.d3-graph-gallery.com/graph/treemap_json.html

/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */  

// This is where the margins of the graph are set
var margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 600 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// Creates the svg and set its dimensions
var svg = d3.select("body")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Here I read in data I created from a json file on my github
d3.json("https://raw.githubusercontent.com/jpretti/data/master/csvjson.json").then(function(data) {

  //Unlike with csv, no need for stratify
  // d3.hierarchy is used to create the hierarchy of all the data
  //.sum used to get the values of each item, department, and store
  var root = d3.hierarchy(data)
    .sum(function(d){ return d.value}) 

  // treemap is called to get the root coordinates of each child and grandchild
  d3.treemap()
    .size([width, height])
    //new padding set to further show the difference between the departments
    .paddingTop(30)
    .paddingRight(5)
    .paddingInner(5)
    (root);

  // This is used to create separate rectangle colors for each rectanlge department aka: fruit, veggies, meat, dairy
  var color = d3.scaleOrdinal()
    .domain(["Fruit", "Vegetables", "Dairy", "Meat"])
    .range(["blue", "green", "grey", "red"])

  // Opacity is used in order to give contrasting shades of color to each rectangle depending on their value. With larger sales containing a darker shade, and less sales containing a lighter shade.
  var opacity = d3.scaleLinear()
    .domain([0, 20])
    .range([.5,1])

  // This is where the rectangles are created.
  svg
    .selectAll("rect")
    //uses the root leaf data of each rectangle
    .data(root.leaves())
    .enter()
    .append("rect")
      //sets the x coordinate
      .attr('x', function (d) {return d.x0;})
      //sets the y coordinate
      .attr('y', function (d) { return d.y0; })
      //Sets the width of the rectangle 
      .attr('width', function (d) { return d.x1 - d.x0; })
      //Sets the height of the rectangle
      .attr('height', function (d) { return d.y1 - d.y0; })
      //used to fill the rectanlge with a specific color assigned to each parent, name
      .style("fill", function(d){return color(d.parent.data.name)})
      //used to set an opacity specific to each item, value
      .style("opacity", function(d){return opacity(d.data.value)})
      //additional stylings in css file

  // Creates the item labels
  svg
    .selectAll("items")
    .data(root.leaves())
    .enter()
    .append("text")
      //sets right position of the labels within the rectangle
      .attr("x", function(d){return d.x0+5})
      //set lower postion of the labels within the rectangle
      .attr("y", function(d){return d.y0+20})
      //return name of each item
      .text(function(d){return d.data.name})
      //various stylings below
      .attr("font-size", "16.4px")
      .attr("fill", "white")
      .style("stroke", "black")
      .style("stroke-width", ".15")
    
  // Creats the # Sold tag based on each item's number sold, taken from value
  svg
    .selectAll("units_sold")
    .data(root.leaves())
    .enter()
    .append("text")
      //sets right position of the vlues within the rectangle
      .attr("x", function(d){return d.x0+5})    
      //set lower postion of the values within the rectangle
      .attr("y", function(d){return d.y0+35})   
      //return value of each item
      .text(function(d){return "# Sold: " + (d.data.value)})
      .attr("font-size", "11px")
      .attr("fill", "white")
    
  // Display what percentage of total sales each item has
  svg
    .selectAll("units_sold")
    .data(root.leaves())
    .enter()
    .append("text")
      //sets right position of the percentages within the rectangle
      .attr("x", function(d){return d.x0+5}) 
      //set lower postion of the percentages within the rectangle
      .attr("y", function(d){return d.y0+45}) 
      //return % of total sales for each item
      //Rounded total sales percentage
      .text(function(d){return "Sales: " + (Math.round(d.data.value / 260 * 100) + "%")})
      .attr("font-size", "11px")
      .attr("fill", "white")

  // Create Title for each department: fruit, veggies, meat, dairy
  svg
    .selectAll("department")
    .data(root.descendants().filter(function(d){return d.depth==1}))
    .enter()
    .append("text")
      //sets right position of the department labels within the rectangle
      .attr("x", function(d){return d.x0})
      //set lower postion of the department labels within the rectangle
      .attr("y", function(d){return d.y0+21})
      //returns name of department
      .text(function(d){return d.data.name})
      .attr("font-size", "22px")
      .attr("fill",  function(d){return color(d.data.name)})
      .style("stroke", "black")
      .style("stroke-width", ".3")

  // Title for store
  svg
    .append("text")
      // sets coordinates of title
      .attr("x", 0)
      .attr("y", 14)   
      //title text
      .text("Sales by Department")
      .attr("font-size", "19px")
      .attr("fill",  "grey" )

});