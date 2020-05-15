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

describe('getCarbonFootprintFromRecipe (mocked dataSources)', () => {

    test('Roasted chickpea wraps has co2/kg 10', async () => {
        jest.setTimeout(10000);
        // Mock up functions that call recipeAPI
        jest.spyOn(dataSources.recipeAPI, 'getDataFromLink').mockReturnValueOnce(true);
        jest.spyOn(dataSources.recipeAPI, 'getName').mockReturnValueOnce("Roasted chickpea wraps");
        jest.spyOn(dataSources.recipeAPI, 'getIngredients').mockReturnValueOnce([
                { name: 'chickpeas', amount: 0 },
                { name: 'olive oil', amount: 0.01 },
                { name: 'ground cumin', amount: 0 }
            ]
        );
        jest.spyOn(dataSources.recipeAPI, 'getUrl').mockReturnValueOnce("https://www.bbcgoodfood.com/recipes/roasted-chickpea-wraps");
        jest.spyOn(dataSources.recipeAPI, 'getImageUrl').mockReturnValueOnce("https://mock.image.URL");
        jest.spyOn(dataSources.carbonAPI, 'getCfMultipleItems').mockReturnValue([{item: "mock", carbonpkilo: 10, categories: "1000"}]);

        const url = "https://www.bbcgoodfood.com/recipes/roasted-chickpea-wraps";
        let actual = await getCarbonFootprintFromRecipe(dataSources, url);
        let expected = { "carbonFootprintPerKg": 10,
                        "imageUrl": "https://mock.image.URL",
                        "ingredients": [{"amountKg": 0, "carbonFootprintPerKg": 10,"ingredient": "chickpeas"},
                                        {"amountKg": 0.01, "carbonFootprintPerKg": 10, "ingredient": "olive oil"},
                                        {"amountKg": 0, "carbonFootprintPerKg": 10, "ingredient": "ground cumin"}],
                         "item": "Roasted chickpea wraps",
                         "sourceUrl": "https://www.bbcgoodfood.com/recipes/roasted-chickpea-wraps"
                        };
        expect(actual).toEqual(expected);
    });

    test('A website with no recipe should return nulls', async () => {
        jest.setTimeout(10000);
        jest.spyOn(dataSources.recipeAPI, 'getDataFromLink').mockReturnValueOnce(false);
        const url = "https://www.bbc.co.uk/news/in-pictures-52120114";
        let actual = await getCarbonFootprintFromRecipe(dataSources, url);
        let expected = { "carbonFootprintPerKg": null, "item": null, "ingredients": null, "sourceUrl": null, "imageUrl": null};
        expect(actual).toEqual(expected);
    });

    test('Muhsroom risotto has co2/kg 10', async () => {
        jest.setTimeout(10000);
        // Mock up functions that call recipeAPI
        jest.spyOn(dataSources.recipeAPI, 'getDataFromName').mockReturnValueOnce(true);
        jest.spyOn(dataSources.recipeAPI, 'getName').mockReturnValueOnce("Mushroom Risotto");
        jest.spyOn(dataSources.recipeAPI, 'getIngredients').mockReturnValueOnce([
                { name: 'butter', amount: 0.03 },
                { name: 'oyster mushrooms', amount: 0.17 }
            ]
        );
        jest.spyOn(dataSources.recipeAPI, 'getUrl').mockReturnValueOnce("https://www.simplyrecipes.com/recipes/mushroom_risotto/");
        jest.spyOn(dataSources.recipeAPI, 'getImageUrl').mockReturnValueOnce("https://another.mock.image.URL");
        jest.spyOn(dataSources.carbonAPI, 'getCfMultipleItems').mockReturnValue([{item: "mock", carbonpkilo: 10, categories: "1000"}]);
        const name = "mushroom risotto";
        let actual = await getCarbonFootprintFromRecipe(dataSources, name);
        let expected = { "carbonFootprintPerKg": 10,
                        "imageUrl": "https://another.mock.image.URL",
                        "ingredients": [{"amountKg": 0.03, "carbonFootprintPerKg": 10,"ingredient": "butter"},
                                        {"amountKg": 0.17, "carbonFootprintPerKg": 10, "ingredient": "oyster mushrooms"}],
                         "item": "Mushroom Risotto",
                         "sourceUrl": "https://www.simplyrecipes.com/recipes/mushroom_risotto/"
                        };
        expect(actual).toEqual(expected);
    });

    test('Metal should return nulls', async () => {
        jest.setTimeout(10000);
        jest.spyOn(dataSources.recipeAPI, 'getDataFromName').mockReturnValueOnce(false);
        const name = "metal";
        let actual = await getCarbonFootprintFromRecipe(dataSources, name);
        let expected = { "carbonFootprintPerKg": null, "item": null, "ingredients": null, "sourceUrl": null, "imageUrl": null};
        expect(actual).toEqual(expected);
    });
});

afterAll(() => {
    deleteStore();
});

