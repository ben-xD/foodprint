// This file supplies mock data for network requests for tests
// Intentional '.' in filename to prevent jest thinking this is a test

import { GET_CARBON_FOODPRINT, GET_WEEKLY_AVERAGE, GET_WEEKLY_COMPOSITION, GET_MONTHLY_AVERAGE, GET_MONTHLY_COMPOSITION } from '../screens/Foodprint';

export const mockedResponses = [
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
