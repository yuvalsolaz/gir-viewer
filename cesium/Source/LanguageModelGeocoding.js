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

LanguageModelGeocoder.prototype.geocode = function (input) {
  const endpoint = "http://0.0.0.0:5000/geocoding"
  const resource = new Cesium.Resource({
    url: endpoint,
    queryParameters: {
      format: "json",
      text: input,
    },
  });

  LanguageModelGeocoder.prototype.geocode.autoComplete = false
  
  return resource.fetchJson().then(function (results) {
    let bboxDegrees;
    return results.map(function (resultObject) {
      
      viewer.entities.removeAll();
       
      confidance = Math.round(resultObject.confidance*100);
      bboxDegrees = resultObject.boundingbox;
      text = `${resultObject.display_name} (${confidance}%)`;
      position = Cesium.Cartesian3.fromDegrees((bboxDegrees[2]+bboxDegrees[3])/2.0, (bboxDegrees[0]+bboxDegrees[1])/2.0);
      viewer.entities.add({position:position,        
                          label:{text:text, 
                                 font:"24px Helvetica", 
                                 fillColor: Cesium.Color.SKYBLUE, 
                                 outlineColor: Cesium.Color.BLACK, 
                                 outlineWidth: 2,
                                 style: Cesium.LabelStyle.FILL_AND_OUTLINE,}
      });    

      coordinates = Cesium.Rectangle.fromDegrees(bboxDegrees[2], bboxDegrees[0], bboxDegrees[3], bboxDegrees[1]);
      rectangle = {coordinates:coordinates, fill:false, outline:true, outlineColor:Cesium.Color.BLUE, outlineWidth:3};
      viewer.entities.add({rectangle:rectangle});
      for (i = 1; i < resultObject.levels_bbox.length; i++) {
        _bbox = resultObject.levels_bbox[i];
        _coordinates = Cesium.Rectangle.fromDegrees(_bbox[2], _bbox[0], _bbox[3], _bbox[1]);
        _rectangle = {coordinates:_coordinates, fill:false, outline:true, outlineColor:Cesium.Color.WHITE, outlineWidth:2};
        viewer.entities.add({rectangle:_rectangle});
      }

      buffer = 0.2 * coordinates.width * (180.0 / 3.14) 
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


  