// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    info: () => 'Hello world!',
  }
};

module.exports = resolvers;
