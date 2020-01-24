import React, {useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Text,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  Image,
  View,
  Button,
  ScrollView,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface Props {}

// TODO add a localhost/ environment variables?
const endpoint = 'http://10.0.2.2:8080/picture';

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
          method: 'post',
          headers: {'content-type': 'multipart/form-data'},
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
    });
  };

  const sendRequest = async () => {
    const body = new FormData();
    body.append('name', 'ben');
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: {'content-type': 'multipart/form-data'},
        body,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={{width: '100%', height: '100%'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 8,
        }}>
        <Text style={{fontSize: 24}}>Your food history</Text>
        <Button title="Send post request" onPress={sendRequest}></Button>
        <TouchableOpacity
          // style={{position: 'absolute', right: 0}}
          onPress={takePicture}>
          <MaterialCommunityIcons name="plus" color={'black'} size={50} />
          {/* <Image style={styles.button} source={require('./myButton.png')} /> */}
        </TouchableOpacity>
      </View>
      <ScrollView>
        {food.map((meal, i) => {
          console.log({meal});
          return (
            <View key={i}>
              <Image
                style={{width: 200, height: 400}}
                source={{uri: meal.uri}}
              />
              <Text>{meal.name}</Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FoodOverview;
