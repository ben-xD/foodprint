const mongoose = require('mongoose');

class CarbonAPI {

  constructor( store ) {
    this._carbonSchema;
    this.searchData = this.searchData.bind(this);
    this.store = store
  }

  async insert_in_DB(new_data) {

    console.log(store.carbon.collection);
    await this.store.carbon.collection.insert(new_data, function (err, docs) {
      if (err) {
        return console.error(err);
      } else {
        console.log("Document inserted into the carbon collection");
        return true;
      }
    });
  }

  // Search database for given label and return its carbon footprint
  async searchData(label) {

    let itemList;
    try {
      await this.store.carbon.findOne({ item: label }, (err, items) => {
        if (err) {
          throw err;
        }
        itemList = items;
      }).maxTime(100000).exec();

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
