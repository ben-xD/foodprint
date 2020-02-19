const carbon_footprint_calculation = require('../carbon_footprint_calculation');

test('getCarbonFootprintFromName: Simple test with an item in the database (rice)', async () => {
  let response = await carbon_footprint_calculation.getCarbonFootprintFromName("rice");
  expect(response).toEqual({item: "rice", carbonFootprintPerKg: 1.14});
});
