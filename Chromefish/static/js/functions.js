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


