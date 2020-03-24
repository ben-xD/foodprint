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

  async getCarbonFootprintModel () {
    if(!this._carbonSchema){
      this._carbonSchema = new mongoose.Schema({
        item: String,
        carbonpkilo: Number,
        categories: String,
        label: String
      }, {collection: 'carbon'});
    }

    return mongoose.model('Carbon', this._carbonSchema);
  }

  async insert_in_DB (new_data) {

    const carbonModel = await this.getCarbonFootprintModel();
    console.log(carbonModel);
    carbonModel.collection.insert(new_data, function(err, docs){
      if(err){
        return console.error(err);
      } else {
        console.log("Document inserted into the carbon collection");
      }
    });
  }

  // Search database for given label and return its carbon footprint
  async searchData(label) {

    const carbonModel = await this.getCarbonFootprintModel();
    let itemList;
    try {
      await carbonModel.findOne({item: label}, (err, items) => {
        if (err) {
          throw err;
        }
        itemList = items;
      }).exec();

      return {
        carbonpkilo: itemList.carbonpkilo,
        categories: itemList.categories
      }

    } catch (err) {
      return {
        carbonpkilo: undefined,
        categories: undefined
      };
    }
  }

}

module.exports = CarbonAPI;
