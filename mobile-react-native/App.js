import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import MainScreen from './app/screens/MainScreen';

class HomeScreen extends React.Component {
  render() {
    return (
      <MainScreen />
    );
  }
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
});

export default createAppContainer(AppNavigator);
