const CarbonAPI = require('../carbon');
const UserHistAPI = require('../user_history');
const  { createStore, deleteStore } = require('../../utils');
const store = createStore();

let userHistAPI = new UserHistAPI(store);
let carbonAPI = new CarbonAPI(store);
const mockDataSources = {
    carbonAPI: {
      searchData: jest.fn()
    },
    userHistAPI: {
        get_month_i_data: jest.fn(),
        get_week_i_data: jest.fn(),
    }
  }
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

describe('Real user history database', () => {

    // test('Average co2 of all products for user test_user is 0.62 (rounded up)', async () => {
    //     jest.setTimeout(10000);
    //     const user = 'test_user';
    //     const expected = 0.62;
    //     expect.assertions(1);
    //     const res = await userHistAPI.avg_co2_for_user(carbonAPI, user);
    //     console.log('res', res);
    //     const actual = res;
    //     expect(actual).toEqual(expected);
    // });

    test('Average co2 of all products for a user that has no products saved in db should be 0', async () => {
        jest.setTimeout(10000);
        const user = 'non_user';
        const expected = 0;
        expect.assertions(1);
        const res = await userHistAPI.avg_co2_for_user(carbonAPI, user);
        console.log('res', res);
        const actual = res;
        expect(actual).toEqual(expected);
    });
});

describe('User history database (mocked dataSources)', () => {

    test('Get weekly_cf_composition', async () => {
        jest.setTimeout(10000);
        jest.spyOn(userHistAPI, 'get_week_i_data').mockImplementation(() => 
        [{ item: 'mock' }]
        );
        mockDataSources.carbonAPI.searchData.mockReturnValue({
            "carbonpkilo": 10,
            "categories": "1200"
          });

        mockDataSources.carbonAPI.searchData.mockImplementation((item) => {
            if (item == 'mock'){
                return {
                    "carbonpkilo": 10,
                    "categories": "1200"
                  };
            }
            return "error"
        });

        const user = 'test_user';
        const expected = {
            "plantBased": CATEGORY_WITH_DATA, 
            "fish": CATEGORY_WITH_DATA, 
            "meat": CATEGORY_EMPTY, 
            "eggsAndDairy": CATEGORY_EMPTY
        };
        expect.assertions(1);
        const res = await userHistAPI.weekly_cf_composition(mockDataSources.carbonAPI, user, 0);
        //console.log('res', res);
        const actual = res;
        expect(actual).toEqual(expected);
    });

    test('Get monthly_cf_composition', async () => {
        jest.setTimeout(10000);
        jest.spyOn(userHistAPI, 'get_month_i_data').mockImplementation(() => 
        [{ item: 'mock' }]
        );
        mockDataSources.carbonAPI.searchData.mockReturnValue({
            "carbonpkilo": 10,
            "categories": "1200"
          });

        mockDataSources.carbonAPI.searchData.mockImplementation((item) => {
            if (item == 'mock'){
                return {
                    "carbonpkilo": 10,
                    "categories": "1200"
                  };
            }
            return "error"
        });

        const user = 'test_user';
        const expected = {
            "plantBased": CATEGORY_WITH_DATA, 
            "fish": CATEGORY_WITH_DATA, 
            "meat": CATEGORY_EMPTY, 
            "eggsAndDairy": CATEGORY_EMPTY
        };
        expect.assertions(1);
        const res = await userHistAPI.monthly_cf_composition(mockDataSources.carbonAPI, user, 0);
        //console.log('res', res);
        const actual = res;
        expect(actual).toEqual(expected);
    });
});