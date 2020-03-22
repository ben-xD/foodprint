const vision = require('@google-cloud/vision');
const credentials = require('../credentials/carbon-7fbf76411514.json');

/**
 * Function to return descriptor labels for input image, using Google Vision API
 * Example labels at https://docs.google.com/spreadsheets/d/1MQl5HjTbkToTniYZ3w6wwPfPen9yEGbur-11XgVCIT8/edit?usp=sharing
 * @param {Buffer} image - image file buffer
 * @returns {Array} List of string labels (e.g. "coffee")
*/
const getImageLabels = async (image) => {
  // Setup Google Vision ImageAnnotatorClient
  let client;
  try {
    // Using Alba's credentials here
    client = new vision.ImageAnnotatorClient({ credentials });
  } catch (err) {
    console.log('Failed to set up Google Vision ImageAnnotatorClient.');
    console.log(err);
  }

  // Request label detection
  let googleResult;
  try {
    googleResult = await client.labelDetection(image);
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
  labels = labels.filter((element, first_index) => labels.indexOf(element) === first_index)

  return labels;
};

module.exports = getImageLabels;
