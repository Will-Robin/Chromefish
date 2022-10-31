import sys
from flask import Flask, render_template, request, jsonify

from ChromProcess import Classes
from ChromProcess.Loading import chrom_from_csv
from ChromProcess.Writers import chromatogram_to_json
from ChromProcess.Processing import find_peaks_in_region
from ChromProcess.Processing import add_peaks_to_chromatogram


app = Flask(__name__)

def prepare_chromatogram(chrom):
    """ """

    # Rearrange data for the front end.
    chromatogram_points = []
    for x in range(0, len(chrom.time)):
        chromatogram_points.append({"x": chrom.time[x], "y": chrom.signal[x]})

    peaks = []
    for pk in chrom.peaks:
        peak = chrom.peaks[pk]

        start = peak.indices[0]
        end = peak.indices[-1]
        retention_time = peak.retention_time

        peaks.append(
            {
                "start": int(start),
                "end": int(end),
                "retention_time": float(retention_time),
            }
        )

    data = {"chromatogram": chromatogram_points, "peaks": peaks}

    return data


@app.route("/")
def index():
    """
    Initialise the page.
    """

    return render_template("index.html")


@app.route("/load_chrom", methods=["POST"])
def loadchroms():
    """ """

    req = request.get_json()

    # Todo: load from file
    exp_name = ""
    align = ""

    data = prepare_chromatogram(chrom)

    return jsonify(data)


@app.route("/cursor_info", methods=["POST"])
def receive_cursor():
    """ """

    req = request.get_json()

    start_ind = req["start"]
    end_ind = req["end"]

    peaks = find_peaks_in_region(
        chrom, chrom.time[start_ind], chrom.time[end_ind], threshold=0.1
    )

    # remove peaks with empty indices
    new_peaks = [p for p in peaks if len(p.indices) > 0]

    add_peaks_to_chromatogram(new_peaks, chrom)

    data = prepare_chromatogram(chrom)

    return jsonify(data)


@app.route("/delete_peak", methods=["POST"])
def delete_peak():
    """ """

    req = request.get_json()

    start_ind = req["start"]
    end_ind = req["end"]

    region = chrom.time[[start_ind, end_ind]]

    del_list = []
    for pk in chrom.peaks:
        if region[0] <= pk <= region[-1]:
            del_list.append(pk)

    for d in del_list:
        del chrom.peaks[d]

    data = prepare_chromatogram(chrom)

    return jsonify(data)

@app.route("/create_report", methods=["POST"])
def create_report():
    """ """
    out_dir = "data"

    for pk in chrom.peaks:
        chrom.peaks[pk].get_height(chrom)
        chrom.peaks[pk].get_integral(chrom, baseline_subtract = True)

    chrom.write_peak_collection(filename = f"{out_dir}/peakCollection.csv")

    return jsonify({})


if __name__ == "__main__":

    chromatogram_filename = "data/example.csv"

    if len(sys.argv) > 1:
        chromatogram_filename = sys.argv[1]

    chrom = chrom_from_csv(chromatogram_filename)

    app.run(debug=True)
