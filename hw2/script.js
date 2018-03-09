const margin = { top: 30, right: 300, bottom: 60, left: 60 }; 
const outerHeight = 500; 
const innerHeight =  outerHeight - margin.top - margin.bottom; 
const outerWidth = 960; 
const innerWidth = outerWidth - margin.left - margin.right; 
const xValue = d => d.horsepower_bhp; 
const yValue = d => d.horsepower_bhp; 
const sizeValue = d => d.engine_size_cat; 
const colorValue = d => d.decade;

const row = d => {
        d.horsepower_bhp = +d.horsepower_bhp;
        d.rpm_horsepower_measure_point = +d.rpm_horsepower_measure_point;
        d.torque_lb_ft = +d.torque_lb_ft; 
        d.rpm_torque_measure_point = +d.rpm_torque_measure_point
        d.car_0_60_time_seconds = +d.car_0_60_time_seconds; 
        d.engine_size_cc = +d.engine_size_cc; 
        d.engine_size_ci = +d.engine_size_ci;
        d.top_speed_mph = +d.top_speed_mph;
        d.top_speed_kph = +d.top_speed_kph;
        d.horsepower_per_ton_bhp = +d.horsepower_per_ton_bhp;
        d.year = +d.year;
        d.car_weight_tons = +d.car_weight_tons;
        d.torque_per_ton = +d.torque_per_ton;
        return d;
      };

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv('supercars_org.csv', row, data => { 
  var selectData = [{"text": "horsepower_bhp"},{"text": "rpm_horsepower_measure_point"},
                        {"text": "torque_lb_ft"}, {"text": "rpm_torque_measure_point"},
                        {"text": "car_0_60_time_seconds"}, 
                        {"text": "engine_size_cc"}, {"text": "engine_size_ci"},
                        {"text": "top_speed_mph"}, {"text": "top_speed_kph"},
                        {"text": "horsepower_per_ton_bhp"}, {"text": "year"},
                        {"text": "car_weight_tons"}, {"text": "torque_per_ton"},
                    ]; 
  //body object as defined in d3
  var body = d3.select('body');

  // Select X-axis Variable
  //add span to body tags
  var span = body.append('span')
    .text('Select X-Axis variable: '); 
  var xInput = body.append('select')//select is the drop down menu
      .attr('id','xSelect')
      .on('change',xChange) //appending a function (everytime option changes, execute function)
    .selectAll('option')
      .data(selectData)
      .enter()
    .append('option') //add an option for each element in selectData and text for each element in selectData
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;}); 
  body.append('br'); 

  // Select Y-axis Variable
  var span = body.append('span')
      .text('Select Y-Axis variable: ');
  var yInput = body.append('select')
      .attr('id','ySelect')
      .on('change',yChange)
    .selectAll('option')
      .data(selectData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;});

  // Creating a new SVG
  var svg = body.append('svg')
      .attr('height', outerHeight)
      .attr('width', outerWidth)
    .append('g') //apend g inside SVG
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')');

  // Scales
  var xScale = d3.scaleLinear()
    .domain(d3.extent(data, xValue))
    .range([0,innerWidth]);
  var yScale = d3.scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([innerHeight,0]);
  var sizeScale = d3.scaleLinear() 
    .domain(d3.extent(data, sizeValue))
    .range([3,9]);
  var colorScale = d3.scaleOrdinal()
    .domain(['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s'])
    .range(['aqua', 'lime', 'green', 'purple', 'fuchsia', 'red', 'maroon' ]);

  // X-axis
  var xAxis = d3.axisBottom()
    .scale(xScale);
  // Y-axis
  var yAxis = d3.axisLeft()
    .scale(yScale);
    //.ticks(5)

  // color legend
  var colorLegend = d3.legendColor() 
    .scale(colorScale)
    .shape('circle')
    .on("cellclick", function(type) {
      // dim all the icons in legend
      d3.selectAll(".cell") //select all the cell class HTML onjects
        .style("opacity", 0.1); 
      // undim the selected one 
      d3.select(this) //'this' in this case is the object you are clicking
        .style("opacity", 1); 
      // dim all the data circles 
      d3.selectAll(".data-circle")
        .style("opacity", 0) 
        // filter out the selected ones 
        .filter(function(d) {
          return d["decade"] == type; 
        })
        .style("opacity", 1) 
    })
    ;

  // Size legend
  var sizeLegend = d3.legendSize() 
    .scale(sizeScale)
    //.cells(4)
    .shape('circle')
    .cells([0,1,2,3,4,5,6,7,8])
    .shapePadding(4)
    .on("cellclick", function(type) {
      // dim all the icons in legend
      d3.selectAll(".cell") 
        .style("opacity", 0.1); 
      // undim the selected one 
      d3.select(this) 
        .style("opacity", 1); 
      // dim all the data circles 
      d3.selectAll(".data-circle")
        .style("opacity", 0) 
        // filter out the selected ones 
        .filter(function(d) {
          return d["engine_size_cat"] == type; 
        })
        .style("opacity", 1) 
    })
    ;

  // X-axis
  svg.append('g')
      .attr('class','axis')
      .attr('id','xAxis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
    .append('text') // X-axis Label
      .attr('id','xAxisLabel')
      .attr('class', 'axis-label')
      .attr('y',30)
      .attr('x',innerWidth/2)
      .text('Horsepower');
  // Y-axis
  svg.append('g')
      .attr('class','axis')
      .attr('id','yAxis')
      .call(yAxis) //in this situation call means to draw
    .append('text') // y-axis Label
      .attr('id', 'yAxisLabel')
      .attr('class', 'axis-label')
      .attr('transform','rotate(-90)')
      .attr('x',-innerHeight/2)
      .attr('y',-45)
      .style('text-anchor','middle')
      .text('Horsepower');

  // draw the Color legend 
  svg.append('g')
      .attr('class', 'legend')
      .attr('id', 'colorLegend')
      .attr('transform', `translate(${innerWidth+70})`)
      .call(colorLegend) 
    .append('text') 
      .attr('class', 'axis-label')
      .attr('y', -20)
      .text('Decade of Manufacture');

  // draw the Size legend 
  svg.append('g')
      .attr('class', 'legend')
      .attr('id', 'sizeLegend')
      .attr('transform', `translate(${innerWidth+70}, 200)`)
      .call(sizeLegend) 
    .append('text') 
      .attr('class', 'axis-label')
      .attr('y', -20)
      .text('Engine CC 1000s (rounded down)');

  // Circles
  var circles = svg.selectAll('circle')
      .data(data) //depnding ond the amount of the data...
      .enter()
    .append('circle') //... we append the number of circles
      .attr('class', 'data-circle')
      .attr('cx', d => xScale(xValue(d)))
      .attr('cy', d => yScale(yValue(d))) 
      .attr('r', d => sizeScale(sizeValue(d)))
      .attr('fill', d => colorScale(colorValue(d))) 
      .attr('fill-opacity', 0.5)
      .on("mouseover", function(d) {
        div.transition()
          .duration(200)
          .style("opacity", 0.9)
          .style('width', 200 + 'px')
          .style('height', 50 + 'px')
          .style('background-color', 'white');

        div.html((d.car_full_nm) + "<br/>" + d.year)
          .style("left", (d3.event.pageX+28) + "px")
          .style("top", (d3.event.pageY -28) + "px");
        })

      .on("mouseout", function(d) {
        div.transition()
        .duration(500)
        .style("opacity", 0);
      })
        ;

  function xChange() {
    var value = this.value; // get the new x value
    xScale // change the xScale
      .domain([
        d3.min([0,d3.min(data,function (d) { return d[value] })]),
        d3.max([0,d3.max(data,function (d) { return d[value] })])
        ]);
    xAxis.scale(xScale); // change the xScale
    d3.select('#xAxis') // redraw the xAxis
      .call(xAxis);
    d3.select('#xAxisLabel') // change the xAxisLabel
      .text(value);
    d3.selectAll('.data-circle') // update the circles
      .attr('cx',function (d) { return xScale(d[value]) });
  }

  function yChange() {
    var value = this.value; // get the new y value
    yScale // change the yScale
      .domain([
        d3.min([0,d3.min(data,function (d) { return d[value] })]),
        d3.max([0,d3.max(data,function (d) { return d[value] })])
        ]);
    yAxis.scale(yScale); // change the yScale
    d3.select('#yAxis') // redraw the yAxis
      .call(yAxis);
    d3.select('#yAxisLabel') // change the yAxisLabel
      .text(value);    
    d3.selectAll('.data-circle') // update the circles
      .attr('cy',function (d) { return yScale(d[value]) });
  }

});

//function to reset all the colorizations
function reset() {
  d3.select("#colorLegend").selectAll(".cell") //select all the cell class HTML onjects
    .style("opacity", 1);
  d3.select("#sizeLegend").selectAll(".cell") //select all the cell class HTML onjects
    .style("opacity", 1);
  d3.selectAll('.data-circle')
    .style("opacity", 1);
}