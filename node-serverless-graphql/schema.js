const {gql} = require('apollo-server');

// Construct a schema, using GraphQL schema language
const typeDefs = gql` 
  type Picture {
    title: String
    image: String
  }
  
  type Query {
    getPicture(title: String!): Picture
  }
  
  type Mutation {
    postPicture(title: String): Picture
  }
`;

module.exports = typeDefs;
