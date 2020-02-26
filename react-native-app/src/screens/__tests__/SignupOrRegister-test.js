import React from 'react';

import renderer from 'react-test-renderer';
import SignupOrRegister from '../SignupOrRegister';
import { AuthContext } from '../../store/Auth';
import { render } from '@testing-library/react-native';

jest.mock('@apollo/react-hooks');

// Check current component against its snapshot
test('SignupOrRegister matches previous snapshot', () => {
  const authentication = {
    signInWithGoogle: () => { },
    signInAnonymously: () => { },
  };

  const tree = renderer.create(<AuthContext.Provider value={authentication}>
    <SignupOrRegister />
  </AuthContext.Provider>).toJSON();
  expect(tree).toMatchSnapshot();
});

// HELPERS

// Re-use this function to render Signup, as it uses useContext. This 'mocks' that out.
function renderSignUp(authentication) {
  return render(
    <AuthContext.Provider value={authentication}>
      <SignupOrRegister />
    </AuthContext.Provider>
  );
}

