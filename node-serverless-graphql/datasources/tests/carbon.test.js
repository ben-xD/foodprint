const CarbonAPI = require('../carbon');

const  { createStore, deleteStore } = require('../../utils');
const store = createStore();

let carbonAPI = new CarbonAPI(store);

describe('Real database', () => {

  test('Carbon footprint of rice is 1.14 and category is 1000', async () => {
    jest.setTimeout(10000);
    const name = 'rice';
    const expected = { carbonpkilo: 1.14, categories: '1000' };
    expect.assertions(1);
    const res = await carbonAPI.getCfOneItem(name);
    console.log('res', res);
    const actual = res;
    expect(actual).toMatchObject(expected);
  });

  test('Item that is not in the database returns null', async () => {
    jest.setTimeout(10000);
    const name = 'definitely-not-in-the-db someRandomNoise';
    const expected = null;
    expect.assertions(1);
    const res = await carbonAPI.getCfOneItem(name);
    console.log('res', res);
    const actual = res;
    expect(actual).toEqual(expected);
  });

})

