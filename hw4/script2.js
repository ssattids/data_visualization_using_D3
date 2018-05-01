// set the dimensions and margins of the graph
var margin2nd = {top2: 20, right2: 20, bottom2: 50, left2: 130},
    width2 = 1600 - margin2nd.left2 - margin2nd.right2,
    height2 = 500 - margin2nd.top2 - margin2nd.bottom2;

// parse the date / time
var parseTime2 = d3.timeParse("%d-%b-%y");
const formatYear2 = d3.timeFormat("%y");

// set the ranges
var x = d3.scaleTime().range([0, width2]);
var y = d3.scaleLinear().range([height2, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.release_date); })
    .y(function(d) { return y(d.budget); });

// append the svg2 obgect to the body of the page
// appends a 'group' element to 'svg2'
// moves the 'group' element to the top2 left2 margin2nd
var svg2 = d3.select("#vis2svg")
    .attr("width", width2 + margin2nd.left2 + margin2nd.right2)
    .attr("height", height2 + margin2nd.top2 + margin2nd.bottom2)
  .append("g")
    .attr("transform",
          "translate(" + margin2nd.left2 + "," + margin2nd.top2 + ")");

// Get the data
d3.csv("tmdb_5000_movies.csv", function(error, data) {

  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.release_date = parseTime(d.release_date);
      d.vote_average = +d.vote_average;
      d.budget = +d.budget;
      d.popularity = +d.popularity;
      d.revenue = +d.revenue;
      d.runtime = +d.runtime;
      d.vote_count = +d.vote_count;
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.release_date; }));
  y.domain(d3.extent(data, function(d) { return d.budget; }));

  var selectData2 = [{"text": "budget"},{"text": "popularity"}, {"text": "revenue"},
                     {"text": "runtime"}, {"text": "vote_average"}, {"text": "vote_count"}
                    ];      

    // Select Y-axis Variable
  var span2 = d3.select('#vis2span')
      .text('Select Y-Axis variable: ');

  var yInput2 = d3.select('#vis2select')
      .attr('id','ySelect2')
      .on('change',yChange2)
    .selectAll('option')
      .data(selectData2)
      .enter()
    .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;});


  // Add the valueline path.
  svg2.append("path")
      .datum(data)
      .attr("id", "line2")
      .attr("fill", "none")
      .attr("stroke", "#409900")
      .attr("d", valueline);
  
  // Add the x Axis
  svg2.append("g")
      .attr("transform", "translate(0," + height2 + ")")
      .call(d3.axisBottom(x));

  // text label for the x axis
  svg2.append("text")             
      .attr("transform",
            "translate(" + (width2/2) + " ," + 
                           (height2 + margin2nd.top2 + 20) + ")")
      .style("text-anchor", "middle")
      .text("Date");

  var yAxis2 = d3.axisLeft().scale(y)
  // Add the y Axis
  svg2.append("g")
      .attr('id','yAxis2')
      .call(yAxis2);

  // text label for the y axis
  ylabel = svg2.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin2nd.left2)
      .attr("x",0 - (height2 / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
  
  ylabel.text("$ Budget");   

  //plot the circles
  var dots2 = svg2.selectAll("circle")
          .data(data).enter()
          .append("circle")
          .attr("class", "data-circles2")
          .attr("cx", function (d) { return x(d.release_date) ; })
          .attr("cy", function (d) { return y(d.budget); })
          .attr("r", "3px")
          .on("mouseover", function(d) {
            div.transition()
              .duration(200)
              .style("opacity", 0.9)
              .style('width', 200 + 'px')
              .style('height', 60 + 'px')
              .style('background-color', 'white')

            div.html("<b>Title: " + d.title + "</b><br/>" + "Tagline: " + d.tagline + "<br/>")
              .style("left", d => {
                return (d3.event.pageX+28) + "px"
              })
              .style("top", (d3.event.pageY -28) + "px");
          })
          //tooltip - actions when hovering out
          .on("mouseout", function(d) {
            div.transition()
            .duration(500)
            .style("opacity", 0);
          });

  function yChange2() {
    var value = this.value; // get the new y value
    console.log(value)
    //update y-axis
    y = d3.scaleLinear().range([height2, 0]);
    y.domain(d3.extent(data, function(d) { return d[value]; }));

    yAxis2 = d3.axisLeft().scale(y)
    svg2.select('#yAxis2')
      .call(yAxis2);

    ylabel.text(value);

    valueline = d3.line()
    .x(function(d) { return x(d.release_date); })
    .y(function(d) { return y(d[value]); });

    //update line
    svg2.select("#line2")
      .attr("d", valueline);
      //update circles
    dots2
      .attr("cx", function (d) { return x(d.release_date) ; })
      .attr("cy", function (d) { return y(d[value]) ; })
      .attr("r", "2px");
    
  }


});