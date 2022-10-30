

gir visualization 

A simple JavaScript app with Cesium, the open-source WebGL virtual globe and map engine
Cesium version: 1.9.5

License: Apache 2.0. Free for commercial and non-commercial use. See LICENSE.md.

based on custom geocoding code example from Cesium Sandcastle.

Local server
A local HTTP server is required to run the app:
from the root directory run:
python3 -m SimpleHTTPServer -m http.server 8000

Browse to http://localhost:8000/

What's here?
index.html - A simple HTML page based on Cesium's Hello World example. Run a local web server, and browse to index.html to run your app, which will show a 3D globe.

Source - Contains app.js which is referenced from index.html. This is where geocoding app's code goes.

s2 geometry Region Coverer demo:
https://s2.sidewalklabs.com/regioncoverer/