fs = require('fs');
const mockFootprints = require('./mockFootprints.json');
const vision = require('@google-cloud/vision');
const credentials = require('./carbon-7fbf76411514.json');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const MAX_LAYER = 4;

const searchData = (label) => {
  // TODO: replace mockFootprints with a db call
  if (mockFootprints[label] !== undefined) {
    return {
      score: mockFootprints[label],
      description: label,
    }
  }
};

const firstLayerSearch = (labels) => {
  for (let i = 0; i < labels.length; i++) {
    let carbonFootprint = searchData(labels[i]);
    if (carbonFootprint !== undefined)
      return carbonFootprint;
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
  return ([nextConceptResponse, undefined])
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
  let ProcessedGoogleResult = [];
  for (let i = 0; i < GoogleResult.length; i++) {
    ProcessedGoogleResult.push(GoogleResult[i].description.toLowerCase());
  }
  return ProcessedGoogleResult; // list of labels
};

// Main
const getCarbonFootprintFromImage = async (image) => {
  // Get image labels from Google Vision API
  let imageLabels = await getImageLabels(image);
  console.log({imageLabels});
  // Attempt to find the labels in the database
  let carbonFootprint = firstLayerSearch(imageLabels);
  let layer = 0;
  while (carbonFootprint === undefined && layer < MAX_LAYER) {
    // Call ConceptNet
    let newLabels = nextLayerSearch(imageLabels);
    carbonFootprint = newLabels[1];
    imageLabels = newLabels[0];
    layer++;
  }
  return carbonFootprint
};

module.exports = getCarbonFootprintFromImage;


