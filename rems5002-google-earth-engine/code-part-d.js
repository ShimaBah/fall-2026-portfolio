var collection = imageCollection.select('EVI');
var reference = collection.filterDate('2001-01-01', '2010-12-31').sort('system:time_start');
var mean = reference.mean();
var vis = {min: 2000, max: 5000, palette: ['brown', 'yellow', 'green']};
Map.addLayer(mean, vis, 'Reference EVI');
var recent = collection.filterDate('2011-01-01', '2018-12-31');
var meanRecent = recent.mean();
Map.addLayer(meanRecent, vis, 'Recent EVI');
var subtractmean = function(image) {
  return image.subtract(mean).copyProperties(image, ['system:time_start']);
};
var anomalies = recent.map(subtractmean);
Map.addLayer(anomalies.sum(), {
  min: -10000,
  max: 10000,
  palette: ['darkred', 'red', 'yellow', 'green', 'darkgreen']
}, 'Cumulative anomaly');
var time0 = reference.first().get('system:time_start');
var first = ee.List([
  ee.Image(0).set('system:time_start', time0).rename('EVI')
]);
var accumulate = function(image, list) {
  var previous = ee.Image(ee.List(list).get(-1));
  var added = image.add(previous)
    .set('system:time_start', image.get('system:time_start'));
  return ee.List(list).add(added);
};
var cumulative = ee.ImageCollection(ee.List(
  anomalies.iterate(accumulate, first)
));
Map.centerObject(roi, 7);
var chartParam = {
  title: 'Cumulative EVI anomaly over time',
  hAxis: {title: 'Time'},
  vAxis: {title: 'Cumulative EVI anomaly'},
};
var chart = ui.Chart.image.seriesByRegion({
  imageCollection: cumulative,
  regions: roi,
  reducer: ee.Reducer.mean(),
  band: 'EVI',
  scale: 500,
  xProperty: 'system:time_start',
  seriesProperty: 'PROJECT'
});
print(chart.setOptions(chartParam));
