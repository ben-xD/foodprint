const axios = require('axios');
const { getCarbonFootprintFromName} = require('./carbon_footprint_calculation');
const mongooseQueries = require('./mongoose_queries');

//contains the key to query the Tesco API
const options = {
    headers: {'Ocp-Apim-Subscription-Key': '6b9983f7c22d42e1a242b91c7b0cfe37'}
};

const getCarbonFootprintFromBarcode = async (barcode) => {
    //get data from the barcode
    let data = await getData(barcode);
    if(data.products === undefined || data.products.length == 0){
        console.log('This barcode has no product information');
        return {
            item: 'No product information in the barcode',
            carbonFootprintPerKg: undefined,
        };
    }
    let product_name = cleanName(data.products[0].description);


    //run getCarbonFootprintFromName (that might be very costly no?). if it returns a value that means the product
    //is in the db and thus return the value.
    let fromNameResult = await getCarbonFootprintFromName(product_name);
    if(fromNameResult.carbonFootprintPerKg !== undefined)
        return fromNameResult;

    //if getCarbonFootprintFromName returns an undefined carbonFootprintPerKg, the product is not in the db yet, so sum
    //up the ingredients to get the carbon footprint.
    let result = calcCarbonFromIngredients(data);

    //store the new product in the db, unless the carbonfootprintperkg is undefined
    //mongooseQueries.connect();
    //TODO: ADD TO MONGODB
    //mongooseQueries.disconnect();

    return result;

};

//Extracts data from the barcode
//tpnb in the url can be replaced by other barcode types such as gtin, tpnb or tpnc
const getData = async (barcode) => {
    let url = 'https://dev.tescolabs.com/product/?gtin='.concat(barcode);
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

    return name;
}

//Passes the data stored in the barcode. Extracts ingredients of the product and from those calculates
//the carbon footprint. If there are no ingredients, return undefined. (In the case of no ingredients, we have
//already run getCarbonFootprintFromName in etCarbonFootprintFromBarcode, therefore we know this product
//isnt in the database either.
const calcCarbonFromIngredients = async (data) => {
    //check whether the product has ingredients at all
    if(data.products[0].ingredients === undefined){
        return {
            item: cleanName(data.products[0].description),
            carbonFootprintPerKg: undefined,
        }
    }

    let ingredients_raw = getIngredientList(data);
    let ingredients = delete_junk(ingredients_raw);
    console.log(ingredients);
    let carbon = await calculate_total_carbon(ingredients);

    if (carbon === 0){
        carbon = undefined;
    }

    return {
        item: cleanName(data.products[0].description),
        carbonFootprintPerKg: carbon,
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
    //replace all whitespaces after a comma so that we don't end up with an ingredient "squid   "
    ingredients_raw = ingredients_raw.replace(/\s*,\s*/g, ",");

    //split the string into array of ingredients
    let ingredients = ingredients_raw.split(",");

    return ingredients;
};

//Sums up the carbon footprint of all the ingredients within the product
const calculate_total_carbon = async (ingredients) => {
    let total_carbon = 0;
    for(let i = 0; i < ingredients.length; i++){
        console.log(ingredients[i]);
        let carbon = (await getCarbonFootprintFromName(ingredients[i])).carbonFootprintPerKg; //how do i correctly access carbonfootpirngperkd???
        if(carbon != undefined)
            total_carbon += carbon;
    }

    return total_carbon;

};

// //Sample barcodes of foods
// let pickle = '61051936';
// let paella = '84597752';
// let orange = '50501316';
// let orange_gtin = '02130270000000';
// let tiramisu = '85053274';
// let soap = '066947017';
// let not_a_barcode = '000000';
// let buckwheat = '60955456';
// //let res = getCarbonFootprintFromBarcode(orange_gtin);

// const getCarbonFootprintFromBarcode = async () => {

//     let res = await getCarbonFootprintFromBarcodeAux(tiramisu);
//     console.log(res);
//     return res;

// };


module.exports = {
  getCarbonFootprintFromBarcode
}