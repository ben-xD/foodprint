const CarbonAPI = require('../carbon');

let carbonAPI = new CarbonAPI();

test('Carbon footprint of rice is 1.14', async () => {
  const name = 'rice';
  const expected = 1.14;
  expect.assertions(1);
  const actual = await carbonAPI.searchData(name).carbonpkilo;
  expect(actual).toEqual(expected);
});