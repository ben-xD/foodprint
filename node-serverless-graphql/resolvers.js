const { getCarbonFootprintFromImage, getCarbonFootprintFromName } = require('./carbon-footprint/carbon_footprint_calculation');
const { getCarbonFootprintFromBarcode } = require('./carbon-footprint/barcode');

const resolvers = {
  Query: {
    _: () => {
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
      const { item, carbonFootprintPerKg } = await getCarbonFootprintFromBarcode(dataSources, barcode);
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

      const { dataSources, user } = context
      console.log('Received history entry for...');
      console.log({ 'item': item });
      const uid = user.uid;
      console.log({ 'user id': uid });
      try {
        dataSources.userHistAPI.insert_in_DB({ "user_id": uid, "item": item });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
};

module.exports = resolvers;
