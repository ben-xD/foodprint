import React from 'react';
import Foodprint, { GET_USER_HISTORY_REPORT, WEEKLY_TIMESPAN, MONTHLY_TIMESPAN } from '../Foodprint';
import { MockedProvider } from '@apollo/react-testing';
// renderer should be imported after react-native (implicitly by Foodprint)
// according to https://formidable.com/open-source/victory/docs/native/
import renderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import { useState } from 'react';
import { when } from 'jest-when';

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

// Check current component against its snapshot
test('Foodprint with WEEK selected with loaded results matches previous snapshot', async () => {
  const mockedNavigation = {
    setOptions: jest.fn(),
  };

  // when(useState).calledWith(WEEKLY_TIMESPAN).mockReturnValue([WEEKLY_TIMESPAN, jest.fn()]);

  let component;
  renderer.act(() => {
    component = <MockedProvider mocks={mockedResponses} addTypename={false}>
      <Foodprint navigation={mockedNavigation} />
    </MockedProvider>;
  });

  expect(component).toMatchSnapshot();
});

// Check current component against its snapshot
test('foodprint screen with MONTH selected with loaded results matches previous snapshot', async () => {
  const mockedNavigation = {
    setOptions: jest.fn(),
  };

  // TODO fix this mocking of state
  // const mockedUseState = jest.mock(useState);
  // jest.spyOn(React, 'useState').mockImplementation(() => ([MONTHLY_TIMESPAN, jest.fn()]));
  // when(mockedUseState).calledWith(WEEKLY_TIMESPAN).mockReturnValue([MONTHLY_TIMESPAN, jest.fn()]);

  const shallowRenderer = new ShallowRenderer();
  const result = shallowRenderer.render(<MockedProvider mocks={mockedResponses} addTypename={false}>
    <Foodprint navigation={mockedNavigation} />
  </MockedProvider>);
  expect(result).toMatchSnapshot();

  // let component;
  // renderer.act(() => {
  //   component = <MockedProvider mocks={mockedResponses} addTypename={false}>
  //     <Foodprint navigation={mockedNavigation} />
  //   </MockedProvider>;
  // });

  // expect(component).toMatchSnapshot();
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

test('Foodprint screen shows both WEEK and MONTH view successfully', async () => {

});
