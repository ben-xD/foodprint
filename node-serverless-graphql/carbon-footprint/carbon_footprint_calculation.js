const vision = require('@google-cloud/vision');
const axios = require('axios');
const credentials = require('./carbon-7fbf76411514.json');
const config = require('./config');
const mongooseQueries = require('./mongoose_queries');

const searchData = async (label) => {
  mongooseQueries.connect();
  const carbonModel = mongooseQueries.getCarbonFootprintModel();
  let itemList;
  await carbonModel.findOne({ item: label }, (err, items) => {
    itemList = items;
  }).exec();
  console.log({ itemList });
  return itemList.carbonpkilo;
};

const firstLayerSearch = async (labels) => {
  for (let i = 0; i < labels.length; i++) {
    const carbonFootprintPerKg = await searchData(labels[i]);
    if (carbonFootprintPerKg !== undefined) { return [labels[i], carbonFootprintPerKg]; }
  }
  return [undefined, undefined];
};

const nextLayerSearch = async (labels) => {
  const nextConceptResponse = [];
  for (let i = 0; i < labels.length; i++) {
    let conceptResponse = await axios.get(`http://api.conceptnet.io/query?start=/c/en/${labels[i]}&rel=/r/IsA&limit=1000`);
    conceptResponse = conceptResponse.data.edges;

    for (let j = 0; j < conceptResponse.length; j++) {
      const concept = conceptResponse[j].end.label;
      const carbonFootprint = await searchData(concept);
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
      credentials,
    });
    [GoogleResult] = await client.labelDetection(image);
  } catch (err) {
    console.log('Google label detection failed.');
    console.log(err);
  }
  const { labelAnnotations } = GoogleResult; // Array of annotations
  const processedAnnotations = [];
  for (let i = 0; i < labelAnnotations.length; i++) {
    processedAnnotations.push(labelAnnotations[i].description.toLowerCase());
  }
  return processedAnnotations; // List of label descriptions (e.g. "coffee")
};


// Main
const getCarbonFootprintFromImage = async (image) => {
  // Get image labels from Google Vision API
  const imageLabels = await getImageLabels(image);
  // Attempt to find the labels in the database
  let [item, carbonFootprintPerKg] = await firstLayerSearch(imageLabels);
  let layer = 0;
  let newLabels = [];
  while (carbonFootprintPerKg === undefined && layer < config.MAX_LAYER) {
    // Call ConceptNet
    [newLabels, item, carbonFootprintPerKg] = await nextLayerSearch(imageLabels);
    layer += 1;
  }
  return [item, carbonFootprintPerKg];
};

module.exports = getCarbonFootprintFromImage;
