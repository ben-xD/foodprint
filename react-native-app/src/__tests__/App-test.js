// End to end tests and big integration tests go here.
// Other tests can be found in their respective folders, alongside the implementations.
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import App from '../App';
import renderer from 'react-test-renderer';
import { GET_USER_HISTORY_REPORT } from '../screens/Foodprint';

jest.mock('@react-native-community/google-signin');
jest.mock('apollo-boost');
jest.mock('react-native-screens');

// Mocking for react-native-reanimated if needed in the future.
// jest.mock('react-native-reanimated', () => ({
//   ...require('react-native-reanimated/mock'),
//   addWhitelistedNativeProps: () => { },
// })
// );

jest.mock('@gorhom/paper-onboarding', () => {
  const paperOnboarding = () => <div />;
  return paperOnboarding;
});


const mockedResponses = [
  {
    request: {
      query: GET_USER_HISTORY_REPORT,
    },
    result: {
      data: {
        getUserHistoryReport: {
          userAvg: 17.25,
          periodAvgs: [13.4, 64],
          categoryReports: [
            {
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
            {
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
          ],
        },
      },
    },
  },
];


it('App renders correctly', () => {
  let app;
  renderer.act(() => {
    app = <MockedProvider mocks={mockedResponses} addTypename={false}>
      <App />
    </MockedProvider>;
  });
});
