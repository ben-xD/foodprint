const { gql } = require('apollo-server');

const typeDefs = gql`
    scalar Upload


    type ProductFootprint {
        name: String
        carbonFootprintPerKg: Float
    }

    input PictureFile {
        base64: String
        uri: String
        height: Int
        width: Int
        pictureOrientation: Int
        deviceOrientation: Int
    }

    type Query {
        _: String
    }

    type Mutation {
        postPicture(file: PictureFile): ProductFootprint
        postBarcode(barcode: String!): ProductFootprint
        postCorrection(name: String!): ProductFootprint
    }
`;

// Construct a schema, using GraphQL schema language

module.exports = typeDefs;
