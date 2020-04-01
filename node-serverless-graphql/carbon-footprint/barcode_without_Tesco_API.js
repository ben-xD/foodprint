const barcode_products = require('./barcode_products');
const { getCarbonFootprintFromName } = require('./carbon_footprint_calculation');

const getCarbonFootprintFromBarcode = async (dataSources, barcode) => {
    // get the name of the product from barcode
    const product_name = barcode_products[barcode];

    // check if we are able to recognise that barcode
    if (product_name === undefined){
        return{
            item: undefined,
            carbonpkilo: undefined,
        };
    }

    return getCarbonFootprintFromName(dataSources, product_name);

};

module.exports = {
    getCarbonFootprintFromBarcode
};
