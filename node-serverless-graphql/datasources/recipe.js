const axios = require('axios');

class RecipeAPI {

    constructor() {
        this.API_KEY = '0473110dff3544f5920dbd2a45c56a38';
        this.config = {
            headers: {
                "Content-Type": "application/json",
            }
        };
        this.content;
    }

    // Get data from API. Have to run this before getName and getIngredients.
    // Returns true if reasons that the url is a recipe, false if not a recipe.
    async getData(webURL){
        let url = "https://api.spoonacular.com/recipes/extract?url=" + webURL + "&apiKey=" + this.API_KEY;
        console.log("start getting res");
        let res = await axios.get(url, this.config);
        console.log("got the res");
        // Check if website is a recipe link
        if(res.data.weightWatcherSmartPoints === 0 && res.data.preparationMinutes === undefined && res.data.cookingMinutes === undefined && res.data.healthScore === 0 && res.data.pricePerServing === 0){
            return false;
        };
        this.content = res.data;
        return true;
    }

    // Method to get the name from the recipe. Have to run getData first once.
    async getName() {
        return this.content.title;
    }

    // Method to get ingredients from the recipe. Have to run getData first once.
    async getIngredients() {
        let full_ingredients = this.content.extendedIngredients;
        let ingredients = [];
        for (let i = 0; i < full_ingredients.length; i++){
            // Convert amount to be in kg and save it together with the name
            let amount_in_kg = await this.convertMetrics(full_ingredients[i].name, full_ingredients[i].amount, full_ingredients[i].unit, "kilograms");
            ingredients[i] = {
                name: full_ingredients[i].name,
                amount: amount_in_kg
            }
        }
        return ingredients;
    }

    // Method to convert metrics.
    //@params ingredientName: ingredient for which to convert units
    //        sourceAmount: the amount of ingredient you have in current metric
    //        sourceUnit: the metric in which you currently have the ingredient
    //        targetUnitL the metric in which you wish to convert the amount
    //@return: amount of ingredient in targetUnit metric
    async convertMetrics(ingredientName, sourceAmount, sourceUnit, targetUnit) {
        let url = "https://api.spoonacular.com/recipes/convert?ingredientName=" + ingredientName + "&sourceAmount=" + sourceAmount + "&sourceUnit=" + sourceUnit + "&targetUnit=" + targetUnit + "&apiKey=" + this.API_KEY;
        let res = await axios.get(url, this.config);
        return res.data.targetAmount;
    }
};


module.exports = RecipeAPI;

// //const webURL = "https://www.bbcgoodfood.com/recipes/roasted-chickpea-wraps";
// //const webURL = "https://www.bbc.co.uk/news/in-pictures-52120114";
// //const webURL = "https://en.wikipedia.org/wiki/Cauchy%27s_integral_formula"
// //const webURL = "https://www.bbcgoodfood.com/recipes/chocolate-eclairs";
// const webURL = "https://www.delfi.lv/";
// let test = new RecipeAPI();
//
// const example = async () =>{
//     let res = await test.getData(webURL);
//     //let res = await test.convertMetrics("avocados", "2", "", "kilograms");
//     //let res = await test.getIngredients();
//     console.log(res);
//
// }
//
// example();