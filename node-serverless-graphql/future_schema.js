const {gql} = require('apollo-server');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type CarbonFootprintReport {
    product: Product
    carbonFootprint: Float
    carbonFootprintPerKg: Float
  }
  
  input CorrectionInput {
    originalClassification: String!
    correctedClassification: String!
  }
  
  type Picture {
    id: ID!
    path: String!
    filename: String!
    mimetype: String!
  }
  
  type Query {
    uploads: String
  }
  
  type Mutation {
    postPicture(file: Upload!): File!
    correction(correctionInput: CorrectionInput): CarbonFootprintReport!
  }
`;

module.exports = typeDefs;
