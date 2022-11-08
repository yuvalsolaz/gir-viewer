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
      text = `${resultObject.display_name.slice(0,64)} (${confidance}%)`;
      position = Cesium.Cartesian3.fromDegrees((bboxDegrees[2]+bboxDegrees[3])/2.0, (bboxDegrees[0]+bboxDegrees[1])/2.0);
      viewer.entities.add({position:position,        
                          label:{text:text, 
                                 font:"24px Helvetica", 
                                 fillColor: Cesium.Color.SKYBLUE, 
                                 outlineColor: Cesium.Color.BLACK, 
                                 outlineWidth: 2,
                                 style: Cesium.LabelStyle.FILL_AND_OUTLINE,}
      });    


      coordinates = Cesium.Cartesian3.fromDegreesArray(resultObject.levels_polygons[0]);
      polygon = {hierarchy:coordinates, fill:false, outline:true, outlineColor:Cesium.Color.BLUE, outlineWidth:3};
      viewer.entities.add({polygon: polygon});      // viewer.entities.add({rectangle:rectangle});

      for (i = 1; i < resultObject.levels_polygons.length; i++) {
        _coordinates = Cesium.Cartesian3.fromDegreesArray(resultObject.levels_polygons[i]);
        _polygon = {hierarchy:_coordinates, fill:false, outline:true, outlineColor:Cesium.Color.BLACK, outlineWidth:2};
        viewer.entities.add({polygon:_polygon});
      }

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


  