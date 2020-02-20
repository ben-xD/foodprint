const axios = require('axios');
const { getCarbonFootprintFromName } = require('./carbon_footprint_calculation');

//contains the key to query the Tesco API
const options = {
    headers: {'Ocp-Apim-Subscription-Key': '6b9983f7c22d42e1a242b91c7b0cfe37'}
};

//Returns the carbon footprint of the product from its barcode
const getCarbonFootprintFromBarcode = async (barcode) => {

    //get data from the barcode
    let data = await getData(barcode);

    //if the product does not have ingredients listed (i.e. is not a ready made meal)
    //pass its name directly to the getCarbonFootprintFromName function and return the result
    let product_name;
    if(data.products[0].ingredients === undefined){
        product_name = data.products[0].description; //NEED TO SOLVE THIS AS THE DESCRIPTION IS LIKE 'TESCO CHICKEN & PRAWN PAELLA'
        return getCarbonFootprintFromName(product_name);
    }

    let ingredients_raw = getIngredientList(data);
    let ingredients = delete_junk(ingredients_raw);
    let carbon = await calculate_total_carbon(ingredients);

    if (carbon === 0){
        carbon = undefined;
    }

    return {
        item: data.products[0].description,
        carbonFootprintPerKg: carbon,
    };

};

//Extracts data from the barcode
//tpnb in the url can be replaced by other barcode types such as gtin, tpnb or tpnc
const getData = async (barcode) => {
    let url = 'https://dev.tescolabs.com/product/?tpnb='.concat(barcode);
    let tescoResponse = await axios.get(url, options);
    return tescoResponse.data;
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
    ingredients_raw = ingredients_raw.replace(/\[.*?\]/g, '' );
    //deletes everything between ()
    ingredients_raw = ingredients_raw.replace(/\(.*?\)/g, '' );
    //deletes everything between <>
    ingredients_raw = ingredients_raw.replace(/\<.*?\>/g, '' );
    //deletes INGREDIENTS:
    ingredients_raw = ingredients_raw.replace('INGREDIENTS: ', ''); //for some reason this wont work on tiramisu
    ingredients_raw = ingredients_raw.replace('INGREDIENTS: ', ''); //for some reason this will work on tiramisu, but not on paella
    //the string ends with '.,' delete it so that doesnt create an ingredient '.'
    ingredients_raw = ingredients_raw.replace('.,', '');
    //replace all whitespaces after a comma so that we don't end up with an ingredient "squid   "*/
    ingredients_raw = ingredients_raw.replace(/\s*,\s*/g, ",");

    //split the string into array of ingredients
    let ingredients = ingredients_raw.split(",");

    return ingredients;
};

//Sums up the carbon footprint of all the ingredients within the product
const calculate_total_carbon = async (ingredients) => {
    let total_carbon = 0;
    for(let i = 0; i < ingredients.length; i++){
        let carbon = (await getCarbonFootprintFromName(ingredients[i])).carbonFootprintPerKg; //how do i correctly access carbonfootpirngperkd???
        if(carbon != undefined)
            total_carbon += carbon;
    }

    return total_carbon;

};

//Sample barcodes of foods
let pickle = '61051936';
let paella = '84597752';
let orange = '50501316';
let orange_gtin = '02130270000000';
let tiramisu = '85053274';
//let res = getCarbonFootprintFromBarcode(orange_gtin);

const test_function = async () => {

    let res = await getCarbonFootprintFromBarcode(tiramisu);
    console.log(res);

};

test_function();
