const { ApolloServer } = require('apollo-server-cloud-functions');
const admin = require('firebase-admin');
const typeDefs = require('./schema.js');
const resolvers = require('./resolvers.js');
const context = require('./context');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://carbon-footprint-2020.firebaseio.com',
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  playground: true,
  introspection: true,
});

exports.handler = server.createHandler();
