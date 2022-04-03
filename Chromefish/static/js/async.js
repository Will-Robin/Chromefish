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

function create_report(){

  $.ajax({
          type: "POST",
          url: '/create_report',
          data: JSON.stringify({
                                "create_report": "",
                              }),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (d) {
                    console.log("Peak report created!");
                  }
  });
}


