const barcode_products = require('./barcode_products');
const { getCarbonFootprintFromName } = require('./carbon_footprint_calculation');

const getCarbonFootprintFromBarcode = async (dataSources, barcode) => {
    // get the name of the product from barcode
    const product_name = barcode_products[barcode];
    console.log(product_name);

    // check if we are able to recognise that barcode
    if (product_name === undefined){
        return{
            item: null,
            carbonFootprintPerKg: null,
        };
    }

    let res = await getCarbonFootprintFromName(dataSources, product_name);
    return res;

};

module.exports = { getCarbonFootprintFromBarcode };