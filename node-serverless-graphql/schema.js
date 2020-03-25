const { gql } = require('apollo-server');

let schema = `
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
    postUserHistoryEntry(item: String): Boolean
  }
`;

// Construct a schema, using GraphQL schema language
const typeDefs = gql(schema);

module.exports = typeDefs;
