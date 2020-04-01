// End to end tests and big integration tests go here.
// Other tests can be found in their respective folders, alongside the implementations.
import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/react-testing';
import App from '../App';
import { mockedResponses } from './.mockedResponses';

jest.mock('@react-native-community/google-signin');
jest.mock('apollo-boost');

it('App renders correctly', () => {
  let app;
  renderer.act(() => {
    app = <MockedProvider mocks={mockedResponses} addTypename={false}>
      <App />
    </MockedProvider>;
  });
});
