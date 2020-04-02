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
  // return: list of objects, each containing carbonpkilo and categories fields
  // If there is no input for one of the labels in labelList in the db, no object for that item is contained in the
  // returning list
  // So querying for ['rice', 'some-random-item'] would return a list with a single object that has values for rice
  // Querying ['blablabla'] would return an empty list
  async getCfMultipleItems(labelList) { return await this.store.carbon.find({ item: { $in: labelList } }); }

}

module.exports = CarbonAPI;
