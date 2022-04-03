// Plotting functions
function plot_data(data) {

    // Redefine scales
    x_scaler = d3.scaleLinear()
        .domain(
                [
                    Math.min(...get_x_ax(data.chromatogram)),
                    Math.max(...get_x_ax(data.chromatogram))
                ]
        )
        .range([0, width]);

    y_scaler = d3.scaleLinear()
      .domain(
              [
                  Math.min(...get_y_ax(data.chromatogram)),
                  Math.max(...get_y_ax(data.chromatogram))
              ]
      )
      .range([height,0]);

    // append the svg object to the body of the page
    var svg = d3.select("#chart")
                .append("svg")
                    .attr("id", "mainplot")
                    .attr("width", width)
                    .attr("height", height*2)
                .append("g")
                    .attr("transform", "translate(" + plot_dim.margin_left + "," + plot_dim.margin_top + ")");

    axis_setup(data.chromatogram, svg);

    line_plot_zoom(data, svg)

}

function axis_setup(data, parent_element) {

  var y_axis = parent_element
                    .append("g")
                    .style("font", "30px times")
                    .attr('id','x_axis')
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x_scaler));

  var x_axis = parent_element
                    .append('g')
                    .style("font", "30px times")
                    .attr('id','y_axis')
                    .call(d3.axisLeft(y_scaler));
  // X axis label
  parent_element.append("text")
                  .style("font", "30px times")
                  .attr("class", "x label")
                  .attr("text-anchor", "middle")
                  .attr("x", width/2)
                  .attr("y", height + 0.075*height)
                  .text("time");

  // Y axis label
  parent_element.append("text")
                  .style("font", "30px times")
                  .attr("class", "y label")
                  .attr("text-anchor", "middle")
                  .attr('transform', 'rotate(-90)')
                  .attr("y", 0 - plot_dim.margin_left)
                  .attr("x", 0 - (height/2))
                  .attr("dy", "1em")
                  .text("signal");

}

function line_plot_zoom(data, parent_element) {

    // Create a line segment for the cursor
    cursor_segment = data.chromatogram.slice(cursor.start_idx, cursor.end_idx);

    var clip = parent_element.append("defs")
                                .append("svg:clipPath")
                                    .attr("id", "clip")
                                    .append("svg:rect")
                                    .attr("width", width )
                                    .attr("height", height )
                                    .attr("x", 0)
                                    .attr("y", 0);

    parent_element.append("g")
                  .attr("class", "brush")
                  .call(brush);

    var line = parent_element
                    .append('g')
                      .attr("clip-path", "url(#clip)")

    line.append('g')
        .append('path')
          .attr("id",'lineplot')
          .attr('d', lineFunc(data.chromatogram))
          .attr('stroke', 'black')
          .attr('stroke-width', 4)
          .attr('fill', 'none');

    line.append('g')
        .append('path')
          .attr("id",'cursorplot')
          .attr('d', lineFunc(cursor_segment))
          .attr('stroke', 'red')
          .attr('stroke-width', 8)
          .attr('fill', 'none');

    area = line.append("g")
            .attr("id", "area_plots");

    for (let i = 0; i < data.peaks.length; i++) {

        peak_seg = data.chromatogram.slice(data.peaks[i].start, data.peaks[i].end);

        // Add the area
        area.append("path")
          .attr("class",'peak_area')
          .datum(peak_seg)
              .attr("fill", "#69b3a2")
              .attr("fill-opacity", .3)
              .attr("stroke", "black")
              .attr("stroke-width", 1)
              .attr("d", areaGenerator)
            .append("g")
                .attr("class", "brush")
                .call(brush);
    }
}

function update_plot(data) {

    d3.select("#lineplot")
        .attr('d', lineFunc(data.chromatogram));

    // Remove old peaks
    d3.selectAll(".peak_area").remove();

    // Add in current peaks
    area = d3.select("#area_plots");

    for (let i = 0; i < data.peaks.length; i++) {

        peak_seg = data.chromatogram.slice(data.peaks[i].start, data.peaks[i].end);

        // Add the area
        area.append("path")
          .attr("class",'peak_area')
          .datum(peak_seg)
              .attr("fill", "#69b3a2")
              .attr("fill-opacity", .3)
              .attr("stroke", "black")
              .attr("stroke-width", 1)
              .attr("d", areaGenerator)
            .append("g")
                .attr("class", "brush")
                .call(brush);
    }
}

