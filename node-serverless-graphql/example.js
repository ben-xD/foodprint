// const { getCarbonFootprintFromRecipe } = require('../calculate_carbon_from_recipe');
//
// const VisionAPI = require('../../datasources/vision');
// const visionCredentials = require('../../credentials/carbon-7fbf76411514.json');
// const CarbonAPI = require('../../datasources/carbon');
// const ConceptAPI = require('../../datasources/concept');
// const userHistAPI = require('../../datasources/user_history');
// const RecipeAPI = require('../../datasources/recipe');
//
// const  { createStore, deleteStore } = require('../../utils');
// const store = createStore();
// const carbonAPI = new CarbonAPI(store);
//
// const dataSources = {
//     visionAPI: new VisionAPI(visionCredentials),
//     conceptAPI: new ConceptAPI(),
//     carbonAPI:  carbonAPI,
//     userHistAPI: new userHistAPI(store),
//     recipeAPI: new RecipeAPI(),
// };
//
// describe('getCarbonFootprintFromRecipe', () => {
//
//     test('co2 of a "Roasted chickpea wraps" is 2.48', async () => {
//         const url = "https://www.bbcgoodfood.com/recipes/roasted-chickpea-wraps";
//         let actual = await getCarbonFootprintFromRecipe(dataSources, url);
//         const expected = 2.48;
//         expect(actual).toEqual(excpeted);
//     });
//
//
//
// });