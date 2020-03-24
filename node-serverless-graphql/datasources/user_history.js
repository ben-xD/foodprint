const mongoose = require('mongoose');
const config = require('../carbon-footprint/config');

class userHistory {

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
        item: String,
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

  // Search database for all products consumed by a user
  async get_all_user_data (user) {

    const carbonModel = await this.getUserHistorytModel();
    let user_data;
    try {
      await carbonModel.find({user_id: user}, (err, items) => {
        if (err) {
          throw err;
        }
        user_data = items;
      }).exec();

      return user_data;

    } catch (err) {
      return undefined;
    }

  }

  // Calculate the average co2 footprint of a user using all products added by user
  async avg_co2_for_user (carbonAPI, user) {

    const user_data = await this.get_all_user_data(user);
    let user_co2 = 0;
    let no_of_datapoints = 0;
    for (let i = 0; i < user_data.length; i++){
      let carbonResult = await carbonAPI.searchData(user_data[i].item);
      if(carbonResult.carbonpkilo !== undefined){
        user_co2 += Number(carbonResult.carbonpkilo);
        no_of_datapoints += 1;
      }
    }

    return user_co2/no_of_datapoints;

  }

};

module.exports = userHistory;
