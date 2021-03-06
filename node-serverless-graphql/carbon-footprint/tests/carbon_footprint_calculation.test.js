const carbon_footprint_calculation = require('../carbon_footprint_calculation');
const potato_image = require('./potato_image');
const orange_image = require('./orange_image');
const rice_image = require('./rice_image');

const VisionAPI = require('../../datasources/vision');
const CarbonAPI = require('../../datasources/carbon');
const ConceptAPI = require('../../datasources/concept');
const UserHistAPI = require('../../datasources/user_history');

const { createStore, deleteStore } = require('../../utils');

const store = createStore();
const carbonAPI = new CarbonAPI(store);

const dataSources = {
  visionAPI: new VisionAPI(),
  conceptAPI: new ConceptAPI(),
  carbonAPI,
  userHistAPI: new UserHistAPI(store),
};

const mockDataSources = {
  carbonAPI: {
    getCfOneItem: jest.fn(),
    getCfMultipleItems: jest.fn(),
    findCategorisedLabel: carbonAPI.findCategorisedLabel, // Note that this function is not mocked
  },
};

describe('getCarbonFootprintFromName (mocked dataSources)', () => {
  test('"rice" is a known item in the database', async () => {
    mockDataSources.carbonAPI.getCfMultipleItems.mockReturnValueOnce([{
      item: 'rice',
      carbonpkilo: 1.14,
      categories: '1000',
    }]);
    const response = await carbon_footprint_calculation.getCarbonFootprintFromName(mockDataSources, 'rice');
    expect(response).toEqual({ item: 'rice', carbonFootprintPerKg: 1.14 });
    expect(mockDataSources.carbonAPI.getCfMultipleItems).toBeCalledWith(['rice']);
  });

  test('"Some nice RICE" is converted into "rice" and footprint for "rice" is returned', async () => {
    mockDataSources.carbonAPI.getCfMultipleItems.mockReturnValueOnce([{
      item: 'rice',
      carbonpkilo: 1.14,
      categories: '1000',
    }]);
    const response = await carbon_footprint_calculation.getCarbonFootprintFromName(mockDataSources, 'Some nice RICE');
    expect(response).toEqual({ item: 'rice', carbonFootprintPerKg: 1.14 });
    expect(mockDataSources.carbonAPI.getCfMultipleItems).toBeCalledWith(['rice']);
  });

  test('"fruit" is not in the database and is returned from categorised shortlist (fruit)', async () => {
    mockDataSources.carbonAPI.getCfMultipleItems.mockReturnValueOnce([]);
    const response = await carbon_footprint_calculation.getCarbonFootprintFromName(mockDataSources, 'fruit');
    expect(response).toEqual({ item: 'fruit', carbonFootprintPerKg: 1.1 });
  });
});


describe('getCarbonFootprintFromImage (no mocking)', () => {
  test('getCarbonFootprintFromImage: rice image (shallow layer search)', async () => {
    jest.setTimeout(30000);
    const image_buffer = new Buffer(rice_image, 'base64');
    const response = await carbon_footprint_calculation.getCarbonFootprintFromImage(dataSources, image_buffer);
    expect(response).toEqual({ item: 'rice', carbonFootprintPerKg: 1.14 });
  });
});

afterAll(() => {
  deleteStore();
});
