const { getCarbonFootprintFromNameUsedForRecipe } = require('./carbon_footprint_calculation');

const getCarbonFootprintFromRecipe = async (dataSources, url) => {
    await dataSources.recipeAPI.getData(url);

    // Extract the name of the food and ingredients
    const food_name = await dataSources.recipeAPI.getName();
    let ingredients = await dataSources.recipeAPI.getIngredients();

    // First check whether this food is already in the databse
    let result = await dataSources.carbonAPI.getCfOneItem(food_name);
    if(result !== null){
        return{
            item: result.item,
            carbonFootprintPerKg: result.carbonpkilo
        };
    }

    // If this food is not yet in the database, approximate its co2 from ingredients
    result = await calculate_total_carbon(dataSources, ingredients);
    if(result.carbonFootprintPerKg === 0){
        return {
            item: null,
            carbonFootprintPerKg: null
        }
    }

    // Clearly, now the food is not yet in database and the approximated co2 is not 0, therefore add to db
    let save_to_db = {
        item: food_name,
        carbonpkilo: result.carbonFootprintPerKg,
        categories: result.categories,
        label: "approximated from ingredients (from recipe)"
    };
    await dataSources.carbonAPI.insert_in_DB(save_to_db);

    // Finally return the caculated co2 and detected food name
    return {
        item: food_name,
        carbonFootprintPerKg:result.carbonFootprintPerKg
    };

};

//Sums up the carbon footprint of all the ingredients within the recipe
const calculate_total_carbon = async (dataSources, ingredients) => {
    let total_carbon = 0;
    let categories = "0000";
    for(let i = 0; i < ingredients.length; i++){
        console.log(ingredients[i]);
        let carbonResponse = await getCarbonFootprintFromNameUsedForRecipe(dataSources, ingredients[i].name);
        let carbon = carbonResponse.carbonFootprintPerKg;//how do i correctly access carbonfootpirngperkd???
        let new_categories = carbonResponse.categories;
        if(carbon !== undefined) { //this will have to be changed to carbon
            total_carbon += carbon * ingredients[i].amount;
            console.log(new_categories);
            categories = await update_categories(categories, new_categories);
        }
    }

    return {
        carbonFootprintPerKg: total_carbon,
        categories: categories
    };

};

//Function which updates the status of the categories of a product
const update_categories = async (categories, new_categories) => {

    for (let i = 0; i < new_categories.length; i++){
        console.log(new_categories[i]);
        if(!categories.includes(new_categories[i])){
            categories = categories.replace("0", new_categories[i]);
        }
    }

    return categories;
};


// const VisionAPI = require('../datasources/vision');
// const visionCredentials = require('../credentials/carbon-7fbf76411514.json');
// const CarbonAPI = require('../datasources/carbon');
// const ConceptAPI = require('../datasources/concept');
// const userHistAPI = require('../datasources/user_history');
// const RecipeAPI = require('../datasources/recipe');
//
// const { createStore, deleteStore } = require('../utils');
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
// const example = async () => {
//     const webURL = "https://www.bbcgoodfood.com/recipes/roasted-chickpea-wraps";
//     let res = await getCarbonFootprintFromRecipe(dataSources, webURL);
//     console.log(res);
//     // let categories = "4000";
//     // let new_categories = "3000";
//     // let res = await update_categories(categories, new_categories);
//     // console.log(res);
// };
//
// example();
