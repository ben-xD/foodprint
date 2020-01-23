import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Food from './Food';
import Settings from './Settings';

interface Props {}

const Tab = createBottomTabNavigator();

const Tabs: React.FC<Props> = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Food"
        component={Food}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="food-apple"
              color={color}
              size={size}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Location"
        component={Location}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="location-on" color={color} size={size} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
