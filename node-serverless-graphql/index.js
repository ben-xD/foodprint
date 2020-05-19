const { ApolloServer } = require('apollo-server-cloud-functions');
const admin = require('firebase-admin');
const typeDefs = require('./schema.js');
const resolvers = require('./resolvers.js');
const context = require('./context');
const { createStore } = require('./utils');

const VisionAPI = require('./datasources/vision');
const CarbonAPI = require('./datasources/carbon');
const ConceptAPI = require('./datasources/concept');
const UserHistAPI = require('./datasources/user_history');
const RecipeAPI = require('./datasources/recipe');

// Using $GOOGLE_APPLICATION_CREDENTIALS, which should be set, see `README.md`
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://carbon-footprint-2020.firebaseio.com',
});

const store = createStore();
const carbonAPI = new CarbonAPI(store);

const dataSources = () => ({
  visionAPI: new VisionAPI(),
  conceptAPI: new ConceptAPI(),
  carbonAPI,
  userHistAPI: new UserHistAPI(store),
  recipeAPI: new RecipeAPI(),
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  playground: true,
  introspection: true,
});

exports.handler = server.createHandler({
  cors: {
    origin: true,
  },
});
