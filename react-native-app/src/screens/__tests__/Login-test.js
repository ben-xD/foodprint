import React from 'react';

import renderer from 'react-test-renderer';
import Login from '../Login';
import { AuthContext } from '../../store/Auth';

jest.mock('@apollo/react-hooks');

// Check current component against its snapshot
test('Login matches previous snapshot', () => {
  const authentication = {
    signIn: () => { },
  };

  const tree = renderer.create(<AuthContext.Provider value={authentication}>
    <Login />
  </AuthContext.Provider>).toJSON();
  expect(tree).toMatchSnapshot();
});
