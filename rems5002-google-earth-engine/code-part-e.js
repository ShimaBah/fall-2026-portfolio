var L8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA');

var startdate = ee.Date('2013-05-01');
var enddate = ee.Date('2022-02-07');

var l8images = L8.filterDate(startdate, enddate)
  .filterBounds(roi);

var cloudThresh = 20;
var cloudFunction = function(image){
  var scored = ee.Algorithms.Landsat.simpleCloudScore(image);
  var quality = scored.select('cloud');
  var cloudy = quality.gt(cloudThresh);
  var cloudmask = cloudy.not();
  return image.updateMask(cloudmask);
};

var l8CloudMasked = l8images.map(cloudFunction);

Map.centerObject(roi, 8);
Map.addLayer(l8CloudMasked.median().clip(roi), {
  min: 0,
  max: 0.5,
  bands: ['B5', 'B4', 'B3']
}, 'Landsat 8 False colour median');

function addNdwi(img) {
  var ndwi = img.normalizedDifference(['B3', 'B5']).rename('NDWI');
  return img.addBands(ndwi);
}

var l8ndwi = L8
  .filterBounds(roi)
  .filterDate(startdate, enddate)
  .map(cloudFunction)
  .select(['B3', 'B5'])
  .map(addNdwi);

Map.addLayer(l8ndwi.select('NDWI').max().mask(l8ndwi.select('NDWI').max()).clip(roi),
  {bands: 'NDWI', min: 0, max: 1, palette: ['darkblue']}, 'NDWI L8');

var year = 2018;
var ndwiViz = {bands:'NDWI',min:0,max:1,palette:['darkblue']};
var ndwiYEAR = l8ndwi.filterDate({
  start: ee.Date.fromYMD(year, 1, 1),
  end: ee.Date.fromYMD(year, 12, 31)
}).max();
Map.addLayer(ndwiYEAR.mask(ndwiYEAR).clip(roi), ndwiViz, '2018 NDWI');

var waterBinary = l8ndwi.select('NDWI').map(function(image) {
  return image.gt(0);
});
var frequency = waterBinary.sum().divide(waterBinary.count());
Map.addLayer(frequency.mask(frequency).clip(roi),
  {palette: ['white', 'magenta', 'blue','darkblue']}, 'Water inundation frequency');
