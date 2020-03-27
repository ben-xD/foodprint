const resolvers = require('../resolvers');
const rice_image = require('../carbon-footprint/tests/rice_image');
const context = require('../context');
const VisionAPI = require('../datasources/vision');
const visionCredentials = require('../credentials/carbon-7fbf76411514.json');
const  { createStore } = require('../utils');
const store = createStore();

const CarbonAPI = require('../datasources/carbon');
const carbonAPI = new CarbonAPI(store);
const ConceptAPI = require('../datasources/concept');
const userHistAPI = require('../datasources/user_history');


const dataSources = {
  visionAPI: new VisionAPI(visionCredentials),
  carbonAPI,
  conceptAPI: new ConceptAPI(),
  userHistAPI: new userHistAPI(store),
};

describe('real dataSources (no mocking)', () => {
  test('getCarbonFootprintFromName: Simple test with an item in the database (rice)', async () => {
    jest.setTimeout(30000);
    const name = 'rice';
    const actual = await resolvers.Mutation.postCorrection(null, {name}, {dataSources}, context);
    const expected = {name: "rice", carbonFootprintPerKg: 1.14};
    expect(actual).toEqual(expected);
  });

  test('getCarbonFootprintFromImage: rice image', async () => {
    jest.setTimeout(30000);
    const file = {base64: rice_image};
    let actual = await resolvers.Mutation.postPicture(null, {file}, {dataSources}, context);
    const expected = {name: "rice", carbonFootprintPerKg: 1.14};
    expect(actual).toEqual(expected);
  });

  test('Query: not used for anything yet, mandatory for GraphQL', async () => {
    resolvers.Query._();
  });
})
