const { ApolloServer } = require('apollo-server-cloud-functions');
const typeDefs = require('./schema.js');
const resolvers = require('./resolvers.js');
const context = require('./context');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  playground: true,
  introspection: true,
});

exports.handler = server.createHandler();
