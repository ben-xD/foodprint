const express = require('express');
const multer = require('multer');
fs = require('fs');
const app = express();
const upload = multer()
const mockFootprints = require('./mockFootprints.json')
const vision = require('@google-cloud/vision');
const credentials = require('./carbon-7fbf76411514.json')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const MAX_LAYER = 4

app.get('/', (req, res) => {
  res.send("API for CarbonFootprint is now accessible.");
});

app.post('/picture', upload.any(), async (req, res) => {
  console.log({ req })
  if (!req.files || !req.files[0]) {
    console.log("No files found")
    return res.sendStatus(400)
  }  
  const file = req.files[0].buffer

  try {
    const client = new vision.ImageAnnotatorClient({
      credentials
    });
    const [GoogleResult] =  await client.labelDetection(file);
  } 
  catch (err) {
    console.log("Google label detection failed.")
    console.log(err)
  }  

  let ProcessedGoogleResult = [];
  for (let i = 0; i < GoogleResult.length; i++){
    ProcessedGoogleResult.push(GoogleResult[i].description.toLowerCase());
  }

  const carbonFootprint = undefined;
  if (ProcessedGoogleResult.length > 0)
    carbonFootprint = getCarbonFootprintImage(ProcessedGoogleResult)
  console.log({ carbonFootprint })
  if (!carbonFootprint) {
    return res.sendStatus(404)
  }

  res.setHeader('Content-Type', 'application/json')
  return res.send(JSON.stringify(carbonFootprint))
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Server is listening on port', port);
});

/*const getGoogleVisionResponse = (imageFile) => {
  const client = new vision.ImageAnnotatorClient();

  try {
    const client = new vision.ImageAnnotatorClient();
    const [GoogleResult] =  client.labelDetection(imageFile);
    let ProcessedGoogleResult = [];
    for (let i = 0; i < result.length; i++){
      ProcessedGoogleResult.push(GoogleResult[i].description.toLowerCase());
    }
    return ProcessedGoogleResult;
  } 
  catch (err) {
    console.log("Google label detection failed.")
    console.log(err)
  }  
}*/

const searchData = (label) => {
  if (mockFootprints[label] !== undefined) {
    console.log({ name })
    const carbonFootprint = {
      score: mockFootprints[name],
      description: labels[i].description
    }
    return carbonFootprint
  }
} 

const firstLayerSearch = (labels) => {
  for (let i = 0; i < labels.length; i++){
    if (carbonFootprint = searchData(labels[i]) != undefined)
      return carbonFootprint
  }
}

const nextLayerSearch = (labels) => {
  let nextConceptResponse = []
  for (let i = 0; i < labels.length; i++){
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", 'http://api.conceptnet.io/query?start=/c/en/' +
    labels[i] + '&rel=/r/IsA&limit=1000', false );
    xmlHttp.send( null );
    const conceptResponse = xmlHttp.responseText;
    console.log(conceptResponse)

    for (let j = 0; i < conceptResponse.length; i++){
      const concept = conceptResponse['edges'][j]['end']['label']
      carbonFootprint = searchData(concept)
      nextConceptResponse.push(concept)
      if (carbonFootprint != undefined){
        return ([], carbonFootprint)
      }
    }
  }
  return (nextConceptResponse, undefined)  
}


const getCarbonFootprintImage = (labels) => {
  //let labels = getGoogleVisionResponse(image);
  console.log({ labels })
  let carbonFootprint = firstLayerSearch(labels);
  let layer = 0
  while(carbonFootprint == undefined && layer < MAX_LAYER){
    let newLabels = nextLayerSearch(labels);
    carbonFootprint = newLabels[1];
    labels = newLabels[0];
    layer++;
  }
  return carbonFootprint
}

/*
imageFile = fs.readFile('apple.jpeg', function(err, data) {
  if (err) throw err;
});
getCarbonFootprintImage(imageFile)
*/

