import React, {useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Text,
  SafeAreaView,
  Image,
  View,
  ScrollView,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Config from 'react-native-config';

import {/*useQuery, */useMutation} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';

const postPictureUri = Config.SERVER_URL + 'picture';

const POST_PICTURE_MUTATION = gql`
  mutation PostPictureMutation($file: Upload!) {
    postPicture(file: $file) {
      product {
        name
      }
    }
  }
`;

const FoodOverview = ({navigation}) => {
  const [food, setFood] = useState([]);

  const [postPictureMutation, {loading, error, data}] = useMutation(POST_PICTURE_MUTATION);

  const upload = async (image) => {
    await postPictureMutation({variables: {file: image}});
    console.log('Sent file...');
  };

  useEffect(() => {
    console.log({useEffectData: data});
  }, [data]);

  const classifyPicture = async (image) => {
    try {
      upload(image);
    } catch (err) {
      console.warn({err});
    }
  };

  const takePicture = async () => {
    navigation.navigate('Camera', {
      classifyPicture,
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
        <TouchableOpacity onPress={takePicture}>
          <MaterialCommunityIcons name="plus" color={'black'} size={50}/>
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
