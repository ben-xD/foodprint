import React from 'react';
import {
  Text,
  Button,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
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
          await fetch(endpoint, config);
        } catch (err) {
          console.log(err);
        }
        // and update state on response
      }
    });
  };

  return (
    <SafeAreaView>
      <Text>Food overview</Text>
      <Button onPress={takePicture} title="Open camera" />
    </SafeAreaView>
  );
};

export default FoodOverview;
