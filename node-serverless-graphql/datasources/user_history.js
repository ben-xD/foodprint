const mongoose = require('mongoose');

class userHistAPI {

  constructor(store) {
    this._hystorySchema;
    this.searchData = this.searchData.bind(this);
    this.insert_in_DB = this.insert_in_DB.bind(this);
    this.avg_co2_for_user = this.avg_co2_for_user.bind(this);
    this.weekly_average_cf = this.weekly_average_cf.bind(this);
    this.weekly_cf_composition = this.weekly_cf_composition.bind(this);
    this.monthly_average_cf = this.monthly_average_cf.bind(this);
    this.monthly_cf_composition = this.monthly_cf_composition.bind(this);
    this.get_all_user_data = this.get_all_user_data.bind(this);
    this.get_week_i_data = this.get_week_i_data.bind(this);
    this.get_month_i_data = this.get_month_i_data.bind(this);
    this.convert_date = this.convert_date.bind(this);
    this.average_data = this.average_data.bind(this);
    this.get_items = this.get_items.bind(this);
    this.create_cf_composition_table = this.create_cf_composition_table.bind(this);
    this.get_number_of_categories = this.get_number_of_categories.bind(this);
    this.sum_period_data_to_table = this.sum_period_data_to_table.bind(this);
    this.store = store;
    this.NUMBER_OF_WEEKS_RETURNED = 6;
    this.NUMBER_OF_MONTHS_RETURNED = 6;
    this.CATEGORIES = ['plantBased', 'fish', 'meat', 'eggsAndDairy'];
  }

  async searchData(user_id) {

    const itemList = this.store.userHist.findOne({user_id: user_id});
    return itemList ?
      {
        item: itemList.item,
        time_stamp: itemList.time_stamp
      } :
      {
        item: undefined,
        time_stamp: undefined
      }

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

    await this.store.userHist.collection.insert(new_data, function (err, docs) {
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
    if (user_data === undefined) {
      return null;
    }

    let average = await this.average_data(carbonAPI, user_data);
    return average;

  };

  // Calculates the average cf per week of a user
  async weekly_average_cf(carbonAPI, user, timezone) {

    let sum = 0;

    for (let i = 1; i < this.NUMBER_OF_WEEKS_RETURNED; i++) {
      // Get data for every week:
      let week_i_data = await this.get_week_i_data(user, timezone, i);
      let week_cf = 0
      if (week_i_data != undefined) {
        week_cf = await this.average_data(carbonAPI, week_i_data);
        sum = sum + week_cf;
      }
    }

    let average = +(sum / (this.NUMBER_OF_WEEKS_RETURNED - 1)).toFixed(2); // -1 because the current week is not taken into account

    return average;
  };

  // Calculates the weekly composition of a user
  async weekly_cf_composition(carbonAPI, user, timezone) {

    let table = await this.create_cf_composition_table();

    for (let i = 0; i < this.NUMBER_OF_WEEKS_RETURNED; i++) {
      const week_i_data = await this.get_week_i_data(user, timezone, i);
      if (week_i_data === undefined) {
        continue;
      }
      table = await this.sum_period_data_to_table(carbonAPI, week_i_data, i, table);
    }

    return table;
  };

  // Calculates the average cf per month of a user
  async monthly_average_cf(carbonAPI, user, timezone) {

    let sum = 0;
    for (let i = 1; i < this.NUMBER_OF_WEEKS_RETURNED; i++) {
      // Get data for every week:
      let month_i_data = await this.get_month_i_data(user, timezone, i);
      let month_cf = 0
      if (month_i_data !== undefined) {
        month_cf = await this.average_data(carbonAPI, month_i_data);
        sum = sum + month_cf;
      }
    }

    let average = +(sum / (this.NUMBER_OF_MONTHS_RETURNED - 1)).toFixed(2); // -1 because the current week is not taken into account
    return average;
  };

  // Calculates the monthly composition of a user
  async monthly_cf_composition(carbonAPI, user, timezone) {

    let table = await this.create_cf_composition_table();

    for (let i = 0; i < this.NUMBER_OF_WEEKS_RETURNED; i++) {
      const month_i_data = await this.get_month_i_data(user, timezone, i);
      table = await this.sum_period_data_to_table(carbonAPI, month_i_data, i, table);
    }

    return table;
  };

  // #################################################################################
  //                          Helper functions to get history data
  // #################################################################################

  // Search database for all products consumed by a user
  async get_all_user_data(user) {

    return await this.store.userHist.find({user_id: user});

  }

  // Gets the data in week i starting from today
  async get_week_i_data(user, timezone, i) {

    const today = new Date();
    const week_i_data = await this.store.userHist.aggregate([
      {
        $project: {
          week_period: {
            $subtract: [
              {$week: {$add: [today, timezone * 60000 * 60]}},
              {$week: {$add: ["$time_stamp", timezone * 60000 * 60]}}
            ]
          },
          user_id: 1,
          item: 1,
          time_stamp: 1,
        }
      },
      {
        $match: {
          week_period: i,
          user_id: user,
        }
      }
    ])
    return week_i_data;
  };

  // Gets the data in month i starting from today
  async get_month_i_data(user, timezone, i) {

    const today = new Date();
    const month_i_data = await this.store.userHist.aggregate([
      {
        $project: {
          month_period: {
            $subtract: [
              {$month: {$add: [today, timezone * 60000 * 60]}},
              {$month: {$add: ["$time_stamp", timezone * 60000 * 60]}}
            ]
          },
          user_id: 1,
          item: 1,
          time_stamp: 1,
        }
      },
      {
        $match: {
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
  async convert_date(date, timezone) {

    let adjusted_date = new Date(date.getTime() + (timezone * 60000 * 60)).toISOString();
    return adjusted_date;
  }

  // Calculates the average cf of the items in data
  async average_data(carbonAPI, data) {
    if (data.length === 0) {
      return 0;
    }

    const [items, repetitions] = await this.get_items(data)
    const carbonData = await carbonAPI.getCfMultipleItems(items, true);
    if (carbonData === []) {
      return null;
    }

    let user_co2 = 0;
    for (let i = 0; i < carbonData.length; i++) {
      const carbonResult = carbonData[i];
      user_co2 += (Number(carbonResult.carbonpkilo) * repetitions[i]);
    }

    const n_items = repetitions.reduce(function (a, b) {
      return a + b;
    });
    return +(user_co2 / n_items).toFixed(2);   // "+" to avoid toFixed convert result to string
  }


  // takes the items from list  of user history data. The number of times an item is repeated is stored in
  // the array of repetitions.
  async get_items(data) {
    let items = [];
    let repetitions_indexes = {};
    let repetitions = new Array(data.length).fill(1);
    for (let i = 0; i < data.length; i++) {
      let item = data[i].item;

      if (items.includes(item)) { // if the item has appeared before
        let index_first_item = repetitions_indexes[item];
        repetitions[index_first_item] += 1;
      } else { // if it is a new item
        repetitions_indexes[item] = i;
        items.push(item);
      }

    }
    repetitions = repetitions.slice(0, items.length);
    return [items, repetitions];
  }

  // Creates a table to store the compositions
  async create_cf_composition_table() {

    // In each subtable, there are NUMBER_OF_WEEKS_RETURNED weeks
    let subtable = []
    for (let i = 0; i < this.NUMBER_OF_WEEKS_RETURNED; i++) {
      subtable.push({periodNumber: -i, avgCarbonFootprint: 0})
    }

    // One subtable for each category:
    let table = {}
    for (let cat = 0; cat < 4; cat++) {
      table[this.CATEGORIES[cat]] = JSON.parse(JSON.stringify(subtable));
    }

    return table;
  };

  // Returns the number of categories in a product, given a string of categories.
  // It assumes category strings do not contain replicates.
  async get_number_of_categories(categories) {
    let n = 0;
    for (let i = 0; i < categories.length; i++) {
      if (categories.charAt(i) != "0") {
        n += 1;
      }
    }
    return n;
  }

  // Adds the data (period_i_data) of a period i (week or month) to the compositions table
  async sum_period_data_to_table(carbonAPI, period_i_data, period, table) {
    const [items, repetitions] = await this.get_items(period_i_data)
    const carbonData = await carbonAPI.getCfMultipleItems(items, true);
    for (let i = 0; i < carbonData.length; i++){ // For each item found
      let carbonResult = carbonData[i];
      if (carbonResult.carbonpkilo !== undefined) {
        const categories = carbonResult.categories.toString();
        const n_categories = await this.get_number_of_categories(categories);
        for (let cat = 1; cat < 5; cat++) {
          if (categories.includes(cat)) {
            let cf = +carbonResult.carbonpkilo.toFixed(2);
            table[this.CATEGORIES[cat - 1]][period]["avgCarbonFootprint"] += (cf * repetitions[i] / n_categories);
          }
        }
      }
    }
    return table;
  };

};

module.exports = userHistAPI;
