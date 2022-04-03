// Some helper functions
function get_y_ax(data){
    return data.map(d=>d.y)
}

function get_x_ax(data){
    return data.map(d=>d.x)
}

// Create scales to transform values to pixels
// These will be overwritten when data is loaded/zoomed etc.
let x_scaler = d3.scaleLinear()
    .domain(
            [
                Math.min(...get_x_ax(data.chromatogram)),
                Math.max(...get_x_ax(data.chromatogram))
            ]
    )
    .range([0, width]);

let y_scaler = d3.scaleLinear()
  .domain(
          [
              Math.min(...get_y_ax(data.chromatogram)),
              Math.max(...get_y_ax(data.chromatogram))
          ]
  )
  .range([height,0]);


module.exports = {
    x_scaler,
    y_scaler
}
