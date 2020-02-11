fs = require('fs');
const vision = require('@google-cloud/vision');
const credentials = require('./carbon-7fbf76411514.json');
const config = require('./config');
const axios = require('axios');
const CarbonModel = require('./mongoose_queries');

const searchData = async (label) => {
  let itemList;
  await CarbonModel.findOne({item: label}, (err, items) => {
    itemList = items;
  }).exec();
  try {
    return itemList.carbonpkilo;
  } catch (err) {
    return undefined
  }
};


const firstLayerSearch = async (labels) => {
  for (let i = 0; i < labels.length; i++) {
    let carbonFootprintPerKg = await searchData(labels[i]);
    if (carbonFootprintPerKg !== undefined)
      return [labels[i], carbonFootprintPerKg];
  }
  return [undefined, undefined]
};

const nextLayerSearch = async (labels) => {
  let nextConceptResponse = [];
  for (let i = 0; i < labels.length; i++){
    let conceptResponse = await axios.get('http://api.conceptnet.io/query?start=/c/en/' + labels[i] + '&rel=/r/IsA&limit=1000');
    conceptResponse = conceptResponse.data['edges'];

    for (let j = 0; j < conceptResponse.length; j++) {
      const concept = conceptResponse[j]['end']['label'];
      let carbonFootprint = await searchData(concept);
      nextConceptResponse.push(concept);
      if (carbonFootprint !== undefined) {
        return [[], concept, carbonFootprint];
      }
    }
  }
  return [nextConceptResponse, undefined, undefined];
};


const getImageLabels = async (image) => {
  let GoogleResult = [];
  try {
    const client = new vision.ImageAnnotatorClient({
      credentials
    });
    [GoogleResult] = await client.labelDetection(image);
  } catch (err) {
    console.log("Google label detection failed.");
    console.log(err);
  }
  const labelAnnotations = GoogleResult['labelAnnotations']; // Array of annotations
  let processedAnnotations = [];
  for (let i = 0; i < labelAnnotations.length; i++) {
    processedAnnotations.push(labelAnnotations[i].description.toLowerCase());
  }
  return processedAnnotations; // List of label descriptions (e.g. "coffee")
};

// Main
const getCarbonFootprintFromImage = async (image) => {
  // Get image labels from Google Vision API
  let imageLabels = await getImageLabels(image);
  // Attempt to find the labels in the database
  let [item, carbonFootprintPerKg] = await firstLayerSearch(imageLabels);
  let layer = 0;
  let newLabels = [];
  while (carbonFootprintPerKg === undefined && layer < config.MAX_LAYER) {
    // Call ConceptNet
    [newLabels, item, carbonFootprintPerKg] = await nextLayerSearch(imageLabels);
    layer++;
  }
  return [item, carbonFootprintPerKg]
};

const getCarbonFootprintFromName = async (name) => {
  // Set array of name only for labels
  let labels = [name.toLowerCase()];
  // Attempt to find the labels in the database
  let [item, carbonFootprintPerKg] = await firstLayerSearch(labels);
  let layer = 0;
  let newLabels = [];
  while (carbonFootprintPerKg === undefined && layer < config.MAX_LAYER) {
    // Call ConceptNet
    [newLabels, item, carbonFootprintPerKg] = await nextLayerSearch(imageLabels);
    layer++;
  }
  return [item, carbonFootprintPerKg]
};

module.exports = {getCarbonFootprintFromImage, getCarbonFootprintFromName};




