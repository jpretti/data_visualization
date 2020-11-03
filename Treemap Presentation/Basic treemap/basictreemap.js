//Code adapted but altered from tutorial @ https://www.d3-graph-gallery.com/graph/treemap_basic.html

/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */  

//This is where the dimensions of the graph are set
var margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 445 - margin.left - margin.right,
  height = 445 - margin.top - margin.bottom;

// creating the svg object 
var svg = d3.select("body")
.append("svg")
  //setting the width and height of the svg
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

//creating a group g
.append("g")
  //setting group to appear in svg
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Loading a CSV file from my github
d3.csv("https://raw.githubusercontent.com/jpretti/data/master/datasheet.csv").then(function(data){

  // This is one of the key functions to allow a csv file to work
  // Basically converts the csv into a json file "sort of"
    //stratify is used to take column data from the csv
    //and convert it into a hierarchy format with parent/child
    //relationships.
  var root = d3.stratify()
    // Name of the child = column name in csv file
    .id(function(d) { return d.name; })  
    // Name of the parent = column parent in csv file
    .parentId(function(d) { return d.parent; })
    (data);
   
  // getting the value from column value in the CSV
  // this value will be used to determine the size of the table
  root.sum(function(d){return +d.value})

  // d3.treemap is another key function
  // it computes the position of each element in a hierarchy
  // The coordinates are added to the root object above
  d3.treemap()
    .size([width, height])
    .padding(8)
    (root);

//used to check the leaves    
console.log(root.leaves())

  // This is where the rectangles are created
  svg.selectAll("rect")
    // grabing data for all the children aka rect's
    .data(root.leaves())
    .enter()
    .append("rect")
    
      //x0, x1, y0, y1 are based on the value column and set
        //when calling treemap. They represent the top left
        // and bottom right corners of the rectangles

      //this is where the location of each rect is set
      .attr('x', function(d){return d.x0;})
      .attr('y', function(d){return d.y0;})
    
      //The proportion of the space that a rectangle covers inside
        //its parent is based on the values from column value in CSV
    
      //this is where the size of each rect is set
      //depends on the value
      .attr('width', function(d){return d.x1 - d.x0; })
      .attr('height', function(d){return d.y1 - d.y0; })
      //some additional styling in css file
      

  // and to add the text labels
  svg.selectAll("text")
    .data(root.leaves())
    .enter()
    //creating label for each leaf
    .append("text")
      // setting postion a little to the right
      .attr("x", function(d){return d.x0+10})
      // setting position a little lower
      .attr("y", function(d){return d.y0+20})
      // setting label to name of item from column name in csv
      .text(function(d){return d.data.name})
      //some additional styling in css file
})