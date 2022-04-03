# Chromefish

Go fishing for peaks in chromatograms. A proof-of-principle chromatogram processing application using [ChromProcess](https://github.com/Will-Robin/ChromProcess), D3 and JQuery.

## Why?

The idea behind all this is to show how modular analysis software can be built by scientists. The code in ChromProcess can be used all together in scripts, iPython notebooks, or its constituent parts can be assembled into something else, like a handy peak picking GUI. There's also the idea of using a keyboard to interact with the data, rather than clicking and dragging with a mouse.

Whilst you could use this to process your data, I would not currently recommend it - the features are limited and this is very much a sketch of an idea.

## Features

- Displays a chromatogram,
- Has a movable cursor,
- Picks peaks,
- Deletes peaks,
- Exports files containing peak features,
- That's all you get for now...

## Grab a fishing rod and head to the water...

Most conveniently, you'll need some way of setting up a Python virtual environment, and `npm` installed on your system. It's not the only way to get this to work, but the most convenient.

Set up [ChromProcess](https://github.com/Will-Robin/ChromProcess) in a virtual environment, and install Flask (`pip install flask`). Navigate to `Chromefish/static/js` and run `npm install`. If you don't want to use `npm`, the app needs `jquery.min.js` and `d3.min.js` to be placed in the paths `Chromefish/static/js/node_modules/d3/dist` and `Chromefish/static/js/node_modules/d3/dist`, respectively.

Navigate to the folder containing `app.py` and run `python app.py` to start the Flask server which will provide you with an IP address to paste into your browser. Run like this, an example chromatogram will be loaded. A specific chromatogram `.csv` file can be loaded by running `python app.py <path-to-file>`. To ensure loading goes to plan, make sure that the file given is formatted in the same way as the example file in `data/example.csv`. Instructions for use are overlayed on the page.

Sometimes the server crashes if peak picking goes wrong. It just needs to be restarted, but you will lose your peaks.

To be honest, I have never even been fishing.
