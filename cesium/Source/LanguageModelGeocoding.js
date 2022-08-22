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
      bboxDegrees = resultObject.boundingbox;
      coordinates = Cesium.Rectangle.fromDegrees(bboxDegrees[2], bboxDegrees[0], bboxDegrees[3], bboxDegrees[1]);
      rectangle = {coordinates:coordinates, fill:false, outline:true, outlineColor:Cesium.Color.Blue, outlineWidth:4};
      parent_bbox = resultObject.parent_bbox;
      parent_coordinates = Cesium.Rectangle.fromDegrees(parent_bbox[2], parent_bbox[0], parent_bbox[3], parent_bbox[1]);
      parent_rectangle = {coordinates:parent_coordinates, fill:false, outline:true, outlineColor:Cesium.Color.White, outlineWidth:3};

      viewer.entities.removeAll();
      viewer.entities.add({rectangle:rectangle});
      viewer.entities.add({rectangle:parent_rectangle});

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


  