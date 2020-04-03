const { getCarbonFootprintFromRecipe } = require('../calculate_carbon_from_recipe');

const VisionAPI = require('../../datasources/vision');
const visionCredentials = require('../../credentials/carbon-7fbf76411514.json');
const CarbonAPI = require('../../datasources/carbon');
const ConceptAPI = require('../../datasources/concept');
const userHistAPI = require('../../datasources/user_history');
const RecipeAPI = require('../../datasources/recipe');

const  { createStore, deleteStore } = require('../../utils');
const store = createStore();
const carbonAPI = new CarbonAPI(store);

const dataSources = {
    visionAPI: new VisionAPI(visionCredentials),
    conceptAPI: new ConceptAPI(),
    carbonAPI:  carbonAPI,
    userHistAPI: new userHistAPI(store),
    recipeAPI: new RecipeAPI(),
};


describe('getCarbonFootprintFromName (mocked dataSources)', () => {

    test('Roasted chickpea wraps has co2 2.49', async () => {
        jest.setTimeout(10000);
        const url = "https://www.bbcgoodfood.com/recipes/roasted-chickpea-wraps";
        let actual = await getCarbonFootprintFromRecipe(dataSources, url);
        let expected =  {"carbonFootprintPerKg": 2.49, "item": "Roasted chickpea wraps"};
        expect(actual).toEqual(expected);
    });

    test('A website with no recipe should return nulls', async () => {
        jest.setTimeout(10000);
        const url = "https://www.bbc.co.uk/news/in-pictures-52120114";
        let actual = await getCarbonFootprintFromRecipe(dataSources, url);
        let expected =  {"carbonFootprintPerKg": null, "item": null};
        expect(actual).toEqual(expected);
    });



});
