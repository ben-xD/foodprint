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
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryStack,
  VictoryLine,
  VictoryPie,
  VictoryLabel
} from 'victory-native';

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

  const averageFootprint = [
    {label: ' ', footprint: 17.25},
    {label: ' ', footprint: 26.7-17.25},
  ]

  const calculateColour = (carbonFootprint) => {
    if (carbonFootprint < 4) {
      return 'forestgreen';
    } else if (carbonFootprint < 12) {
      return 'yellowgreen';
    } else if (carbonFootprint < 16) {
      return 'yellow';
    } else if (carbonFootprint < 20) {
      return 'orange';
    }
    return 'red';
  };

  const calculateSmileyUri = (carbonFootprint) => {
    if (carbonFootprint < 4) {
      return 'https://png2.cleanpng.com/sh/c5b35fb606ae368e2669b3aa2dc9813b/L0KzQYm3VcIyN5NvjJH0aYP2gLBuTfVud6Vue9H3LXXwf7vwTgN1cZRwfeQ2ZnHmdbP2jBsucZ9oReV2aXzoiX68gsAzPWNnfKdrM0LmQXA9WMIyOGE7T6MAMka7R4mCUMk0P2Q7RuJ3Zx==/kisspng-emoticon-emoji-sticker-facebook-inc-smiley-5b0252bd5b32c1.6821006715268789093736.png';
    } else if (carbonFootprint < 12) {
      return 'https://png2.cleanpng.com/sh/aa9abae2f6cf874c82a4539ea76a4c89/L0KzQYm3VcAzN5doiZH0aYP2gLBuTgNucZ1qkZ92YYTogrrojL02aZYAfKo5NnazcYrsU745QWY4SqI6NEG4Qoa5V8Q3O2EAUKcDLoDxd1==/kisspng-smiley-material-5ae9d806f0a9e3.8953201415252746309858.png';
    } else if (carbonFootprint < 16) {
      return 'https://png2.cleanpng.com/sh/eaa639cc15c9f43d3360600da13430c3/L0KzQYm3VsI6N6RufpH0aYP2gLBuTgRmdJZsitN2LYDkgLb5TgBtaap4jNN9aXBxPYW0kCRqa5xqip9vYXPocrF2i71naZRqetH4az32hLrqiBVzNWZnS6g5ZUDlRLW5UcA5NmU9SaQAOUa3QYa6UMI3QWIATaU6NUmxgLBu/kisspng-telegram-paper-playstation-4-sticker-facebook-facebook-sticker-5b360e0b4d2108.4812596415302691953159.png';
    } else if (carbonFootprint < 20) {
      return 'https://png2.cleanpng.com/sh/bb35a218a95bc6b0a876a23331c0a8c6/L0KzQYm3VsEzN6RtkZH0aYP2gLBuTgRmdpD3ReV9aXPudcO0hvFkbZN0h902ZnHmdbP2jBsue6Vue91ucj24coO3VBJkOGY8Sdg9Nz68Roi3UMcxPmI6SqoDNUW3SIm6VcY6NqFzf3==/kisspng-tenor-sticker-facebook-facebook-sticker-5b207bc0571f47.9670070615288554883569.png';
    }
    return 'https://png2.cleanpng.com/sh/d7860791a661433b352383574c3dfbf5/L0KzQYm3WMIyN5d7fpH0aYP2gLBuTfVud6Vue9H3LXbkc7bpjB9sNZdme9c2d3n3eH77hfFze150fp9zb4mwdb72ivkua6NARdN2cD30hbF7TcVjP5QAeaYBNUXpcoaCTsI6OmM5T6oEMUW2RImCUsYyPGQ6SqQ3cH7q/kisspng-emoticon-facebook-face-with-tears-of-joy-emoji-cry-amp-quot-5b7c9a4655fb59.2922478915348926143522.png';
  };

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
      <View style={{height:220, justifyContent:'center', marginTop:30, alignContent:'center'}}>
        <Image
            source={{uri:calculateSmileyUri(17.25)}}
            style={{height:100, width:100, position:'absolute', alignSelf:'center'}}
        />
        <VictoryPie
            data={averageFootprint}
            x="label"
            y="footprint"
            standalone={true}
            colorScale={[calculateColour(17.25), 'transparent']}
            startAngle={-90}
            endAngle={90}
            innerRadius={140}
        />
      </View>
      <View style={{ justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
        <Text style={{fontSize:24, color:'grey'}}>57 kg of CO2 eq/kg</Text>
        <Text style={{marginLeft:15}}>-14% compared{"\n"}to last month</Text>
      </View>
      <View style={{justifyContent:'flex-start'}}>
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
              source={{ uri:'https://www.pinclipart.com/picdir/big/132-1326972_list-of-synonyms-and-antonyms-of-the-word.png'}}
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
