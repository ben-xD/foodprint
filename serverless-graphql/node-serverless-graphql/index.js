const express = require('express');
const multer = require('multer')
const app = express();
const upload = multer()

app.get('/', (req, res) => {
  console.log('Hello world received a request.');

  const target = process.env.TARGET || 'Animal';
  res.send(`Hello ${target}!`);
});

app.post('/picture', upload.any(), (req, res) => {
  console.log(req)
  // run python script on req.files[0].buffer
  res.send("24")
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Hello world listening on port', port);
});