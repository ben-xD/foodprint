const CarbonAPI = require('../carbon');

let carbonAPI = new CarbonAPI();

describe('Real database', () => {

  test('Carbon footprint of rice is 1.14 and category is 1000', async () => {
    jest.setTimeout(10000);
    const name = 'rice';
    const expected = { carbonpkilo: 1.14, categories: '1000' };
    expect.assertions(1);
    const res = await carbonAPI.searchData(name);
    console.log('res', res);
    const actual = res;
    expect(actual).toEqual(expected);
  });

  test('Item that is not in the database returns undefined', async () => {
    jest.setTimeout(10000);
    const name = 'definitely-not-in-the-db someRandomNoise';
    const expected = { carbonpkilo: undefined, categories: undefined };
    expect.assertions(1);
    const res = await carbonAPI.searchData(name);
    console.log('res', res);
    const actual = res;
    expect(actual).toEqual(expected);
  });

})

