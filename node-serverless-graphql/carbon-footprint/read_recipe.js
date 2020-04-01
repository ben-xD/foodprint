const axios = require('axios');
const API_KEY = '0473110dff3544f5920dbd2a45c56a38'; // Free up to 150 requests/day

let config = {
  headers: {
    "Content-Type": "application/json",
  }
}

const webURL = "https://www.bbcgoodfood.com/recipes/roasted-chickpea-wraps"; // Website containing the recipe 
const URL = "https://api.spoonacular.com/recipes/extract?url=" + webURL + "&apiKey=" + API_KEY;
console.log(URL);
axios.get(URL, config)
.then((response)  => {
  console.log(response.data.extendedIngredients);
  console.log(response.data.extendedIngredients[0].measures); // to access the measures of an ingredient
})    
.catch(e => {
  console.log('Error: ', e.response.data)
});