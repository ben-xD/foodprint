const axios = require('axios');
//const API_KEY = '0473110dff3544f5920dbd2a45c56a38'; // Free up to 150 requests/day
//
// let config = {
//     headers: {
//         "Content-Type": "application/json",
//     }
// };

class recipeAI {

    constructor(webURL) {
        this.API_KEY = '0473110dff3544f5920dbd2a45c56a38';
        this.url = "https://api.spoonacular.com/recipes/extract?url=" + webURL + "&apiKey=" + this.API_KEY;
        this.config = {
            headers: {
                "Content-Type": "application/json",
            }
        };
        this.content;
    }

    // Get data from API
    async getData(){
        let res = await axios.get(this.url, this.API_KEY);
        this.content = res.data;
    }

    // Method to get the name from the recipe
    async getName() {
        return this.content.title;
    }

    async getIngredients() {
        return this.content.extendedIngredients;
    }
};

const webURL = "https://www.bbcgoodfood.com/recipes/roasted-chickpea-wraps";
let test = new recipeAI(webURL);

const example = async () =>{
    await test.getData();
    let res = await test.getIngredients();
    console.log(res);

}

example();