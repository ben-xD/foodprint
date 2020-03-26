const mongoose = require('mongoose');
const config = require('../carbon-footprint/config');

class userHistory {

  constructor( store ) {
    this._hystorySchema;
    this.searchData = this.searchData.bind(this);
    this.store = store;
    this.connect();
    this.NUMBER_OF_WEEKS_RETURNED = 6;
    this.NUMBER_OF_MONTHS_RETURNED = 6;
    this.CATEGORIES = ['Plant based', 'Fish', 'Meat', 'Eggs and dairy'];
  }

  async connect() {
    if (!this.store.isConnected){
      this.store.isConnected = true;
      try {
          await mongoose.connect(config.dbServer, { useNewUrlParser: true, useUnifiedTopology: true });
          console.log("History API: database connected.")
      } catch (error) {
          console.error("History API: DATABASE FAILED TO CONNECT", error);
      }
    }
  }

  async disconnect() {
    mongoose.disconnect((err) => {
      if (err) {
        console.error(err);
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

  async getUserHistorytModel() {
    if (!this._hystorySchema) {
      this._hystorySchema = new mongoose.Schema({
        user_id: String,
        item: String,
        time_stamp: Date,
      }, {collection: 'user-history'});
    }

    return mongoose.model('user-history', this._hystorySchema);
  }

// #################################################################################
//                               Functions used in resolvers
// #################################################################################
// Add a new entry to users product list.
// Entry could look as follows:
//    user_id: "1"
//    item: "rice"
  async insert_in_DB(new_data) {

    // add the timestamp to new_data:
    new_data["time_stamp"] = new Date();

    const historyModel = await this.getUserHistorytModel();
    historyModel.collection.insert(new_data, function (err, docs) {
      if (err) {
        return console.error(err);
      } else {
        console.log("Document inserted into the user history collection");
      }
    });
  }

  // Calculate the average co2 footprint of a user using all products added by user
  async avg_co2_for_user(carbonAPI, user) {

    const user_data = await this.get_all_user_data(user);
    let average = await this.average_data(carbonAPI, user_data);
    return average;

  };

  // Calculates the average cf per week of a user
  async weekly_average_cf (carbonAPI, user, timezone) {
    
    let table = [];

    for (let i = 0; i < this.NUMBER_OF_WEEKS_RETURNED; i++){
      // Get data for every week:
      let week_i_data = await this.get_week_i_data(user, timezone, i);
      let average = await this.average_data(carbonAPI, week_i_data);
      table.push({week: -i, p_weekly_cf: average});
    }
    console.log(table);
    return table;
  };

  // Calculates the weekly composition of a user
  async weekly_cf_composition (carbonAPI, user, timezone) {

    let table = await this.create_weekly_cf_composition_table();

    for (let i = 0; i < this.NUMBER_OF_WEEKS_RETURNED; i++){
      const week_i_data = await this.get_week_i_data(user, timezone, i);
      table = await this.sum_week_data_to_table(carbonAPI, week_i_data, i, table);
    }
    console.log(table);
    return table;
  };

  // Calculates the average cf per month of a user
  async monthly_average_cf (carbonAPI, user, timezone) {

    let table = [];

    for (let i = 0; i < this.NUMBER_OF_WEEKS_RETURNED; i++){
      // Get data for every week:
      let month_i_data = await this.get_month_i_data(user, timezone, i);
      let average = await this.average_data(carbonAPI, month_i_data);
      table.push({month: -i, p_monthly_cf: average});
    }
    console.log(table);
    return table;
  };

  // Calculates the monthly composition of a user
  async monthly_cf_composition (carbonAPI, user, timezone) {

    let table = await this.create_monthly_cf_composition_table();

    for (let i = 0; i < this.NUMBER_OF_WEEKS_RETURNED; i++){
      const month_i_data = await this.get_month_i_data(user, timezone, i);
      table = await this.sum_month_data_to_table(carbonAPI, month_i_data, i, table);
    }
    console.log(table);
    return table;
  };

  // #################################################################################
  //                          Helper functions to get history data
  // #################################################################################

  // Search database for all products consumed by a user
  async get_all_user_data(user) {

    const historyModel = await this.getUserHistorytModel();
    let user_data;
    try {
      await historyModel.find({user_id: user}, (err, items) => {
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

  // Gets the data in week i starting from today
  async get_week_i_data(user, timezone, i){
    
    const today = new Date();
    const historyModel = await this.getUserHistorytModel();
    const week_i_data = await historyModel.aggregate([
      { $project: {
          week_period:{
            $subtract: [
              { $week: {$add: [today, timezone*60000*60]} }, 
              { $week: {$add: ["$time_stamp", timezone*60000*60]} }
            ]
          },
          user_id: 1,
          item: 1,
          time_stamp: 1,
        }
      },
      { $match: {
          week_period: i,
          user_id: user, 
        }
      }
    ]) 
    return week_i_data;
  };

  // Gets the data in month i starting from today
  async get_month_i_data(user, timezone, i){
    
    const today = new Date();
    const historyModel = await this.getUserHistorytModel();
    const month_i_data = await historyModel.aggregate([
      { $project: {
          month_period:{
            $subtract: [
              { $month: {$add: [today, timezone*60000*60]} }, 
              { $month: {$add: ["$time_stamp", timezone*60000*60]} }
            ]
          },
          user_id: 1,
          item: 1,
          time_stamp: 1,
        }
      },
      { $match: {
          month_period: i,
          user_id: user, 
        }
      }
    ]) 
    return month_i_data;
  };
  
  // #################################################################################
  //                   Helper functions to make calculations and formating
  // #################################################################################

  // Converts a date according to timezone
  async convert_date(date, timezone){
    
    let adjusted_date = new Date(date.getTime() + ( timezone* 60000 * 60)).toISOString();
    return adjusted_date;
  }

  // Calculates the average cf of the items in data
  async average_data(carbonAPI, data){
    
    let user_co2 = 0;
    let no_of_datapoints = 0;
    for (let i = 0; i < data.length; i++){
      let carbonResult = await carbonAPI.searchData(data[i].item);
      if(carbonResult.carbonpkilo !== undefined){
        user_co2 += Number(carbonResult.carbonpkilo);
        no_of_datapoints += 1;
      }
    }
    if (no_of_datapoints > 0){
      return user_co2 / no_of_datapoints;
    } 
    return 0
  }

  // Creates a table to store the weekly compositions
  async create_weekly_cf_composition_table() {

    // In each subtable, there are NUMBER_OF_WEEKS_RETURNED weeks
    let subtable = []
    for (let i = 0; i < this.NUMBER_OF_WEEKS_RETURNED; i++){
       subtable.push({week: -i, p_weekly_cf: 0})
    }

    // One subtable for each category:
    let table = {}
    for (let cat = 0; cat < 4; cat++){
      table[this.CATEGORIES[cat]] = JSON.parse(JSON.stringify(subtable));
    }

    return table;
  };

  // Adds the data (week_i_data) of a week to the compositions table
  async sum_week_data_to_table(carbonAPI, week_i_data, week, table){
    for (let i = 0; i < week_i_data.length; i++){ // For each item found
      let carbonResult = await carbonAPI.searchData(week_i_data[i].item);
      if(carbonResult.carbonpkilo !== undefined){ 
        const categories = carbonResult.categories.toString();
        for (let cat = 1; cat < 5; cat ++){
          if (categories.includes(cat)){
            table[this.CATEGORIES[cat-1]][week]["p_weekly_cf"] += carbonResult.carbonpkilo;
          }
        }
      }
    }
    return table;
  };

  // Creates a table to store the monthly compositions
  async create_monthly_cf_composition_table() {

    let subtable = []
    for (let i = 0; i < this.NUMBER_OF_MONTHS_RETURNED; i++){
       subtable.push({month: -i, p_monthly_cf: 0})
    }

    // one subtable for each category:
    let table = {}
    for (let cat = 0; cat < 4; cat++){
      table[this.CATEGORIES[cat]] = JSON.parse(JSON.stringify(subtable));
    } 

    return table;
  };

  // Adds the data (month_i_data) of a month to the compositions table
  async sum_month_data_to_table(carbonAPI, month_i_data, month, table){

    for (let i = 0; i < month_i_data.length; i++){ // For each item found
      let carbonResult = await carbonAPI.searchData(month_i_data[i].item);
      if(carbonResult.carbonpkilo !== undefined){ 
        const categories = carbonResult.categories.toString();

        for (let cat = 1; cat < 5; cat ++){
          if (categories.includes(cat)){
            table[this.CATEGORIES[cat-1]][month]["p_monthly_cf"] += carbonResult.carbonpkilo;
          }
        }
      }
    }
    return table;
  };

};

module.exports = userHistory;
