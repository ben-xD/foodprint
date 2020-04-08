const catergorisedCarbonValues = require("./categorisedCarbonValues.json");

class CarbonAPI {

  constructor(store) {
    this._carbonSchema;
    this.getCfOneItem = this.getCfOneItem.bind(this);
    this.getCfMultipleItems = this.getCfMultipleItems.bind(this);
    this.insert_in_DB = this.insert_in_DB.bind(this);
    this.getCfMultipleItems = this.getCfMultipleItems.bind(this);
    this.containsNonStrings = this.containsNonStrings.bind(this);
    this.store = store
  }

  async insert_in_DB(new_data) { await this.store.carbon.collection.insertOne(new_data); }

  /**
   * Search database for given label and return its carbon footprint
   * @param {string} label
   * @returns {JSON} with carbonpkilo and categories fields, return null if item not in the database
   */
  async getCfOneItem(label) { return await this.store.carbon.findOne({ item: label }); }

  // Search database for a list of labels, returning a list of objects for only those labels defined in the db
  // labelList: list of strings
  // checkAll: If true, the function checks that all the producs were found in the db. If one of the items wasn't found, throws an error.
  // Note that if checkAll = true, then labelList should be list of strings (without regular expressions) and  without duplicates
  // useCategories: If true, the labels are also looked for in the categories
  // return: list of objects, each containing carbonpkilo and categories fields
  // If there is no input for one of the labels in labelList in the db, no object for that item is contained in the
  // returning list
  // So querying for ['rice', 'some-random-item'] would return a list with a single object that has values for rice
  // Querying ['blablabla'] would return an empty list
  async getCfMultipleItems(labelList, checkAll = false, useCategories = false) {

    // Check all the labels are strings:
    if (checkAll && await this.containsNonStrings(labelList)) {
      throw new Error("CarbonAPI: getCfMultipleItems shoudn't be used with regular expresions if checkAll is enabled");
    }

    // Search the labels in the carbon database
    const _itemList = await this.store.carbon.find({ item: { $in: labelList } });

    // If useCategories = true, search the remaining labels in categorised db
    if (useCategories && (labelList.length > _itemList.length)){

      const found_items = this.getItemsInList(_itemList); 
      const not_found_items = labelList.filter(item => !found_items.includes(item));

      for (let i = 0; i < not_found_items.length; i += 1) {
        let carbonFootprintResponse = catergorisedCarbonValues[not_found_items[i]];
        if (carbonFootprintResponse) {
          _itemList.push ({
            item: labels[i],
            carbonpkilo: carbonFootprintResponse[0].carbonpkilo,
            categories: carbonFootprintResponse[0].categories
          });
        }
      }

    }

    // If checkAll = true, check that all the items have been found (either in the categorised or carbon db)
    if (checkAll && labelList.length > _itemList.length) {
      throw new Error("CarbonAPI: only " + _itemList.length + " out of " + labelList.length + " items were found");
    }

    return _itemList;
  }

  // Function that tries to find a label in the DB of categories (cotaining items like fruit, meat, ...)
  // @return CarbonFootprintReport (if found) or null (if not found)
  async findCategorisedLabel (labels) {
    for (let i = 0; i < labels.length; i += 1) {
      let carbonFootprintResponse = catergorisedCarbonValues[labels[i]];
      if (carbonFootprintResponse) {
        return {
          item: labels[i],
          carbonpkilo: carbonFootprintResponse[0].carbonpkilo,
          categories: carbonFootprintResponse[0].categories
        };
      }
    }
    return null;
  };

  async containsNonStrings(labelList) {
    for (let i = 0; i < labelList.length; i++) {
      if (typeof (labelList[i]) != "string") return true;
    }
    return false;
  }

  async getItemsInList(list) {
    let items = [];
    for (let i = 0; i < list.length; i++){
      items.push(list[i].item);
    }
    return items;
  }

}

module.exports = CarbonAPI;
