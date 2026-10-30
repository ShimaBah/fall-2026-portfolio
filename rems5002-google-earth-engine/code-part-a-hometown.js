var sanandaj = ee.Geometry.Point([47.01, 35.31]);
Map.centerObject(sanandaj, 11);
var s2 = ee.ImageCollection('COPERNICUS/S2_HARMONIZED');
var leafOn = s2.filterBounds(sanandaj)
  .filterDate('2021-10-01', '2021-11-15')
  .sort('CLOUDY_PIXEL_PERCENTAGE')
  .first();
Map.addLayer(leafOn, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 'Leaf-on true colour');
var ndviOn = leafOn.normalizedDifference(['B8', 'B4']);
Map.addLayer(ndviOn, {min: 0, max: 1, palette: ['brown', 'yellow', 'green']}, 'Leaf-on NDVI');
print('Leaf-on date:', leafOn.date());
var leafOff = s2.filterBounds(sanandaj)
  .filterDate('2021-11-15', '2021-11-30')
  .sort('CLOUDY_PIXEL_PERCENTAGE')
  .first();
Map.addLayer(leafOff, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 'Leaf-off true colour');
var ndviOff = leafOff.normalizedDifference(['B8', 'B4']);
Map.addLayer(ndviOff, {min: 0, max: 1, palette: ['brown', 'yellow', 'green']}, 'Leaf-off NDVI');
print('Leaf-off date:', leafOff.date());

print('Leaf-off cloud %:', leafOff.get('CLOUDY_PIXEL_PERCENTAGE'));
