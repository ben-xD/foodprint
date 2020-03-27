const CarbonAPI = require('../carbon');
const UserHistAPI = require('../user_history');
const  { createStore, deleteStore } = require('../../utils');
const store = createStore();

let userHistAPI = new UserHistAPI(store);
let carbonAPI = new CarbonAPI(store);

describe('Real user history database', () => {

    // test('Returns true if inserting a new user history entry to the database is successful', async () => {
    //     jest.setTimeout(10000);
    //     const new_data = {user_id: "test_user", item: "test_item"};
    //     const expected = true;
    //     expect.assertions(1);
    //     const res = await userHistAPI.insert_in_DB(new_data);
    //     console.log('res', res);
    //     const actual = res;
    //     expect(actual).toEqual(expected);
    // });

    test('Average co2 of all products for user test_user is 0.62 (rounded up)', async () => {
        jest.setTimeout(10000);
        const user = 'test_user';
        const expected = "0.62"";
        expect.assertions(1);
        const res = await userHistAPI.avg_co2_for_user(carbonAPI, user);
        console.log('res', res);
        const actual = res;
        expect(actual).toEqual(expected);
    });

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

})