// This is our first line of code. Let’s define the image collection we are working with by writing this command
var image = ee.Image(sent2

// We will then include a filter to get only images in the date range we are interested in
.filterDate("2021-02-07", "2022-02-07")

// Next we include a geographic filter to narrow the search to images at the location of our point
.filterBounds(cogs)

// Next we will also sort the collection by a metadata property, in our case cloud cover is a very useful one
.sort("CLOUD_COVERAGE_ASSESSMENT")

// Now lets select the first image out of this collection - i.e. the most cloud free image in the date range
.first());

// And let's print the image to the console.
print("A Sentinel-2 scene:", image);

// Define visualization parameters in a JavaScript dictionary for true colour rendering. Bands 4,3 and 2 needed for RGB.
var trueColour = {
    bands: ["B4", "B3", "B2"],
    min: 0,
    max: 3000
    };

// Add the image to the map, using the visualization parameters.
Map.addLayer(image, trueColour, "True-colour image");

//Define false-colour visualization parameters.
var falseColour = {
    bands: ["B8", "B4", "B3"],
    min: 0,
    max: 3000
    };

// Add the image to the map, using the visualisation parameters.
Map.addLayer(image, falseColour, "False-colour composite");

//Define variable NDVI from equation
var NDVI = image.expression(
    "(NIR - RED) / (NIR + RED)",
    {
      RED: image.select("B4"),    //  RED
      NIR: image.select("B8"),    // NIR
      BLUE: image.select("B2")    // BLUE
    });

Map.addLayer(NDVI, {min: 0, max: 1}, "NDVI");

Map.addLayer(NDVI, {min: 0, max: 1, palette: ['brown', 'yellow', 'green']}, "NDVI colour");
