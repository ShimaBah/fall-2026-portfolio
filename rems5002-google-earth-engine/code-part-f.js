var ecoregions = ee.FeatureCollection('RESOLVE/ECOREGIONS/2017');
Map.addLayer(ecoregions, {}, 'default display');
Map.addLayer(ecoregions, {color: 'FF0000'}, 'colored');
Map.addLayer(ecoregions.draw({color: '006600', strokeWidth: 5}), {}, 'drawn');

var empty = ee.Image().byte();
var outline = empty.paint({
  featureCollection: ecoregions,
  color: 1,
  width: 3
});
Map.addLayer(outline, {palette: 'FF0000'}, 'edges');
var outlines = empty.paint({
  featureCollection: ecoregions,
  color: 'BIOME_NUM',
  width: 4
});
var palette = ['FF0000', '00FF00', '0000FF'];
Map.addLayer(outlines, {palette: palette, max: 14}, 'different color edges');

var outlines = empty.paint({
  featureCollection: ecoregions,
  color: 'BIOME_NUM',
  width: 'NNH'
});
Map.addLayer(outlines, {palette: palette, max: 14}, 'different color, width edges');

var fills = empty.paint({
  featureCollection: ecoregions,
  color: 'BIOME_NUM',
});
Map.addLayer(fills, {palette: palette, max: 14}, 'colored fills');

var empty = ee.Image().byte();
var palette = ['FF0000', '00FF00', '0000FF'];
var filledOutlines = empty.paint(ecoregions, 'BIOME_NUM').paint(ecoregions, 0, 2);
Map.addLayer(filledOutlines, {palette: ['000000'].concat(palette), max: 14}, 'edges and fills');
var sheds = ee.FeatureCollection('USGS/WBD/2017/HUC06')
  .map(function(feature){
    var num = ee.Number.parse(feature.get('areasqkm'));
    return feature.set('areasqkm', num);
  });
var continentalUS = ee.Geometry.Rectangle(-127.18, 19.39, -62.75, 51.29);
var filtered = sheds.filterBounds(continentalUS);
print('Count after filter:', filtered.size());
var largeSheds = filtered.filter(ee.Filter.gt('areasqkm', 25000));
print('Count after filtering by size:', largeSheds.size());
