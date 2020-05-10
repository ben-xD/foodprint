const barcode_products = require('./barcode_products');
const axios = require('axios');
const pluralize = require('pluralize')
const { getCarbonFootprintFromName } = require('./carbon_footprint_calculation');

//contains the key to query the Tesco API
const options = {
    headers: { 'Ocp-Apim-Subscription-Key': '6b9983f7c22d42e1a242b91c7b0cfe37' }
};

// @param: tescoApi_working is a boolean value. Set it to true if tescoAPI working,
// set to false if not working.
const getCarbonFootprintFromBarcode = async (dataSources, barcode, tescoAPI_working) => {

    let result;
    if (tescoAPI_working) {
        result = await getCarbonFootprintFromBarcode_with_Tesco(dataSources, barcode);
    } else {
        result = await getCarbonFootprintFromBarcode_without_Tesco(dataSources, barcode);
    }

    return result;
};

const getCarbonFootprintFromBarcode_without_Tesco = async (dataSources, barcode) => {
    // get the name of the product from barcode
    const product_name = barcode_products[barcode];
    console.log(product_name);

    // check if we are able to recognise that barcode
    if (product_name === undefined) {
        return {
            item: null,
            carbonFootprintPerKg: null,
        };
    }

    const res = await getCarbonFootprintFromName(dataSources, product_name);
    return res;

};

const getCarbonFootprintFromBarcode_with_Tesco = async (dataSources, barcode) => {
    //get data from the barcode
    let data = await getData(barcode);
    if (data.products === undefined || data.products.length == 0) {
        console.log('This barcode has no product information');
        return {
            item: null,
            carbonFootprintPerKg: null,
        };
    }
    let product_name = cleanName(data.products[0].description);


    //run getCarbonFootprintFromName. if it returns a value that means the product
    //is in the db and thus return the value.
    let fromNameResult = await getCarbonFootprintFromName(dataSources, product_name);
    if (fromNameResult.carbonFootprintPerKg !== null)
        return fromNameResult;

    //if getCarbonFootprintFromName returns an undefined carbonFootprintPerKg, the product is not in the db yet, so sum
    //up the ingredients to get the carbon footprint.
    let result = calcCarbonFromIngredients(dataSources, data);
    if(result.carbonFootprintPerKg === null){
        result.item = null;
    }

    //store the new product in the db, unless the carbonfootprintperkg is undefined
    if (result.carbonFootprintPerKg !== null) {
        let save_to_db = {
            item: result.item,
            carbonpkilo: result.carbonFootprintPerKg,
            categories: result.categories,
            label: "approximated from ingredients"
        };
        if (await dataSources.carbonAPI.getCfOneItem([save_to_db.item]).carbonpkilo !== undefined)
            await dataSources.carbonAPI.insert_in_DB(save_to_db);
    }

    return {
        item: result.item,
        carbonFootprintPerKg: result.carbonFootprintPerKg
    };

};

//Extracts data from the barcode
//tpnb in the url can be replaced by other barcode types such as gtin, tpnb or tpnc
const getData = async (barcode) => {
    let url = 'https://dev.tescolabs.com/product/?tpnb='.concat(barcode);
    let tescoResponse = await axios.get(url, options);
    return tescoResponse.data;
};

//Function which deletes Tesco or Sainsburys from the product name
//Also returns grams (for now)
const cleanName = (name) => {
    name = name.replace('Tesco', '');
    name = name.replace('TESCO', '');
    name = name.replace('Sainsburys', '');
    name = name.replace('SAINBURYS', '');
    name = name.replace(/[0-9]g/g, '');
    name = name.replace(/[0-9]/g, '');
    name = name.replace(/X/g, ''); //assuming there is no food that starts with X
    name = name.replace(' ', '');
    name = name.toLowerCase();
    name = pluralize.singular(name);

    return name;
}

//Passes the data stored in the barcode. Extracts ingredients of the product and from those calculates
//the carbon footprint. If there are no ingredients, return undefined. (In the case of no ingredients, we have
//already run getCarbonFootprintFromName in etCarbonFootprintFromBarcode, therefore we know this product
//isnt in the database either.
const calcCarbonFromIngredients = async (dataSources, data) => {
    //check whether the product has ingredients at all
    if (data.products[0].ingredients === undefined) {
        return {
            item: null,
            carbonFootprintPerKg: null,
        }
    }

    let ingredients_raw = getIngredientList(data);
    let ingredients = delete_junk(ingredients_raw);
    console.log(ingredients);
    let carbon = await calculate_total_carbon(dataSources, ingredients);

    if (carbon_response.carbonFootprintPerKg === 0) {
        carbon_response.carbonFootprintPerKg = null;
    }

    return {
        item: cleanName(data.products[0].description),
        carbonFootprintPerKg: carbon_response.carbonFootprintPerKg,
        categories: carbon_response.categories
    };

};

//Returns the ingredients (unformatted) stored in the barcode data
const getIngredientList = (data) => {
    let ingredients_raw = "";
    for (let i = 0; i < data.products[0].ingredients.length; i++) {
        ingredients_raw = ingredients_raw.concat(data.products[0].ingredients[i]);
        ingredients_raw = ingredients_raw.concat(", ");
    }

    return ingredients_raw;

};

//Returns a 'clean' array of ingredients from an unformatted string of ingredients
const delete_junk = (ingredients_raw) => {
    //deletes everything between []
    ingredients_raw = ingredients_raw.replace(/\[.*?\]/g, '');
    //deletes everything between ()
    ingredients_raw = ingredients_raw.replace(/\(.*?\)/g, '');
    //deletes everything between <>
    ingredients_raw = ingredients_raw.replace(/\<.*?\>/g, '');
    //deletes INGREDIENTS:
    ingredients_raw = ingredients_raw.replace('INGREDIENTS: ', ''); //for some reason this wont work on tiramisu
    ingredients_raw = ingredients_raw.replace('INGREDIENTS: ', ''); //for some reason this will work on tiramisu, but not on paella
    //the string ends with '.,' delete it so that doesnt create an ingredient '.'
    ingredients_raw = ingredients_raw.replace('.,', '');
    //replace all whitespaces after a comma so that we don't end up with an ingredient "squid   "
    ingredients_raw = ingredients_raw.replace(/\s*,\s*/g, ",");

    //split the string into array of ingredients
    let ingredients = ingredients_raw.split(",");

    return ingredients;
};

//Sums up the carbon footprint of all the ingredients within the product
const calculate_total_carbon = async (dataSources, ingredients) => {
    let total_carbon = 0;
    let categories = "0000"
    for (let i = 0; i < ingredients.length && i < 5; i++) {
        console.log(ingredients[i]);
        let carbonResponse = await getCarbonFootprintFromName(dataSources, ingredients[i]);
        let carbon = carbonResponse.carbonFootprintPerKg;//how do i correctly access carbonfootpirngperkd???
        let new_categories = carbonResponse.categories;
        if (carbon != null) {
            total_carbon += carbon;
            categories = update_categories(categories, new_categories);
        }
    }

    return {
        carbonFootprintPerKg: total_carbon,
        categories: categories
    };

};

//Function which updates the status of the categories of a product
const update_categories = async (categories, new_categories) => {

    for (let i = 0; i < new_categories.length; i++) {
        if (!categories.includes(new_categories[i])) {
            categories = categories.replace("0", new_categories[i]);
        }
    }

    return categories;
};

module.exports = {
    getCarbonFootprintFromBarcode
}
