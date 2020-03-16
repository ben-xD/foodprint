const CarbonAPI = require('../carbon');

CarbonAPI.connect();
const carbonModel = CarbonAPI.getCarbonFootprintModel();

test('Carbon footprint of rice is 0.5', async () => {
  const name = 'rice';
  const expected = 1.14;
  expect.assertions(1);
  await carbonModel.findOne({item: name}, (err, item) => {
    expect(item.carbonpkilo).toEqual(expected);
  });
});
