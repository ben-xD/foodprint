const barcode = require('../barcode');

test('empty test', () => {
  expect('hello').toBe('hello');
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
