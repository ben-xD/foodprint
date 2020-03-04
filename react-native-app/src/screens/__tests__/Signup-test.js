import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react-native';
import renderer from 'react-test-renderer';
import Signup from '../Signup';
import { AuthContext } from '../../store/Auth';

// Snapshot test
test('SignUp renders matches previous snapshot', () => {
  const authentication = {
    signUp: () => { },
  };

  const tree = renderer.create(<AuthContext.Provider value={authentication}>
    <Signup />
  </AuthContext.Provider>).toJSON();
  expect(tree).toMatchSnapshot();
});

test('Join button calls signUp function from context if email and password is valid', async () => {
  const signUpMock = jest.fn();

  const authentication = {
    signUp: signUpMock,
  };

  const utils = renderSignUp(authentication);

  const emailInput = utils.getByPlaceholderText('Email');
  const famousLecturerAtImperial = 'WillKnottenbelt@NotARealEmail.co.uk';
  fireEvent.changeText(emailInput, famousLecturerAtImperial);

  const passwordInput = utils.getByPlaceholderText('Password');
  const famousLecturersPassword = 'b10ckch@1n';
  fireEvent.changeText(passwordInput, famousLecturersPassword);

  const button = utils.getByText('Join');
  fireEvent.press(button);
  await wait(() => expect(utils.queryByTestId('joinButton')));
  expect(signUpMock.mock.calls.length).toBe(1);
});

// TODO implement error messages for user
// test('Prevents badly formatted email', async () => {
//   const signUpMock = jest.fn();

//   const authentication = {
//     signUp: signUpMock,
//   };

//   const utils = renderSignUp(authentication);

//   const emailInput = utils.getByPlaceholderText('Email');
//   const invalidEmail = 'NotAnEmail';
//   fireEvent.changeText(emailInput, invalidEmail);

//   const passwordInput = utils.getByPlaceholderText('Password');
//   const password = 'b10ckch@1n';
//   fireEvent.changeText(passwordInput, password);

//   const button = utils.getByText('Join');
//   fireEvent.press(button);
//   await wait(() => expect(utils.queryByTestId('joinButton')));
// });


// HELPERS

// Re-use this function to render Signup, as it uses useContext. This 'mocks' that out.
function renderSignUp(authentication) {
  return render(
    <AuthContext.Provider value={authentication}>
      <Signup />
    </AuthContext.Provider>
  );
}

