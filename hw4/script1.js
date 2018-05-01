const margin = {top: 20, right: 10, bottom: 20, left: 10};   
//position in the center
const innerWidth = 800 - margin.left - margin.right; 
const innerHeight = 800 - margin.top - margin.bottom;  
const svg = d3.select("#vis1svg"); 
const g = svg.append("g")
    	//.attr("transform", "translate(" + innerWidth / 2 + "," + innerHeight / 2 + ")");

const innerRadius = 70; //how big the inner most circle should be
const outerRadius = Math.min(innerWidth, innerHeight) * 0.5;
const fullCircle = 2 * Math.PI; //2pi is the circumfrence! 
const parseTime = d3.timeParse("%B %d, %Y"); //returning date object
const formatYear = d3.timeFormat("%Y"); //return the month: 1=Jan, 2=Feb

const xScale = d3.scaleTime()
        .range([0, fullCircle]);
var yScale = d3.scaleRadial()
    		.range([innerRadius, outerRadius]);
//at which angle and length you will draw the line (think polar coordinates)
var lineScale = d3.lineRadial()
    		.angle(function(d) { return xScale(d.release_date); })  // x: angle in radians; 0 at -y (12 o'clock)
    		.radius(function(d) { return yScale(d.budget); }); // y: distance from origin (0,0)

//adjust the viewbox, since we start drawing form the center
svg.attr("viewBox", ""+innerWidth/-2+" "+innerHeight/-2+" "+innerWidth+" "+innerHeight+" ");

svg.call(d3.zoom()
  .scaleExtent([0.8,8]) //limit the range of the scaling
  .on("zoom", zoom));

//create a div that will be used for the tooltip
    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 1);

d3.csv("tmdb_5000_movies.csv" ,function(d) {
      d.release_date = parseTime(d.release_date);
      d.vote_average = +d.vote_average;
      d.budget = +d.budget;
      d.popularity = +d.popularity;
      d.revenue = +d.revenue;
      d.runtime = +d.runtime;
      d.vote_count = +d.vote_count;
      return d;
    }, function(error, data) {
      if (error) throw error;
      
  //set the domains of the scales
  xScale.domain(d3.extent(data, d => d.release_date));
  yScale.domain(d3.extent(data, d => d.budget));
  
  //all variables available for selection
  var selectData = [{"text": "budget"},{"text": "popularity"}, {"text": "revenue"},
                     {"text": "runtime"}, {"text": "vote_average"}, {"text": "vote_count"}
                    ];           

  // Select Y-axis Variable using a drop down
  var span = d3.select('#vis1span')
      .text('Select Y-Axis variable: ');
  var yInput = d3.select('#vis1select')
      .attr('id','ySelect')
      .on('change',yChange)
     .selectAll('option')
       .data(selectData)
       .enter()
     .append('option')
       .attr('value', function (d) { return d.text })
       .text(function (d) { return d.text ;});

  //draw the line
  var linePlot = g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#409900")
      .attr("d", lineScale); //knows how to plot the path because of line scale
  
  //draw the circle
  var dots = g.selectAll("circle")
          .data(data).enter()
          .append("circle")
          .attr("class", "data-circles")
          .attr("cx", function (d) { return yScale(d.budget)*Math.cos(xScale(d.release_date)-Math.PI/2); })
          .attr("cy", function (d) { return yScale(d.budget)*Math.sin(xScale(d.release_date)-Math.PI/2); })
          .attr("r", "2px")
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

  //draw axis
  var yAxis = g.append("g")
      .attr("text-anchor", "middle");
  
  //draw ticks
  var yTick = yAxis
      .selectAll("g") 
      .data(yScale.ticks(5))//how many circles do you want
      .enter().append("g").attr("class", "y-ticks-labels");

  //append the axis (these are the concentric circles)
  yTick.append("circle")
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("opacity", 1)
    .attr("r", yScale);

  yTick.append("text")
    .attr("y", function(d) { return -yScale(d); })
    .attr("fill", "blue")
    .attr("dy", "0.35em")
    .text(function(d) { return d; });
  
  //draw inner most circle      
  yAxis.append("circle")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("opacity", 1)
    .attr("r", function() { return yScale(yScale.domain()[0])});
        
  var xAxis = g.append("g");
    
  var xTick = xAxis
      .selectAll("g")
      .data(xScale.ticks(12))//12months
      .enter().append("g")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
              return "rotate(" + ((xScale(d)) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)";//have a distance from the inner radius
            });

  //makes the ticks go on the inside
  xTick.append("line")
    .attr("x2", -5)
    .attr("stroke", "#000");

  //add the month labels
  xTick.append("text")
    .attr("transform", function(d) { 
        var angle = xScale(d); 
        return ((angle < Math.PI / 2) || (angle > (Math.PI * 3 / 2))) ? "rotate(90)translate(0,22)" : "rotate(-90)translate(0, -15)"; })
    .text(function(d) {return formatYear(d);})
    .style("font-size", 10)
    .attr("opacity", 0.6)
        
  var title = g.append("g")
    .attr("class", "title")
    .append("text")
    .attr("dy", "-0.2em")
    .attr("text-anchor", "middle")
    .text("Movies")
        
  var subtitle = g.append("text")
    .attr("dy", "1em")
    .attr("text-anchor", "middle")
    .attr("opacity", 0.6)
    .text("From IMDB");  

  //function to update the y based on the selected value
  function yChange() {
    var value = this.value; // get the new y value
    console.log(value)

    lineScale
         .angle(function(d) { return xScale(d.release_date); })  // x: angle in radians; 0 at -y (12 o'clock)
         .radius(function(d) { return yScale(d[value]); });
    
    yScale.domain(d3.extent(data, d => d[value]));

    //update the line 
    linePlot.attr("d", lineScale); //knows how to plot the path because of line scale

    yTick.remove();

    yTick = yAxis
        .selectAll("g")
        .data(yScale.ticks(5))//how many circles do you want
        .enter().append("g");
    //append the axis (these are the concentric circles)
    yTick.append("circle")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("opacity", 0.2)
      .attr("r", yScale);
    yTick.append("text")
      .attr("y", function(d) { return -yScale(d); })
      .attr("fill", "blue")
      .attr("dy", "0.35em")
      .text(function(d) { return d; }); 

    //update the dots
    dots
      .attr("cx", function (d) { return yScale(d[value])*Math.cos(xScale(d.release_date)-Math.PI/2); })
      .attr("cy", function (d) { return yScale(d[value])*Math.sin(xScale(d.release_date)-Math.PI/2); })
      .attr("r", "2px");
    }


});

//zoom function to zoom and into the g element
function zoom() {
  g.attr("transform", d3.event.transform);
}


