import React from 'react';
import {NavigationNativeContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Camera from './src/screens/Camera';
import Tabs from './src/containers/Tabs';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationNativeContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Back"
          component={Tabs}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Camera" component={Camera} />
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
};

export default App;
