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
