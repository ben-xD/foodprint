const axios = require('axios');
const getImageLabels = require('../google_vision')
const CarbonAPI = require('../datasources/carbon');
const catergorisedCarbonValues = require("./categorisedCarbonValues.json");
const nlp = require('compromise');
const pluralize = require('pluralize')
const MAX_LENGTH_OF_NEXT_LAYER = 5;
const MAX_NUMBER_OF_CONCEPTS = 10;
// TODO modify into generator/yield

// Function that tries to find a label in the DB.
// @return cabonpkilo (if found) or undefined (if not found)
const searchData = async (label) => {
  const carbonModel = CarbonAPI.getCarbonFootprintModel();
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
    let carbonFootprintPerKg = catergorisedCarbonValues[labels[i]];
    if(carbonFootprintPerKg){
      return {
        item: labels[i],
        carbonFootprintPerKg,
      };
    }
  }
  return undefined;
};

// For each valid label in a list of labels (aka layer), this function tries to find it in the DB. If none of the labels
// are found in the DB, then it tries to find one in the DB of categories.
// Note that  the search is made in order (the labels are already ordered by prediction confidence by Google Vision API).
// @return CarbonFootprintReport (if a label was found in a DB) or undefined (it any label was found)
const oneLayerSearch = async (labels) => {

  for (let i = 0; i < labels.length; i += 1) {
    nounInLabel = labels[i];
    if (await isConceptValid(nounInLabel)){
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
    let conceptResponse = await axios.get(`http://api.conceptnet.io/query?start=/c/en/${labels[i]}&rel=/r/IsA&limit=${MAX_NUMBER_OF_CONCEPTS}&end=/c/en`);
    conceptResponse = conceptResponse.data.edges;

    for (let j = 0; j < conceptResponse.length && nextConceptResponse.length < MAX_LENGTH_OF_NEXT_LAYER; j += 1) {
      const concept = conceptResponse[j].end.label;
      nextConceptResponse.push(concept);
    }
  }

  removeDuplicates(nextConceptResponse);
  return nextConceptResponse;
};

// Parses a ConceptNet response to a list of labels, if they are in English
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
  return nounsArray;
}

const splitLabelInWords = (label) =>  {
  let labelSplit = label.split(" ");

  // Removes any "" included as a word:
  let index = labelSplit.indexOf("");
  while (index !== -1){
    labelSplit.splice(index, 1);
    index = labelSplit.indexOf("");
  }
  return labelSplit;
}

const getNounsInLabels = (labels) => {
  let nounLabels = [];
  for (let i = 0; i < labels.length; i++) {
    let label = labels[i];
    let labelSplit = splitLabelInWords(label);

    if (labelSplit.length > 1) {
      let nounsArray = nlp(label).nouns().out('string');
      nounsArray = splitLabelInWords(nounsArray);

      // When there are more than one noun:
      if (nounsArray.length > 1) {
        let allNounsInString = "" // String to concatenate all the nouns
        for (let j = 0; j < nounsArray.length; j++){
          allNounsInString += nounsArray[j] + " ";
          nounLabels.push(nounsArray[j]);
        }
        allNounsInString = allNounsInString.substring(0, allNounsInString.length - 1); // To remove the last " "
        nounLabels.splice(i, 0, allNounsInString);
      }

      // When there is only one noun in the array:
      if (nounsArray.length == 1 && nounsArray[0]!= '') {
        nounLabels.push(nounsArray[0]);
      }
    }

    // If there isn't any noun, the last word is mantained:
    if  (nounLabels.length == 0){
      nounLabels.push(labelSplit[labelSplit.length - 1]);
    }
  }
  return nounLabels;
}

//
const singularize = (name) => {
  return pluralize.singular(name);
};


// Assess if a concept is valid by checking if it is related to food (this is done making use of
// ConceptNet relations).
const isConceptValid = async (concept) => {
  if (concept.split(" ").length > 1) {
    return false;
  }

  let isAResponse = await axios.get(`http://api.conceptnet.io/query?start=/c/en/${concept}&rel=/r/IsA&limit=${MAX_NUMBER_OF_CONCEPTS}&end=/c/en`);
  isA = getLabelsFromResponse(isAResponse);
  if (isA.includes("food") || isA.includes("a food") || isA.includes("fruit") || isA.includes("edible fruit")) {
    return true;
  }

  let usedForResponse = await axios.get(`http://api.conceptnet.io/query?start=/c/en/${concept}&rel=/r/UsedFor&limit=${MAX_NUMBER_OF_CONCEPTS}&end=/c/en`);
  usedFor = getLabelsFromResponse(usedForResponse);
  if (usedFor.includes("eating")) {
    return true;
  }

  let RelatedTermsResponse = await axios.get(`http://api.conceptnet.io/query?start=/c/en/${concept}&rel=/r/RelatedTo&limit=${MAX_NUMBER_OF_CONCEPTS}&end=/c/en`);
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

  CarbonAPI.connect();

  // Attempt to find the google vision labels in the database:
  const firstResponse= await oneLayerSearch(imageLabels);
  if (firstResponse.item) {
    CarbonAPI.disconnect();
    return firstResponse;
  }

  // Call ConceptNet to create the next layer:
  const nextLabels = await getNextLayer(imageLabels);

  // Attempt to find the next layer labels in the database:
  const nextResponse = await oneLayerSearch(nextLabels);
  if (nextResponse.item) {
    CarbonAPI.disconnect();
    return nextResponse;
  }

  CarbonAPI.disconnect();
  return {
    item: imageLabels[0],
    carbonFootprintPerKg: undefined,
  };
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
  CarbonAPI.connect();
  // Preprocess the name (to singular and lower case):
  name = name.toLowerCase();
  name = singularize(name);
  // Set array of name only for labels:
  let labels = [name];
  labels = getNounsInLabels(labels);

  // Attempt to find the google vision labels in the database:
  const firstResponse = await oneLayerSearch(labels);
  if (firstResponse.item) {
    CarbonAPI.disconnect();
    return firstResponse;
  }

  // Call ConceptNet to create the next layer:
  let nextLabels = await getNextLayer(labels);

  // Attempt to find the next layer labels in the database:
  const nextResponse = await oneLayerSearch(nextLabels);
  if (nextResponse.item) {
    CarbonAPI.disconnect();
    return nextResponse;
  }

  CarbonAPI.disconnect();
  return {
    item: labels[0],
    carbonFootprintPerKg: undefined,
  };
};


module.exports = { getCarbonFootprintFromImage, getCarbonFootprintFromName};
