import React, { useEffect } from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import SignupOrRegister from './src/screens/SignupOrRegister';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
import Loading from './src/screens/Loading';
import Home from './src/containers/Home';
import { AuthContext } from './src/store/Auth';
import auth from '@react-native-firebase/auth';

const Stack = createStackNavigator();

const App = () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
    SplashScreen.hide();
  }, []);

  const authContext = React.useMemo(
    () => ({
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
        await AsyncStorage.setItem('userToken', token);
        dispatch({ type: 'SIGN_IN', token });
      },
      signOut: () => {
        AsyncStorage.removeItem('userToken');
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
        await AsyncStorage.setItem('userToken', token);
        dispatch({ type: 'SIGN_IN', token });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationNativeContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Loading" component={Loading} />
          ) : state.userToken === null ? (
            // No token found, user isn't signed in
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
                <Stack.Screen name="Home" component={Home} />
              )}
        </Stack.Navigator>
      </NavigationNativeContainer>
    </AuthContext.Provider>
  );
};

export default App;