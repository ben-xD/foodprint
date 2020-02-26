import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { Text, Button, Rating } from 'react-native-elements';
import ErrorMessage from '../components/ErrorMessage';


const Feedback = ({ route, navigation }) => {

  const [isVisible, setVisibility] = useState(false);
  console.log({ 'route': route.params });
  const [meal, setMeal] = useState(route.params.meal);

  const calculateRating = (carbonFootprint) => {
    if (carbonFootprint < 2) {
      return 5;
    } else if (carbonFootprint < 4) {
      return 4.5;
    } else if (carbonFootprint < 6) {
      return 4;
    } else if (carbonFootprint < 8) {
      return 3.5;
    } else if (carbonFootprint < 10) {
      return 3;
    } else if (carbonFootprint < 12) {
      return 2, 5;
    } else if (carbonFootprint < 14) {
      return 2;
    } else if (carbonFootprint < 16) {
      return 1.5;
    } else if (carbonFootprint < 18) {
      return 1;
    } else if (carbonFootprint < 20) {
      return 0.5;
    } else {
      return 0;
    }
  };

  console.log({ meal });

  return (
    <View style={{ flex: 1 }}>
      <ErrorMessage
        isVisible={isVisible}
        setVisibility={setVisibility}
        meal={meal}
        setMeal={setMeal}
      />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{
          flex: 4,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          margin: 10,
          marginTop: 100,
          marginBottom: 30,
        }}>
          <Image
            style={{ height: 350, width: 350 }}
            source={{ uri: meal.uri }}
          />
          <Text h2 style={{ marginTop: 20, marginBottom: 10 }}>{meal.description}</Text>
          <Rating
            readonly
            startingValue={calculateRating(meal.score)}
          />
          <Text style={{ fontSize: 18, margin: 10 }}>{meal.score}kg of CO2 eq/kg</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', marginLeft: 50, marginRight: 50 }}>
          <Button
            buttonStyle={{ backgroundColor: 'darkred' }}
            titleStyle={{ fontSize: 24 }}
            title="This isn't my item..."
            onPress={() => setVisibility(true)}
          />
        </View>
      </View>
    </View>
  );
};

export default Feedback;
