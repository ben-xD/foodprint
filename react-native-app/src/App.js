import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
import Signup from './screens/Signup';
import SignupOrRegister from './screens/SignupOrRegister';
import { ApolloProvider } from '@apollo/react-hooks';
import client from './Client.js';
import Loading from './screens/Loading';
import BottomTabBar from './containers/BottomTabBar';
import { createActionCreators, reducer, initialState } from './context/Context';
import Config from 'react-native-config';
import { GoogleSignin } from '@react-native-community/google-signin';
import { useNetInfo } from '@react-native-community/netinfo';
import AuthContext from './context/AuthContext';
import DeleteAccount from './screens/DeleteAccount';
import Snackbar from 'react-native-snackbar';
import Camera from './screens/Camera';
import Feedback from './screens/Feedback';
import Correction from './screens/Correction';
import Foodprint from './screens/Foodprint';
import Recipe from './screens/Recipe';
import { Platform, Keyboard } from 'react-native';
import Onboarding from './screens/Onboarding';
import appleAuth from '@invertase/react-native-apple-authentication';
import { enableScreens } from 'react-native-screens';

// Allows OS to optimize memory usage for screens that are under the view stack
//  and also simplify the native node hierarchy https://reactnavigation.org/docs/react-native-screens/
enableScreens();

const Stack = createStackNavigator();

const App = (props) => {
  const netInfo = useNetInfo();
  // const [firstTimeUser, setFirstTimeUser] = useState(false);

  // null if app is started normally, but if android and opened via
  // specific intent-filter, then recipeUrl will be the recipeUrl from the browser
  const recipeUrl = !props ? null : Platform.select({
    ios: null,
    android: props['android.intent.extra.TEXT'],
  });

  useEffect(() => {
    // Configure firebase logins
    GoogleSignin.configure({
      scopes: [], // Add scopes here, like Google drive, calendar, etc.
      webClientId: Config.WEB_CLIENT_ID,
    });

    Keyboard.dismiss();
  }, []);

  useEffect(() => {
    if (netInfo.details !== null && !netInfo.isConnected) {
      Snackbar.show({
        text: 'No internet connection, using offline data.',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  }, [netInfo]);

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const authContext = React.useMemo(() => createActionCreators(dispatch), []);
  React.useMemo(() => {
    authContext.restoreUserLoginStateFromLocalStorage();
    // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    if (appleAuth.isSupported) {
      appleAuth.onCredentialRevoked(async () => {
        authContext.signOut();
      });
    }
  }, [authContext]);

  const renderScreens = () => {
    if (state.userIsLoggedIn) {
      return (
        <>
          {recipeUrl ? (<Stack.Screen name="Recipe" component={Recipe} initialParams={{ recipeUrl }} />) : <></>}
          <Stack.Screen name="Home" component={BottomTabBar} />
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Your Foodprint" component={Foodprint} />
          <Stack.Screen name="Camera" component={Camera} />
          <Stack.Screen name="Correction" component={Correction} />
          <Stack.Screen name="Feedback" component={Feedback} initialParams={{ client }} />
          <Stack.Screen name="Delete Account" component={DeleteAccount} />
          {!recipeUrl ? (<Stack.Screen name="Recipe" component={Recipe} initialParams={{ recipeUrl }} />) : <></>}
        </>
      );
    } else {
      return (
        <>
          <Stack.Screen
            name="SignupOrRegister"
            component={SignupOrRegister}
            options={{
              title: 'Join us',
              animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
          />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
        </>
      );
    }
  };

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {state.isLoading ? (
              <Stack.Screen name="Loading" component={Loading} />
            ) : renderScreens()}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </ApolloProvider>
  );
};

export default App;
