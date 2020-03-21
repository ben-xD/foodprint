const CarbonAPI = require('../carbon');
const searchData = CarbonAPI.CarbonAPIInstance.searchData;

test('Carbon footprint of rice is 0.5', async () => {
  const name = 'rice';
  const expected = 1.14;
  expect.assertions(1);
  const actual = await searchData(name);
  expect(actual).toEqual(expected);
});
