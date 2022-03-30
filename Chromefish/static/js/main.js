// set the dimensions and margins of the graph
var plot_dim = {
        width: 2000, height: 1000,
        margin_top: 10, margin_right: 40,
        margin_bottom: 50, margin_left:200 
};

var width = plot_dim.width - plot_dim.margin_left - plot_dim.margin_right;
var height = plot_dim.height - plot_dim.margin_top - plot_dim.margin_bottom;

// Duration of plot transitions
var duration = 1000;

// Initialise objects
var cursor = {start_idx: 0, end_idx: 20};

var cursor_segment = [
                        {x: 0.0, y: 0.0},
                        {x:1,y:1}
];

var data = {chromatogram: [{x: 0.0, y: 0.0},{x:1,y:1}],
            peaks: []};

// Some helper functions
function get_y_ax(data){
    return data.map(d=>d.y)
}

function get_x_ax(data){
    return data.map(d=>d.x)
}

// Create scales to transform values to pixels
// These will be overwritten when data is loaded/zoomed etc.
var x_scaler = d3.scaleLinear()
    .domain(
            [
                Math.min(...get_x_ax(data.chromatogram)),
                Math.max(...get_x_ax(data.chromatogram))
            ]
    )
    .range([0, width]);

var y_scaler = d3.scaleLinear()
  .domain(
          [
              Math.min(...get_y_ax(data.chromatogram)),
              Math.max(...get_y_ax(data.chromatogram))
          ]
  )
  .range([height,0]);

// A line function to allow for line plots.
var lineFunc = d3.line()
                  .x(function(d) { return x_scaler(d.x)})
                  .y(function(d) { return y_scaler(d.y)})

// Generating function for area plots.
var areaGenerator = d3.area()
                      .x(function(d) { return x_scaler(d.x)})
                      .y0(y_scaler(0))
                      .y1(function(d) { return y_scaler(d.y)})

// Brush for zooming
var brush = d3.brush().on("end", brushended),
idleTimeout,
idleDelay = 350;

// Definition of idling
function idled() {
  idleTimeout = null;
}

// Trigger for zoom after brushing.
function brushended() {

    var s = d3.brushSelection(this);

    if (!s) {

        if (!idleTimeout)
          return idleTimeout = setTimeout(idled, idleDelay);
          x_scaler.domain(
              [
                  Math.min(...get_x_ax(data.chromatogram)),
                  Math.max(...get_x_ax(data.chromatogram))
              ]
          );

          y_scaler.domain(
              [
                  0,
                  Math.max(...get_y_ax(data.chromatogram))
              ]
          );

    }
    else {
        x_scaler.domain(
            [
                s[0][0],
                s[1][0]
            ].map(x_scaler.invert, x_scaler)
        );
        y_scaler.domain(
            [
                s[1][1],
                s[0][1]
            ].map(y_scaler.invert, y_scaler)
        );

        d3.select(".brush")
                    .call(brush.move, null);
    }

    zoom();

}

// Transformations that occur upon zooming
function zoom() {

    parent_element = d3.select("#mainplot");

    parent_element.select('#x_axis')
                    .transition()
                    .duration(duration)
                    .call(d3.axisBottom(x_scaler));

    parent_element.select('#y_axis')
                    .transition()
                    .duration(duration)
                    .call(d3.axisLeft(y_scaler));

    d3.select('#lineplot')
                .transition()
                .duration(duration)
                .attr('d', lineFunc(data.chromatogram))
                .attr('stroke', 'black')
                .attr('stroke-width', 4)
                .attr('fill', 'none');

    d3.select('#cursorplot')
                .transition()
                .duration(duration)
                .attr('d', lineFunc(cursor_segment))
                .attr('stroke', 'red')
                .attr('stroke-width', 8)
                .attr('fill', 'none');

    d3.selectAll(".peak_area")
        .each(
            function (d) {
                    d3.select(this)
                    .transition()
                    .duration(duration)
                      .attr("d", areaGenerator)
            }
        );
}

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

// Events
// Placeholder for chromatogram selection
$('#check').change(load_chromatogram());

// Keybindings
$("body").keypress(function(event){

    var chr = String.fromCharCode(event.which); 


    if (event.which === 13) {
        send_cursor();
    } else if (chr === "h") {
        if (cursor.start_idx > 0) {
            cursor.start_idx -= 10
        }
    } else if (chr === "l") {
        if (cursor.end_idx < data.chromatogram.length){
            cursor.end_idx += 10
        }
    } else if (chr === "j") {
        if (cursor.start_idx < cursor.end_idx) {
            cursor.start_idx += 10
        }
    } else if (chr === "k") {
        if (cursor.end_idx > cursor.start_idx) {
            cursor.end_idx -= 10
        }
    } else if (chr === "]") {
        if (cursor.end_idx < data.chromatogram.length) {
            cursor.start_idx += 10
            cursor.end_idx += 10
        }
    } else if (chr === "[") {
        if (cursor.start_idx > 0) {
            cursor.start_idx -= 10
            cursor.end_idx -= 10
        }
    } else if (chr === "[") {
        if (cursor.start_idx > 0) {
            cursor.start_idx -= 10
            cursor.end_idx -= 10
        }
    } else if (chr == "d") {
        delete_peak();
    } else if (chr == "p") {
        var current_pos = 0.5*(data.chromatogram[cursor.start_idx].x + data.chromatogram[cursor.end_idx].x);

        var min_dist = 1000.0
        next_lower = cursor.start_idx;
        next_upper = cursor.end_idx;
        for (let i = 0; i < data.peaks.length; i++) {
            delta_pk = data.peaks[i].retention_time - current_pos;
            if (delta_pk < min_dist && delta_pk > 0.0) {
                min_dist = delta_pk;
                next_lower = data.peaks[i].start;
                next_upper = data.peaks[i].end;
            }
        }

        cursor.start_idx = next_lower;
        cursor.end_idx = next_upper;

    } else if (chr == "P") {

        var current_pos = 0.5*(data.chromatogram[cursor.start_idx].x + data.chromatogram[cursor.end_idx].x);

        var min_dist = 1000.0
        next_lower = cursor.start_idx;
        next_upper = cursor.end_idx;
        for (let i = 0; i < data.peaks.length; i++) {
            delta_pk = current_pos - data.peaks[i].retention_time;
            if (delta_pk < min_dist && delta_pk > 0.0) {
                min_dist = delta_pk;
                next_lower = data.peaks[i].start;
                next_upper = data.peaks[i].end;
            }
        }

        cursor.start_idx = next_lower;
        cursor.end_idx = next_upper;

    }

    cursor_segment = data.chromatogram.slice(cursor.start_idx, cursor.end_idx);

    d3.select('#cursorplot')
                    .transition()
                    .duration(0)
                    .attr('d', lineFunc(cursor_segment))
                    .attr('stroke', 'red')
                    .attr('stroke-width', 8)
                    .attr('fill', 'none');
});


// Async functions
function send_cursor() {

  $.ajax({
          type: "POST",
          url: '/cursor_info',
          data: JSON.stringify({
                                "start": cursor.start_idx,
                                "end": cursor.end_idx,
                              }),
          contentType: "application/json; charset=utf-8",
         dataType: "json",
        success: function(d) {
                        update_plot(d);
                }
  });
}

function delete_peak() {
  $.ajax({
          type: "POST",
          url: '/delete_peak',
          data: JSON.stringify({
                                "start": cursor.start_idx,
                                "end": cursor.end_idx,
                              }),
          contentType: "application/json; charset=utf-8",
         dataType: "json",
        success: function(d) {
                                update_plot(d);
                }
  });
}

function load_chromatogram (){

  $.ajax({
          type: "POST",
          url: '/load_chrom',
          data: JSON.stringify({
                                "exp_code": "",
                              }),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (d) {
                                data = d;
                                plot_data(data);
                  }
  });
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

load_chromatogram();

