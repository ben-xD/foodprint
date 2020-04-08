const admin = require('firebase-admin');
const { AuthenticationError, ApolloError } = require('apollo-server');
const { getCarbonFootprintFromImage, getCarbonFootprintFromName } = require('./carbon-footprint/carbon_footprint_calculation');
const { getCarbonFootprintFromBarcode } = require('./carbon-footprint/barcode');
const { getCarbonFootprintFromRecipe } = require('./carbon-footprint/calculate_carbon_from_recipe');


const resolvers = {
  Query: {
    getUserHistoryReport: async (parent, { timezone, resolutions }, context) => {
      if (!context.user) {
        // Throw a 403 error because token was invalid or missing in context.js
        throw new AuthenticationError('You must be logged in.');
      }
      const { dataSources, user } = context;
      const { uid } = user;
      const response = {};
      try {
        // userAvg
        console.log('Packing average co2 for user', uid);
        const userAvg = await dataSources.userHistAPI.avg_co2_for_user(dataSources.carbonAPI, uid);
        response.userAvg = userAvg;
        // periodAvgs
        const periodAvgs = [];
        if (resolutions.includes('WEEK')) {
          weeklyAvg = await dataSources.userHistAPI.weekly_average_cf(dataSources.carbonAPI, uid, timezone);
          console.log('Packing weekly average co2 last 6 weeks for user', uid);
          periodAvgs.push(weeklyAvg);
        }
        if (resolutions.includes('MONTH')) {
          monthlyAvg = await dataSources.userHistAPI.monthly_average_cf(dataSources.carbonAPI, uid, timezone);
          console.log('Packing monthly average co2 last 6 months for user', uid);
          periodAvgs.push(monthlyAvg);
        }
        response.periodAvgs = periodAvgs;
        // categoryReport
        const categoryReports = [];
        if (resolutions.includes('WEEK')) {
          weeklyReport = await dataSources.userHistAPI.weekly_cf_composition(dataSources.carbonAPI, uid, timezone);
          console.log('Packing categorised information on co2 for the last 6 weeks for user', uid);
          categoryReports.push(weeklyReport);
        }
        if (resolutions.includes('MONTH')) {
          monthlyReport = await dataSources.userHistAPI.monthly_cf_composition(dataSources.carbonAPI, uid, timezone);
          console.log('Packing categorised information on co2 last 6 months for user', uid);
          categoryReports.push(monthlyReport);
        }
        response.categoryReports = categoryReports;
        console.log({ Returning: response });
        return response;
      } catch (err) {
        console.log(err);
        return null;
      }
    },
  },
  Mutation: {
    deleteData: async (parent, payload, { user, dataSources }) => {
      if (!user) {
        // Throw a 403 error because token was invalid or missing in context.js
        throw new AuthenticationError('You must be logged in.');
      }

      try {
        await dataSources.userHistAPI.deleteUserData(user.uid);
      } catch (err) {
        console.error(err);
        // throw a 500 error to say
        throw new ApolloError('Unable to deleteUserData', 500);
      }

      try {
        await admin.auth().deleteUser(user.uid);
      } catch (err) {
        console.error(err);
        throw new ApolloError('Successfully deleted user data, but not user', 500);
      }

      return true;
    },
    postPicture: async (parent, { file }, context) => {
      if (!context.user) {
        // Throw a 403 error because token was invalid or missing in context.js
        throw new AuthenticationError('You must be logged in.');
      }

      const { dataSources, user } = context;
      console.log({ dataSources, user, parent });
      const image = new Buffer(file.base64, 'base64'); // Decode base64 of "file" to image
      console.log('Received picture');
      const { item, carbonFootprintPerKg } = await getCarbonFootprintFromImage(context.dataSources, image);
      const response = {
        name: item,
        carbonFootprintPerKg,
      };
      console.log({ Returning: response });
      return response;
    },
    postBarcode: async (parent, { barcode }, context) => {
      if (!context.user) {
        // Throw a 403 error because token was invalid or missing in context.js
        throw new AuthenticationError('You must be logged in.');
      }

      const { dataSources, user } = context;
      console.log({ dataSources, user, parent });
      console.log(`Received barcode: ${barcode}`);
      const { item, carbonFootprintPerKg } = await getCarbonFootprintFromBarcode(dataSources, barcode, false);
      const response = {
        name: item,
        carbonFootprintPerKg,
      };
      console.log({ Returning: response });
      return response;
    },
    postCorrection: async (parent, { name }, context) => {
      if (!context.user) {
        // Throw a 403 error because token was invalid or missing in context.js
        throw new AuthenticationError('You must be logged in.');
      }

      const { dataSources, user } = context;
      console.log({ 'Received correction': name });
      const { item, carbonFootprintPerKg } = await getCarbonFootprintFromName(dataSources, name);
      const response = {
        name: item,
        carbonFootprintPerKg,
      };
      console.log({ Returning: response });
      return response;
    },
    postUserHistoryEntry: async (parent, { item }, context) => {
      if (!context.user) {
        // Throw a 403 error because token was invalid or missing in context.js
        throw new AuthenticationError('You must be logged in.');
      }

      const { dataSources, user } = context;
      console.log('Received history entry for...');
      console.log({ item });
      const { uid } = user;
      console.log({ 'user id': uid });
      try {
        await dataSources.userHistAPI.insert_in_DB({ user_id: uid, item });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },

    postRecipe: async (parent, { name }, context) => {
      if (!context.user) {
        // Throw a 403 error because token was invalid or missing in context.js
        throw new AuthenticationError('You must be logged in.');
      }

      const { dataSources, user } = context;
      console.log({ dataSources, user, parent });
      console.log(`Received url: ${name}`);
      let {
        item, carbonFootprintPerKg, imageUrl, ingredients, sourceUrl,
      } = await getCarbonFootprintFromRecipe(dataSources, name);
      if (!item) item = 'unknown';
      const response = {
        name: item,
        carbonFootprintPerKg,
        imageUrl,
        ingredients,
        sourceUrl,
      };
      console.log({ Returning: response });
      return response;
    },
  },
};

module.exports = resolvers;
