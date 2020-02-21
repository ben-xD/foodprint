import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Text,
  SafeAreaView,
  Image,
  View,
  ScrollView,
} from 'react-native';
import { Overlay } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { VictoryBar } from 'victory-native';

const FoodOverview = ({ navigation }) => {
  const [food, setFood] = useState([]);
  const [isVisible, setVisibility] = useState(true);

  // useEffect(() => {
  //   navigation.navigate('Camera');
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const takePicture = async () => {
    navigation.navigate('Camera');
  };

  const goToSettings = async () => {
    navigation.navigate('Settings');
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
        <TouchableOpacity onPress={takePicture}>
          <MaterialCommunityIcons name="camera" color={'grey'} size={45} style={{ margin:10}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToSettings}>
          <MaterialCommunityIcons name="settings-outline" color={'grey'} size={50} style={{ margin:10}} />
        </TouchableOpacity>
      </View>
      <View><VictoryBar /></View>
      <Overlay isVisible = { isVisible } onBackdropPress = {() => setVisibility(false)}>
        <ScrollView>
          <View style={{justifyContent:'center', alignItems:'center', marginHorizontal:40}}>
            <Text style={{ fontSize: 36, marginVertical: 20, textAlign:"center"}}>Welcome to FoodPrint!</Text>
            <Text style={{fontSize:20, textAlign:'center', marginTop:20}}>
              You can now know the carbon footprint of the food you buy simply by scanning its barcode or taking a picture
              of it!
            </Text>
            <Image
              source={{ uri:'https://png2.cleanpng.com/sh/4618a1d69c3326bc75ab0d6a0d3cd256/L0KzQYm3VcIyN5NvjJH0aYP2gLBuTfVud6Vue9H3LXXwf7vwTgN1cZRwfeQ2ZnHmdbP2jBsucZ9oReV2aXzoiX68gsAzPWNnfKdrM0LmQXA9WMIyOGE7T6MAMka7R4mCUMk0P2Q7RuJ3Zx==/kisspng-emoticon-emoji-sticker-facebook-inc-smiley-5b0252bd5b32c1.6821006715268789093736.png'}}
              style={{ width: 150, height:150, marginTop:10}}
            />
            <Text style={{fontSize:20, textAlign:'center', marginTop:20}}>
              To get started, simply click on the Camera icon in the top left corner!
            </Text>
          </View>
        </ScrollView>
      </Overlay>
    </SafeAreaView>
  );
};


export default FoodOverview;
