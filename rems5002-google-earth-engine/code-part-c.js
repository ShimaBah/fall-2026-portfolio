var filtered = L8.filterDate('2021-02-07', '2022-02-07');
Map.addLayer(filtered);
var filtered = L8.filterDate('2021-05-01', '2021-09-01');
Map.addLayer(filtered, {min: 0, max: 0.3, bands: ['B4', 'B3', 'B2']});
var rgb_vis = {min: 0, max: 0.3, bands: ['B4', 'B3', 'B2']};
var median = filtered.median();
Map.addLayer(median, rgb_vis, 'Median');
var cogs = ee.Geometry.Point([-65.17, 44.89]);
var filtered = L8.filterBounds(cogs);
print(filtered);
var image = filtered.first();
Map.addLayer(image, rgb_vis, 'Image');
var ndvi = image.normalizedDifference(['B5', 'B4']);
Map.addLayer(ndvi, {min: 0, max: 1}, 'NDVI');
function addNDVI(image) {
  var ndvi = image.normalizedDifference(['B5', 'B4']);
  return image.addBands(ndvi);
}
var with_ndvi = filtered.map(addNDVI);
var greenest = with_ndvi.qualityMosaic('nd');
Map.addLayer(greenest, {min: 0, max: 0.3, bands: ['B4', 'B3', 'B2']}, 'Greenest');
var chart = ui.Chart.image.series({
  imageCollection: with_ndvi.select('nd'),
  region: cogs,
  reducer: ee.Reducer.mean(),
  scale: 30
});
print(chart);
Export.image.toDrive({
  image: greenest.select(['B4', 'B3', 'B2']),
  description: 'GreenestPixel',
  scale: 30,
  region: cogs.buffer(10000),
  maxPixels: 1e9
});
