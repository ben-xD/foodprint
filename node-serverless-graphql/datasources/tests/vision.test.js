const VisionAPI = require('../vision');
const orangeImage = require('../../tests/orange_image');

const visionAPI = new VisionAPI();

describe('Real Vision API', () => {
  test('There is an orange in the image', async () => {
    const imageBuffer = new Buffer(orangeImage, 'base64');
    const actual = await visionAPI.getImageLabels(imageBuffer);
    expect(actual).toContain('orange');
  });
});
