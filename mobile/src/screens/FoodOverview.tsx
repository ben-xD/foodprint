import React, {useState} from 'react';
import {
  Text,
  Button,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  Image,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

interface Props {}

const options = {
  storageOptions: {
    // skipBackup: true,
    // path: 'images',
  },
};

const FoodOverview: React.FC<Props> = ({navigation}) => {
  const [food, setFood] = useState([]);

  const takePicture = () => {
    // ask for file perms
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'App needs file permissions to save your photos',
          message: 'App needs file permissions to save your food photos',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
    }

    ImagePicker.launchCamera(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        try {
          const endpoint = 'http://8aacbaaa.ngrok.io/';
          const data = new FormData();
          data.append('picture', {
            uri: response.uri,
            type: 'image/jpeg',
            name: 'pic.jpg',
          });
          const config = {
            method: 'post',
            // headers: {'content-type': 'multipart/form-data'},
            body: data,
          };
          const carbonFootprintResponse = await fetch(endpoint, config);
          console.log({carbonFootprintResponse});
          // and update state on response
          console.log({response});
          const meal = {
            name: 'One meal',
            uri: 'data:image/jpeg;base64,' + response.data,
          };
          setFood([...food, meal]);
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  return (
    <SafeAreaView>
      <Text>Food overview</Text>
      <Button onPress={takePicture} title="Open camera" />
      {food.map((meal, i) => {
        console.log({meal});
        return (
          <View key={i}>
            <Image style={{width: 150, height: 58}} source={{uri: meal.uri}} />
            <Text>{meal.name}</Text>
          </View>
        );
      })}
    </SafeAreaView>
  );
};

export default FoodOverview;
