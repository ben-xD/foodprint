const carbon_footprint_calculation = require('../carbon_footprint_calculation');
const potato_image = require('./potato_image');
const orange_image = require('./orange_image');
const rice_image = require('./rice_image');

const VisionAPI = require('../../datasources/vision');
const credentials = require('../../credentials/carbon-7fbf76411514.json');
const visionAPI = new VisionAPI(credentials);

const CarbonAPI = require('../../datasources/carbon');
carbonAPI = new CarbonAPI();

test('getCarbonFootprintFromName: Simple test with an item in the database (rice)', async () => {
  let response = await carbon_footprint_calculation.getCarbonFootprintFromName(carbonAPI,"rice");
  expect(response).toEqual({item: "rice", carbonFootprintPerKg: 1.14});
});

test('getCarbonFootprintFromName: Item not in database but is part of categorised shortlist (fruit)', async () => {
  let response = await carbon_footprint_calculation.getCarbonFootprintFromName(carbonAPI,"fruit");
  expect(response).toEqual({item: "fruit", carbonFootprintPerKg: 1.1});
});

// test('getCarbonFootprintFromImage: orange image (deep layer search)', async() => {
//   jest.setTimeout(10000)
//   const image_buffer = new Buffer(orange_image, 'base64');
//   let response = await carbon_footprint_calculation.getCarbonFootprintFromImage(image_buffer);
//   expect(response).toEqual({item: "citrus", carbonFootprintPerKg: 0.5});
//   jest.setTimeout(5000)
// });

test('getCarbonFootprintFromImage: rice image (shallow layer search)', async() => {
  jest.setTimeout(15000);
  const image_buffer = new Buffer(rice_image, 'base64');
  let response = await carbon_footprint_calculation.getCarbonFootprintFromImage(visionAPI, carbonAPI, image_buffer);
  expect(response).toEqual({item: "rice", carbonFootprintPerKg: 1.14});
  jest.setTimeout(5000);
});
