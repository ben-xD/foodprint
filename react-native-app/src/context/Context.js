import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import { GoogleSignin } from '@react-native-community/google-signin';
import SplashScreen from 'react-native-splash-screen';
import client from '../Client';

import { YellowBox } from 'react-native';

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
  restoreTokenFromLocalStorage: async () => {
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
    const token = await auth().currentUser.getIdToken();
    console.log({ token });
    await AsyncStorage.setItem('userIsLoggedIn', JSON.stringify(true));
    dispatch({ type: 'SIGN_IN', token });
  },
  signInWithGoogle: async () => {
    try {
      const { accessToken, idToken } = await GoogleSignin.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
      await firebase.auth().signInWithCredential(credential);
      await AsyncStorage.setItem('userIsLoggedIn', JSON.stringify(true));
      dispatch({ type: 'SIGN_IN', accessToken });
    } catch (err) {
      console.warn(err);
    }
  },
  signIn: async ({ email, password }) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      console.log({ userCredential });
    } catch (e) {
      if (e.code === 'auth/invalid-email') {
        return console.warn('tell user email invalid');
      } else if (e.code === 'auth/user-disabled') {
        return console.warn('tell user disabled');
      } else if (e.code === 'auth/user-not-found') {
        return console.warn('tell user does not exist');
      } else if (e.code === 'auth/wrong-password') {
        return console.warn('tell user wrong pw');
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
        // TODO can this function return an Promise<error> back to Signup.js. Then display it there
        return console.warn('tell user email is already used');
      } else if (e.code === 'auth/invalid-email') {
        return console.warn('tell user invalid email');
      } else if (e.code === 'auth/operation-not-allowed') {
        return console.warn('tell user server has problems');
      } else if (e.code === 'auth/weak-password') {
        return console.warn('tell user password too weak');
      }
      else { console.error(e); }
    }
    const token = await auth().currentUser.getIdToken();
    console.log({ token });
    await AsyncStorage.setItem('userIsLoggedIn', JSON.stringify(true));
    dispatch({ type: 'SIGN_IN', token });
  },
  deleteAccount: async () => {
    try {
      await auth().signInAnonymously();
      await auth().currentUser.delete();
    } catch (e) {
      // make user login again:
      console.warn(e);
    }
    client.clearStore();
    AsyncStorage.clear(); // userIsLoggedIn, historyReport, etc.
    dispatch({ type: 'SIGN_OUT' });
  },
});
