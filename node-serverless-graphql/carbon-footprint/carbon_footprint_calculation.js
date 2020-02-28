const vision = require('@google-cloud/vision');
const axios = require('axios');
const credentials = require('../credentials/carbon-7fbf76411514.json');
const mongooseQueries = require('./mongoose_queries');
const catergorisedCarbonValues = require("./categorisedCarbonValues.json");
const nlp = require('compromise');
const MAX_LENGTH_OF_NEXT_LAYER = 5;
const MAX_NUMBER_OF_CONCEPTS = 10;
// TODO modify into generator/yield

// Function that tries to find a label in the DB.
// @return cabonpkilo (if found) or undefined (if not found)
const searchData = async (label) => {
  const carbonModel = mongooseQueries.getCarbonFootprintModel();
  let itemList;
  try {
    await carbonModel.findOne({ item: label }, (err, items) => {
      if (err) {
        throw err;
      }
      itemList = items;
    }).exec();

    return itemList.carbonpkilo;

  } catch (err) {
    return undefined;
  }
};

// Function that tries to find a label in the DB of categories (cotaining items like fruit, meat, ...)
// @return CarbonFootprintReport (if found) or undefined (if not found)
const findCategorisedLabel = (labels) => {
  for (let i = 0; i < labels.length; i += 1) {
    let categoryCarbonFootprintPerKg = catergorisedCarbonValues[labels[i]]
    if (categoryCarbonFootprintPerKg) {
      return {
        item: labels[i],
        carbonFootprintPerKg: categoryCarbonFootprintPerKg,
      };
    }
    return undefined;
  }
};

// For each valid label in a list of labels (aka layer), this function tries to find it in the DB. If none of the labels
// are found in the DB, then it tries to find one in the DB of categories.
// Note that  the search is made in order (the labels are already ordered by prediction confidence by Google Vision API).
// @return CarbonFootprintReport (if a label was found in a DB) or undefined (it any label was found)
const oneLayerSearch = async (labels) => {
  for (let i = 0; i < labels.length; i += 1) {

    const nounInLabel = getNounInString(labels[i]);

    if (await isConceptValid(nounInLabel)) {
      const carbonFootprintPerKg = await searchData(nounInLabel);
      if (carbonFootprintPerKg !== undefined) {
        return {
          item: nounInLabel,
          carbonFootprintPerKg,
        };
      }
    }
  }

  categoryResult = findCategorisedLabel(labels)
  if (categoryResult != undefined) {
    return categoryResult;
  }
  return {
    item: undefined,
    carbonFootprintPerKg: undefined,
  };
};

// Given a layer, finds the "next layer", considered the list of terms matching the ConceptNet "isA" relation with
// at least one of the labels in the original layer.
// @return List of labels in the next layer
const getNextLayer = async (labels) => {
  const nextConceptResponse = [];
  for (let i = 0; i < labels.length; i += 1) {
    let conceptResponse = await axios.get(`http://api.conceptnet.io/query?start=/c/en/${labels[i]}&rel=/r/IsA&limit=${MAX_NUMBER_OF_CONCEPTS}`);
    conceptResponse = conceptResponse.data.edges;

    for (let j = 0; j < conceptResponse.length && nextConceptResponse.length < MAX_LENGTH_OF_NEXT_LAYER; j += 1) {
      const concept = conceptResponse[j].end.label;
      if (await isConceptValid(concept)) {
        nextConceptResponse.push(concept);
      }
    }
  }

  removeDuplicates(nextConceptResponse);
  return nextConceptResponse;
};

// Parses a ConceptNet response to a list of labels.
const getLabelsFromResponse = (conceptResponse) => {
  conceptResponse = conceptResponse.data.edges
  const labels = [];
  for (let i = 0; i < conceptResponse.length; i++) {
    labels.push(conceptResponse[i].end.label);
  }
  return labels;
};

//  Deletes the adjetives in a string
const getNounInString = (label) => {
  if (label.split(" ").length <= 1) {
    return label;
  }
  let nounsArray = nlp(label).nouns().out('array');
  return nounsArray[0];
}


// Assess if a concept is valid by checking if it is related to food (this is done making use of
// ConceptNet relations).
const isConceptValid = async (concept) => {
  if (concept.split(" ").length > 1) {
    return false;
  }

  let isAResponse = await axios.get(`http://api.conceptnet.io/query?start=/c/en/${concept}&rel=/r/IsA&limit=${MAX_NUMBER_OF_CONCEPTS}`);
  isA = getLabelsFromResponse(isAResponse);
  if (isA.includes("food") || isA.includes("a food") || isA.includes("fruit") || isA.includes("edible fruit")) {
    return true;
  }

  let usedForResponse = await axios.get(`http://api.conceptnet.io/query?start=/c/en/${concept}&rel=/r/UsedFor&limit=${MAX_NUMBER_OF_CONCEPTS}`);
  usedFor = getLabelsFromResponse(usedForResponse);
  if (usedFor.includes("eating")) {
    return true;
  }

  let RelatedTermsResponse = await axios.get(`http://api.conceptnet.io/query?start=/c/en/${concept}&rel=/r/RelatedTo&limit=${MAX_NUMBER_OF_CONCEPTS}`);
  RelatedTerms = getLabelsFromResponse(RelatedTermsResponse);
  if (RelatedTerms.includes("food")) {
    return true;
  }

  return false;
};

// Removes the duplicate labels in a list
const removeDuplicates = (labels) => {
  return labels.filter((a, b) => labels.indexOf(a) === b);
};

// Sends a given image to Google Vision API and returns the labels found.
// Go to https://docs.google.com/spreadsheets/d/1MQl5HjTbkToTniYZ3w6wwPfPen9yEGbur-11XgVCIT8/edit?usp=sharing
// to see some examples.
// @return List of unique label descriptions (e.g. "coffee")
const getImageLabels = async (image) => {
  let GoogleResult = [];
  try {
    // Using alba's credentials here
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
  removeDuplicates(processedAnnotations);
  return processedAnnotations;
};

// ****************************************************************
//             MAIN FUNCTION FOR POSTPICTURE REQUESTS
// ****************************************************************
// Given an image,
// 1. Calls the Google Vision API to get the labels in the image (getImageLabels)
// 2. Tries to find a label in the DB or in the categories DB (oneLayerSearch)
// 3. Finds the related concepts to the name (getNextLayer)
// 4. Tries to find a related concept in the DB or in the categories DB (oneLayerSearch)
// @return CarbonFootprintReport (carbonFootprintPerKg is undefined if all the searches failed)

const getCarbonFootprintFromImage = async (image) => {
  // Get image labels from Google Vision API
  const imageLabels = await getImageLabels(image);

  return getCarbonFootprint(imageLabels);
};

// ****************************************************************
//         MAIN FUNCTION FOR POSTCORRECTION REQUESTS
// ****************************************************************
// Given a name of a product,
// 1. Tries to find the name in the DB or in the categories DB (oneLayerSearch)
// 2. Finds the related concepts to the name (getNextLayer)
// 3. Tries to find a related concept in the DB or in the categories DB (oneLayerSearch)
// @return CarbonFootprintReport (carbonFootprintPerKg is undefined if all the searches failed)

const getCarbonFootprintFromName = async (name) => {
  return getCarbonFootprint([name.toLowerCase()]);
}

const getCarbonFootprint = async (labels) => {
  mongooseQueries.connect();

  // Attempt to find the google vision labels in the database:
  const firstResponse = await oneLayerSearch(labels);
  if (firstResponse.item) {
    mongooseQueries.disconnect();
    return firstResponse;
  }

  // Call ConceptNet to create the next layer:
  const nextLabels = await getNextLayer(labels);

  // Attempt to find the next layer labels in the database:
  const nextResponse = await oneLayerSearch(nextLabels);
  if (nextResponse.item) {
    mongooseQueries.disconnect();
    return nextResponse;
  }

  mongooseQueries.disconnect();
  return {
    item: labels[0],
    carbonFootprintPerKg: undefined,
  };
};

module.exports = { getCarbonFootprintFromImage, getCarbonFootprintFromName };
