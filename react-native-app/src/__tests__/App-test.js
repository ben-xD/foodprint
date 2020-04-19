import React from 'react';
import { render, act, toJSON, wait } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { MockedProvider } from '@apollo/react-testing';
import App from '../App';
import renderer from 'react-test-renderer';
import { GET_USER_HISTORY_REPORT } from '../screens/Foodprint';
import * as NetInfo from '@react-native-community/netinfo';

jest.mock('@react-native-community/google-signin');
jest.mock('apollo-boost');
jest.mock('react-native-screens');
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

test('App renders correctly', async () => {
  const shallowRenderer = new ShallowRenderer();
  let app;

  const mockedUseNetInfo = jest.fn(() => ({
    details: null,
    isConnected: false,
  }));
  jest.spyOn(NetInfo, 'useNetInfo').mockImplementationOnce(mockedUseNetInfo);

  // Tried to render shallowly (shallowRenderer.render), but coverage was very low.
  // So now back to using renderer.create to keep coverage is high, opacities and positions
  // were fractionally different on every render, failing to match previous snapshots
  await renderer.act(async () => {
    app = renderer.create(
      <MockedProvider mocks={mockedResponses} addTypename={false}>
        <App />
      </MockedProvider>
    );
  });
  wait();

  expect(mockedUseNetInfo).toBeCalledTimes(1);
  expect(app).toMatchSnapshot();
});


test('App renders from recipe shared from browser', async () => {
  const shallowRenderer = new ShallowRenderer();
  let app;

  // Previously was rendering fully (renderer.create), however, opacities and positions
  // were fractionally different on every render, failing to match previous snapshots
  // So now use ShallowRenderer https://reactjs.org/docs/shallow-renderer.html
  await renderer.act(async () => {
    app = shallowRenderer.render(
      <MockedProvider mocks={mockedResponses} addTypename={false}>
        <App props={{ 'android.intent.extra.TEXT': 'fakeRecipe' }} />
      </MockedProvider>
    );
  });

  expect(app).toMatchSnapshot();
});
