import React, { useEffect } from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from './src/containers/Tabs';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import SignupOrRegister from './src/screens/SignupOrRegister';
import { createContext } from 'react';
import SplashScreen from 'react-native-splash-screen';

const Stack = createStackNavigator();

const UserContext = createContext({});

const App = () => {
  useEffect(() => {
    // load user into Context.

    SplashScreen.hide();
  }, []);

  return (
    <UserContext.Provider>
      <NavigationNativeContainer>
        <Stack.Navigator initialRouteName="Back" >
          <Stack.Screen
            name="Tabs"
            component={Tabs}
            screenOptions={{ headerShown: false }}
          />
          <Stack.Screen name="Back" component={SignupOrRegister}
            options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
        </Stack.Navigator>
      </NavigationNativeContainer>
    </UserContext.Provider>
  );
};

export default App;
