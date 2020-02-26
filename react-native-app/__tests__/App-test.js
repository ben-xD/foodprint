import React from 'react';
import { } from 'react-native';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import NoInternet from '../src/screens/NoInternet';
import Signup from '../src/screens/Signup';

jest.mock('react-native-camera', () => 'Camera');
jest.mock('@react-native-community/async-storage', () => { });
jest.mock('react-native-gesture-handler', () => { });
jest.mock('@react-navigation/stack', () => { return { Header: () => 'whatever' }; });
jest.mock('@react-native-firebase/auth', () => { return {}; });


it('NoInternet component renders correctly', () => {
  renderer.create(<NoInternet />);
});

// it('NoInternet component renders correctly', () => {
//   renderer.create(<NoInternet />);
// });

// it('renders correctly', () => {
//   renderer.create(<App />);
// });

// it('renders correctly', () => {
//   renderer.create(<NoInternet />);
// });

// it('should display loading text if not rehydrated', () => {
//   const store = mockStore({
//     rehydrated: false,
//   });
//   const navigation = { navigate: jest.fn() };

//   expect(renderer.create(<Loading store={store} navigation={navigation} />)).toMatchSnapshot();
// });
