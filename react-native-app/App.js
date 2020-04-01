import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import SignupOrRegister from './src/screens/SignupOrRegister';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import Loading from './src/screens/Loading';
import BottomTabBar from './src/containers/BottomTabBar';
import { createActionCreators, reducer, initialState } from './src/context/Context';
import Config from 'react-native-config';
import { GoogleSignin } from '@react-native-community/google-signin';
import { useNetInfo } from '@react-native-community/netinfo';
import auth from '@react-native-firebase/auth';
import AuthContext from './src/context/AuthContext';
import DeleteAccount from './src/screens/DeleteAccount';
import Snackbar from 'react-native-snackbar';
import Camera from './src/screens/Camera';
import Feedback from './src/screens/Feedback';
import Correction from './src/components/Correction';
import Foodprint from './src/screens/Foodprint';

const Stack = createStackNavigator();

const client = new ApolloClient({
  uri: Config.SERVER_URL,
  request: async (operation) => {
    if (!auth().currentUser) {
      return;
    }
    // Returns the current token if it has not expired.
    // Otherwise, this will refresh the token and return a new one.
    const token = await auth().currentUser.getIdToken();
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
});

const App = () => {
  const netInfo = useNetInfo();

  useEffect(() => {
    // Configure firebase logins (including login with email)
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
        text: 'No internet connection, using offline data',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  }, [netInfo]);

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const authContext = React.useMemo(() => createActionCreators(dispatch), [dispatch]);
  React.useMemo(() => authContext.restoreTokenFromLocalStorage(), [authContext]);

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {state.isLoading ? (
              // If isLoading, we haven't finished checking for the token yet
              <Stack.Screen name="Loading" component={Loading} />
            ) :
              // No token found, user isn't signed in
              state.userIsLoggedIn ? (
                <>
                  <Stack.Screen name="Home" component={BottomTabBar} />
                  <Stack.Screen name="Your Foodprint" component={Foodprint} />
                  <Stack.Screen name="Camera" component={Camera} />
                  <Stack.Screen name="Correction" component={Correction} />
                  <Stack.Screen name="Feedback" component={Feedback} />
                  {/* Refactor deleteAccount into new Settings */}
                  <Stack.Screen name="Delete Account" component={DeleteAccount} />
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
                </>}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </ApolloProvider>
  );
};

export default App;
