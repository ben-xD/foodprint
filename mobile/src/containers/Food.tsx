import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FoodOverview from '../screens/FoodOverview';

interface Props { }

const Stack = createStackNavigator();

const Food: React.FC<Props> = () => {
  return (
    <Stack.Navigator
      initialRouteName="Overview"
    >
      <Stack.Screen
        name="Overview"
        component={FoodOverview}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Food;
