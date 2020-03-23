const mongoose = require('mongoose');
const config = require('../carbon-footprint/config');

class CarbonAPI {

  constructor() {
    this._carbonSchema;
    this.searchData = this.searchData.bind(this);
    this.connect();
  }

  async connect() {
    try {
      await mongoose.connect(config.dbServer, {useNewUrlParser: true, useUnifiedTopology: true});
      console.log("Carbon API: database connected.")
    } catch (error) {
      console.error("Carbon API: DATABASE FAILED TO CONNECT", error);
    }
  }

  async disconnect() {
    mongoose.disconnect((err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  // Search database for given label and return its carbon footprint
  async searchData(label) {

    const getCarbonFootprintModel = () => {
      if (!this._carbonSchema) {
        this._carbonSchema = new mongoose.Schema({
          item: String,
          carbonpkilo: Number,
        }, {collection: 'carbon'});
      }

      return mongoose.model('Carbon', this._carbonSchema);
    }

    const carbonModel = getCarbonFootprintModel();
    let itemList;
    try {
      await carbonModel.findOne({item: label}, (err, items) => {
        if (err) {
          throw err;
        }
        itemList = items;
      }).exec();

      return itemList.carbonpkilo;

    } catch (err) {
      return undefined;
    }
  }

}

module.exports = CarbonAPI;
