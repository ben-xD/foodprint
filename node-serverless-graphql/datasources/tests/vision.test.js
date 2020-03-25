const VisionAPI = require('../vision');
const orange_image = require('../../tests/orange_image');
const credentials = require('../../credentials/carbon-7fbf76411514.json');

let visionAPI = new VisionAPI(credentials);

test('There is an orange in the image', async () => {
  const image_buffer = new Buffer(orange_image, 'base64');
  const actual = await visionAPI.getImageLabels(image_buffer);
  expect(actual).toContain("orange");
});
