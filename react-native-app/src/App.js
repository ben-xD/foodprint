import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
import Signup from './screens/Signup';
import SignupOrRegister from './screens/SignupOrRegister';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import Loading from './screens/Loading';
import BottomTabBar from './containers/BottomTabBar';
import { createActionCreators, reducer, initialState } from './context/Context';
import Config from 'react-native-config';
import { GoogleSignin } from '@react-native-community/google-signin';
import { useNetInfo } from '@react-native-community/netinfo';
import auth from '@react-native-firebase/auth';
import AuthContext from './context/AuthContext';
import DeleteAccount from './screens/DeleteAccount';
import Snackbar from 'react-native-snackbar';
import Camera from './screens/Camera';
import Feedback from './screens/Feedback';
import Correction from './components/Correction';
import Foodprint from './screens/Foodprint';

const Stack = createStackNavigator();

const client = new ApolloClient({
  uri: Config.SERVER_URL,
  request: async (operation) => {
    if (!auth().currentUser) {
      return;
    }
    // Following refreshes the token automatically if needed:
    const token = await auth().currentUser.getIdToken();
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
});

const App = (props) => {
  const netInfo = useNetInfo();

  useEffect(() => {
    console.log({ props })
    if (props && props["android.intent.extra.TEXT"]) {
      console.log(`Got a url!: ${props["android.intent.extra.TEXT"]}`)
    }
  }, [])

  useEffect(() => {
    // Configure firebase logins
    GoogleSignin.configure({
      scopes: [], // Add scopes here, like Google drive, calendar, etc.
      webClientId: Config.WEB_CLIENT_ID,
    });
  }, []);

  useEffect(() => {
    if (netInfo.details !== null && !netInfo.isConnected) {
      console.log('Displaying "no internet connection" snack');
      console.log({ netInfo });
      Snackbar.show({
        text: 'No internet connection, using offline data.',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  }, [netInfo]);

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const authContext = React.useMemo(() => createActionCreators(dispatch), [dispatch]);
  React.useMemo(() => authContext.restoreTokenFromLocalStorage(), [authContext]);

  const renderScreens = () => {
    if (state.userIsLoggedIn) {
      return (
        <>
          <Stack.Screen name="Home" component={BottomTabBar} />
          <Stack.Screen name="Your Foodprint" component={Foodprint} />
          <Stack.Screen name="Camera" component={Camera} />
          <Stack.Screen name="Correction" component={Correction} />
          <Stack.Screen name="Feedback" component={Feedback} />
          <Stack.Screen name="Delete Account" component={DeleteAccount} />
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
