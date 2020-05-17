import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import { GoogleSignin } from '@react-native-community/google-signin';
import SplashScreen from 'react-native-splash-screen';
import client from '../Client';

import { YellowBox, Linking } from 'react-native';
import Snackbar from 'react-native-snackbar';
import appleAuth, {
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';

// We ignore this warning because we want to pass a camera buffer object
// This prevents persisting the state (after app restart) of the navigation at the next view
// We don't need to persist the Feedback screen.
// The user will have to take another picture to get to the feedback screen
YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);

export const initialState = {
  isLoading: true,
  isSignout: false,
  userIsLoggedIn: false,
};

const getHelpHandler = () => {
  Linking.openURL('mailto:ben@fresla.co?subject=Foodprint%20Support').catch(
    err => {
      console.warn(err);
      Snackbar.show({
        text: 'You need an email app to send an email to support.',
        duration: Snackbar.LENGTH_LONG,
      });
    },
  );
};

export const reducer = (prevState, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        userIsLoggedIn: action.userIsLoggedIn,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        userIsLoggedIn: true,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        userIsLoggedIn: false,
      };
  }
};

export const createActionCreators = (dispatch) => ({
  restoreUserLoginStateFromLocalStorage: async () => {
    // Fetch the token from storage
    let userIsLoggedIn;
    try {
      userIsLoggedIn = await AsyncStorage.getItem('userIsLoggedIn');
    } catch (e) {
      userIsLoggedIn = false;
    }
    dispatch({ type: 'RESTORE_TOKEN', userIsLoggedIn });
    SplashScreen.hide();
  },
  signInAnonymously: async () => {
    await auth().signInAnonymously();
    try {
      const token = await auth().currentUser.getIdToken();
      console.log({ token });
      await AsyncStorage.setItem('userIsLoggedIn', JSON.stringify(true));
      dispatch({ type: 'SIGN_IN' });
    } catch (error) {
      console.warn(error);
      Snackbar.show({
        text: 'Oops, something went wrong.',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  },
  signInWithGoogle: async () => {
    try {
      const { accessToken, idToken } = await GoogleSignin.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
      try {
        await firebase.auth().signInWithCredential(credential);
        await AsyncStorage.setItem('userIsLoggedIn', JSON.stringify(true));
        dispatch({ type: 'SIGN_IN' });
      } catch (err) {
        Snackbar.show({
          text: 'Oops, something went wrong.',
          duration: Snackbar.LENGTH_LONG,
        });
      }
    } catch (err) {
      console.warn(err);
    }
  },
  signInWithApple: async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
    });

    const { identityToken, nonce } = appleAuthRequestResponse;

    if (identityToken) {
      const appleCredential = firebase.auth.AppleAuthProvider.credential(identityToken, nonce);
      await firebase.auth().signInWithCredential(appleCredential);
      await AsyncStorage.setItem('userIsLoggedIn', JSON.stringify(true));
      dispatch({ type: 'SIGN_IN' });
    } else {
      Snackbar.show({
        text: 'Oops, something went wrong.',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  },
  signIn: async ({ email, password }) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      console.log({ userCredential });
    } catch (e) {
      if (e.code === 'auth/invalid-email') {
        return Snackbar.show({
          text: 'That email is not valid.',
          duration: Snackbar.LENGTH_LONG,
        });
      } else if (e.code === 'auth/user-disabled') {
        return Snackbar.show({
          text: 'Your account is disabled',
          duration: Snackbar.LENGTH_LONG,
          action: {
            text: 'GET HELP',
            textColor: 'red',
            onPress: () => {
              Linking.openURL('mailto:ben@fresla.co?subject=Foodprint%20Support').catch(
                err => {
                  console.warn(err);
                  Snackbar.show({
                    text: 'You need an email app to send an email to support.',
                    duration: Snackbar.LENGTH_LONG,
                  });
                },
              );
            },
          },
        });
      } else if (e.code === 'auth/user-not-found') {
        return Snackbar.show({
          text: 'That combination of email & password doesn\'t exist.',
          duration: Snackbar.LENGTH_LONG,
        });
      } else if (e.code === 'auth/wrong-password') {
        return Snackbar.show({
          text: 'That combination of email & password doesn\'t exist.',
          duration: Snackbar.LENGTH_LONG,
        });
      }
      else { return console.error(e); }
    }
    const token = await auth().currentUser.getIdToken();
    await AsyncStorage.setItem('userIsLoggedIn', JSON.stringify(true));
    dispatch({ type: 'SIGN_IN', token });
  },
  signOut: () => {
    // Empty local storage
    auth().signOut();
    client.clearStore();
    AsyncStorage.clear(); // userIsLoggedIn, historyReport, etc.
    dispatch({ type: 'SIGN_OUT' });
  },
  signUp: async (email, password) => {
    try {
      const userCredentials = await auth().createUserWithEmailAndPassword(email, password);
      console.log({ userCredentials });
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        return Snackbar.show({
          text: 'That email is already in use.',
          duration: Snackbar.LENGTH_LONG,
        });
      } else if (e.code === 'auth/invalid-email') {
        return Snackbar.show({
          text: 'That email isn\'t valid.',
          duration: Snackbar.LENGTH_LONG,
        });
      } else if (e.code === 'auth/operation-not-allowed') {
        console.error('auth/operation-not-allowed');
        return Snackbar.show({
          text: 'There seems to be a server error.',
          duration: Snackbar.LENGTH_LONG,
          action: {
            text: 'GET HELP',
            textColor: 'red',
            onPress: getHelpHandler,
          },
        });
      } else if (e.code === 'auth/weak-password') {
        return Snackbar.show({
          text: 'That password is too simple.',
          duration: Snackbar.LENGTH_LONG,
        });
      }
      else { console.error(e); }
    }
    const token = await auth().currentUser.getIdToken();
    console.log({ token });
    await AsyncStorage.setItem('userIsLoggedIn', JSON.stringify(true));
    dispatch({ type: 'SIGN_IN', token });
  },
  deleteAccount: async () => {
    client.clearStore();
    AsyncStorage.clear(); // userIsLoggedIn, historyReport, etc.
    dispatch({ type: 'SIGN_OUT' });
  },
});
