const resolvers = require('../resolvers');
const rice_image = require('../carbon-footprint/tests/rice_image');
const VisionAPI = require('../datasources/vision');
const visionCredentials = require('../credentials/carbon-7fbf76411514.json');
const { createStore, deleteStore } = require('../utils');
const store = createStore();

const CarbonAPI = require('../datasources/carbon');
const carbonAPI = new CarbonAPI(store);
const ConceptAPI = require('../datasources/concept');
const userHistAPI = require('../datasources/user_history');
const RecipeAPI = require('../datasources/recipe');


const dataSources = {
    visionAPI: new VisionAPI(visionCredentials),
    carbonAPI,
    conceptAPI: new ConceptAPI(),
    userHistAPI: new userHistAPI(store),
    recipeAPI: new RecipeAPI(),
};

const CATEGORY_WITH_DATA =
    [{ "avgCarbonFootprint": 10, "periodNumber": 0 },
    { "avgCarbonFootprint": 10, "periodNumber": -1 },
    { "avgCarbonFootprint": 10, "periodNumber": -2 },
    { "avgCarbonFootprint": 10, "periodNumber": -3 },
    { "avgCarbonFootprint": 10, "periodNumber": -4 },
    { "avgCarbonFootprint": 10, "periodNumber": -5 }];

const CATEGORY_EMPTY =
    [{ "avgCarbonFootprint": 0, "periodNumber": 0 },
    { "avgCarbonFootprint": 0, "periodNumber": -1 },
    { "avgCarbonFootprint": 0, "periodNumber": -2 },
    { "avgCarbonFootprint": 0, "periodNumber": -3 },
    { "avgCarbonFootprint": 0, "periodNumber": -4 },
    { "avgCarbonFootprint": 0, "periodNumber": -5 }]

const user = { uid: "x" };

describe('testing resolvers', () => {
    test('getCarbonFootprintFromName: Simple test with an item in the database (rice)', async () => {
        jest.setTimeout(30000);
        const name = 'rice';
        const actual = await resolvers.Mutation.postCorrection(null, { name }, { dataSources, user });
        const expected = { name: "rice", carbonFootprintPerKg: 1.14 };
        expect(actual).toEqual(expected);
    });

    test('getCarbonFootprintFromImage: rice image', async () => {
        jest.setTimeout(30000);
        const file = { base64: rice_image };
        let actual = await resolvers.Mutation.postPicture(null, { file }, { dataSources, user });
        const expected = { name: "rice", carbonFootprintPerKg: 1.14 };
        expect(actual).toEqual(expected);
    });

    test('get co2 of tiramisu (we have stored the barcode in json file), which should be 0.65', async () => {
        jest.setTimeout(30000);
        const barcode = "85053274";
        const actual = await resolvers.Mutation.postBarcode(null, { barcode }, { dataSources, user });
        const expected = { name: 'tiramisu', carbonFootprintPerKg: 0.65 };
        expect(actual).toEqual(expected);
    });

    test('postUserHistoryEntry', async () => {
        jest.setTimeout(30000);

        jest.spyOn(dataSources.userHistAPI, 'insert_in_DB').mockImplementation((user, item) => {
            if (item == 'mock' && user == 'x') {
                return true;
            }
            return false;
        });

        const res = await resolvers.Mutation.postUserHistoryEntry(null, 'mock', { dataSources, user });

        expect(res).toEqual(true);

    });

    test('getUserHistoryReport (aggregated report) for user x', async () => {
        jest.setTimeout(30000);
        // Average co2 of all products for user x is 2.28 (rounded up)
        jest.spyOn(dataSources.userHistAPI, 'avg_co2_for_user').mockImplementation(async () => 2.28);
        // Average co2 of all products for user x over last 6 weeks is 3.12(rounded up)
        jest.spyOn(dataSources.userHistAPI, 'weekly_average_cf').mockImplementation(async () => 3.12);
        // Average co2 of all products for user x over last 6 months is 1.34 (rounded up)
        jest.spyOn(dataSources.userHistAPI, 'monthly_average_cf').mockImplementation(async () => 1.34);
        // reportByCategory: weekly report
        jest.spyOn(dataSources.userHistAPI, 'weekly_cf_composition').mockImplementation(async () => {
            return (
                {
                    "plantBased": CATEGORY_WITH_DATA,
                    "fish": CATEGORY_WITH_DATA,
                    "meat": CATEGORY_EMPTY,
                    "eggsAndDairy": CATEGORY_EMPTY
                }
            )
        });
        // reportByCategory: monthly report
        jest.spyOn(dataSources.userHistAPI, 'monthly_cf_composition').mockImplementation(async () => {
            return (
                {
                    "plantBased": CATEGORY_WITH_DATA,
                    "fish": CATEGORY_WITH_DATA,
                    "meat": CATEGORY_EMPTY,
                    "eggsAndDairy": CATEGORY_EMPTY
                }
            )
        });

        // Compare results
        const timezone = 0;
        const resolutions = ['WEEK', 'MONTH'];
        const expected = {
            userAvg: 2.28,
            periodAvgs: [3.12, 1.34],
            categoryReports: [
                {
                    plantBased: CATEGORY_WITH_DATA,
                    fish: CATEGORY_WITH_DATA,
                    meat: CATEGORY_EMPTY,
                    eggsAndDairy: CATEGORY_EMPTY
                },
                {
                    plantBased: CATEGORY_WITH_DATA,
                    fish: CATEGORY_WITH_DATA,
                    meat: CATEGORY_EMPTY,
                    eggsAndDairy: CATEGORY_EMPTY
                }
            ]
        }
        const actual = await resolvers.Query.getUserHistoryReport(null, { timezone, resolutions }, { dataSources, user });
        expect(actual).toEqual(expected);
    });

    test('Test postRecipe', async () => {
        jest.setTimeout(10000);
        // Mock up functions that call recipeAPI
        jest.spyOn(dataSources.recipeAPI, 'getData').mockReturnValueOnce(true);
        jest.spyOn(dataSources.recipeAPI, 'getName').mockReturnValueOnce("Roasted chickpea wraps");
        jest.spyOn(dataSources.recipeAPI, 'getIngredients').mockReturnValueOnce([
            { name: 'chickpeas', amount: 0 },
            { name: 'olive oil', amount: 0.01 },
            { name: 'ground cumin', amount: 0 },
            { name: 'smoked paprika', amount: 0 },
            { name: 'avocados', amount: 0.4 },
            { name: 'juice of lime', amount: 0.03 },
            { name: 'coriander', amount: 0 },
            { name: 'corn tortillas', amount: 0.21 },
            { name: 'iceberg lettuce', amount: 0.32 },
            { name: 'natural yogurt', amount: 0.15 },
            { name: 'roasted red peppers', amount: 0.48 }
        ]
        );

        const url = "https://www.bbcgoodfood.com/recipes/roasted-chickpea-wraps";
        let actual = await resolvers.Mutation.postRecipe(null, { url }, { dataSources, user });
        let expected = { "carbonFootprintPerKg": 2.49, "name": "Roasted chickpea wraps" };
        expect(actual).toEqual(expected);
    });
});

afterAll(() => {
    deleteStore();
});
