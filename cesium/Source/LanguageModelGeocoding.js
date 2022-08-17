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
  const endpoint = "http://192.168.68.147:5000/geocoding"
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
      viewer.entities.removeAll();
      viewer.entities.add({rectangle:rectangle});
      return {
        displayName: resultObject.display_name,
        destination: coordinates
      };
    });
  });
};

const viewer = new Cesium.Viewer("cesiumContainer", 
  {geocoder: new LanguageModelGeocoder()});


  