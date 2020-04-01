import React from 'react';

import renderer from 'react-test-renderer';
import Foodprint from '../Foodprint';

import { GET_WEEKLY_AVERAGE, GET_WEEKLY_COMPOSITION } from '../../components/WeeklyDisplay';
import { GET_INDEFINITE_AVERAGE } from '../../components/CarbonFootprintScoreView';
import { GET_MONTHLY_COMPOSITION, GET_MONTHLY_AVERAGE } from '../../components/MonthlyDisplay';
import { MockedProvider, wait } from '@apollo/react-testing';

const mocks = [
  {
    request: {
      query: GET_INDEFINITE_AVERAGE,
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
