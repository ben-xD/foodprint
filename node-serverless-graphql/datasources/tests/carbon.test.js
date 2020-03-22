const CarbonAPI = require('../carbon');

carbonAPI = new CarbonAPI();

test('Carbon footprint of rice is 0.5', async () => {
  const name = 'rice';
  const expected = 1.14;
  expect.assertions(1);
  const actual = await carbonAPI.searchData(name);
  expect(actual).toEqual(expected);
});
