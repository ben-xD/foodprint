const mongoose = require('mongoose');
const config = require('../carbon-footprint/config');

let carbonSchema;

const connect = async ()  => {
  try{
    await mongoose.connect(config.dbServer, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch(error){
    handleError(error);
  }
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
