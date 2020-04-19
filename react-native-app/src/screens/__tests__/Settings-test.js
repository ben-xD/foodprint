import React from 'react';
import renderer from 'react-test-renderer';
import Settings from '../Settings';
import AuthContext from '../../context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

test('matches snapshot', async () => {
  const mockedSignOut = jest.fn();
  const authentication = {
    signOut: mockedSignOut,
  };

  const app = renderer.create(
    <SafeAreaProvider>
      <AuthContext.Provider value={authentication}>
        <Settings />
      </AuthContext.Provider>
    </SafeAreaProvider >
  );

  expect(app).toMatchSnapshot();
});

