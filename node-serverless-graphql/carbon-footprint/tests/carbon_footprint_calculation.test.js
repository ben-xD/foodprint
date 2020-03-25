const carbon_footprint_calculation = require('../carbon_footprint_calculation');
const potato_image = require('./potato_image');
const orange_image = require('./orange_image');
const rice_image = require('./rice_image');

const VisionAPI = require('../../datasources/vision');
const credentials = require('../../credentials/carbon-7fbf76411514.json');
const visionAPI = new VisionAPI(credentials);
const CarbonAPI = require('../../datasources/carbon');
const carbonAPI = new CarbonAPI();
const ConceptAPI = require('../../datasources/concept');
const conceptAPI = new ConceptAPI();

const dataSources = {
  carbonAPI,
  visionAPI,
  conceptAPI
}

const mockDataSources = {
  carbonAPI: {
    searchData: jest.fn(),
  }
}

describe('mocked dataSources', () => {

  test('getCarbonFootprintFromName: Simple test with an item in the database (rice)', async () => {
    mockDataSources.carbonAPI.searchData.mockReturnValueOnce({
      "carbonpkilo": 1.14,
      "categories": "1000"
    });
    let response = await carbon_footprint_calculation.getCarbonFootprintFromName(mockDataSources, "rice");
    expect(response).toEqual({item: "rice", carbonFootprintPerKg: 1.14});
    expect(mockDataSources.carbonAPI.searchData).toBeCalledWith('rice');
  });

});

describe('real dataSources (no mocking)', () => {

  test('getCarbonFootprintFromName: Item not in database but is part of categorised shortlist (fruit)', async () => {
    jest.setTimeout(10000);
    let response = await carbon_footprint_calculation.getCarbonFootprintFromName(dataSources, "fruit");
    expect(response).toEqual({item: "fruit", carbonFootprintPerKg: 1.1});
  });

  test('getCarbonFootprintFromImage: rice image (shallow layer search)', async () => {
    jest.setTimeout(30000);
    const image_buffer = new Buffer(rice_image, 'base64');
    let response = await carbon_footprint_calculation.getCarbonFootprintFromImage(dataSources, image_buffer);
    expect(response).toEqual({item: "rice", carbonFootprintPerKg: 1.14});
  });

})
