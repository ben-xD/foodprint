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

import {/*useQuery, */useMutation} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import {Button} from 'react-native-elements';

const postPictureUri = Config.SERVER_URL + 'picture';

// const UPLOADS = gql`
//   {
//     uploads
//   }
// `;

const TEST_MUTATION = gql`
  mutation TestMutation($input: String!) {
    test(input: $input)
  }
`;

const FoodOverview = ({ navigation }) => {
  const [food, setFood] = useState([]);

  const classifyPicture = async (image) => {
    // console.log({ image });
    // testMutation();
    // console.log('Mutation:');
    // console.log(m_data);

    // try {
    //   const data = new FormData();
    //   data.append('picture', {
    //     uri: image.uri,
    //     type: 'image/jpeg',
    //     name: 'pic.jpg',
    //   });
    //   const config = {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       'Accept': 'application/json',
    //     },
    //   };
    //   console.log({ postPictureUri });
    //   const carbonFootprintResponse = await Axios.post(
    //     postPictureUri,
    //     data,
    //     config,
    //   );
    //   console.log({ carbonFootprintResponse });
    //
    //   if (!carbonFootprintResponse.data.error) {
    //     const meal = {
    //       description: carbonFootprintResponse.data.description,
    //       score: carbonFootprintResponse.data.score,
    //       uri: 'data:image/jpeg;base64,' + image.base64,
    //     };
    //     setFood([...food, meal]);
    //   } else {
    //     console.warn('No meal found, handle this case for user.');
    //   }
    // } catch (err) {
    //   console.warn({ err });
    // }
  };

  const takePicture = async () => {
    navigation.navigate('Camera', {
      classifyPicture,
    });
  };

  const [testMutation] = useMutation(TEST_MUTATION);

  const mutate = () => {
    testMutation({variables: {input: 'testing'}}).then(() => console.log(''));
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
      <View style={{ flex: 4, flexDirection: 'column' }}>
        <Button
          title="Mutation"
          titleStyle={{ color: 'blue', fontSize: 24 }}
          onPress={mutate}
          type="clear"
        />
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
