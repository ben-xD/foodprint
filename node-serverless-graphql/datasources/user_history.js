const mongoose = require('mongoose');
const config = require('../carbon-footprint/config');

class CarbonAPI {

  constructor() {
    this._hystorySchema;
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

  async getUserHistorytModel () {
    if(!this._hystorySchema){
      this._hystorySchema = new mongoose.Schema({
        user_id: String,
        item: Number,
        time_stamp: Date,
      }, {collection: 'user-history'});
    }

    return mongoose.model('user-history', this._hystorySchema);
  }

  async insert_in_DB (new_data) {

    const historyModel = await this.getUserHistorytModel();
    console.log(historyModel);
    historyModel.collection.insert(new_data, function(err, docs){
      if(err){
        return console.error(err);
      } else {
        console.log("Document inserted into the user history collection");
      }
    });
  }

  // Search database for given label and return its carbon footprint
  async searchData(user_id) {

    const historyModel = await this.getUserHistorytModel();
    let itemList;
    try {
      await historyModel.findOne({user_id: user_id}, (err, items) => {
        if (err) {
          throw err;
        }
        itemList = items;
      }).exec();

      return {
        item: itemList.item,
        time_stamp: itemList.time_stamp
      }

    } catch (err) {
      return {
        item: undefined,
        time_stamp: undefined
      };
    }
  }

}

module.exports = CarbonAPI;
