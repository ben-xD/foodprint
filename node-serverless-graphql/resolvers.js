const { getCarbonFootprintFromImage, getCarbonFootprintFromName } = require('./carbon-footprint/carbon_footprint_calculation');
const { getCarbonFootprintFromBarcode } = require('./carbon-footprint/barcode');
const { getCarbonFootprintFromRecipe } = require('./carbon-footprint/calculate_carbon_from_recipe');

const resolvers = {
  Query: {
    _: () => {
    },
    getUserAvg: async (parent, {}, context) => {
      if (!context.user) {
        // Throw a 403 error because token was invalid or missing in context.js
        throw new Error('You must be logged in.');
      }
      const { dataSources, user } = context;
      const uid = user.uid;
      console.log(("Returning average co2 for user"));
      console.log(uid);
      let avg_co2;
      try {
        avg_co2 = await dataSources.userHistAPI.avg_co2_for_user(dataSources.carbonAPI, uid);
        return avg_co2;
      } catch (err) {
        console.log(err);
        return null;
      }
    },
    getPeriodAvg: async (parent, { timezone, resolution}, context) => {
      if (!context.user) {
        // Throw a 403 error because token was invalid or missing in context.js
        throw new Error('You must be logged in.');
      }
      const { dataSources, user } = context;
      const uid = user.uid;
      let avg;
      try{
        if (resolution === 'WEEK'){
          console.log(("Returning weekly average co2 last 6 weeks for user "));
          console.log(uid);
          avg = await dataSources.userHistAPI.weekly_average_cf(dataSources.carbonAPI, uid, timezone);
          return avg;
        } else if (resolution === 'MONTH'){
          console.log(("Returning monthly average co2 last 6 months for user "));
          console.log(uid);
          avg = await dataSources.userHistAPI.monthly_average_cf(dataSources.carbonAPI, uid, timezone);
          return avg;
        }
      } catch (err) {
        console.log(err);
        return null;
      }
    },
    reportByCategory: async (parent, { timezone, resolution}, context) => {
      if (!context.user) {
        // Throw a 403 error because token was invalid or missing in context.js
        throw new Error('You must be logged in.');
      }
      const { dataSources, user } = context;
      const uid = user.uid;
      let res;
      try{
        if (resolution === 'WEEK'){
          console.log(("Returning categorised information on co2 for the last 6 weeks for user "));
          console.log(uid);
          res = await dataSources.userHistAPI.weekly_cf_composition(dataSources.carbonAPI, uid, timezone);
          return res;
        } else if (resolution === 'MONTH'){
          console.log(("Returning categorised information on co2 last 6 months for user "));
          console.log(uid);
          res = await dataSources.userHistAPI.monthly_cf_composition(dataSources.carbonAPI, uid, timezone);
          return res;
        }
      } catch (err) {
        console.log(err);
        return null;
      }
    },
  },
  Mutation: {
    postPicture: async (parent, { file }, context) => {
      const { dataSources, user } = context
      console.log({ dataSources, user, parent });
      const image = new Buffer(file.base64, 'base64'); // Decode base64 of "file" to image
      console.log('Received picture');
      const { item, carbonFootprintPerKg } = await getCarbonFootprintFromImage(context.dataSources, image);
      const response = {
        name: item,
        carbonFootprintPerKg,
      };
      console.log({ 'Returning': response });
      return response;
    },
    postBarcode: async (parent, { barcode }, context) => {
      const { dataSources, user } = context
      console.log({ dataSources, user, parent });
      console.log(`Received barcode: ${barcode}`);
      const { item, carbonFootprintPerKg } = await getCarbonFootprintFromBarcode(dataSources, barcode, false);
      const response = {
        name: item,
        carbonFootprintPerKg,
      };
      console.log({ 'Returning': response });
      return response;
    },
    postCorrection: async (parent, { name }, context) => {
      const { dataSources, user } = context
      console.log({ 'Received correction': name });
      const { item, carbonFootprintPerKg } = await getCarbonFootprintFromName(dataSources, name);
      const response = {
        name: item,
        carbonFootprintPerKg,
      };
      console.log({ 'Returning': response });
      return response;
    },
    postUserHistoryEntry: async (parent, { item }, context) => {
      if (!context.user) {
        // Throw a 403 error because token was invalid or missing in context.js
        throw new Error('You must be logged in.');
      }

      const { dataSources, user } = context;
      console.log('Received history entry for...');
      console.log({ 'item': item });
      const uid = user.uid;
      console.log({ 'user id': uid });
      try {
        await dataSources.userHistAPI.insert_in_DB({ "user_id": uid, "item": item });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },

    postRecipe: async (parent, {url}, context) => {
      const { dataSources, user } = context;
      console.log({ dataSources, user, parent });
      console.log(`Received url: ${url}`);
      let { item, carbonFootprintPerKg } = await getCarbonFootprintFromRecipe(dataSources, url);
      if (!item) item = 'unknown';
      const response = {
        name: item,
        carbonFootprintPerKg,
      };
      console.log({ 'Returning': response });
      return response;
    }
  }
};

module.exports = resolvers;
