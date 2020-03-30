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


// const mockDataSources = {
//   carbonAPI: {
//     searchData: jest.fn()
//   },
//   userHistAPI: {
//       insert_in_DB: jest.fn(),
//       avg_co2_for_user: jest.fn(),
//       weekly_average_cf: jest.fn(),
//       weekly_cf_composition: jest.fn(),
//       monthly_average_cf: jest.fn(),
//       monthly_cf_composition: jest.fn(),
//   }, 
//   user: {id: "mock"},
// }

const CATEGORY_WITH_DATA = 
    [{"avgCarbonFootprint": 10, "periodNumber": 0}, 
    {"avgCarbonFootprint": 10, "periodNumber": -1}, 
    {"avgCarbonFootprint": 10, "periodNumber": -2}, 
    {"avgCarbonFootprint": 10, "periodNumber": -3}, 
    {"avgCarbonFootprint": 10, "periodNumber": -4}, 
    {"avgCarbonFootprint": 10, "periodNumber": -5}];

const CATEGORY_EMPTY = 
    [{"avgCarbonFootprint": 0, "periodNumber": 0}, 
    {"avgCarbonFootprint": 0, "periodNumber": -1}, 
    {"avgCarbonFootprint": 0, "periodNumber": -2}, 
    {"avgCarbonFootprint": 0, "periodNumber": -3}, 
    {"avgCarbonFootprint": 0, "periodNumber": -4}, 
    {"avgCarbonFootprint": 0, "periodNumber": -5}]

const user = {uid: "x"};

describe('real dataSources (no mocking)', () => {
  test('getCarbonFootprintFromName: Simple test with an item in the database (rice)', async () => {
    jest.setTimeout(30000);
    const name = 'rice';
    const actual = await resolvers.Mutation.postCorrection(null, {name}, {dataSources, user});
    const expected = {name: "rice", carbonFootprintPerKg: 1.14};
    expect(actual).toEqual(expected);
  });

  test('getCarbonFootprintFromImage: rice image', async () => {
    jest.setTimeout(30000);
    const file = {base64: rice_image};
    let actual = await resolvers.Mutation.postPicture(null, {file}, {dataSources, user});
    const expected = {name: "rice", carbonFootprintPerKg: 1.14};
    expect(actual).toEqual(expected);
  });

  test('Query: not used for anything yet, mandatory for GraphQL', async () => {
    resolvers.Query._();
  });

})

describe('mocked dataSources', () => {
  test('postUserHistoryEntry', async () => {
    jest.setTimeout(30000);

    jest.spyOn(dataSources.userHistAPI, 'insert_in_DB').mockImplementation((user, item) => {
      if (item == 'mock' &&  user == 'x'){
        return true;
      }
      return false;
    });
    
    const res = await resolvers.Mutation.postUserHistoryEntry(null, 'mock',  {dataSources, user});

    expect(res).toEqual(true);

  });

  test('reportByCategory: weekly report', async () => {
    jest.setTimeout(30000);

    jest.spyOn(dataSources.userHistAPI, 'weekly_cf_composition').mockImplementation(() => {
        return (
          {
            "plantBased": CATEGORY_WITH_DATA, 
            "fish": CATEGORY_WITH_DATA, 
            "meat": CATEGORY_EMPTY, 
            "eggsAndDairy": CATEGORY_EMPTY
          }
        )
      });
    
    const res = await resolvers.Query.reportByCategory(null, {timezone: 0, resolution: 'WEEKLY'},  {dataSources, user});
    
    expect(res).toEqual(
      {
        "plantBased": CATEGORY_WITH_DATA, 
        "fish": CATEGORY_WITH_DATA, 
        "meat": CATEGORY_EMPTY, 
        "eggsAndDairy": CATEGORY_EMPTY
      }
    )
  });

  test('reportByCategory: monthly report', async () => {
    jest.setTimeout(30000);

    jest.spyOn(dataSources.userHistAPI, 'monthly_cf_composition').mockImplementation(() => {
        return (
          {
            "plantBased": CATEGORY_WITH_DATA, 
            "fish": CATEGORY_WITH_DATA, 
            "meat": CATEGORY_EMPTY, 
            "eggsAndDairy": CATEGORY_EMPTY
          }
        )
      });
    
    const res = await resolvers.Query.reportByCategory(null, {timezone: 0, resolution: 'MONTHLY'},  {dataSources, user});
    
    expect(res).toEqual(
      {
        "plantBased": CATEGORY_WITH_DATA, 
        "fish": CATEGORY_WITH_DATA, 
        "meat": CATEGORY_EMPTY, 
        "eggsAndDairy": CATEGORY_EMPTY
      }
      )
    });

})