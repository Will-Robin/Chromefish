// Events
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

