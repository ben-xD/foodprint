import React from 'react';

import renderer from 'react-test-renderer';
import { fireEvent, render, wait } from '@testing-library/react-native';
import Login from '../Login';
import AuthContext from '../../context/AuthContext';

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


test('Login button calls signIn function from context if email and password is valid', async () => {
  const signIn = jest.fn();

  const authentication = {
    signIn,
  };

  const utils = renderLogin(authentication);

  const emailInput = utils.getByPlaceholderText('Email');
  const famousLecturerAtImperial = 'WillKnottenbelt@NotARealEmail.co.uk';
  fireEvent.changeText(emailInput, famousLecturerAtImperial);

  const passwordInput = utils.getByPlaceholderText('Password');
  const famousLecturersPassword = 'b10ckch@1n';
  fireEvent.changeText(passwordInput, famousLecturersPassword);

  const loginButton = utils.getByText('Login');
  fireEvent.press(loginButton);
  await wait(() => expect(utils.queryByTestId('loginButton')));
  expect(signIn.mock.calls.length).toBe(1);
});

test('Login button shows error if email is not valid', async () => {
  const utils = renderLogin({});

  const emailInput = utils.getByPlaceholderText('Email');
  const famousLecturerAtImperial = 'WillKnottenbelt@NotARealEmail';
  fireEvent.changeText(emailInput, famousLecturerAtImperial);

  const passwordInput = utils.getByPlaceholderText('Password');
  const famousLecturersPassword = 'b10ckch@1n';
  fireEvent.changeText(passwordInput, famousLecturersPassword);

  const loginButton = utils.getByText('Login');
  fireEvent.press(loginButton);
  await wait(() => expect(utils.queryByTestId('loginButton')));
  // TODO add expect error here (look for string)
});

// HELPERS

// Re-use this function to render Signup, as it uses useContext. This 'mocks' that out.
function renderLogin(authentication) {
  return render(
    <AuthContext.Provider value={authentication}>
      <Login />
    </AuthContext.Provider>
  );
}

