const carbon_footprint_calculation = require('../carbon_footprint_calculation');
const fs = require('fs');

test('getCarbonFootprintFromName: Simple test with an item in the database (rice)', async () => {
  let response = await carbon_footprint_calculation.getCarbonFootprintFromName("rice");
  expect(response).toEqual({item: "rice", carbonFootprintPerKg: 1.14});
});

test('getCarbonFootprintFromImage: orange image', async() => {
  const  path = __dirname + "/orange_image.txt";
  const image  = fs.readFileSync(path); // Read text file
  const image_string = image.toString('utf-8') // Convert to string
  const image_buffer = new Buffer(image_string, 'base64'); // Decode as base64 file buffer
  let response = await carbon_footprint_calculation.getCarbonFootprintFromImage(image_buffer);
  expect(response).toEqual({item: "citrus", carbonFootprintPerKg: 0.5});
});
