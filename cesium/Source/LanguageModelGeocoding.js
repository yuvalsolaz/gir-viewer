/**
 * This class provides geocoding through the Language model geocoding service.
 * @alias LanguageModelGeocoder
 * @constructor
 */
function LanguageModelGeocoder() {}

/**
 * The function called to geocode using this geocoder service.
 *
 * @param {String} input The query to be sent to the geocoder service
 * @returns {Promise<GeocoderService.Result[]>}
 */

 function centroid(polygon) {
    let xc = 0;
    let yc = 0;
    vertices = 0;
    for (_i=0 ; _i < polygon.length ; _i+=2, vertices+=1) {
        xc += polygon[_i];
        yc += polygon[_i+1];        
    };

    return {x: xc / vertices, 
            y: yc / vertices};
 };

 function boundingbox(polygon) {
  let min_x = 90;
  let min_y = 180;
  let max_x = -90;
  let max_y = -180;
  vertices = 0;
  for (_i=0 ; _i < polygon.length ; _i+=2, vertices+=1) {
      min_x = Math.min(polygon[_i], min_x);
      min_y = Math.min(polygon[_i+1], min_y);
      max_x = Math.max(polygon[_i],max_x)
      max_y = Math.max(polygon[_i+1],max_y)
  };

  return Array(min_y, max_y,min_x, max_x);
};

 LanguageModelGeocoder.prototype.geocode = function (input) {  
  const endpoint = "http://10.53.124.25:5008/geocoding";  // "/visual aid geocoding"
  // const endpoint = "http://l-p-yuvalso-ww-lnx:5000/geocoding";  // "/visual aid geocoding"
  const confidence_threshold = 0.2; 
  
  const resource = new Cesium.Resource({
    url: endpoint,
    queryParameters: {
      format: "json",
      text: input,
      k: 5
    },
  });

  LanguageModelGeocoder.prototype.geocode.autoComplete = false; 
  return resource.fetchJson().then(function (results) {
    let bboxDegrees;
    return results.map(function (resultObject) {
      
      viewer.entities.removeAll();
      label_text = resultObject.display_name.slice(0,64)
      for (i = 0; i < resultObject.levels_polygons.length; i++) {
        _confidence = (resultObject.confidence[i]).toFixed(3);        
        if (_confidence >= confidence_threshold) {            
            _text = `${i+1} (${_confidence})`; // `${label_text} ${i} (${_confidence}%)`;
            _coordinates = Cesium.Cartesian3.fromDegreesArray(resultObject.levels_polygons[i]);
              _polygon = {
                  hierarchy:_coordinates, 
                  // extrudedHeight: Math.exp(_confidence[i]*10) * 200.0, // meters
                  fill:false, 
                  outline:true, 
                  outlineColor:Cesium.Color.BLUE, 
                  outlineWidth:4};
            viewer.entities.add({polygon:_polygon});
            _centroid = centroid(resultObject.levels_polygons[i]);
            _position = Cesium.Cartesian3.fromDegrees(_centroid.x, _centroid.y);
            viewer.entities.add({position:_position,        
                                label:{text:_text, 
                                   font:"16px Helvetica", 
                                   fillColor: Cesium.Color.WHITE, 
                                   outlineColor: Cesium.Color.BLACK, 
                                   outlineWidth: 2,
                                   style: Cesium.LabelStyle.FILL_AND_OUTLINE,}
                               });
                               bboxDegrees = boundingbox(resultObject.levels_polygons[i]) 
              label_text = ''
              // break;
        }
  
      };
      // return bounding box of top confidance
      bboxDegrees = boundingbox(resultObject.levels_polygons[0]) 
      buffer = 0.2 * Math.abs(bboxDegrees[2]-bboxDegrees[3]);
      buffer_coordinates = Cesium.Rectangle.fromDegrees(
        bboxDegrees[2]-buffer, 
        bboxDegrees[0]-buffer, 
        bboxDegrees[3]+buffer, 
        bboxDegrees[1]+buffer
      );

      return {
        displayName: resultObject.display_name,
        destination: buffer_coordinates
      };
    });
  });
};

const viewer = new Cesium.Viewer("cesiumContainer", 
  {geocoder: new LanguageModelGeocoder()});


  