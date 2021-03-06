const nlp = require('compromise');
const pluralize = require('pluralize')
const MAX_LENGTH_OF_NEXT_LAYER = 5;


// For each valid label in a list of labels (aka layer), this function tries to find it in the DB. If none of the labels
// are found in the DB, then it tries to find one in the DB of categories.
// Note that  the search is made in order (the labels are already ordered by prediction confidence by Google Vision API).
// @return CarbonFootprintReport (if a label was found in a DB) or null (it any label was found)
const oneLayerSearch = async (dataSources, labels) => {

  const carbonFootprintResponse = await dataSources.carbonAPI.getCfMultipleItems(labels);
  if (carbonFootprintResponse.length > 0 && carbonFootprintResponse[0].carbonpkilo != null) {
    return {
      item: carbonFootprintResponse[0].item,
      carbonpkilo: carbonFootprintResponse[0].carbonpkilo,
      categories: carbonFootprintResponse[0].categories
    };
  }

  const categoryResult = await dataSources.carbonAPI.findCategorisedLabel(labels)
  if (categoryResult != null) {
    return categoryResult;
  }
  return {
    item: null,
    carbonpkilo: null,
  };
};


// Given a layer, finds the "next layer", considered the list of terms matching the ConceptNet "isA" relation with
// at least one of the labels in the original layer.
// @return List of labels in the next layer
const getNextLayer = async (dataSources, labels) => {
  const nextConceptResponse = [];
  for (let i = 0; i < labels.length; i += 1) {
    let conceptResponse = await dataSources.conceptAPI.getConceptResponse(labels[i]);
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

const splitLabelInWords = (label) => {
  let labelSplit = label.split(" ");

  // Removes any "" included as a word:
  let index = labelSplit.indexOf("");
  while (index !== -1) {
    labelSplit.splice(index, 1);
    index = labelSplit.indexOf("");
  }
  return labelSplit;
}

const getNounsInLabels = (labels) => {
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
        for (let j = 0; j < nounsArray.length; j++) {
          allNounsInString += nounsArray[j] + " ";
          nounLabels.push(nounsArray[j]);
        }
        allNounsInString = allNounsInString.substring(0, allNounsInString.length - 1); // To remove the last " "
        nounLabels.splice(i, 0, allNounsInString);
      }

      // When there is only one noun in the array:
      if (nounsArray.length == 1 && nounsArray[0] != '') {
        nounLabels.push(nounsArray[0]);
      }
    }

    // If there isn't any noun, the last word is mantained:
    if (nounLabels.length == 0) {
      nounLabels.push(labelSplit[labelSplit.length - 1]);
    }
  }
  return nounLabels;
}

//
const singularize = (name) => {
  return pluralize.singular(name);
};


// Assess if a concept is valid by checking if it is related to food (this is done making use of
// ConceptNet relations).
const isConceptValid = async (dataSources, concept) => {
  if (concept.split(" ").length > 1) {
    return false;
  }

  let isAResponse = await dataSources.conceptAPI.getConceptResponse(concept);
  isA = getLabelsFromResponse(isAResponse);
  if (isA.includes("food") || isA.includes("a food") || isA.includes("fruit") || isA.includes("edible fruit")) {
    return true;
  }

  let usedForResponse = await dataSources.conceptAPI.usedForResponse(concept);
  usedFor = getLabelsFromResponse(usedForResponse);
  if (usedFor.includes("eating")) {
    return true;
  }

  let RelatedTermsResponse = await dataSources.conceptAPI.getReletedTerms(concept);
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
// @return CarbonFootprintReport (carbonFootprintPerKg is null if all the searches failed)

const getCarbonFootprintFromImage = async (dataSources, image) => {
  // Get image labels from Google Vision API
  let imageLabels = await dataSources.visionAPI.getImageLabels(image);
  imageLabels = getNounsInLabels(imageLabels);

  // Attempt to find the google vision labels in the database:
  const firstResponse = await oneLayerSearch(dataSources, imageLabels);
  if (firstResponse.item) {
    console.log(firstResponse);
    return {
      item: firstResponse.item,
      carbonFootprintPerKg: firstResponse.carbonpkilo
    }
  }

  // Call ConceptNet to create the next layer:
  const nextLabels = await getNextLayer(dataSources, imageLabels);

  // Attempt to find the next layer labels in the database:
  const nextResponse = await oneLayerSearch(dataSources, nextLabels);
  if (nextResponse.item) {
    return {
      item: nextResponse.item,
      carbonFootprintPerKg: nextResponse.carbonpkilo
    };
  }

  return {
    item: null,
    carbonFootprintPerKg: null,
  };
};



// ****************************************************************
//         MAIN FUNCTION FOR POSTCORRECTION REQUESTS
// ****************************************************************
// Given a name of a product,
// 1. Tries to find the name in the DB or in the categories DB (oneLayerSearch)
// 2. Finds the related concepts to the name (getNextLayer)
// 3. Tries to find a related concept in the DB or in the categories DB (oneLayerSearch)
// @return CarbonFootprintReport (carbonFootprintPerKg is null if all the searches failed)

const getCarbonFootprintFromName = async (dataSources, name) => {
  // Preprocess the name (to singular and lower case):
  name = name.toLowerCase();
  name = singularize(name);
  // Set array of name only for labels:
  let labels = [name];
  labels = getNounsInLabels(labels);

  // Attempt to find the google vision labels in the database:
  const firstResponse = await oneLayerSearch(dataSources, labels);
  if (firstResponse.item) {
    return {
      item: firstResponse.item,
      carbonFootprintPerKg: firstResponse.carbonpkilo
    };
  }

  // Call ConceptNet to create the next layer:
  let nextLabels = await getNextLayer(dataSources, labels);

  // Attempt to find the next layer labels in the database:
  const nextResponse = await oneLayerSearch(dataSources, nextLabels);
  if (nextResponse.item) {
    console.log(nextResponse);

    // Clearly, the product was not in the db previousle, therefore add it now.
    const save_to_db = {
      item: name,
      carbonpkilo: nextResponse.carbonpkilo,
      categories: nextResponse.categories, //CHNANGE HERE TO A FUNC WHICH CAN DECIDE ON THE PROPER CATEGORY!!!!
      label: "approximated from product " + nextResponse.item
    };
    
    try {
      await dataSources.carbonAPI.insert_in_DB(save_to_db);
      }  catch(e) {
      switch(e.code){
          case 11000: console.log("Item ", name, " already in db"); break;
          default: console.log(e)
      }
    };

    return {
      item: name,
      carbonFootprintPerKg: nextResponse.carbonpkilo
    };
  }

  return {
    item: null,
    carbonFootprintPerKg: null,
  };
};

// This function is being used for calcualte_carbon_from_recipe.js, it is needed b/c calcualte_carbon_from_recipe.js
// needs to receive categories as well.
const getCarbonFootprintFromNameUsedForRecipe = async (dataSources, name) => {
  // Preprocess the name (to singular and lower case):
  name = name.toLowerCase();
  name = singularize(name);
  // Set array of name only for labels:
  let labels = [name];
  labels = getNounsInLabels(labels);

  // Attempt to find the google vision labels in the database:
  const firstResponse = await oneLayerSearch(dataSources, labels);
  if (firstResponse.item) {
    return {
      item: firstResponse.item,
      carbonFootprintPerKg: firstResponse.carbonpkilo,
      categories: firstResponse.categories,
    };
  }

  // Call ConceptNet to create the next layer:
  let nextLabels = await getNextLayer(dataSources, labels);

  // Attempt to find the next layer labels in the database:
  const nextResponse = await oneLayerSearch(dataSources, nextLabels);
  if (nextResponse.item) {
    console.log(nextResponse);

    // Clearly, the product was not in the db previousle, therefore add it now.
    const save_to_db = {
      item: name,
      carbonpkilo: nextResponse.carbonpkilo,
      categories: nextResponse.categories, //CHNANGE HERE TO A FUNC WHICH CAN DECIDE ON THE PROPER CATEGORY!!!!
      label: "approximated from product " + nextResponse.item
    };

    try {
      await dataSources.carbonAPI.insert_in_DB(save_to_db);
      }  catch(e) {
      switch(e.code){
          case 11000: console.log("Item ", name, " already in db"); break;
          default: console.log(e)
      }
    };

    return {
      item: name,
      carbonFootprintPerKg: nextResponse.carbonpkilo,
      categories: nextResponse.categories,
    };
  }

  return {
    item: null,
    carbonFootprintPerKg: null,
    categories: null,
  };
};

module.exports = { getCarbonFootprintFromImage, getCarbonFootprintFromName, singularize, getCarbonFootprintFromNameUsedForRecipe};