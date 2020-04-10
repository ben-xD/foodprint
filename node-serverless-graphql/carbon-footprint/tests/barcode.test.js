const { getCarbonFootprintFromBarcode } = require('../barcode');

const VisionAPI = require('../../datasources/vision');
const visionCredentials = require('../../credentials/carbon-7fbf76411514.json');
const { createStore, deleteStore } = require('../../utils');
const store = createStore();

const CarbonAPI = require('../../datasources/carbon');
const carbonAPI = new CarbonAPI(store);
const ConceptAPI = require('../../datasources/concept');
const userHistAPI = require('../../datasources/user_history');


const dataSources = {
  visionAPI: new VisionAPI(visionCredentials),
  carbonAPI,
  conceptAPI: new ConceptAPI(),
  userHistAPI: new userHistAPI(store),
};

describe('testing barcode without Tesco API', () => {

  test('get co2 of lasagna (we have stored the barcode in json file), which should be 3.4', async () => {
    jest.setTimeout(30000);
    const barcode = "5057753197223";
    const actual = await getCarbonFootprintFromBarcode(dataSources, barcode, false);
    const expected = { item: 'lasagna', carbonFootprintPerKg: 3.4 };
    expect(actual).toEqual(expected);
  });

  test('get co2 of nonexistent barcode (we have not stored the barcode in json file)', async () => {
    jest.setTimeout(30000);
    const barcode = "0000000";
    const actual = await getCarbonFootprintFromBarcode(dataSources, barcode, false);
    const expected = { item: null, carbonFootprintPerKg: null };
    expect(actual).toEqual(expected);
  });
});

// // before testing this make sure to add 'Oranges Each' to the db
// test('getCarbonFootprintFromBarcode: barcode of a product that is already in the database', async () => {
//   const oranges_each_barcode = '50501316';
//   const response = await barcode.getCarbonFootprintFromBarcode(oranges_each_barcode);
//   expect(response).toEqual({ item: 'Oranges Each', carbonFootprintPerKg: 0.5 });
// });
//
// test('getCarbonFootprintFromBarcode: barcode of a product who is not in the database'
//   + ' and also has no ingredients listed', async () => {
//     const buckwheat_barcode = '60955456';
//     const response = await barcode.getCarbonFootprintFromBarcode(buckwheat_barcode_barcode);
//     expect(response).toEqual({ item: 'Tesco Buckwheat 500G', carbonFootprintPerKg: undefined }); // this might not be tesco buckwheat, but buckwheat now
//   });
//
// // What to do when the product is not food/drink?
// test('getCarbonFootprintFromBarcode: barcode of a product which is not a food', async () => {
//   const soap_barcode = '066947017';
//   const response = await barcode.getCarbonFootprintFromBarcode(soap_barcode);
//   expect(response).toEqual({ item: 'Dove Original Bar Soap 6X100g', carbonFootprintPerKg: undefined });
// });
//
// test('getCarbonFootprintFromBarcode: barcode of a product which has no information', async () => {
//   const no_info_barcode = '000000';
//   const response = await barcode.getCarbonFootprintFromBarcode(no_info_barcode_barcode);
//   expect(response).toEqual({ item: 'No product information in the barcode', carbonFootprintPerKg: undefined });
// });
//
// // Might have to change this food after every run, bc each run adds them to the database
// test('getCarbonFootprintFromBarcode: barcode of a product who is not in the database'
//   + ' ,but has ingredients listed', async () => {
//     const tiramisu_barcode = '84597752';
//     const response = await barcode.getCarbonFootprintFromBarcode(tiramisu_barcode);
//     expect(response).toEqual({ item: 'Tesco Tiramisu 2X85g', carbonFootprintPerKg: xxx }); // change carbonperkg here
//     // might have changed from tessco tiramisu to just tiramisu
//   });

afterAll(() => {
  deleteStore();
});
