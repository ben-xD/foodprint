const mongooseQueries = require('../mongoose_queries');

mongooseQueries.connect();
const carbonModel = mongooseQueries.getCarbonFootprintModel();

test('Carbon footprint of rice is 0.5', async () => {
  const name = 'rice';
  const expected = 1.14;
  expect.assertions(1);
  await carbonModel.findOne({item: name}, (err, item) => {
    expect(item.carbonpkilo).toEqual(expected);
  });
});
