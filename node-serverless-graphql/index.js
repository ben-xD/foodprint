const { ApolloServer } = require('apollo-server-cloud-functions');
const admin = require('firebase-admin');
const typeDefs = require('./schema.js');
const resolvers = require('./resolvers.js');
const context = require('./context');

const VisionAPI = require('./datasources/vision');
const visionCredentials = require('./credentials/carbon-7fbf76411514.json');
const CarbonAPI = require('./datasources/carbon');
const ConceptAPI = require('./datasources/concept');

// Using $GOOGLE_APPLICATION_CREDENTIALS, which should be set, see `README.md`
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://carbon-footprint-2020.firebaseio.com',
});

const carbonAPI = new CarbonAPI();

const dataSources = () => ({
  visionAPI: new VisionAPI(visionCredentials),
  carbonAPI: carbonAPI,
  conceptAPI: new ConceptAPI()
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  playground: true,
  introspection: true,
});

exports.handler = server.createHandler();
