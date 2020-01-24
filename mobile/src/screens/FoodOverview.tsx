import React, {useState} from 'react';
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
import {TouchableOpacity} from 'react-native-gesture-handler';
import Axios from 'axios';

interface Props {}

// TODO add a localhost/ environment variables?
// const postPictureUri = 'http://10.0.2.2:8080/picture';
const postPictureUri = 'https://helloworld-5i6gsvkjla-ew.a.run.app/picture';

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
          headers: {'content-type': 'multipart/form-data'},
          accept: 'application/json',
        };
        console.log({postPictureUri});
        const carbonFootprintResponse = await Axios.post(
          postPictureUri,
          data,
          config,
        );
        console.log({carbonFootprintResponse});

        // if (carbonFootprintResponse.status === 404) {
        //   // TODO implement a warning screen
        //   console.warn(
        //     'Unsuccessful result. TODO: implement a error warning for user',
        //   );
        //   // return;
        // }

        const meal = {
          description: carbonFootprintResponse.data.description,
          score: carbonFootprintResponse.data.score,
          uri: 'data:image/jpeg;base64,' + response.data,
        };
        setFood([...food, meal]);
      } catch (err) {
        console.warn({err});
      }
    });
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
