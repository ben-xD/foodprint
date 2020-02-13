const { gql } = require('apollo-server');

let schema = `
  type Product {
    name: String
  }
 
  type CarbonFootprintReport {
    product: Product
    carbonFootprint: Float
    carbonFootprintPerKg: Float
  }
  
  type Query {
    _: String
  }
  
  type Mutation {
    postPicture(file: Upload!): CarbonFootprintReport
  }
`;

schema = `scalar Upload\n\n` + schema

// Construct a schema, using GraphQL schema language
const typeDefs = gql(schema);

module.exports = typeDefs;
