/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */

var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 40, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
//d3.timeParse used to parse the date (specifically the year in this case)
var parseTime = d3.timeParse("%Y");

//d3.scaleTime used to encode time along x-axis
var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var yAxis = d3.axisLeft(y)
    // incredment y axis values by 5
    .ticks(5);

//d3.line used to display the line shape
var line = d3.line()
    //line is interpolated using curveBasis
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.btu); });


//converting data to date and columns
function rowConverter(d, _, columns) {
  d.date = parseTime(d.date);
  for (var i = 1, n = columns.length, c; i < n; ++i)
      d[c = columns[i]] = +d[c];
  return d;
}

//creating x gridline function
function make_x_gridlines() {		
    return d3.axisBottom(x)
        .ticks(5)
}

// gridlines in y axis function
function make_y_gridlines() {		
    return d3.axisLeft(y)
        .ticks(5)
}


d3.csv("BRICSdata.csv",rowConverter).then(function(data){
    // map used to copy properties from data into a map
    //columns.slice used to take a slice of the columns
    var countries = data.columns.slice(1).map(function(id) {
        return {
            id: id,
            values: data.map (function(d) {
                return {date: d.date, btu: d[id]};
            })
        };
    })
    
    //extent used to return the min and max value of array using natural order (i.e. domain)
    x.domain(d3.extent(data, function(d) { return d.date; }));
    
    //finding min and max values of BTU's
    y.domain([
        d3.min(countries, function(c) { return d3.min(c.values, function(d) { return d.btu; }); }),
        d3.max(countries, function(c) { return d3.max(c.values, function(d) { return d.btu; }); })
    ]);
    
    console.log(x);
    console.log(y);
    
    z.domain(countries.map(function(c) { return c.id; }));
    
    // add the X gridlines
    g.append("g")			
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
          //Used inner and out to remove ending grid line
          .tickSizeInner(-height)
          .tickSizeOuter(0)
          .tickFormat(""));
    
      // add the Y gridlines
      g.append("g")			
          .attr("class", "grid")
          .call(make_y_gridlines()
              //Used inner and out to remove ending grid line
              .tickSizeInner(-width)
              .tickSizeOuter(0)
              .tickFormat(""));
    
    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    
    g.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
    
    var country = g.selectAll(".country")
        .data(countries)
        .enter().append("g")
        .attr("class", "country")
        .attr("id", function(d){
            return d.id.replace(" ", '_');
        });
    
    console.log(countries);
        
    // Creating var path to be animated later on. 
    // These are the country lines
    var path = country.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return z(d.id); });
    
    console.log(path);
    
    // Setting total length to the path to be used in animation
    var totalLength = path.node().getTotalLength();
    
    console.log(totalLength);
    
    // Animation Code
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
        //time duration of animation
        .duration(3000)
        // type of animation (linear, circle, cubic, exp, poly)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

    // Adding Country Names next to each line
    country.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.btu) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "12px sans-serif")
      .text(function(d) { return d.id; })
    
    //Y axis Title
    g.append("text")
        //Flipping Y axis title 90 degrees
        .attr("transform", "rotate(-90)")
        //Moving y axis title to the left of y axis
        .attr("y", 0 - 35)
        //Moving y axis title half way down height length
        .attr("x", 0 - (height / 2))
        //Fixing y axis title to center of y axis
        .style("text-anchor", "middle")
        //Writing y axis title
        .text("Million BTUs Per Person")
        //Giving the y axis label some style
        .style("font-weight", "bold");
    
    //X Axis Title
    g.append("text")
        //Move x axis label below x axis
        .attr("y", 527)
        //move x axis to center of x axis
        .attr("x", width/2)
        //fix x axis labelto be centered
        .style("text-anchor", "middle")
        //write x axis label
        .text("Year")
        //Giving the x axis label some style
        .style("font-weight", "bold");

});
