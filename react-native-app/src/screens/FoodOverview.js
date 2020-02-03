import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Text,
  SafeAreaView,
  Image,
  View,
  ScrollView,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Axios from 'axios';
import Config from 'react-native-config';

const postPictureUri = Config.SERVER_URL + 'picture';

import {ApolloClient, HttpLink, InMemoryCache, gql} from 'apollo-boost';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://5da1c59b.ngrok.io', // Replace with your ngrok or GCF url
  }),
  cache: new InMemoryCache(),
});

client.query({query: gql`{
    uploads
  }`}).then(result => console.log({result}));

const FoodOverview = ({ navigation }) => {
  const [food, setFood] = useState([]);

  const classifyPicture = async (image) => {
    console.log({ image });
    try {
      const data = new FormData();
      data.append('picture', {
        uri: image.uri,
        type: 'image/jpeg',
        name: 'pic.jpg',
      });
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      };
      console.log({ postPictureUri });
      const carbonFootprintResponse = await Axios.post(
        postPictureUri,
        data,
        config,
      );
      console.log({ carbonFootprintResponse });

      if (!carbonFootprintResponse.data.error) {
        const meal = {
          description: carbonFootprintResponse.data.description,
          score: carbonFootprintResponse.data.score,
          uri: 'data:image/jpeg;base64,' + image.base64,
        };
        setFood([...food, meal]);
      } else {
        console.warn('No meal found, handle this case for user.');
      }
    } catch (err) {
      console.warn({ err });
    }
  };

  const takePicture = async () => {
    navigation.navigate('Camera', {
      classifyPicture,
    });
  };

  return (
    <SafeAreaView style={{ width: '100%', height: '100%' }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 8,
        }}>
        <Text style={{ fontSize: 24 }}>Your food history</Text>
        <TouchableOpacity onPress={takePicture}>
          <MaterialCommunityIcons name="plus" color={'black'} size={50} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {food.map((meal, i) => {
          console.log({ meal });
          return (
            <View key={i}>
              <Image
                style={{ width: 200, height: 400 }}
                source={{ uri: meal.uri }}
              />
              <Text>{meal.description}</Text>
              <Text>{meal.score}</Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FoodOverview;
