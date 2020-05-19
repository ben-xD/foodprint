const vision = require('@google-cloud/vision');

class VisionAPI {
  constructor() {
    this.getImageLabels = this.getImageLabels.bind(this);

    // Setup Google Vision ImageAnnotatorClient
    try {
      this.client = new vision.ImageAnnotatorClient();
      console.log('VisionAPI: connected to Google Vision.')
    } catch (err) {
      console.error('Failed to set up Google Vision ImageAnnotatorClient.');
      console.error(err);
    }
  }

  /**
   * Method to return descriptor labels for input image, using Google Vision API
   * Example labels at https://docs.google.com/spreadsheets/d/1MQl5HjTbkToTniYZ3w6wwPfPen9yEGbur-11XgVCIT8/edit?usp=sharing
   * @param {Buffer} image - image file buffer
   * @returns {Array} List of string labels (e.g. "coffee")
   */
  async getImageLabels(image) {

    // Request label detection
    let googleResult;
    try {
      googleResult = await this.client.labelDetection(image);
    } catch (err) {
      console.log('Google Vision labelDetection failed.');
      console.log(err);
    }

    // Get labelAnnotations from Google result
    const { labelAnnotations } = googleResult[0];

    // Store lower case label descriptions in array
    let labels = [];
    for (let i = 0; i < labelAnnotations.length; i++) {
      labels.push(labelAnnotations[i].description.toLowerCase())
    }

    // Remove duplicates and return
    labels = labels.filter((element, first_index) => labels.indexOf(element) === first_index);

    return labels;
  }

}

const VisionAPIInstance = new VisionAPI();

module.exports = VisionAPI;
