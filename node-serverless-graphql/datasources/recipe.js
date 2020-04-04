const axios = require('axios');

class RecipeAPI {

    constructor() {
        this.API_KEYS = ['9efd88836fa1476fa23dfd873e490e2e', '5d370d89f92e48b79a8c993005dc13ee',
            '154716f9a0af4751ad49538178fef94f', '0473110dff3544f5920dbd2a45c56a38'];
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
        let url = "https://api.spoonacular.com/recipes/extract?url=" + webURL;
        let res = undefined;

        // Try all keys
        let i = 0;
        while (res === undefined && i < this.API_KEYS.length){
            res = await this.query_api(this.API_KEYS[i], url);
            i += 1;
        };

        // in case of errors (e.g. exceeded number of requests).
        if(res === undefined){
            return false;
        }

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
        let url = "https://api.spoonacular.com/recipes/convert?ingredientName=" + ingredientName + "&sourceAmount=" + sourceAmount + "&sourceUnit=" + sourceUnit + "&targetUnit=" + targetUnit;
        let res = undefined;

        // Try all keys
        let i = 0;
        while (res === undefined && i < this.API_KEYS.length){
            res = await this.query_api(this.API_KEYS[i], url);
            i += 1;
        };

        // in case of errors (e.g. exceeded number of requests).
        if(res === undefined){
            return null;
        }
        return res.data.targetAmount;
    }

    async query_api(API_key, url){
        // add the key to the url
        let full_url = url + "&apiKey=" + this.API_KEY;
        let res = undefined;

        // query spoonacular API with the provided key
        await axios.get(url, this.config)
            .then((response)  => {
                res = response;
            })
            .catch(e => {
                console.log('Error: ', e.response.data)
            });

        return res;

    }
};


module.exports = RecipeAPI;