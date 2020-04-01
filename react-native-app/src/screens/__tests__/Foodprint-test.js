import React from 'react';

import renderer from 'react-test-renderer';
import Foodprint from '../Foodprint';
import { MockedProvider } from '@apollo/react-testing';
import { mockedResponses } from '../../__tests__/.mockedResponses';

// Check current component against its snapshot
test('foodprint screen with loaded results matches previous snapshot', async () => {
  const mockedNavigation = {
    setOptions: jest.fn(),
  };

  let component;
  renderer.act(() => {
    component = <MockedProvider mocks={mockedResponses} addTypename={false}>
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
