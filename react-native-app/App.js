import React from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from './src/containers/Tabs';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import SignupOrRegister from './src/screens/SignupOrRegister';
import FoodOverview from './src/screens/FoodOverview';
import Camera from './src/screens/Camera';
import Settings from './src/containers/Settings';
import Feedback from './src/screens/Feedback';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationNativeContainer>
      <Stack.Navigator initialRouteName="Back" >
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          screenOptions={{ headerShown: true }}
        />
        <Stack.Screen name="Back" component={SignupOrRegister}
          options={{ headerShown: true }} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="FoodOverview" component={FoodOverview} />
        <Stack.Screen name="Camera" component={Camera} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Feedback" component={Feedback} />
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
};

export default App;
