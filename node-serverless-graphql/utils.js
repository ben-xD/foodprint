const mongoose = require('mongoose');
const config = require('./carbon-footprint/config');

const createStore = () => {
  // Create connection to MongoDB:
  try {
    mongoose.connect(config.dbServer, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Database connected.');
  } catch (error) {
    console.error('DATABASE FAILED TO CONNECT', error);
  }

  // Store the schemas:
  const store = {};

  const carbonSchema = new mongoose.Schema({
    item: String,
    carbonpkilo: Number,
    categories: String,
    label: String,
  }, { collection: 'carbon' });

  store.carbon = mongoose.model('carbon', carbonSchema);

  const histSchema = new mongoose.Schema({
    user_id: String,
    item: String,
    time_stamp: Date,
  }, { collection: 'user-history' });

  store.userHist = mongoose.model('user-history', histSchema);

  return store;
};

const deleteStore = () => {
  mongoose.disconnect((err) => {
    if (err) {
      console.error(err);
    }
  });
};

module.exports = { createStore, deleteStore };
