print(srtm);
Map.addLayer(srtm);
Map.addLayer(srtm, {min: 0, max: 1000}, 'DEM');
Map.addLayer(srtm, {min: 0, max: 300, palette: ['blue', 'yellow', 'red']}, 'Elevation above sea level');
var hillshade = ee.Terrain.hillshade(srtm);
Map.addLayer(hillshade, {min: 150, max: 255}, 'Hillshade');
var high = srtm.gt(200);
Map.addLayer(high, {}, 'Above 100m');
var slope = ee.Terrain.slope(srtm);
Map.addLayer(slope, {min: 0, max: 30}, 'Slope');
Map.addLayer(geometry2);
var dict = srtm.reduceRegion({
  reducer: 'mean',
  geometry: geometry2,
  scale: 90
});
print('Mean elevation', dict);
