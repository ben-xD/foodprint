import React from 'react';

import renderer from 'react-test-renderer';
import Foodprint, { GET_CARBON_FOODPRINT, GET_WEEKLY_AVERAGE, GET_WEEKLY_COMPOSITION, GET_MONTHLY_AVERAGE, GET_MONTHLY_COMPOSITION } from '../Foodprint';
import { MockedProvider } from '@apollo/react-testing';
import AsyncStorage from '@react-native-community/async-storage';
import wait from 'waait';
import { execute } from 'apollo-boost';

const mocks = [
  {
    request: {
      query: GET_CARBON_FOODPRINT,
    },
    result: {
      data: { getUserAvg: 17.25 },
    },
  },
  {
    request: {
      query: GET_WEEKLY_AVERAGE,
    },
    result: { getPeriodAvg: 13.4 },
  },
  {
    request: {
      query: GET_WEEKLY_COMPOSITION,
    },
    result: {
      reportByCategory: {
        plantBased: [
          { 'periodNumber': 0, 'avgCarbonFootprint': 3.8 },
          { 'periodNumber': -1, 'avgCarbonFootprint': 2.7 },
          { 'periodNumber': -2, 'avgCarbonFootprint': 3.3 },
          { 'periodNumber': -3, 'avgCarbonFootprint': 2.85 },
          { 'periodNumber': -4, 'avgCarbonFootprint': 2.6 },
          { 'periodNumber': -5, 'avgCarbonFootprint': 3.3 },
        ],
        fish: [
          { 'periodNumber': 0, 'avgCarbonFootprint': 3.8 },
          { 'periodNumber': -1, 'avgCarbonFootprint': 2.6 },
          { 'periodNumber': -2, 'avgCarbonFootprint': 3.3 },
          { 'periodNumber': -3, 'avgCarbonFootprint': 2.7 },
          { 'periodNumber': -4, 'avgCarbonFootprint': 2.85 },
          { 'periodNumber': -5, 'avgCarbonFootprint': 2.6 },
        ],
        meat: [
          { 'periodNumber': 0, 'avgCarbonFootprint': 3.8 },
          { 'periodNumber': -1, 'avgCarbonFootprint': 3.3 },
          { 'periodNumber': -2, 'avgCarbonFootprint': 2.85 },
          { 'periodNumber': -3, 'avgCarbonFootprint': 2.6 },
          { 'periodNumber': -4, 'avgCarbonFootprint': 2.7 },
          { 'periodNumber': -5, 'avgCarbonFootprint': 3.3 },
        ],
        eggsAndDairy: [
          { 'periodNumber': 0, 'avgCarbonFootprint': 3.8 },
          { 'periodNumber': -1, 'avgCarbonFootprint': 3.3 },
          { 'periodNumber': -2, 'avgCarbonFootprint': 2.85 },
          { 'periodNumber': -3, 'avgCarbonFootprint': 2.6 },
          { 'periodNumber': -4, 'avgCarbonFootprint': 2.7 },
          { 'periodNumber': -5, 'avgCarbonFootprint': 2.6 },
        ],
      },
    },
  },
  {
    request: {
      query: GET_MONTHLY_AVERAGE,
    },
    result: { getPeriodAvg: 64 },
  },
  {
    request: {
      query: GET_MONTHLY_COMPOSITION,
    },
    result: {
      reportByCategory: {
        plantBased: [
          { 'periodNumber': 0, 'avgCarbonFootprint': 13.50 },
          { 'periodNumber': -1, 'avgCarbonFootprint': 19.00 },
          { 'periodNumber': -2, 'avgCarbonFootprint': 16.50 },
          { 'periodNumber': -3, 'avgCarbonFootprint': 14.25 },
          { 'periodNumber': -4, 'avgCarbonFootprint': 13.00 },
          { 'periodNumber': -5, 'avgCarbonFootprint': 16.50 },
        ],
        fish: [
          { 'periodNumber': 0, 'avgCarbonFootprint': 13.50 },
          { 'periodNumber': -1, 'avgCarbonFootprint': 13.00 },
          { 'periodNumber': -2, 'avgCarbonFootprint': 16.50 },
          { 'periodNumber': -3, 'avgCarbonFootprint': 19.00 },
          { 'periodNumber': -4, 'avgCarbonFootprint': 14.25 },
          { 'periodNumber': -5, 'avgCarbonFootprint': 13.00 },
        ],
        meat: [
          { 'periodNumber': 0, 'avgCarbonFootprint': 13.50 },
          { 'periodNumber': -1, 'avgCarbonFootprint': 16.50 },
          { 'periodNumber': -2, 'avgCarbonFootprint': 19.00 },
          { 'periodNumber': -3, 'avgCarbonFootprint': 13.00 },
          { 'periodNumber': -4, 'avgCarbonFootprint': 14.25 },
          { 'periodNumber': -5, 'avgCarbonFootprint': 16.50 },
        ],
        eggsAndDairy: [
          { 'periodNumber': 0, 'avgCarbonFootprint': 13.50 },
          { 'periodNumber': -1, 'avgCarbonFootprint': 16.5 },
          { 'periodNumber': -2, 'avgCarbonFootprint': 19 },
          { 'periodNumber': -3, 'avgCarbonFootprint': 13 },
          { 'periodNumber': -4, 'avgCarbonFootprint': 14.25 },
          { 'periodNumber': -5, 'avgCarbonFootprint': 13 },
        ],
      },
    },
  },
];

// Check current component against its snapshot
test('foodprint screen with loaded results matches previous snapshot', async () => {
  const mockedNavigation = {
    setOptions: jest.fn(),
  };

  let component;
  renderer.act(() => {
    component = <MockedProvider mocks={mocks} addTypename={false}>
      <Foodprint navigation={mockedNavigation} />
    </MockedProvider>;
  });

  expect(component).toMatchSnapshot();
});

// test('foodprint screen caches all responses', async () => {
//   const mockedNavigation = {
//     setOptions: jest.fn(),
//   };

//   let component;
//   renderer.act(() => {
//     component = <MockedProvider mocks={mocks} addTypename={false}>
//       <Foodprint navigation={mockedNavigation} />
//     </MockedProvider>;
//   });

//   await wait(0);

//   // UI's are hard to test and we currently cannot ensure the useEffect hooks are triggered in a test.
//   // They are usually triggered based on state change events, but we cannot change the state directly in a test.
//   // Instead, we mock the response from the network, which currently does not trigger useEffect hooks.
//   expect(AsyncStorage.setItem).toHaveBeenCalled();
//   expect(AsyncStorage.setItem).toBeCalledWith('monthlyAverage');
//   expect(AsyncStorage.setItem).toBeCalledWith('monthlyComposition');
//   expect(AsyncStorage.setItem).toBeCalledWith('weeklyAverage');
//   expect(AsyncStorage.setItem).toBeCalledWith('weeklyComposition');
// });

// test('foodprint screen loads from cache when no internet connection', async () => {

// })
