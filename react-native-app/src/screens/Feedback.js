import React, {useEffect, useState} from 'react';
import { View, Image } from 'react-native';
import {Text, Button, Rating, Overlay, Input} from 'react-native-elements';
import Axios from "axios";
import Config from "react-native-config";


const postPictureUri = Config.SERVER_URL + 'picture';

const Feedback = ({route, navigation}) => {

  const [isVisible, setVisibility] = useState(false);
  const [meal, setMeal] = useState({});
  const {data} = route.params;

  function calculateRating(carbonFootprint) {
    if (carbonFootprint < 4) {
      return 5;
    } else if (carbonFootprint < 8) {
      return 4;
    } else if (carbonFootprint < 12) {
      return 3;
    } else if (carbonFootprint < 16) {
      return 2;
    } else if (carbonFootprint < 20) {
      return 1;
    } else {
      return 0;
    }
  };

  useEffect(() => {

  const classifyPicture = async () => {
    console.log({data});
    try {
      const formData = new FormData();
      formData.append('picture', {
        uri: data.uri,
        type: 'image/jpeg',
        name: 'pic.jpg',
      });
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      };
      // console.log({ postPictureUri });
      const carbonFootprintResponse = await Axios.post(
          postPictureUri,
          formData,
          config,
      );
      // console.log({ carbonFootprintResponse });

      if (!carbonFootprintResponse.data.error) {
        const meal = {
          description: carbonFootprintResponse.data.description,
          score: carbonFootprintResponse.data.score,
          uri: 'data:image/jpeg;base64,' + data.base64,
        };
        setMeal(meal);
      } else {
        console.warn('No meal found, handle his case for user.');
      }
    } catch (err) {
      console.warn({err});
    }
  };

  classifyPicture()
  }, [data])

  return (
      <View style={{flex: 1}}>


        <Overlay
            isVisible={isVisible}
            onBackdropPress={() => setVisibility(false)}
        >
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', flex: 2, alignItems: 'center', justifyContent: 'center'}}>
              <View style={{flex: 1}}/>
              <Text h3 style={{flex: 5, textAlign: 'center'}}>We're sorry we couldn't find your item...</Text>
              <View style={{flex: 1}}/>
            </View>
            <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
              <Image
                  style={{height: 200, width: 200}}
                  source={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/fc4a1059120725.5a15c9fa08f78.gif'}}
              />
            </View>
            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <View style={{flex: 1}}/>
              <Text style={{fontSize: 18, flex: 4, textAlign: 'center'}}>Let us know what it was, so we can improve our
                app:</Text>
              <View style={{flex: 1}}/>
            </View>
            <View style={{flex: 1.5, flexDirection: 'row'}}>
              <View style={{flex: 1}}/>
              <View style={{flex: 4, flexDirection: 'column', justifyContent: 'center'}}>
                <Input
                    placeholder="e.g. Cucumber"
                />
                <View style={{height: 20}}/>
                <Button
                    buttonStyle={{backgroundColor: 'green'}}
                    titleStyle={{fontSize: 24}}
                    title="Submit"
                    onPress={() => alert('Implement')}
                />
                <View style={{height: 50}}/>
              </View>
              <View style={{flex: 1}}/>
            </View>
          </View>
        </Overlay>


        <View style={{flex: 1}}/>
        <View style={{flex: 3.5, alignItems: 'center', justifyContent: 'center', backgroundColor: "white"}}>
          <Image
              style={{height: 200, width: 200}}
              source={{uri: meal.uri}}
          />
          <View style={{height: 10}}/>
          <Text h2>{meal.description}</Text>
          <View style={{height: 10}}/>
          <Rating
              readonly
              startingValue={calculateRating(meal.score)}
          />
          <View style={{height: 10}}/>
          <Text style={{fontSize: 18}}>{meal.score}kg of CO2 eq/kg</Text>
        </View>
        <View style={{flex: 0.5}}/>
        <View style={{flex: 2, flexDirection: 'row'}}>
          <View style={{flex: 1}}/>
          <View style={{flex: 4, flexDirection: 'column'}}>
            <Button
                buttonStyle={{backgroundColor: 'darkred'}}
                titleStyle={{fontSize: 24}}
                title="This isn't my item..."
                onPress={() => setVisibility(true)}
            />
          </View>
          <View style={{flex: 1}}/>
        </View>
      </View>
  );
};

export default Feedback;