const axios = require('axios');

class recipeAPI {

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
    async getData(webURL){
        let url = "https://api.spoonacular.com/recipes/extract?url=" + webURL + "&apiKey=" + this.API_KEY;
        let res = await axios.get(url, this.config);
        this.content = res.data;
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
            ingredients[i] = {
                name: full_ingredients[i].name,
                amount: full_ingredients[i].amount,
                unit: full_ingredients[i].unit
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

// const webURL = "https://www.bbcgoodfood.com/recipes/roasted-chickpea-wraps";
// let test = new recipeAI();
//
// const example = async () =>{
//     await test.getData(webURL);
//     let res = await test.convertMetrics("flour", "2.5", "cups", "grams");
//     console.log(res);
//
// }
//
// example();