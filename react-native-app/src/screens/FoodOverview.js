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
import {VictoryBar, VictoryChart, VictoryAxis, VictoryStack, VictoryLine } from 'victory-native';

const FoodOverview = ({ navigation }) => {
  const [food, setFood] = useState([]);
  const [isVisible, setVisibility] = useState(true);

  const plantBasedData = [
    { month: 'Mar', footprint: 13.00 },
    { month: 'Apr', footprint: 16.50 },
    { month: 'May', footprint: 14.25 },
    { month: 'Jun', footprint: 19.00 },
    { month: 'Jul', footprint: 16.50 },
    { month: 'Aug', footprint: 13.00 },
    { month: 'Sep', footprint: 19.00 },
    { month: 'Oct', footprint: 19.00 },
    { month: 'Nov', footprint: 16.50 },
    { month: 'Dec', footprint: 13.50 },
    { month: 'Jan', footprint: 16.50 },
    { month: 'Feb', footprint: 14.25 },
  ];

  const eggAndDairyData = [
    { month: 'Mar', footprint: 13.00 },
    { month: 'Apr', footprint: 16.50 },
    { month: 'May', footprint: 14.25 },
    { month: 'Jun', footprint: 19.00 },
    { month: 'Jul', footprint: 16.50 },
    { month: 'Aug', footprint: 13.00 },
    { month: 'Sep', footprint: 19.00 },
    { month: 'Oct', footprint: 19.00 },
    { month: 'Nov', footprint: 16.50 },
    { month: 'Dec', footprint: 13.50 },
    { month: 'Jan', footprint: 16.50 },
    { month: 'Feb', footprint: 14.25 },
  ];

  const fishData = [
    { month: 'Mar', footprint: 13.00 },
    { month: 'Apr', footprint: 16.50 },
    { month: 'May', footprint: 14.25 },
    { month: 'Jun', footprint: 19.00 },
    { month: 'Jul', footprint: 16.50 },
    { month: 'Aug', footprint: 13.00 },
    { month: 'Sep', footprint: 19.00 },
    { month: 'Oct', footprint: 19.00 },
    { month: 'Nov', footprint: 16.50 },
    { month: 'Dec', footprint: 13.50 },
    { month: 'Jan', footprint: 16.50 },
    { month: 'Feb', footprint: 14.25 },
  ];

  const meatData = [
    { month: 'Mar', footprint: 13.00 },
    { month: 'Apr', footprint: 16.50 },
    { month: 'May', footprint: 14.25 },
    { month: 'Jun', footprint: 19.00 },
    { month: 'Jul', footprint: 16.50 },
    { month: 'Aug', footprint: 13.00 },
    { month: 'Sep', footprint: 19.00 },
    { month: 'Oct', footprint: 19.00 },
    { month: 'Nov', footprint: 16.50 },
    { month: 'Dec', footprint: 13.50 },
    { month: 'Jan', footprint: 16.50 },
    { month: 'Feb', footprint: 14.25 },
  ];

  const average = 63.67;

  const userAverage = [
    { month: 'Mar', footprint: 63.67 },
    { month: 'Apr', footprint: 63.67 },
    { month: 'May', footprint: 63.67 },
    { month: 'Jun', footprint: 63.67 },
    { month: 'Jul', footprint: 63.67 },
    { month: 'Aug', footprint: 63.67 },
    { month: 'Sep', footprint: 63.67 },
    { month: 'Oct', footprint: 63.67 },
    { month: 'Nov', footprint: 63.67 },
    { month: 'Dec', footprint: 63.67 },
    { month: 'Jan', footprint: 63.67 },
    { month: 'Feb', footprint: 63.67 }
  ];

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
      <View>
        <VictoryChart
          domainPadding={20}
        >
          <VictoryAxis
            dependentAxis
            label="Carbon footprint"
          />
          <VictoryAxis
            label="Month"
          />
          <VictoryAxis/>
          <VictoryStack colorScale={['olivedrab', 'gold', 'skyblue', 'firebrick']}>
            <VictoryBar data={plantBasedData} x="month" y="footprint" label="Vegatables"/>
            <VictoryBar data={eggAndDairyData} x="month" y="footprint" label="Eggs & Dairy"/>
            <VictoryBar data={fishData} x="month" y="footprint" label="Fish"/>
            <VictoryBar data={meatData} x="month" y="footprint" label="Meat"/>
          </VictoryStack>
          <VictoryLine data={userAverage} x="month" y="footprint"/>
        </VictoryChart>
      </View>
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
