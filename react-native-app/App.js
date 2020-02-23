import React, { useEffect } from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import SignupOrRegister from './src/screens/SignupOrRegister';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import Feedback from './src/screens/Feedback';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
import Loading from './src/screens/Loading';
import Home from './src/containers/Home';
import { AuthContext } from './src/store/Auth';
import auth from '@react-native-firebase/auth';
import Config from 'react-native-config';
import { GoogleSignin } from '@react-native-community/google-signin';
import { firebase } from '@react-native-firebase/auth';
import { useNetInfo } from '@react-native-community/netinfo';
import NoInternet from './src/screens/NoInternet';

const Stack = createStackNavigator();

const client = new ApolloClient({
  uri: Config.SERVER_URL,
  request: async (operation) => {
    // Returns the current token if it has not expired. Otherwise, this will refresh the token and return a new one. This is better than using AsyncStorage and storing a token locally.
    if (!auth().currentUser) {
      return;
    }
    const token = await auth().currentUser.getIdToken();
    console.log({ token });
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
});

const App = () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userIsLoggedIn: true,
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
            userIsLoggedIn: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userIsLoggedIn: null,
    }
  );

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userIsLoggedIn;

      try {
        userIsLoggedIn = await AsyncStorage.getItem('userIsLoggedIn');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', userIsLoggedIn });
    };

    bootstrapAsync();

    (async () => {
      await GoogleSignin.configure({
        scopes: [],
        webClientId: '219082342827-8deros51ih3eb4lu64bkk9o6o86tcbff.apps.googleusercontent.com',
      });
      SplashScreen.hide();
    })();
  }, []);

  const authContext = React.useMemo(
    () => ({
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
        AsyncStorage.removeItem('userIsLoggedIn');
        auth().signOut();
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async (email, password) => {
        try {
          const userCredentials = await auth().createUserWithEmailAndPassword(email, password);
          console.log({ userCredentials });
        } catch (e) {
          if (e.code === 'auth/email-already-in-use') {
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
    }),
    []
  );

  const netInfo = useNetInfo();

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={authContext}>
        <NavigationNativeContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {state.isLoading ? (
              // We haven't finished checking for the token yet
              <Stack.Screen name="Loading" component={Loading} />
            ) : netInfo.isConnected ? (
              // No token found, user isn't signed in
              state.userIsLoggedIn ? (
                <>
                  <Stack.Screen name="Home" component={Home} />
                  <Stack.Screen name="Feedback" component={Feedback} />
                </>
              )
                :
                <>
                  <Stack.Screen
                    name="SignupOrRegister"
                    component={SignupOrRegister}
                    options={{
                      title: 'Sign Up or Register',
                      // When logging out, a pop animation feels intuitive
                      animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                    }}
                  />
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="Signup" component={Signup} />
                </>
            ) : (
                  <Stack.Screen name="NoInternet" component={NoInternet}></Stack.Screen >
                )}
          </Stack.Navigator>
        </NavigationNativeContainer>
      </AuthContext.Provider>
    </ApolloProvider>
  );
};

export default App;
