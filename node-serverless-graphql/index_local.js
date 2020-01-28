// Use module apollo-server for local testing
const {ApolloServer} = require('apollo-server');
const typeDefs = require('./typedefs.js');
const resolvers = require('./resolvers.js');

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});

