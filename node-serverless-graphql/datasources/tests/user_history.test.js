const CarbonAPI = require('../carbon');
const UserHistAPI = require('../user_history');
const { createStore, deleteStore } = require('../../utils');
const store = createStore();

let userHistAPI = new UserHistAPI(store);
let carbonAPI = new CarbonAPI(store);
const mockDataSources = {
    carbonAPI: {
        getCfOneItem: jest.fn(),
        getCfMultipleItems: jest.fn(),
    },
    userHistAPI: {
        get_month_i_data: jest.fn(),
        get_week_i_data: jest.fn(),
    }
}
const CATEGORY_WITH_DATA =
    [{ "avgCarbonFootprint": 10, "periodNumber": 0 },
    { "avgCarbonFootprint": 10, "periodNumber": -1 },
    { "avgCarbonFootprint": 10, "periodNumber": -2 },
    { "avgCarbonFootprint": 10, "periodNumber": -3 },
    { "avgCarbonFootprint": 10, "periodNumber": -4 },
    { "avgCarbonFootprint": 10, "periodNumber": -5 }];

const CATEGORY_EMPTY =
    [{ "avgCarbonFootprint": 0, "periodNumber": 0 },
    { "avgCarbonFootprint": 0, "periodNumber": -1 },
    { "avgCarbonFootprint": 0, "periodNumber": -2 },
    { "avgCarbonFootprint": 0, "periodNumber": -3 },
    { "avgCarbonFootprint": 0, "periodNumber": -4 },
    { "avgCarbonFootprint": 0, "periodNumber": -5 }]

describe('User history database (mocked dataSources)', () => {

    test('Average co2 of all products for user x is 2.28 (rounded up)', async () => {
        jest.setTimeout(30000);
        // Mock up unreliable functions
        jest.spyOn(userHistAPI, 'get_all_user_data').mockReturnValue(
            [{ item: 'rice' }, { item: 'potato' }, { item: 'orange' }]);
        jest.spyOn(carbonAPI, 'getCfMultipleItems').mockReturnValue(
            [{ carbonpkilo: "1.14" }, { carbonpkilo: "2.2" }, { carbonpkilo: "3.5" }]);

        const user = 'x';
        let actual = await userHistAPI.avg_co2_for_user(carbonAPI, user);
        const expected = 2.28;
        expect(actual).toEqual(expected);
    });

    test('Calculate the weekly average co2', async () => {
        jest.setTimeout(30000);
        // Mock up unreliable functions:
        // Mock the items returned for each of the 6 weeks (same for every week)
        jest.spyOn(userHistAPI, 'get_week_i_data').mockReturnValue(
            [{ item: '1' }, { item: '1' }, { item: '2' }, { item: '3' }, { item: '4' }, { item: '5' }, { item: '6' }]);
        // Mock the co2 values returned for each element in each week (6 in total)
        jest.spyOn(carbonAPI, 'getCfMultipleItems').mockReturnValue(
            [{ carbonpkilo: '1.2' }, { carbonpkilo: '2.1' }, { carbonpkilo: '0.4' }, { carbonpkilo: '1.2' },
            { carbonpkilo: '0.4' }, { carbonpkilo: '3' }]);

        const timezone = 0;
        const user = 'x';
        let actual = await userHistAPI.weekly_average_cf(carbonAPI, user, timezone);
        const expected = 1.36;
        expect(actual).toEqual(expected);
    });

    test('Calculate the monthy average co2', async () => {
        jest.setTimeout(30000);
        // Mock up unreliable functions:
        // Mock the items returned for each of the 6 months (same for every month)
        jest.spyOn(userHistAPI, 'get_month_i_data').mockReturnValue(
            [{ item: 'orange' }, { item: 'orange' }, { item: 'orange' }, { item: 'orange' }, { item: 'orange' }, { item: 'orange' }]);
        // Mock the co2 values returned for each element in each month (6 in total)
        jest.spyOn(carbonAPI, 'getCfMultipleItems').mockReturnValue(
            [{ carbonpkilo: 3.2 }]);

        const timezone = 0;
        const user = 'x';
        let actual = await userHistAPI.monthly_average_cf(carbonAPI, user, timezone);
        const expected = 3.2;
        expect(actual).toEqual(expected);
    });

    test('Get weekly_cf_composition', async () => {
        jest.setTimeout(10000);
        jest.spyOn(userHistAPI, 'get_week_i_data').mockImplementation(() =>
            [{ item: 'rice' }, { item: 'orange' }]
        );

        mockDataSources.carbonAPI.getCfMultipleItems.mockImplementation((data, boolean) => {
            if (data[0] == 'rice') {
                return ([{
                    "item": "rice",
                    "carbonpkilo": 10,
                    "categories": "1200"
                },
                {
                    "item": "orange",
                    "carbonpkilo": 10,
                    "categories": "1200"
                }])
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

        mockDataSources.carbonAPI.getCfMultipleItems.mockImplementation((data) => {
            if (data[0] == 'mock') {
                return ([{
                    "carbonpkilo": 20,
                    "categories": "1200"
                }])
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

afterAll(() => {
    deleteStore();
});
