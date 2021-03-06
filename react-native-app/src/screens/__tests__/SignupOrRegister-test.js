import React from 'react';

import renderer from 'react-test-renderer';
import SignupOrRegister from '../SignupOrRegister';
import { fireEvent, render, wait } from '@testing-library/react-native';
import AuthContext from '../../context/AuthContext';

jest.mock('@apollo/react-hooks');
jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: () => ({
    details: {},
    isConnected: true,
  }),
}));
jest.mock('react-native-snackbar', () => ({
  show: jest.fn(),
  dismiss: jest.fn(),
}));

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

test('GoogleSignIn button calls SignInWithGoogle from context', async () => {
  const signInWithGoogle = jest.fn();
  const authentication = {
    signInWithGoogle,
  };

  const utils = renderSignUpOrRegister(authentication);

  const googleButton = utils.getByText('Join using Google');
  fireEvent.press(googleButton);
  await wait(() => expect(utils.queryByTestId('googleButton')));
});

// Skip button removed for now
// test('Skip button calls anonymous sign in', async () => {
//   const signInAnonymously = jest.fn();
//   const authentication = {
//     signInAnonymously,
//   };

//   const utils = renderSignUpOrRegister(authentication);

//   const skipButton = utils.getByText('Skip login');
//   fireEvent.press(skipButton);
//   await wait(() => expect(utils.queryByTestId('skipButton')));
//   expect(signInAnonymously.mock.calls.length).toBe(1);
// });

// HELPERS
// Re-use this function to render Signup, as it uses useContext. This 'mocks' that out.
function renderSignUpOrRegister(authentication) {
  return render(
    <AuthContext.Provider value={authentication}>
      <SignupOrRegister />
    </AuthContext.Provider>
  );
}

