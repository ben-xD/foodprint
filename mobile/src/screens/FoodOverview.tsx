import React from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';

interface Props { }

const FoodOverview: React.FC<Props> = ({ navigation }) => {
  const openCamera = () => {
    navigation.navigate('Camera');
  };

  return (
    <SafeAreaView>
      <Text>Food overview</Text>
      <Button onPress={openCamera} title="Open camera" />
    </SafeAreaView>
  );
};

export default FoodOverview;
