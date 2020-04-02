const CarbonAPI = require('../carbon');

const {createStore, deleteStore} = require('../../utils');
const store = createStore(); // TODO Some asynchronous action needed here

const carbonAPI = new CarbonAPI(store); // Or here...

describe('getCfOneItem: Real database', () => {

  test('Carbon footprint of rice is 1.14 and category is 1000', async () => {
    jest.setTimeout(10000);
    const name = 'rice';
    const expected = {carbonpkilo: 1.14, categories: '1000'};
    expect.assertions(1);
    const actual = await carbonAPI.getCfOneItem(name);
    expect(actual).toMatchObject(expected);
  });

  test('Item that is not in the database returns null', async () => {
    jest.setTimeout(10000);
    const name = 'definitely-not-in-the-db someRandomNoise';
    const expected = null;
    expect.assertions(1);
    const actual = await carbonAPI.getCfOneItem(name);
    expect(actual).toEqual(expected);
  });

});

describe('getCfMultipleItems: Real database', () => {

  test('Carbon footprint of rice and orange is 1.14 and 0.5 respectively', async () => {
    jest.setTimeout(10000);
    const labelList = ['orange', 'rice'];
    const expected = [
      {item: 'orange', carbonpkilo: 0.5, categories: '1000'},
      {item: 'rice', carbonpkilo: 1.14, categories: '1000'}
    ];
    expect.assertions(1);
    const actual = await carbonAPI.getCfMultipleItems(labelList);
    expect(actual).toMatchObject(expected);
  });

  test('Querying one known item and one unkown item returns a list with values only for the known item', async () => {
    jest.setTimeout(10000);
    const labelList = ['rice', 'some-veryRanDOOMiteeem:P'];
    const expected = [
      {item: 'rice', carbonpkilo: 1.14, categories: '1000'},
    ];
    expect.assertions(1);
    const actual = await carbonAPI.getCfMultipleItems(labelList);
    expect(actual).toMatchObject(expected);
  });

});

