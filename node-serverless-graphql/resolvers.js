const getCarbonFootprintFromImage = require('./carbon-footprint/carbon_footprint_calculation');

const resolvers = {
  Query: {
    _: () => {
    },
  },
  Mutation: {
    postPicture: async (parent, { file }) => {
      const image = new Buffer(file.base64, 'base64'); // Decode base64 of "file" to image
      const [productName, carbonFootprintPerKg] = await getCarbonFootprintFromImage(image);
      return {
        product: {
          name: productName,
        },
        carbonFootprintPerKg,
      };
    },
  },
};

module.exports = resolvers;
