const { getCarbonFootprintFromNameUsedForRecipe } = require('./carbon_footprint_calculation');

const getCarbonFootprintFromRecipe = async (dataSources, name) => {
    let response;
    // if the name is a url, call getDataFromLink, else call getDataFromName
    if(name.includes("http")){
        response = await dataSources.recipeAPI.getDataFromLink(name);
    } else {
        response = await dataSources.recipeAPI.getDataFromName(name);
    }

    // If website is not a recipe website, return nulls
    if(!response){
        return{
            item: null,
            carbonFootprintPerKg: null
        }
    }

    // Extract the name of the food, ingredients and url
    const food_name = await dataSources.recipeAPI.getName();
    let ingredients = await dataSources.recipeAPI.getIngredients();
    let sourceUrl = await dataSources.recipeAPI.getUrl();

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
        carbonFootprintPerKg: result.carbonFootprintPerKg
    };

};

//Sums up the carbon footprint of all the ingredients within the recipe
const calculate_total_carbon = async (dataSources, ingredients) => {
    let total_carbon = 0;
    let categories = "0000";
    for(let i = 0; i < ingredients.length; i++){
        let carbonResponse = await getCarbonFootprintFromNameUsedForRecipe(dataSources, ingredients[i].name);
        let carbon = carbonResponse.carbonFootprintPerKg;
        let new_categories = carbonResponse.categories;
        if(carbon !== null) {
            total_carbon += carbon * ingredients[i].amount;
            categories = await update_categories(categories, new_categories);
        }
    }

    return {
        carbonFootprintPerKg: +(total_carbon.toFixed(2)),
        categories: categories
    };

};

//Function which updates the status of the categories of a product
const update_categories = async (categories, new_categories) => {

    for (let i = 0; i < new_categories.length; i++){
        if(!categories.includes(new_categories[i])){
            categories = categories.replace("0", new_categories[i]);
        }
    }

    return categories;
};

module.exports = { getCarbonFootprintFromRecipe };