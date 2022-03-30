function bar_plot(data, parent_element, x_scaler, y_scaler){
  // Making a bar plot
  var bar_width = 10
  parent_element.selectAll('bar')
                  .attr('id','bar_plot')
                  .data(data)
                  .enter()
                  .append('rect')
                  .attr("width", bar_width) // center cx coord
                  .attr('x', function(d){ return x_scaler(d.x)-(bar_width/2) })
                  .attr('y', function(d){ return y_scaler(d.y) })
                  .attr("height", function(d){ return height - y(d.y) }) // center y coord
                  .attr("fill", function(d){return myColor(y(d.y)) }); // radius
}

function scatter_plot(data, parent_element, x_scaler, y_scaler){
  // Making a scatter plot

  parent_element.selectAll('scatter')
                  .data(data)
                  .attr('id','scatter_plot')
                  .enter()
                  .append('circle')
                  .attr("cx", function(d){ return x_scaler(d.x) }) // center cx coord
                  .attr("cy", function(d){ return y_scaler(d.y) }) // center y coord
                  .attr("r", 2) // radius
                  .attr("fill", function(d){ return d.colour});
}

function line_plot(data, parent_element,
                   x_scaler, y_scaler,
                   plot_dimensions){

   width = plot_dimensions.width - plot_dimensions.margin_left - plot_dimensions.margin_right;
   height = plot_dimensions.height - plot_dimensions.margin_top - plot_dimensions.margin_bottom;

  var lineFunc = d3.line()
      .x(function(d) { return x_scaler(d.x) })
      .y(function(d) { return y_scaler(d.y) })

  // Add the path using this helper function
  parent_element
    .append('g')
    .append('path')
      .attr("id",'lineplot')
      .attr('d', lineFunc(data))
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('fill', 'none');

}

function line_plot_zoom(data, parent_element,
                   x_scaler, y_scaler,
                   plot_dimensions){

  var width = plot_dimensions.width - plot_dimensions.margin_left - plot_dimensions.margin_right;
  var height = plot_dimensions.height - plot_dimensions.margin_top - plot_dimensions.margin_bottom;

  var lineFunc = d3.line()
      .x(function(d) { return x_scaler(d.x) })
      .y(function(d) { return y_scaler(d.y) })

  var clip = parent_element.append("defs")
                .append("svg:clipPath")
                    .attr("id", "clip")
                    .append("svg:rect")
                    .attr("width", width )
                    .attr("height", height )
                    .attr("x", 0)
                    .attr("y", 0);

  var line = parent_element.append('g')
      .attr("clip-path", "url(#clip)")

  // Add the path using this helper function
  line
    .append('g')
    .append('path')
      .attr("id",'lineplot')
      .attr('d', lineFunc(data))
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('fill', 'none');

  //add zoom
  var brush = d3.brush().on("end", brushended),
    idleTimeout,
    idleDelay = 350;

  parent_element.append("g")
                  .attr("class", "brush")
                  .call(brush);

  function brushended() {
  var s = d3.brushSelection(this);

  if (!s) {

    if (!idleTimeout)
      return idleTimeout = setTimeout(idled, idleDelay);
      x_scaler.domain([Math.min(...get_x_ax(data)),Math.max(...get_x_ax(data))]);
      y_scaler.domain([0,Math.max(...get_y_ax(data))]);

  }
  else {
    x_scaler.domain([s[0][0], s[1][0]].map(x_scaler.invert, x_scaler));
    y_scaler.domain([s[1][1], s[0][1]].map(y_scaler.invert, y_scaler));
    parent_element.select(".brush").call(brush.move, null);
  }
  zoom();
}
  function idled() {
  idleTimeout = null;
}

function zoom() {

  parent_element.select('#x_axis')
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x_scaler))

  parent_element.select('#y_axis')
          .transition()
          .duration(1000)
          .call(d3.axisLeft(y_scaler))

  parent_element.select('#lineplot')
    .transition()
    .duration(1000)
    .attr('d', lineFunc(data))
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('fill', 'none');

}

}
