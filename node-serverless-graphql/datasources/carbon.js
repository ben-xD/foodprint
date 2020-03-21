const mongoose = require('mongoose');
const config = require('../carbon-footprint/config');

let carbonSchema;

class CarbonAPI {

  async connect() {
    try{
      await mongoose.connect(config.dbServer, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(error){
      handleError(error);
    }
  }

  async getCarbonFootprintModel() {
    if (!carbonSchema) {
      carbonSchema = new mongoose.Schema({
        item: String,
        carbonpkilo: Number,
      }, { collection: 'carbon' });
    }

    return mongoose.model('Carbon', carbonSchema);
  }

  async disconnect() {
    mongoose.disconnect((err) => {
      if (err) {
        console.error(err);
      }
    });
  }

}

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

// Function that tries to find a label in the DB.
// @return cabonpkilo (if found) or undefined (if not found)
const searchData = async (label) => {
  const carbonModel = getCarbonFootprintModel();
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


module.exports = { connect, disconnect, getCarbonFootprintModel, searchData };
