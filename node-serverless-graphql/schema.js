const { gql } = require('apollo-server');

let schema = `
  scalar Upload


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
    postPicture(file: PictureFile): CarbonFootprintReport
    postCorrection(name: String!): CarbonFootprintReport
  }
`;

// Construct a schema, using GraphQL schema language
const typeDefs = gql(schema);

module.exports = typeDefs;
