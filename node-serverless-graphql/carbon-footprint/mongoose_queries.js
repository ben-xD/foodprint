const mongoose = require('mongoose');
const config = require('./config');

let carbonSchema;

const connect = () => {
  mongoose.connect(config.dbServer, { useNewUrlParser: true, useUnifiedTopology: true });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    // we're connected!
  });
};

const getCarbonFootprintModel = () => {
  if (!carbonSchema) {
    carbonSchema = new mongoose.Schema({
      item: String,
      carbonpkilo: Number,
    }, { collection: 'carbon' });
  }

  return mongoose.model('Carbon', carbonSchema);
};

const disconnect = () => {
  mongoose.disconnect((err) => {
    if (err) {
      console.error(err);
    }
  });
};

module.exports = { connect, disconnect, getCarbonFootprintModel };
