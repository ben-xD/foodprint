const { ApolloServer, gql } = require('apollo-server-cloud-functions');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    info: String!
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        info: () => 'Hello world!',
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    introspection: true,
});

exports.handler = server.createHandler();

/* server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
*/
