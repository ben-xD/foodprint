const {gql} = require('apollo-server');

// Construct a schema, using GraphQL schema language
const typeDefs = gql` 
  type File {
    id: ID!
    path: String!
    filename: String!
    mimetype: String!
  }
  
  type Query {
    uploads: String
  }
  
  type Mutation {
    test(input: String!): String
    singleUpload(file: Upload!): File!
  }
`;

module.exports = typeDefs;
