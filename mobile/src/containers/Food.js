import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FoodOverview from '../screens/FoodOverview';
import Camera from '../screens/Camera';

const Stack = createStackNavigator();

const Food = () => {
  return (
    <Stack.Navigator initialRouteName="Overview">
      <Stack.Screen
        name="Overview"
        component={FoodOverview}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Camera" component={Camera}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default Food;
