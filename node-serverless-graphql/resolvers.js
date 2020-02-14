const getCarbonFootprintFromImage = require('./carbon-footprint/carbon_footprint_calculation');

const resolvers = {
  Query: {
    _: () => {
    },
  },
  Mutation: {
    postPicture: async (parent, { file }, context) => {
      // if (!context.user) {
      // Throw a 403 error instead of "ERROR", to provide more meaning to clients
      //   throw new Error('you must be logged in');
      // }

      console.log({ context, parent });
      const image = new Buffer(file.base64, 'base64'); // Decode base64 of "file" to image
      const { productName, carbonFootprintPerKg } = await getCarbonFootprintFromImage(image);
      console.log({ productName, carbonFootprintPerKg });
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
