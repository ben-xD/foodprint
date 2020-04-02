class CarbonAPI {

  constructor(store) {
    this._carbonSchema;
    this.getCfOneItem = this.getCfOneItem.bind(this);
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
  // return: list of objects, each containing carbonpkilo and categories fields
  // If there is no input for one of the labels in labelList in the db, no object for that item is contained in the
  // returning list
  // So querying for ['rice', 'some-random-item'] would return a list with a single object that has values for rice
  // Querying ['blablabla'] would return an empty list
  async getCfMultipleItems(labelList, checkAll = false) {

    if (checkAll && await this.containsNonStrings(labelList)) {
      throw new Error("CarbonAPI: getCfMultipleItems shoudn't be used with regular expresions if checkAll is enabled");
    }

    const _itemList = await this.store.carbon.find({ item: { $in: labelList } });

    if (checkAll && labelList.length > _itemList.length) {
      throw new Error("CarbonAPI: only " + _itemList.length + " out of " + labelList.length + " items were found");
    }

    return _itemList;
  }

  async containsNonStrings(labelList) {
    for (let i = 0; i < labelList.length; i++) {
      if (typeof (labelList[i]) != "string") return true;
    }
    return false;
  }

}

module.exports = CarbonAPI;
