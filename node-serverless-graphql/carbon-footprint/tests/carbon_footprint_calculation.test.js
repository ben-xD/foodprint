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

describe('getCarbonFootprintFromName (mocked dataSources)', () => {

  test('"rice" is a known item in the database', async () => {
    mockDataSources.carbonAPI.searchData.mockReturnValueOnce({
      "carbonpkilo": 1.14,
      "categories": "1000"
    });
    let response = await carbon_footprint_calculation.getCarbonFootprintFromName(mockDataSources, "rice");
    expect(response).toEqual({item: "rice", carbonFootprintPerKg: 1.14});
    expect(mockDataSources.carbonAPI.searchData).toBeCalledWith('rice');
  });

  test('"Some nice RICE" is converted into "rice" and footprint for "rice" is returned', async () => {
    mockDataSources.carbonAPI.searchData.mockReturnValueOnce({
      "carbonpkilo": 1.14,
      "categories": "1000"
    });
    let response = await carbon_footprint_calculation.getCarbonFootprintFromName(mockDataSources, "Some nice RICE");
    expect(response).toEqual({item: "rice", carbonFootprintPerKg: 1.14});
    expect(mockDataSources.carbonAPI.searchData).toBeCalledWith('rice');
  });

  test('"fruit" is not in the database and is returned from categorised shortlist (fruit)', async () => {
    mockDataSources.carbonAPI.searchData.mockReturnValueOnce({
      "carbonpkilo": undefined,
      "categories": undefined
    });
    let response = await carbon_footprint_calculation.getCarbonFootprintFromName(mockDataSources, "fruit");
    expect(response).toEqual({item: "fruit", carbonFootprintPerKg: 1.1});
  });

});


describe('getCarbonFootprintFromImage (no mocking)', () => {

  test('getCarbonFootprintFromImage: rice image (shallow layer search)', async () => {
    jest.setTimeout(30000);
    const image_buffer = new Buffer(rice_image, 'base64');
    let response = await carbon_footprint_calculation.getCarbonFootprintFromImage(dataSources, image_buffer);
    expect(response).toEqual({item: "rice", carbonFootprintPerKg: 1.14});
  });

})
