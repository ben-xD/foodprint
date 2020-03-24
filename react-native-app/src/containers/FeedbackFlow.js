import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FoodOverview from '../screens/FoodOverview';
import Camera from '../screens/Camera';
import Feedback from '../screens/Feedback';
import Loading from '../screens/Loading';
import Correction from '../components/Correction';

const Stack = createStackNavigator();

const Food = () => {
  return (
    <Stack.Navigator initialRouteName="Your Foodprint" screenOptions={{ headerTintColor: 'green' }}>
      <Stack.Screen name="Your Foodprint" component={FoodOverview} />
      <Stack.Screen name="Camera" component={Camera} />
      <Stack.Screen name="Loading" component={Loading} />
      <Stack.Screen name="Correction" component={Correction} />
      <Stack.Screen name="Feedback" component={Feedback} />
    </Stack.Navigator>
  );
};

export default Food;
