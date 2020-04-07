const { getCarbonFootprintFromRecipe } = require('../calculate_carbon_from_recipe');

const VisionAPI = require('../../datasources/vision');
const visionCredentials = require('../../credentials/carbon-7fbf76411514.json');
const CarbonAPI = require('../../datasources/carbon');
const ConceptAPI = require('../../datasources/concept');
const userHistAPI = require('../../datasources/user_history');
const RecipeAPI = require('../../datasources/recipe');

const { createStore, deleteStore } = require('../../utils');
const store = createStore();
const carbonAPI = new CarbonAPI(store);

const dataSources = {
    visionAPI: new VisionAPI(visionCredentials),
    conceptAPI: new ConceptAPI(),
    carbonAPI: carbonAPI,
    userHistAPI: new userHistAPI(store),
    recipeAPI: new RecipeAPI(),
};

describe('getCarbonFootprintFromName (mocked dataSources)', () => {

    test('Roasted chickpea wraps has co2 2.49', async () => {
        jest.setTimeout(10000);
        // Mock up functions that call recipeAPI
        jest.spyOn(dataSources.recipeAPI, 'getDataFromLink').mockReturnValueOnce(true);
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
        let actual = await getCarbonFootprintFromRecipe(dataSources, url);
        let expected = { "carbonFootprintPerKg": 2.49, "item": "Roasted chickpea wraps" };
        expect(actual).toEqual(expected);
    });

    test('A website with no recipe should return nulls', async () => {
        jest.setTimeout(10000);
        jest.spyOn(dataSources.recipeAPI, 'getDataFromLink').mockReturnValueOnce(false);
        const url = "https://www.bbc.co.uk/news/in-pictures-52120114";
        let actual = await getCarbonFootprintFromRecipe(dataSources, url);
        let expected = { "carbonFootprintPerKg": null, "item": null };
        expect(actual).toEqual(expected);
    });
});

afterAll(() => {
    deleteStore();
});
