import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Text,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  Image,
  View,
  ScrollView,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Axios from 'axios';
import Config from 'react-native-config';

const postPictureUri = Config.SERVER_URL + 'picture';

const options = {
  storageOptions: {
    // skipBackup: true,
    // path: 'images',
  },
};

const FoodOverview = ({ navigation }) => {
  const [food, setFood] = useState([]);

  const getFilePermissions = async () => {
    console.log('Ensuring file permissions.');
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'App needs file permissions to save your photos',
            message: 'App needs file permissions to save your food photos',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('File permissions allowed');
        } else {
          console.log('File permissions denied');
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const takePicture = async () => {
    await getFilePermissions();

    ImagePicker.launchCamera(options, async response => {
      if (response.didCancel) {
        return console.log('User cancelled image picker');
      }
      if (response.error) {
        return console.log('ImagePicker Error: ', response.error);
      }
      if (response.customButton) {
        return console.log(
          'User tapped custom button: ',
          response.customButton,
        );
      }
      try {
        const data = new FormData();
        data.append('picture', {
          uri: response.uri,
          type: 'image/jpeg',
          name: 'pic.jpg',
        });
        const config = {
          headers: { 'content-type': 'multipart/form-data' },
          accept: 'application/json',
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
            uri: 'data:image/jpeg;base64,' + response.data,
          };
          setFood([...food, meal]);
        } else {
          console.warn('No meal found, handle this case for user.');
        }
      } catch (err) {
        console.warn({ err });
      }
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
