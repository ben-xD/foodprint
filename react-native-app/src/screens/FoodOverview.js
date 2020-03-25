import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Text,
  Image,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryStack,
  VictoryLine,
  VictoryPie,
  VictoryLabel
} from 'victory-native';
import { Button, Overlay } from 'react-native-elements';
import { useLayoutEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP as percentageWidth, heightPercentageToDP as percentageHeight } from 'react-native-responsive-screen';

const FoodOverview = ({ navigation }) => {

  const [isVisible, setVisibility] = useState(true);
  const [timeSpan, setTimeSpan] = useState('weekly');

  useLayoutEffect(() => {
    const takePicture = async () => {
      navigation.navigate('Camera');
    };

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={takePicture} >
          <MaterialCommunityIcons name="camera" color={'grey'} size={28} style={styles.cameraButton} />
        </TouchableOpacity >
      ),
    });
  }, [navigation]);

  // totalAverage = avg_co2_for_user(carbonAPI, user);

  //Mock-up data: Total average
  const averageFootprint = [
    {label: ' ', footprint: 17.25},
    {label: ' ', footprint: 26.7-17.25},
  ];

  //Mock-up data: Monthly v1
  const plantBasedData = [
    { month: 'Oct', footprint: 19.00 },
    { month: 'Nov', footprint: 16.50 },
    { month: 'Dec', footprint: 13.50 },
    { month: 'Jan', footprint: 16.50 },
    { month: 'Feb', footprint: 14.25 },
    { month: 'Mar', footprint: 13.00 },
  ];

  const eggAndDairyData = [
    { month: 'Oct', footprint: 19.00 },
    { month: 'Nov', footprint: 16.50 },
    { month: 'Dec', footprint: 13.50 },
    { month: 'Jan', footprint: 16.50 },
    { month: 'Feb', footprint: 14.25 },
    { month: 'Mar', footprint: 13.00 },
  ];

  const fishData = [
    { month: 'Oct', footprint: 19.00 },
    { month: 'Nov', footprint: 16.50 },
    { month: 'Dec', footprint: 13.50 },
    { month: 'Jan', footprint: 16.50 },
    { month: 'Feb', footprint: 14.25 },
    { month: 'Mar', footprint: 13.00 },
  ];

  const meatData = [
    { month: 'Oct', footprint: 19.00 },
    { month: 'Nov', footprint: 16.50 },
    { month: 'Dec', footprint: 13.50 },
    { month: 'Jan', footprint: 16.50 },
    { month: 'Feb', footprint: 14.25 },
    { month: 'Mar', footprint: 13.00 },
  ];

  // Mock up data: monthly v2
  const monthlyComposition = {
      'Plant based': [
    { monthly: 0, p_monthly_cf: 0.36 },
    { monthly: -1, p_monthly_cf: 0 },
    { monthly: -2, p_monthly_cf: 0 },
    { monthly: -3, p_monthly_cf: 0 },
    { monthly: -4, p_monthly_cf: 3.61 },
    { monthly: -5, p_monthly_cf: 0 },
    { monthly: -6, p_monthly_cf: 0 }
  ],
      'Fish': [
    { monthly: 0, p_monthly_cf: 0 },
    { monthly: -1, p_monthly_cf: 0 },
    { monthly: -2, p_monthly_cf: 0 },
    { monthly: -3, p_monthly_cf: 0 },
    { monthly: -4, p_monthly_cf: 0 },
    { monthly: -5, p_monthly_cf: 0 },
    { monthly: -6, p_monthly_cf: 0 }
  ],
      'Meat': [
    { monthly: 0, p_monthly_cf: 0 },
    { monthly: -1, p_monthly_cf: 0 },
    { monthly: -2, p_monthly_cf: 0 },
    { monthly: -3, p_monthly_cf: 0 },
    { monthly: -4, p_monthly_cf: 0 },
    { monthly: -5, p_monthly_cf: 0 },
    { monthly: -6, p_monthly_cf: 22.9 }
  ],
      'Eggs and dairy': [
    { monthly: 0, p_monthly_cf: 0 },
    { monthly: -1, p_monthly_cf: 0 },
    { monthly: -2, p_monthly_cf: 0 },
    { monthly: -3, p_monthly_cf: 0 },
    { monthly: -4, p_monthly_cf: 0 },
    { monthly: -5, p_monthly_cf: 0 },
    { monthly: -6, p_monthly_cf: 0 }
  ],
  };


  //Mock-up data: Monthly average
  const average = 63.67;

  const userAverage = [
    { month: 'Oct', footprint: average },
    { month: 'Nov', footprint: average },
    { month: 'Dec', footprint: average },
    { month: 'Jan', footprint: average },
    { month: 'Feb', footprint: average },
    { month: 'Mar', footprint: average },
  ];


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

  const calculateSmiley = (carbonFootprint) => {
    if (carbonFootprint < 4) {
      return require('../images/sparkling-eyes-smiley.png');
    } else if (carbonFootprint < 12) {
      return require('../images/happy-smiley.png');
    } else if (carbonFootprint < 16) {
      return require('../images/shy-smiley.png');
    } else if (carbonFootprint < 20) {
      return require('../images/unimpressed-smiley.png');
    }
    return require('../images/crying-smiley.png');
  };

  return (
      <ScrollView>

        <View style={{height:percentageHeight('32%'), alignItems:'center'}}>
          <Image
              source={ calculateSmiley(17.25) }
              style={{height:percentageHeight('15%'), width:percentageWidth('30%'), position:'absolute', alignSelf:'center', marginTop:percentageHeight('12%')}}
          />
          <Text style={{ fontSize:24, color:'grey', position:'absolute', alignSelf:'center', marginTop:percentageHeight('28%')} }>17.25 units</Text>
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
        <View style={{ flexDirection: 'row', justifyContent:'center', paddingVertical:percentageHeight('2%')}}>
          <Button
              title="Weekly"
              buttonStyle={{width:percentageWidth('30%'), backgroundColor:((timeSpan === 'weekly') ? 'green' : 'grey')}}
              containerStyle={{ paddingHorizontal:percentageWidth('2%')}}
              onPress = {() => setTimeSpan('weekly')}
          />
          <Button
              title="Monthly"
              buttonStyle={{width:percentageWidth('30%'), backgroundColor:((timeSpan === 'monthly') ? 'green' : 'grey')}}
              containerStyle={{ paddingHorizontal:percentageWidth('2%')}}
              onPress = {() => setTimeSpan('monthly')}
          />
        </View>
        <View style={{ justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
          <Text style={{ fontSize:22, color:'grey'}}>57 units this month</Text>
          <Text style={{ marginLeft:15}}>-14% compared{"\n"}to last month</Text>
        </View>

        <View style={{justifyContent:'center', alignItems:'center'}}>
          <VictoryChart padding={{top:percentageHeight('1%'), bottom:percentageHeight('5%'), left:percentageWidth('15%'), right:percentageWidth('8%'),}} domainPadding={20}>
            <VictoryAxis dependentAxis label="Carbon footprint"/>
            <VictoryAxis label="Month"/>
            <VictoryStack colorScale={['olivedrab', 'gold', 'skyblue', 'firebrick']}>
              <VictoryBar data={monthlyComposition["Plant based"]} x="month" y="footprint" label="Vegetables"/>
              <VictoryBar data={monthlyComposition["Eggs and dairy"]} x="month" y="footprint" label="Eggs & Dairy"/>
              <VictoryBar data={monthlyComposition.Fish} x="month" y="footprint" label="Fish"/>
              <VictoryBar data={monthlyComposition.Meat} x="month" y="footprint" label="Meat"/>
            </VictoryStack>
            <VictoryLine data={userAverage} x="month" y="footprint"/>
          </VictoryChart>
        </View>
      <Overlay isVisible = { isVisible } onBackdropPress = {() => setVisibility(false)}>
        <ScrollView>
          <View style={styles.contentContainer}>
            <Text style={ styles.title }>Welcome to FoodPrint!</Text>
            <Text style={styles.text}>
              You can now know the carbon footprint of the food you buy simply by scanning its barcode or taking a picture
              of it!
            </Text>
            <Image
              source={ require('../images/heart-eyes-smiley.png') }
              style={styles.image}
            />
            <Text style={{fontSize:20, textAlign:'center', marginTop:20}}>
              To get started, simply click on the Camera icon in the top left corner!
            </Text>
          </View>
        </ScrollView>
      </Overlay>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', height: '100%' },
  cameraButton: { marginRight: percentageWidth('5%') },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  contentContainer: { justifyContent: 'center', alignItems: 'center', marginHorizontal: 40 },
  text: { fontSize: 20, textAlign: 'center', marginTop: 20 },
  title: { fontSize: 36, marginVertical: 20, textAlign:'center' },
  image: { width: percentageWidth('55%'), height: percentageHeight('25%'), marginTop: percentageHeight('2%') },
});

export default FoodOverview;
