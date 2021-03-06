const axios = require('axios');

class RecipeAPI {

    constructor() {
        this.headers = {
            "content-type":"application/octet-stream",
            "x-rapidapi-host":"spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
            "x-rapidapi-key":"59dedbad60msh8562405bdf32460p1fdbeajsn16fb6904af87"
        };
        this.content;
    }

    // Get data from a url using the API. Have to run this before getName and getIngredients.
    // Returns true if reasons that the url is a recipe, false if not a recipe.
    async getDataFromLink(webURL){
        let url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/extract";
        let res = undefined;
        let params = {
            "forceExtraction":"true",
            "url": webURL
        };

        // Query the API
        res = await this.query_api(url, params);

        // in case of errors (e.g. exceeded number of requests).
        if(res === undefined){
            return false;
        }

        // Check if website is a recipe link
        if(res.data.weightWatcherSmartPoints === 0 && res.data.preparationMinutes === undefined && res.data.cookingMinutes === undefined && res.data.healthScore === 0 && res.data.pricePerServing === 0 && (res.data.readyInMinutes === 0 || res.data.readyInMinutes === undefined)){
            return false;
        };
        this.content = res.data;
        return true;
    }

    // Get data from a name using the API. Have to run this before getName and getIngredients.
    // Returns true if the name has recipes associated with it, otherwise returns false.
    async getDataFromName(name){
        let url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search";
        let res = undefined;
        let params = {
            "query": name
        };

        // Query the API for a recipe
        res = await this.query_api(url, params);

        // in case of errors (e.g. exceeded number of requests).
        if(res === undefined) {
            return null;
        }

        // check if API found any recipes for this name. If not, return false
        if(res.data.results.length === 0){
            console.log("Could not find a recipe for this name");
            return false;
        };

        let recipe_id = res.data.results[0].id;
        url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/" + recipe_id + "/information";
        params = {};

        // Query the API for info on the recipe found
        res = await this.query_api(url, params);

        // in case of errors (e.g. exceeded number of requests).
        if(res === undefined) {
            return null;
        }

        this.content = res.data;
        return true;
    }

    // Method to get the url from the recipe. Have to run getDataFromLink or getDataFromName first once.
    async getUrl() {
        return this.content.sourceUrl;
    }

    // Method to get the name from the recipe. Have to run getDataFromLink or getDataFromName first once.
    async getName() {
        return this.content.title;
    }

    // Method to get the url of the main image of the recope. Have to run getDataFromLink or getDataFromName first once.
    async getImageUrl() {
        return this.content.image;
    }

    // Method to get ingredients from the recipe. Have to run getDataFromLink or getDataFromName first once.
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
        let url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/convert";
        let res = undefined;
        let params = {
            "sourceUnit": sourceUnit,
            "sourceAmount": sourceAmount,
            "ingredientName": ingredientName,
            "targetUnit": targetUnit
        };

        // Query API
        res = await this.query_api(url, params);

        // in case of errors (e.g. exceeded number of requests).
        if(res === undefined) {
            return null;
        }
        return res.data.targetAmount;
    }

    // Method to query the API
    // @param url: the url needed to make a request via AXIOS
    // @param params: parameters that a request takes
    async query_api(url, params){
        let res = undefined;

        // query spoonacular API with the provided key
        await axios({"method":"GET",
            "url": url,
            "headers": this.headers,
            "params": params})
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