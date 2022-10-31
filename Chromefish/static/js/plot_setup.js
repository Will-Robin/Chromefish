function plot_setup(plot_dimensions,element_selection){

  width = plot_dimensions.width - plot_dimensions.margin_left - plot_dimensions.margin_right;
  height = plot_dimensions.height - plot_dimensions.margin_top - plot_dimensions.margin_bottom;

  // append the svg object to the body of the page
  var svg = d3.select(element_selection)
      .append("svg")
      .attr("width", width + plot_dimensions.margin_left + plot_dimensions.margin_right)
      .attr("height", height + plot_dimensions.margin_top + plot_dimensions.margin_bottom)
    // translate to leave a margin.
    .append("g")
      .attr("transform", "translate(" + plot_dimensions.margin_left + "," + plot_dimensions.margin_top + ")");

  return svg;
}

function axis_setup(data, parent_element, x_scaler, y_scaler,
                  plot_dimensions){

  var height = plot_dimensions.height - plot_dimensions.margin_top - plot_dimensions.margin_bottom;

  // Show the axis that corresponds to this scale
  var y_axis = parent_element
                    .append("g")
                    .attr('id','x_axis')
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x_scaler));

  var x_axis = parent_element
                    .append('g')
                  .style("font-size", "100em times")
                    .attr('id','y_axis')
                    .call(d3.axisLeft(y_scaler));
}

function axis_labels(x_label, y_label,
                    parent_element, plot_dimensions){

  width = plot_dimensions.width - plot_dimensions.margin_left - plot_dimensions.margin_right;
  height = plot_dimensions.height - plot_dimensions.margin_top - plot_dimensions.margin_bottom;

  // X axis label
  parent_element.append("text")
                  .attr("class", "x label")
                  .attr("text-anchor", "middle")
                  .attr("x", width/2)
                  .attr("y", height + 0.15*height)
                  .text(x_label)
                  .style("font-size", "100em times");

  // Y axis label
  parent_element.append("text")
                  .attr("class", "y label")
                  .attr("text-anchor", "middle")
                  .attr('transform', 'rotate(-90)')
                  .attr("y", 0-plot_dimensions.margin_left)
                  .attr("x", 0-(height/2))
                  .attr("dy", "1em")
                  .text(y_label);

}

