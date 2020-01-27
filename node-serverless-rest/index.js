const express = require('express');
const multer = require('multer')
const app = express();
const upload = multer()
const mockFootprints = require('./mockFootprints.json')
const vision = require('@google-cloud/vision');

const MAX_TRY = 10

app.get('/', (req, res) => {
  res.send("API for CarbonFootprint is now accessible.");
});

app.post('/picture', upload.any(), async (req, res) => {
  // TODO check to see if buffer exists. if not res.sendStatus(400) immediately
  if (!req.files || !req.files[0]) {
    return res.sendStatus(400)
  }
  const file = req.files[0].buffer

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file
  let labels;
  try {
    const [result] = await client.labelDetection(file);
    labels = result.labelAnnotations;
  } catch (err) {
    console.log("Google label detection failed.")
    console.log(err)
  }

  const carbonFootprint = getCarbonFootprint(labels)
  console.log({ carbonFootprint })
  if (!carbonFootprint) {
    // TODO change this from 
    return res.sendStatus(404)
  }

  res.setHeader('Content-Type', 'application/json')
  return res.send(JSON.stringify(carbonFootprint))
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Server is listening on port', port);
});

const getCarbonFootprint = (labels) => {
  console.log({ labels })
  for (let i = 0; i < MAX_TRY; i++) {
    const name = labels[i].description.toLowerCase()
    if (mockFootprints[name] !== undefined) {
      console.log({ name })
      const carbonFootprint = {
        score: mockFootprints[name],
        description: labels[i].description
      }
      return carbonFootprint
    }
  }
  return null
}