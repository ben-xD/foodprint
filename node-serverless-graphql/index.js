const { ApolloServer } = require('apollo-server-cloud-functions');
const admin = require('firebase-admin');
const typeDefs = require('./schema.js');
const resolvers = require('./resolvers.js');
const context = require('./context');
const  { createStore, deleteStore } = require('./utils');

const VisionAPI = require('./datasources/vision');
const visionCredentials = require('./credentials/carbon-7fbf76411514.json');
const CarbonAPI = require('./datasources/carbon');
const ConceptAPI = require('./datasources/concept');
const userHistAPI = require('./datasources/user_history');
const RecipeAPI = require('./datasources/recipe');

// Using $GOOGLE_APPLICATION_CREDENTIALS, which should be set, see `README.md`
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://carbon-footprint-2020.firebaseio.com',
});

const store = createStore();
const carbonAPI = new CarbonAPI(store);

const dataSources = () => ({
  visionAPI: new VisionAPI(visionCredentials),
  conceptAPI: new ConceptAPI(),
  carbonAPI:  carbonAPI,
  userHistAPI: new userHistAPI(store),
  recipeAPI: new RecipeAPI(),
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  playground: true,
  introspection: true
});

exports.handler = server.createHandler({
  cors: {
    origin: true,
  },
});
