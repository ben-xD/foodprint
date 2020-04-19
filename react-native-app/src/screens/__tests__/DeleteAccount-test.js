import React from 'react';
import renderer from 'react-test-renderer';
import DeleteAccount, { DELETE_ACCOUNT } from '../DeleteAccount';
import AuthContext from '../../context/AuthContext';
import { MockedProvider } from '@apollo/react-testing';
import { SafeAreaProvider } from 'react-native-safe-area-context';

test('matches snapshot', () => {

  const authentication = {
    deleteAccount: jest.fn(),
  };

  const mockedResponses = [
    {
      request: {
        query: DELETE_ACCOUNT,
      },
      result: () => {
        return {
          data: true,
        };
      },
    },
  ];

  const tree = renderer.create(
    <SafeAreaProvider>
      <MockedProvider mocks={mockedResponses} addTypename={false}>
        <AuthContext.Provider value={authentication}>
          <DeleteAccount />
        </AuthContext.Provider>
      </MockedProvider>
    </SafeAreaProvider >
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

