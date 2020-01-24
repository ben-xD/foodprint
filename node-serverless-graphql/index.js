const express = require('express');
const multer = require('multer')
const app = express();
const upload = multer()
const mockFootprints = require('./mockFootprints.json')
const vision = require('@google-cloud/vision');

const MAX_TRY = 4

app.get('/', (req, res) => {
  console.log({ mockFootprints })
  res.send("API for CarbonFootprint is now accessible.");
});

app.post('/picture', upload.any(), async (req, res) => {
  // TODO check to see if buffer exists. if not res.sendStatus(400) immediately
  if (req.files === undefined) {
    res.sendStatus(400)
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
    console.error(err)
  }

  const carbonFootprint = getCarbonFootprint(labels)
  console.log({ carbonFootprint })
  if (!carbonFootprint) {
    return res.sendStatus(400)
  }

  return res.send(carbonFootprint.toString())

})

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Hello world listening on port', port);
});

console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS)

const getCarbonFootprint = (labels) => {
  console.log(labels)
  for (let i = 0; i < MAX_TRY; i++) {
    const name = labels[i].description.toLowerCase()
    console.log(labels[i].description)
    if (mockFootprints[name] !== undefined) {
      return mockFootprints[name]
    }
  }
  return null
}