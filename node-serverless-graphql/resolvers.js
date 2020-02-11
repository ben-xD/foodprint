const {getCarbonFootprintFromImage, getCarbonFootprintFromName} = require('./carbon-footprint/carbon_footprint_calculation');

const resolvers = {
  Query: {
    _: () => {
    }
  },
  Mutation: {
    postPicture: async (parent, {file}) => {
      const image = new Buffer(file.base64, 'base64'); // Decode base64 of "file" to image
      const [productName, carbonFootprintPerKg] = await getCarbonFootprintFromImage(image);
      return {
        product: {
          name: productName,
        },
        carbonFootprintPerKg: carbonFootprintPerKg,
      };
    },
    postCorrection: async (parent, {name}) => {
      const [productName, carbonFootprintPerKg] = await getCarbonFootprintFromName(name);
      return {
        product: {
          name: productName,
        },
        carbonFootprintPerKg: carbonFootprintPerKg,
      };
    }
  },
};

module.exports = resolvers;
