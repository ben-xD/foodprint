const mongoose = require('mongoose');
const config = require('../carbon-footprint/config');
const CarbonAPI = require('./carbon');
const carbonAPI = new CarbonAPI();

class userHistory {

  constructor() {
    this._hystorySchema;
    this.searchData = this.searchData.bind(this);
    this.connect();
    this.NUMBER_OF_WEEKS_RETURNED = 10;
    this.NUMBER_OF_MONTHS_RETURNED = 12;
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

  // Add a new entry to users product list.
  // Entry could look as follows:
  //    user_id: "1"
  //    item: "rice"
  //    time_stamp: "20/04/2020"
  async insert_in_DB(new_data) {

    const historyModel = await this.getUserHistorytModel();
    historyModel.collection.insert(new_data, function (err, docs) {
      if (err) {
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

  // Calculate the average co2 footprint of a user using all products added by user
  async avg_co2_for_user(carbonAPI, user) {

    const user_data = await this.get_all_user_data(user);
    let user_co2 = 0;
    let no_of_datapoints = 0;
    for (let i = 0; i < user_data.length; i++) {
      let carbonResult = await carbonAPI.searchData(user_data[i].item);
      if (carbonResult.carbonpkilo !== undefined) {
        user_co2 += Number(carbonResult.carbonpkilo);
        no_of_datapoints += 1;
      }
    }

    return user_co2 * 1.0 / no_of_datapoints;

  }
  
  // Calculates the average cf of a user in the last week
  async weekly_average_cf (carbonAPI, user) {
    
    // Get data in the last week:
    const historyModel = await this.getUserHistorytModel();
    let today = new Date();
    let first = today.getDate() - today.getDay();
    let firstDayWeek = new Date(today.setDate(first));
    let lastDayWeek = new Date(today.setDate(first + 6));
    const last_week_data = await historyModel.aggregate([
      {
        $match: {
            "time_stamp": {
                $lt: lastDayWeek,
                $gt: firstDayWeek
            },
            user_id: user,
        }
      }
    ])

    // Calculate average cf:
    let user_co2 = 0;
    let no_of_datapoints = 0;
    for (let i = 0; i < last_week_data.length; i++){
      let carbonResult = await carbonAPI.searchData(last_week_data[i].item);
      if(carbonResult.carbonpkilo !== undefined){
        user_co2 += Number(carbonResult.carbonpkilo);
        no_of_datapoints += 1;
      }
    }
    return user_co2 / no_of_datapoints;
  };
  
  // Creates a table to store the weekly compositions
  async create_weekly_cf_composition_table() {

    // In each subtable, there are NUMBER_OF_WEEKS_RETURNED weeks
    let subtable = []
    for (let i = 0; i < this.NUMBER_OF_WEEKS_RETURNED; i++){
       subtable.push({week: i, p_weekly_cf: 0})
    }

    // One subtable for each category:
    let table = {}
    for (let cat = 1; cat < 5; cat++){
      table[cat] = JSON.parse(JSON.stringify(subtable));
    } 

    return table;
  };

  // Adds the data (week_i_data) of a week to the composition table
  async sum_week_data_to_table(carbonAPI, week_i_data, week, table){

    for (let i = 0; i < week_i_data.length; i++){ // For each item found
      let carbonResult = await carbonAPI.searchData(week_i_data[i].item);
      if(carbonResult.carbonpkilo !== undefined){ 
        const categories = carbonResult.categories.toString();

        for (let cat = 1; cat < 5; cat ++){
          if (categories.includes(cat)){
            table[cat][week]["p_weekly_cf"] += carbonResult.carbonpkilo;
          }
        }
      }
    }
    return table;
  };


  // Main function to calculate the weekly composition of a user
  async weekly_cf_composition (carbonAPI, user) {

    const historyModel = await this.getUserHistorytModel();
    let today = new Date();
    let table = await this.create_weekly_cf_composition_table();

    for (let i = 0; i < this.NUMBER_OF_WEEKS_RETURNED; i++){
      const week_i_data = await historyModel.aggregate([
        { $project: {
            week_period:{
              $subtract: [{$week: today}, {$week: "$time_stamp"}]
            },
            user_id: 1,
            item: 1,
          }
        },
        { $match: {
            week_period: i,
            user_id: user, 
          }
        }
      ])
      table = await this.sum_week_data_to_table(carbonAPI, week_i_data, i, table);
    }
    console.log(table);
    return table;
  };

    // Calculates the average cf of a user in the last week
    async monthly_average_cf (carbonAPI, user) {

      // Get data in the last month:
      const historyModel = await this.getUserHistorytModel();
      let today = new Date();
      const last_month_data = await historyModel.aggregate([
        { $project: {
            month_period:{
              $subtract: [{$month: today}, {$month: "$time_stamp"}]
            },
            user_id: 1,
            item: 1,
          }
        },
        { $match: {
            month_period: 0,
            user_id: user, 
          }
        }
      ])

      // Calculate average cf:
      let user_co2 = 0;
      let no_of_datapoints = 0;
      for (let i = 0; i < last_month_data.length; i++){
        let carbonResult = await carbonAPI.searchData(last_month_data[i].item);
        if(carbonResult.carbonpkilo !== undefined){
          user_co2 += Number(carbonResult.carbonpkilo);
          no_of_datapoints += 1;
        }
      }
      return user_co2 / no_of_datapoints;
    };

  // Creates a table to store the monthly compositions
  async create_monthly_cf_composition_table() {

    let subtable = []
    for (let i = 0; i < this.NUMBER_OF_MONTHS_RETURNED; i++){
       subtable.push({month: i, p_monthly_cf: 0})
    }

    // one subtable for each category:
    let table = {}
    for (let cat = 1; cat < 5; cat++){
      table[cat] = JSON.parse(JSON.stringify(subtable));
    } 

    return table;
  };

  // Adds the data (month_i_data) of a month to the composition table
  async sum_month_data_to_table(carbonAPI, month_i_data, month, table){

    for (let i = 0; i < month_i_data.length; i++){ // For each item found
      let carbonResult = await carbonAPI.searchData(month_i_data[i].item);
      if(carbonResult.carbonpkilo !== undefined){ 
        const categories = carbonResult.categories.toString();

        for (let cat = 1; cat < 5; cat ++){
          if (categories.includes(cat)){
            table[cat][month]["p_monthly_cf"] += carbonResult.carbonpkilo;
          }
        }
      }
    }
    return table;
  };

  // Main function to calculate the monthly composition of a user
  async monthly_cf_composition (carbonAPI, user) {

    const historyModel = await this.getUserHistorytModel();
    let today = new Date();
    let table = await this.create_monthly_cf_composition_table();

    for (let i = 0; i < this.NUMBER_OF_MONTHS_RETURNED; i++){
      const month_i_data = await historyModel.aggregate([
        { $project: {
            month_period:{
              $subtract: [{$month: today}, {$month: "$time_stamp"}]
            },
            user_id: 1,
            item: 1,
          }
        },
        { $match: {
            month_period: i,
            user_id: user, 
          }
        }
      ])
      table = await this.sum_month_data_to_table(carbonAPI, month_i_data, i, table);
    }
    console.log(table);
    return table;
  };

};

module.exports = userHistory;


//  TESTS:
const userHis = new userHistory();
//let  res = userHis.avg_co2_for_user(carbonAPI, 1);

//let  res2 = userHis.weekly_average_cf(carbonAPI, "1");

//let  res3 =  userHis.weekly_cf_composition(carbonAPI, "1");

// let  res4 = userHis.monthly_average_cf(carbonAPI, "1");

//let  res5 =  userHis.monthly_cf_composition(carbonAPI, "1");
