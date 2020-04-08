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

    test('Test postRecipe with a url', async () => {
        jest.setTimeout(10000);
        // Mock up functions that call recipeAPI
        jest.spyOn(dataSources.recipeAPI, 'getDataFromLink').mockReturnValueOnce(true);
        jest.spyOn(dataSources.recipeAPI, 'getName').mockReturnValueOnce("Roasted chickpea wraps");
        jest.spyOn(dataSources.recipeAPI, 'getIngredients').mockReturnValueOnce([
            { name: 'chickpeas', amount: 0 },
            { name: 'olive oil', amount: 0.01 },
            { name: 'ground cumin', amount: 0 },
            { name: 'smoked paprika', amount: 0 }
        ]
        );
        jest.spyOn(dataSources.recipeAPI, 'getImageUrl').mockReturnValueOnce("https://mock_url");
        jest.spyOn(dataSources.recipeAPI, 'getUrl').mockReturnValueOnce("https://www.bbcgoodfood.com/recipes/roasted-chickpea-wraps");
        jest.spyOn(dataSources.carbonAPI, 'getCfMultipleItems').mockReturnValueOnce([{item: "chickpeas", carbonpkilo: 0.73, categories: "1000"}]);
        jest.spyOn(dataSources.carbonAPI, 'getCfMultipleItems').mockReturnValueOnce([{item: "olive oil", carbonpkilo: 1.63, categories: "1000"}]);
        jest.spyOn(dataSources.carbonAPI, 'getCfMultipleItems').mockReturnValueOnce([{item: "ground cumin", carbonpkilo: null, categories: "1000"}]);
        jest.spyOn(dataSources.carbonAPI, 'getCfMultipleItems').mockReturnValueOnce([{item: "smoked paprika", carbonpkilo: null, categories: "1000"}]);

        const name = "https://www.bbcgoodfood.com/recipes/roasted-chickpea-wraps";
        let actual = await resolvers.Mutation.postRecipe(null, { name }, { dataSources, user });
        let expected = { "carbonFootprintPerKg": 0.02, 
                        "imageUrl": "https://mock_url",
                        "name": "Roasted chickpea wraps", 
                        "sourceUrl": "https://www.bbcgoodfood.com/recipes/roasted-chickpea-wraps",
                        "ingredients": [
                            { amountKg: 0, carbonFootprintPerKg: 0.73, ingredient: "chickpeas"},
                            { amountKg: 0.01, carbonFootprintPerKg: 1.63, ingredient: "olive oil"},
                            { amountKg: 0, carbonFootprintPerKg: null, ingredient: "ground cumin"},
                            { amountKg: 0, carbonFootprintPerKg: null, ingredient: "smoked paprika"}
                        ]
                    };
        expect(actual).toEqual(expected);
    });

    test('Test postRecipe with a name', async () => {
        jest.setTimeout(10000);
        // Mock up functions that call recipeAPI
        jest.spyOn(dataSources.recipeAPI, 'getDataFromName').mockReturnValueOnce(true);
        jest.spyOn(dataSources.recipeAPI, 'getName').mockReturnValueOnce("Mushroom Risotto");
        jest.spyOn(dataSources.recipeAPI, 'getIngredients').mockReturnValueOnce([
                { name: 'butter', amount: 0.03 },
                { name: 'oyster mushrooms', amount: 0.17 },
                { name: 'brandy', amount: 0.16 },
                { name: 'chicken stock', amount: 1.2 },
                { name: 'shallots', amount: 0.08 },
                { name: 'arborio rice', amount: 0.35 },
                { name: 'parmesan cheese', amount: 0.03 },
                { name: 'salt and pepper', amount: 0 },
                { name: 'fresh parsley', amount: 0.01 }
            ]
        );
        jest.spyOn(dataSources.recipeAPI, 'getUrl').mockReturnValueOnce("https://www.simplyrecipes.com/recipes/mushroom_risotto/");
        jest.spyOn(dataSources.recipeAPI, 'getImageUrl').mockReturnValueOnce("https://mock_url");
        jest.spyOn(dataSources.carbonAPI, 'getCfMultipleItems').mockReturnValueOnce([{item: "butter", carbonpkilo: 11.92, categories: "1000"}]);
        jest.spyOn(dataSources.carbonAPI, 'getCfMultipleItems').mockReturnValueOnce([{item: "oyster mushrooms", carbonpkilo: 0.73, categories: "1000"}]);
        jest.spyOn(dataSources.carbonAPI, 'getCfMultipleItems').mockReturnValueOnce([{item: "brandy", carbonpkilo: 1.65, categories: "1000"}]);
        jest.spyOn(dataSources.carbonAPI, 'getCfMultipleItems').mockReturnValueOnce([{item: "chiken stock", carbonpkilo: 5.05, categories: "1000"}]);
        jest.spyOn(dataSources.carbonAPI, 'getCfMultipleItems').mockReturnValueOnce([{item: "shallots", carbonpkilo: 0.39, categories: "1000"}]);
        jest.spyOn(dataSources.carbonAPI, 'getCfMultipleItems').mockReturnValueOnce([{item: "arborio rice", carbonpkilo: 1.14, categories: "1000"}]);
        jest.spyOn(dataSources.carbonAPI, 'getCfMultipleItems').mockReturnValueOnce([{item: "parmesan cheese", carbonpkilo: 9.78, categories: "1000"}]);
        jest.spyOn(dataSources.carbonAPI, 'getCfMultipleItems').mockReturnValueOnce([{item: "salt and pepper", carbonpkilo: 2, categories: "1000"}]);
        jest.spyOn(dataSources.carbonAPI, 'getCfMultipleItems').mockReturnValueOnce([{item: "fresh parsley", carbonpkilo: null, categories: "1000"}]);

        const name = "mushroom risotto";
        let actual = await resolvers.Mutation.postRecipe(null, { name }, { dataSources, user });
        let expected = { "carbonFootprintPerKg": 7.53, 
                        "imageUrl": "https://mock_url",
                        "name": "Mushroom Risotto",
                        "sourceUrl": "https://www.simplyrecipes.com/recipes/mushroom_risotto/",
                        "ingredients": [
                            { ingredient: 'butter', amountKg: 0.03, carbonFootprintPerKg: 11.92 },
                            { ingredient: 'oyster mushrooms', amountKg: 0.17, carbonFootprintPerKg: 0.73 },
                            { ingredient: 'brandy', amountKg: 0.16, carbonFootprintPerKg: 1.65 },
                            { ingredient: 'chicken stock', amountKg: 1.2, carbonFootprintPerKg: 5.05 },
                            { ingredient: 'shallots', amountKg: 0.08, carbonFootprintPerKg: 0.39 },
                            { ingredient: 'arborio rice', amountKg: 0.35, carbonFootprintPerKg: 1.14 },
                            { ingredient: 'parmesan cheese', amountKg: 0.03, carbonFootprintPerKg: 9.78 },
                            { ingredient: 'salt and pepper', amountKg: 0, carbonFootprintPerKg: 2 },
                            { ingredient: 'fresh parsley', amountKg: 0.01, carbonFootprintPerKg: null }
                          ]
                        };
        expect(actual).toEqual(expected);
    });

});

afterAll(() => {
    deleteStore();
});
