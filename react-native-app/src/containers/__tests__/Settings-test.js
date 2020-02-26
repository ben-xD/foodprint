import React from 'react';

import renderer from 'react-test-renderer';
import { AuthContext } from '../../store/Auth';
import Settings from '../Settings';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.mock('@apollo/react-hooks');

// Check current component against its snapshot
test('ErrorMessage renders correctly and is the same as its previous snapshot', () => {
  const authentication = {
    signOut: () => { },
  };

  const tree = renderer.create(<AuthContext.Provider value={authentication}>
    <SafeAreaProvider>
      <Settings />
    </SafeAreaProvider>
  </AuthContext.Provider>).toJSON();
  expect(tree).toMatchSnapshot();
});
