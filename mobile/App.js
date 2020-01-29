import React from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from './src/containers/Tabs';
import Main from './src/screens/Main';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationNativeContainer>
      <Stack.Navigator initialRouteName="Back" >
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen name="Back" component={Main} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
};

export default App;
