const {ApolloServer} = require('apollo-server-cloud-functions');
const typeDefs = require('./typedefs.js');
const resolvers = require('./resolvers.js');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    introspection: true,
});

exports.handler = server.createHandler();

