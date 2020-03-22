const getImageLabels = require('../vision')
const orange_image = require('../../tests/orange_image')

test('', async () => {
  const image_buffer = new Buffer(orange_image, 'base64');
  const actual = await getImageLabels(image_buffer);
  expect(actual).toContain("orange");
});
