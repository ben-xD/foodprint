import PaperOnboarding from '@gorhom/paper-onboarding';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CommonActions } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const subScreens = [
  {
    title: 'Welcome to Foodprint',
    description: 'Track the sustainability of your diet.',
    color: 'grey',
    image: <Ionicons name="md-planet" color="white" size={80} />,
  },
  {
    title: 'Works with Unpackaged Foods,',
    description: 'We use computer vision to determine what food you have.',
    color: '#35605A',
    image: <MaterialCommunityIcons name="food-croissant" color="white" size={80} />,
  },
  {
    title: 'Products with Barcodes,',
    description: 'We\'ll scan a barcode and tell you its carbon footprint.',
    color: '#008000',
    image: <Ionicons name="ios-barcode" color="white" size={80} />,
  },
  {
    title: '...and Recipes.',
    description: 'Give us a recipe name or link, and we\'ll get you its carbon footprint.',
    color: '#004200',
    image: <MaterialCommunityIcons name="receipt" color="white" size={80} />,
  },
];

const Onboarding = ({ navigation }) => {
  const handleOnClosePress = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Home' },
        ],

      })
    );
  };

  return (
    <PaperOnboarding
      data={subScreens}
      titleStyle={{
        fontSize: 24,
      }}
      onCloseButtonPress={handleOnClosePress}
    />
  );
};

export default Onboarding;
