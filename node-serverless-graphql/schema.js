const {gql} = require('apollo-server');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Product {
    name: String
  }
 
  type CarbonFootprintReport {
    product: Product
    carbonFootprint: Float
    carbonFootprintPerKg: Float
  }
  
  type Query {
    _: Boolean
  }
  
  type Mutation {
    postPicture(file: Upload!): CarbonFootprintReport
  }
`;

module.exports = typeDefs;
