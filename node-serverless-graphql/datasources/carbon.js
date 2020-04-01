class CarbonAPI {

  constructor(store) {
    this._carbonSchema;
    this.getCfOneItem = this.getCfOneItem.bind(this);
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
  // label: string
  // return: object with carbonpkilo and categories fields, return null if item not in the database
  async getCfOneItem(label) {

    let _item = null;
    await this.store.carbon.findOne({item: label}, (err, item) => {
      if (err) {
        console.error('CarbonAPI: failed to query for label:', label);
        throw err;
      }
      _item = item;
    }).exec();

    return _item;
  }

  // Search database for a list of labels, returning a list of objects for only those labels defined in the db
  // labelList: list of strings
  // return: list of objects, each containing carbonpkilo and categories fields
  // If there is no input for one of the labels in labelList in the db, no object for that item is contained in the
  // returning list
  // So querying for ['rice', 'some-random-item'] would return a list with a single object that has values for rice
  // Querying ['blablabla'] would return an empty list
  async getCfMultipleItems(labelList) {

    let _itemList = [];
    await this.store.carbon.find({item: {$in: labelList}}, (err, itemList) => {
      if (err) {
        console.error('CarbonAPI: failed to query for labels:', labelList);
        throw err;
      }
      _itemList = itemList;
    }).exec();

    return _itemList;
  }

  // Search database for a list of labels, returning a list of objects for only those labels defined in the db
  // The function checks that all the producs were found in the db. If one of the items wasn't found, throws an error
  // labelList: list of strings,  without duplicates
  // return: list of objects, each containing carbonpkilo and categories fields
  async getCfAllMultipleItems(labelList) {

    let _itemList = [];
    await this.store.carbon.find({item: {$in: labelList}}, (err, itemList) => {
      if (err) {
        console.error('CarbonAPI: failed to query for labels:', labelList);
        throw err;
      }
      _itemList = itemList;
    }).exec();

    if (labelList.length > _itemList.length){
      throw new Error("CarbonAPI: only " + _itemList.length + " out of " + labelList.length + " items were found");
    }

    return _itemList;
  }

}

module.exports = CarbonAPI;
