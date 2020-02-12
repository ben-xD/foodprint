const config = require('./config');

const mongoose = require('mongoose');
mongoose.connect(config.dbServer, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

const carbonSchema = new mongoose.Schema({
  item: String,
  carbonpkilo: Number
}, {collection: 'carbon'});

const CarbonModel = mongoose.model('Carbon', carbonSchema);

module.exports = CarbonModel;

// Example query
// CarbonModel.findOne({item: /fish/}, (err, items) => {
//   console.log(items.carbonpkilo)
// });
