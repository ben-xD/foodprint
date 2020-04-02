//const csv = require('csv-parser');
const fs = require('fs');
const csv = require('csvtojson');
const CarbonAPI = require('../datasources/carbon');
const catergorisedCarbonValues = require("./categorisedCarbonValues.json");
const {oneLayerSearch, getNextLayer} = require('./carbon_footprint_calculation');
carbonAPI = new CarbonAPI();


const readFile = (file) => {
    let array = []
    fs.createReadStream(file)
    .pipe(csv())
    .on('data', (row)=> {
        console.log(row);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });

    return array;
};

const preCompute = async (file) => {
    const data = await csv().fromFile(file);
    carbonAPI.connect();

    for (let i = 0; i < data.length; i++){
        let row = data[i];
        let  new_item = row["Food"].toLowerCase();
        const new_category = row["Group"].toLowerCase();

        let carbonFootprintPerKg = await carbonAPI.getCfOneItem(new_item);
        if (carbonFootprintPerKg === undefined){  // If in DB --> skip

            // If not in DB --> get_next_layer, one_layer_serach
            const next_layer = await getNextLayer([new_item]);
            console.log(next_layer);
            const response = await oneLayerSearch(carbonAPI, next_layer);
            const carbonFootprintPerKg = response.carbonpkilo;


            if (carbonFootprintPerKg !== undefined){
                const new_categories = response.categories;
                const item = response.item.toString();
                let new_data = [{item: new_item, carbonpkilo: carbonFootprintPerKg, categories: new_categories, label: "approximated from product " + item}];
                console.log("1", new_data);
                carbonAPI.insert_in_DB(new_data);
            }

            else if (catergorisedCarbonValues[new_category]!== undefined) {  // If  we have the category in the categorisedCarbonValues.json file

                let carbonFootprintPerKg = catergorisedCarbonValues[new_category][0]["carbonpkilo"];
                let new_categories = catergorisedCarbonValues[new_category][0]["categories"];
                let new_data = [{item: new_item, carbonpkilo: carbonFootprintPerKg, categories: new_categories, label: "approximated from product " + new_category}];
                console.log("2", new_data);
                carbonAPI.connect();
                carbonAPI.insert_in_DB(new_data);
            }
        };
    }
    carbonAPI.disconnect();
}

//let data = readFile('node-serverless-graphql/carbon-footprint/food_db.csv');
//console.log(data);
preCompute('node-serverless-graphql/carbon-footprint/food_db.csv');
