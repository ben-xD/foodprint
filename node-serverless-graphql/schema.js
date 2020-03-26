const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar Upload


  type Product {
    name: String
  }

  input PictureFile {
    base64: String
    uri: String
    height: Int
    width: Int
    pictureOrientation: Int
    deviceOrientation: Int
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
    postBarcode(barcode: String!): CarbonFootprintReport
    postCorrection(name: String!): CarbonFootprintReport
  }
`;

// Construct a schema, using GraphQL schema language

module.exports = typeDefs;
