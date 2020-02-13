const resolvers = {
  Query: {
    _: () => {
    },
  },
  Mutation: {
    postPicture: async (parent, { file }, context) => {
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
