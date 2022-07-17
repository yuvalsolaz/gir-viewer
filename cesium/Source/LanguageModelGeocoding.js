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
  //const endpoint = "https://nominatim.openstreetmap.org/search";        // TODO: replace with LM geocoding url when ready 
  const endpoint = "http://l-p-yuvalso-ub-ww-n:5000/geocoding/haifa"
  const resource = new Cesium.Resource({
    url: endpoint,
    queryParameters: {
      format: "json",
      q: input,
    },
  });

  return resource.fetchJson().then(function (results) {
    let bboxDegrees;
    return results.map(function (resultObject) {
      bboxDegrees = resultObject.boundingbox;
      return {
        displayName: resultObject.display_name,
        destination: Cesium.Rectangle.fromDegrees(
          bboxDegrees[2],
          bboxDegrees[0],
          bboxDegrees[3],
          bboxDegrees[1]
        ),
      };
    });
  });
};

const viewer = new Cesium.Viewer("cesiumContainer", {
  geocoder: new LanguageModelGeocoder(),
});

