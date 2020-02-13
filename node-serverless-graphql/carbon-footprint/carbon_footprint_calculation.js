const vision = require('@google-cloud/vision');
const axios = require('axios');
const credentials = require('../credentials/carbon-7fbf76411514.json');
const mongooseQueries = require('./mongoose_queries');

// TODO modify into generator/ yield

const searchData = async (label) => {
  mongooseQueries.connect();
  const carbonModel = mongooseQueries.getCarbonFootprintModel();
  let itemList;
  try {
    await carbonModel.findOne({ item: label }, (err, items) => {
      if (err) {
        throw err;
      }
      itemList = items;
    }).exec();
    console.log({ itemList });
    return itemList.carbonpkilo;
  } catch (err) {
    return undefined;
  }
};

const firstLayerSearch = async (labels) => {
  for (let i = 0; i < labels.length; i += 1) {
    const carbonFootprintPerKg = await searchData(labels[i]);
    if (carbonFootprintPerKg !== undefined) {
      return {
        item: labels[i],
        carbonFootprintPerKg,
      };
    }
  }
  throw Error(`Could not find any of labels ${labels} in Carbon Footprint database.`);
};

const nextLayerSearch = async (labels) => {
  const nextConceptResponse = [];
  for (let i = 0; i < labels.length; i += 1) {
    let conceptResponse = await axios.get(`http://api.conceptnet.io/query?start=/c/en/${labels[i]}&rel=/r/IsA&limit=1000`);
    conceptResponse = conceptResponse.data.edges;

    console.log({ conceptResponse });

    for (let j = 0; j < conceptResponse.length; j += 1) {
      const concept = conceptResponse[j].end.label;
      const carbonFootprint = await searchData(concept);
      nextConceptResponse.push(concept);
      if (carbonFootprint !== undefined) {
        return {
          item: concept,
          carbonFootprintPerKg: carbonFootprint,
        };
      }
    }
  }
  return {
    item: undefined,
    carbonFootprintPerKg: undefined,
  };
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


const getCarbonFootprintFromImage = async (image) => {
  // Get image labels from Google Vision API
  const imageLabels = await getImageLabels(image);

  // Attempt to find the labels in the database
  try {
    const { item, carbonFootprintPerKg } = await firstLayerSearch(imageLabels);
    return { item, carbonFootprintPerKg };
  } catch (error) {
    console.info(error);

    // Call ConceptNet
    const response = await nextLayerSearch(imageLabels);
    if (response.carbonFootprintPerKg) {
      return response;
    }
  }
  return {
    item: imageLabels[0],
    carbonFootprintPerKg: undefined,
  };
};

module.exports = getCarbonFootprintFromImage;
