const {gql} = require('apollo-server');

let schema = `
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
    postCorrection(name: String!): CarbonFootprintReport
  }
`;

// if (process.env.gcf !== undefined) {
//   schema = `scalar Upload\n\n` + schema
// }

// Construct a schema, using GraphQL schema language
const typeDefs = gql(schema);

module.exports = typeDefs;
