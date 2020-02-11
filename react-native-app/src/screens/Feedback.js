import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { Text, Button, Rating, Overlay, Input } from 'react-native-elements';
import { gql } from 'apollo-boost';
import {/*useQuery, */useMutation } from '@apollo/react-hooks';

const POST_PICTURE_MUTATION = gql`
  mutation PostPictureMutation($file: Upload!) {
    postPicture(file: $file) {
      product {
        name
      }
    }
  }
`;


const Feedback = ({ route, navigation }) => {

  const [isVisible, setVisibility] = useState(false);
  const [meal, setMeal] = useState({});
  const { image } = route.params;
  const [postPictureMutation, { loading, error, data }] = useMutation(POST_PICTURE_MUTATION);

  function calculateRating(carbonFootprint) {
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
      return 2,5;
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
  }

  useEffect(() => {
    if (data) {
      console.log({ data });
      setMeal({
        ...meal,
        score: 9000,
        description: data.postPicture.product.name,
      });
    }
  }, [data]);

  useEffect(() => {
    const classifyPicture = async () => {
      try {
        await postPictureMutation({ variables: { file: image } });
      } catch (err) {
        setVisibility(true);
      }
    };
    if (image) {
      setMeal({
        ...meal,
        uri: image.uri,
      });
      classifyPicture();
    }
  }, [image]);

  return (
    <View style={{ flex: 1 }}>
      <Overlay
        isVisible={isVisible}
        onBackdropPress={() => setVisibility(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{flex:2, justifyContent:'center'}}>
            <Text h3 style={{ textAlign: 'center' }}>We're sorry we couldn't find your item...</Text>
          </View>
          <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              style={{ height: 250, width:250 }}
              source={{ uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/fc4a1059120725.5a15c9fa08f78.gif' }}
            />
          </View>
          <View style={{ flex:1, justifyContent:'center'}}>
            <Text style={{ fontSize: 22, textAlign: 'center', margin:20 }}>Let us know what it was, so we can improve our
              app:</Text>
          </View>
          <View style={{flex:1.5 }}>
            <View style={{margin:20}}>
              <Input placeholder="e.g. Cucumber"/>
              <Button
                buttonStyle={{ backgroundColor: 'green', marginTop:20 }}
                titleStyle={{ fontSize: 24 }}
                title="Submit"
                onPress={() => alert('Implement')}
              />
            </View>
          </View>
        </View>
      </Overlay>


      <View style={{flex:1, justifyContent:'center'}}>
        <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', margin:10, marginTop:100, marginBottom:30 }}>
          <Image
            style={{ height: 350, width: 350 }}
            source={{ uri: meal.uri }}
          />
          <Text h2 style={{marginTop:20, marginBottom:10}}>{meal.description}</Text>
          <Rating
            readonly
            startingValue={calculateRating(meal.score)}
          />
          <Text style={{ fontSize: 18, margin:10 }}>{meal.score}kg of CO2 eq/kg</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', marginLeft:50, marginRight:50 }}>
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
