fs = require('fs');
const vision = require('@google-cloud/vision');
const credentials = require('./carbon-7fbf76411514.json');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const config = require('./config');
const CarbonModel = require('./mongoose_queries');

const searchData = async (label) => {
  let itemList;
  await CarbonModel.findOne({item: label}, (err, items) => {
    itemList = items;
  }).exec();
  if (itemList === null) {
    return undefined;
  }
  return itemList.carbonpkilo;
};

const firstLayerSearch = async (labels) => {
  for (let i = 0; i < labels.length; i++) {
    labels[i] = 'rice'; // TODO Demo only -- Remove hard-coding
    let carbonFootprintPerKg = await searchData(labels[i]);
    if (carbonFootprintPerKg !== undefined)
      return [labels[i], carbonFootprintPerKg];
  }
};

const nextLayerSearch = (labels) => {
  let nextConceptResponse = [];
  for (let i = 0; i < labels.length; i++) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'http://api.conceptnet.io/query?start=/c/en/' +
      labels[i] + '&rel=/r/IsA&limit=1000', false);
    xmlHttp.send(null);
    const conceptResponse = xmlHttp.responseText;
    console.log(conceptResponse);

    for (let j = 0; i < conceptResponse.length; i++) {
      const concept = conceptResponse['edges'][j]['end']['label'];
      let carbonFootprint = searchData(concept);
      nextConceptResponse.push(concept);
      if (carbonFootprint !== undefined) {
        return ([[], carbonFootprint])
      }
    }
  }
  return [nextConceptResponse, undefined]
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
  // TODO -- Debugging of below needed
  // while (carbonFootprint === undefined && layer < config.MAX_LAYER) {
  //   // Call ConceptNet
  //   let newLabels = await nextLayerSearch(imageLabels);
  //   carbonFootprint = await newLabels[1];
  //   imageLabels = newLabels[0];
  //   layer++;
  // }
  return [item, carbonFootprintPerKg]
};

module.exports = getCarbonFootprintFromImage;


