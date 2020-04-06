const RecipeAPI = require('../recipe');

let recipeAPI = new RecipeAPI();

describe('Real Recipe API', () => {

    test('2 avocados are 0.4kg', async () => {
        const food = "avocados";
        const sourceAmount = 2;
        const sourceUnit = "";
        const targetUnit = "kilograms";
        const actual = await recipeAPI.convertMetrics(food, sourceAmount, sourceUnit, targetUnit);
        const excpeted = 0.4;
        expect(actual).toEqual(excpeted);
    });

    test('return true for a wesbite with recipe in it', async () =>{
        jest.setTimeout(10000);
        const webURL = "https://www.bbcgoodfood.com/recipes/roasted-chickpea-wraps";
        const actual = await recipeAPI.getDataFromLink(webURL);
        const expected = true;
        expect(actual).toEqual(expected);
    });

    test('return false for a wesbite with recipe in it', async () =>{
        jest.setTimeout(10000);
        const webURL = "https://www.bbc.co.uk/news/in-pictures-52120114";
        const actual = await recipeAPI.getDataFromLink(webURL);
        const expected = false;
        expect(actual).toEqual(expected);
    });

})