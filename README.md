# Chromefish

Go fishing for peaks in chromatograms. A proof-of-principle chromatogram processing application using [ChromProcess](https://github.com/Will-Robin/ChromProcess), D3 and JQuery.

## Why?

The idea behind all this is to show how modular analysis software can be built by scientists. The code in ChromProcess can be used all together in scripts, iPython notebooks, or its constituent parts can be assembled into something else, like a handy peak picking GUI.

There's also the idea of using a keyboard to interact with the data, rather than clicking and dragging with a mouse.

Or this could become the gamification of chromatography processing... chromatograms are kind of like one dimensional ripples in water, maybe you could catch a fish every time you find a peak. Keep finding peaks, and you win a data set!

## Features

- Displays a chromatogram,
- Has a movable cursor,
- Picks peaks,
- Deletes peaks,
- That's all you get for now...

## Grab a fishing rod and head to the water...

Most conveniently, you'll need some way of setting up a Python virtual environment, and `npm` installed on your system. Not the only way to get this to work, but the most convenient.

Set up [ChromProcess](https://github.com/Will-Robin/ChromProcess) in a virtual environment, and install Flask (`pip install flask`). Navigate to `Chromefish/static/js` and run `npm install`. If you don't want to use `npm`, app needs `jquery.min.js` and `d3.min.js` to be placed in the paths `Chromefish/static/js/node_modules/d3/dist` and `Chromefish/static/js/node_modules/d3/dist`, respectively.

Navigate to the folder containing `app.py` and run `python app.py` to start the Flask server which will provide you with an IP address to paste into your browser. Instructions are overlayed on the page.

Sometimes the server crashes if peak picking goes wrong. It just needs to be restarted.

To be honest, I have never even been fishing.
