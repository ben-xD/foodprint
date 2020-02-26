const resolvers = require('../resolvers');
const rice_image = require('../carbon-footprint/tests/rice_image');

test('getCarbonFootprintFromName: Simple test with an item in the database (rice)', async () => {
  const name = 'rice';
  const actual = await resolvers.Mutation.postCorrection(null, {name});
  const expected = {product: {name: "rice"}, carbonFootprintPerKg: 1.14};
  expect(actual).toEqual(expected);
});

test('getCarbonFootprintFromImage: rice image', async() => {
  jest.setTimeout(10000)
  const file = {base64: rice_image};
  let actual = await resolvers.Mutation.postPicture(null, {file}, null);
  const expected = {product: {name: "rice"}, carbonFootprintPerKg: 1.14};
  expect(actual).toEqual(expected);
  jest.setTimeout(5000)
});

test('Query: not used for anything yet, mandatory for GraphQL', async() => {
  resolvers.Query._();
});
