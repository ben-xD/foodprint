import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FoodOverview from '../screens/FoodOverview';
import Camera from '../screens/Camera';
import Feedback from '../screens/Feedback';
import Loading from '../screens/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Stack = createStackNavigator();

// TODO Add network requests here to share state between components (ErrorMessage and Feedback)

const Food = () => {
  return (
    <Stack.Navigator initialRouteName="Overview">
      <Stack.Screen
        name="Overview"
        component={FoodOverview}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Camera" component={Camera}></Stack.Screen>
      <Stack.Screen name="Loading" component={Loading}></Stack.Screen>
      <Stack.Screen name="Error" component={ErrorMessage}></Stack.Screen>
      <Stack.Screen name="Feedback" component={Feedback} />
    </Stack.Navigator>
  );
};

export default Food;
