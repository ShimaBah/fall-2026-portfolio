var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});
var legendTitle = ui.Label({
  value: 'My Legend',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
  }
});
legend.add(legendTitle);
var makeRow = function(color, name) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: '#' + color,
      padding: '8px',
      margin: '0 0 4px 0'
    }
  });
  var description = ui.Label({
    value: name,
    style: {margin: '0 0 4px 6px'}
  });
  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};
var palette =['ff0000', '00ff00', '0000ff'];
var names = ['Red','Green','Blue'];
for (var i = 0; i < 3; i++) {
  legend.add(makeRow(palette[i], names[i]));
}
Map.add(legend);
var chirps = ee.ImageCollection("UCSB-CHG/CHIRPS/PENTAD")
var P = chirps.select("precipitation").filterDate('2009-01-01', '2009-12-31').sum()
var viz = {min:0, max:3500, palette:['ffffff','b7f0ae','21f600','0000FF','FDFF92','FF2700','d600ff']};
Map.addLayer(P, viz);
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});
var legendTitle = ui.Label({
  value: 'Rainfall (mm)',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
  }
});
legend.add(legendTitle);
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((viz.max-viz.min)/100.0).add(viz.min);
var legendImage = gradient.visualize(viz);
var panel = ui.Panel({
  widgets: [
    ui.Label(viz['max'])
  ],
});
legend.add(panel);
var thumbnail = ui.Thumbnail({
  image: legendImage,
  params: {bbox:'0,0,10,100', dimensions:'10x200'},
  style: {padding: '1px', position: 'bottom-center'}
});
legend.add(thumbnail);
var panel = ui.Panel({
  widgets: [
    ui.Label(viz['min'])
  ],
});
legend.add(panel);
Map.add(legend);
var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filter(ee.Filter.eq('WRS_PATH', 9))
  .filter(ee.Filter.eq('WRS_ROW', 29))
  .filter(ee.Filter.lt('CLOUD_COVER', 10))
  .filterDate('2013-05-01','2022-02-07')
  .select(['B7', 'B5', 'B3'])
  .map(function(image) {
    return image.multiply(512).uint8();
  });
Map.addLayer(collection.median(), {min:0,max:200}, 'Median')
var polygon = roi
Export.video.toDrive({
  collection: collection,
  description: 'L8VideoExample',
  dimensions: 720,
  framesPerSecond: 12,
  region: polygon
});
