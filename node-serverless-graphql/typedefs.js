const {gql} = require('apollo-server');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    info: String!
  }
`;

module.exports = typeDefs;
