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

    enum ReportResolution {
        WEEK
        MONTH
    }

    type TimeReport {
        periodNumber: Int # week/month number starting with current period of 0, previous -1 etc.
        avgCarbonFootprint: Float
    }

    type CategoryReport {
        plantBased: [TimeReport]
        fish: [TimeReport]
        meat: [TimeReport]
        eggsAndDairy: [TimeReport]
    }

    type UserHistoryReport {
        userAvg: Float
        periodAvgs: [Float]
        categoryReports: [CategoryReport]
    }

    type RecipeReport {
        name: String
        carbonFootprintPerKg: Float
        imageUrl: String
        ingredients: [IngredientReport]
        sourceUrl: String
    }

    type IngredientReport {
        ingredient: String
        amountKg: Float
        carbonFootprintPerKg: Float
    }

    type Query {
        getUserHistoryReport(timezone: Int!, resolutions: [ReportResolution!]!): UserHistoryReport
    }

    type Mutation {
        postPicture(file: PictureFile): ProductFootprint
        postBarcode(barcode: String!): ProductFootprint
        postCorrection(name: String!): ProductFootprint
        postUserHistoryEntry(item: String): Boolean
        postRecipe(name: String!): RecipeReport
        deleteData: Boolean
    }
`;

// Construct a schema, using GraphQL schema language

module.exports = typeDefs;
