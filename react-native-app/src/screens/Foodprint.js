import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Text,
  Image,
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryStack,
  VictoryLine,
  VictoryPie,
  VictoryLegend,
} from 'victory-native';
import { Button, Overlay } from 'react-native-elements';
import { widthPercentageToDP as percentageWidth, heightPercentageToDP as percentageHeight } from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Foodprint = ({ navigation }) => {
  const [isVisible, setVisibility] = useState(true);
  const [timeSpan, setTimeSpan] = useState('weekly');

  const takePicture = async () => {
    navigation.navigate('Camera');
  };

  const totalAverage = 17.25;


  //Mock-up data: Total average
  const averageFootprint = [
    { label: ' ', footprint: totalAverage },
    { label: ' ', footprint: 26.7 - totalAverage },
  ];

  // Mock up data: monthly
  const monthlyComposition = {
    'Plant based': [
      { monthly: 0, p_monthly_cf: 13.50 },
      { monthly: -1, p_monthly_cf: 19.00 },
      { monthly: -2, p_monthly_cf: 16.50 },
      { monthly: -3, p_monthly_cf: 14.25 },
      { monthly: -4, p_monthly_cf: 13.00 },
      { monthly: -5, p_monthly_cf: 16.50 },
    ],
    'Fish': [
      { monthly: 0, p_monthly_cf: 13.50 },
      { monthly: -1, p_monthly_cf: 13.00 },
      { monthly: -2, p_monthly_cf: 16.50 },
      { monthly: -3, p_monthly_cf: 19.00 },
      { monthly: -4, p_monthly_cf: 14.25 },
      { monthly: -5, p_monthly_cf: 13.00 },
    ],
    'Meat': [
      { monthly: 0, p_monthly_cf: 13.50 },
      { monthly: -1, p_monthly_cf: 16.50 },
      { monthly: -2, p_monthly_cf: 19.00 },
      { monthly: -3, p_monthly_cf: 13.00 },
      { monthly: -4, p_monthly_cf: 14.25 },
      { monthly: -5, p_monthly_cf: 16.50 },
    ],
    'Eggs and dairy': [
      { monthly: 0, p_monthly_cf: 13.50 },
      { monthly: -1, p_monthly_cf: 16.5 },
      { monthly: -2, p_monthly_cf: 19 },
      { monthly: -3, p_monthly_cf: 13 },
      { monthly: -4, p_monthly_cf: 14.25 },
      { monthly: -5, p_monthly_cf: 13 },
    ],
  };


  const monthlyAverage = 64;

  const monthlyUserAverage = [
    { month: 0, footprint: monthlyAverage },
    { month: -1, footprint: monthlyAverage },
    { month: -2, footprint: monthlyAverage },
    { month: -3, footprint: monthlyAverage },
    { month: -4, footprint: monthlyAverage },
    { month: -5, footprint: monthlyAverage },
  ];

  // This months's carbon footprint
  const thisMonth = monthlyComposition['Plant based'][0].p_monthly_cf + monthlyComposition.Fish[0].p_monthly_cf + monthlyComposition.Meat[0].p_monthly_cf + monthlyComposition['Eggs and dairy'][0].p_monthly_cf;
  const lastMonth = monthlyComposition['Plant based'][1].p_monthly_cf + monthlyComposition.Fish[1].p_monthly_cf + monthlyComposition.Meat[1].p_monthly_cf + monthlyComposition['Eggs and dairy'][1].p_monthly_cf;
  const changeSinceLastMonth = ((thisMonth - lastMonth) * 100) / thisMonth;
  const monthSign = ((changeSinceLastMonth > 0) ? '+' : '');


  // Mock up data: weekly
  const weeklyComposition = {
    'Plant based': [
      { week: 0, p_weekly_cf: 3.8 },
      { week: -1, p_weekly_cf: 2.7 },
      { week: -2, p_weekly_cf: 3.3 },
      { week: -3, p_weekly_cf: 2.85 },
      { week: -4, p_weekly_cf: 2.6 },
      { week: -5, p_weekly_cf: 3.3 },
    ],
    'Fish': [
      { week: 0, p_weekly_cf: 3.8 },
      { week: -1, p_weekly_cf: 2.6 },
      { week: -2, p_weekly_cf: 3.3 },
      { week: -3, p_weekly_cf: 2.7 },
      { week: -4, p_weekly_cf: 2.85 },
      { week: -5, p_weekly_cf: 2.6 },
    ],
    'Meat': [
      { week: 0, p_weekly_cf: 3.8 },
      { week: -1, p_weekly_cf: 3.3 },
      { week: -2, p_weekly_cf: 2.85 },
      { week: -3, p_weekly_cf: 2.6 },
      { week: -4, p_weekly_cf: 2.7 },
      { week: -5, p_weekly_cf: 3.3 },
    ],
    'Eggs and dairy': [
      { week: 0, p_weekly_cf: 3.8 },
      { week: -1, p_weekly_cf: 3.3 },
      { week: -2, p_weekly_cf: 2.85 },
      { week: -3, p_weekly_cf: 2.6 },
      { week: -4, p_weekly_cf: 2.7 },
      { week: -5, p_weekly_cf: 2.6 },
    ],
  };


  const weeklyAverage = 12.8;

  const weeklyUserAverage = [
    { week: 0, footprint: weeklyAverage },
    { week: -1, footprint: weeklyAverage },
    { week: -2, footprint: weeklyAverage },
    { week: -3, footprint: weeklyAverage },
    { week: -4, footprint: weeklyAverage },
    { week: -5, footprint: weeklyAverage },
  ];

  // This week's carbon footprint
  const thisWeek = weeklyComposition['Plant based'][0].p_weekly_cf + weeklyComposition.Fish[0].p_weekly_cf + weeklyComposition.Meat[0].p_weekly_cf + weeklyComposition['Eggs and dairy'][0].p_weekly_cf;
  const lastWeek = weeklyComposition['Plant based'][1].p_weekly_cf + weeklyComposition.Fish[1].p_weekly_cf + weeklyComposition.Meat[1].p_weekly_cf + weeklyComposition['Eggs and dairy'][1].p_weekly_cf;
  const changeSinceLastWeek = ((thisWeek - lastWeek) * 100) / thisWeek;
  const weekSign = ((changeSinceLastWeek > 0) ? '+' : '');


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

  const month = new Date().getMonth(); //Current Month
  const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <SafeAreaView>
      <ScrollView>
        {/*General carbon footprint score*/}
        <View style={{ height: percentageHeight('29%'), alignItems: 'center' }}>
          <Image
            source={calculateSmiley(totalAverage)}
            style={{ height: percentageHeight('10%'), width: percentageWidth('20%'), position: 'absolute', alignSelf: 'center', marginTop: percentageHeight('12%') }}
          />
          <Text style={[styles.score, { position: 'absolute', alignSelf: 'center', marginTop: percentageHeight('24%') }]}>{totalAverage} units</Text>
          <VictoryPie
            data={averageFootprint}
            x="label"
            y="footprint"
            standalone={true}
            colorScale={[calculateColour(totalAverage), 'transparent']}
            startAngle={-90}
            endAngle={90}
            innerRadius={percentageHeight('16%')}
            height={percentageHeight('40%')}
          />
        </View>

        {/*Monthly vs Weekly buttons*/}

        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: percentageHeight('2%') }}>
          <Button
            title="Weekly"
            titleStyle={styles.buttonTitle}
            buttonStyle={[styles.button, { backgroundColor: ((timeSpan === 'weekly') ? 'green' : 'grey') }]}
            containerStyle={{ paddingHorizontal: percentageWidth('2%') }}
            onPress={() => setTimeSpan('weekly')}
          />
          <Button
            title="Monthly"
            titleStyle={styles.buttonTitle}
            buttonStyle={[styles.button, { backgroundColor: ((timeSpan === 'monthly') ? 'green' : 'grey') }]}
            containerStyle={{ paddingHorizontal: percentageWidth('2%') }}
            onPress={() => setTimeSpan('monthly')}
          />
        </View>

        {/*Monthly or weekly carbon footprint composition*/}

        <View>
          {(timeSpan === 'weekly') ? (
            <View style={styles.contentContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.score}>{thisWeek} units this week</Text>
                <Text style={{ fontSize: percentageWidth('3%'), marginLeft: percentageWidth('2%') }}>{weekSign}{Math.round(changeSinceLastWeek)}% compared{'\n'}to last week</Text>
              </View>
              <View style={{ marginVertical: percentageHeight('2%') }}>
                <VictoryChart
                  padding={{ top: percentageHeight('2%'), bottom: percentageHeight('12%'), left: percentageWidth('15%'), right: percentageWidth('10%') }}
                  domainPadding={percentageWidth('5%')}
                  height={percentageHeight('38%')}
                >
                  <VictoryAxis dependentAxis orientation="left" offsetX={percentageWidth('15%')} label="Carbon footprint" />
                  <VictoryAxis label="Week" domain={[-5, 0]} tickFormat={(t) => (t === 0) ? 'Now' : ('s' + t)} />
                  <VictoryStack colorScale={['olivedrab', 'gold', 'skyblue', 'firebrick']}>
                    <VictoryBar data={weeklyComposition['Plant based']} x="week" y="p_weekly_cf" label="Vegetables" />
                    <VictoryBar data={weeklyComposition['Eggs and dairy']} x="week" y="p_weekly_cf" label="Eggs & Dairy" />
                    <VictoryBar data={weeklyComposition.Fish} x="week" y="p_weekly_cf" label="Fish" />
                    <VictoryBar data={weeklyComposition.Meat} x="week" y="p_weekly_cf" label="Meat" />
                  </VictoryStack>
                  <VictoryLegend
                    data={[{ name: 'Plant' }, { name: 'Eggs & Dairy' }, { name: 'Fish' }, { name: 'Meat' }]}
                    colorScale={['olivedrab', 'gold', 'skyblue', 'firebrick']}
                    orientation="horizontal"
                    x={percentageWidth('15%')}
                    y={percentageHeight('32%')}
                  />
                  <VictoryLine data={weeklyUserAverage} x="week" y="footprint" />
                </VictoryChart>
              </View>
            </View>
          ) : (
              <View style={styles.contentContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.score}>{thisMonth} units this month</Text>
                  <Text style={{ fontSize: percentageWidth('3%'), marginLeft: percentageWidth('2%') }}>{monthSign}{Math.round(changeSinceLastMonth)}% compared{'\n'}to last month</Text>
                </View>
                <View style={{ marginVertical: percentageHeight('2%') }}>
                  <VictoryChart
                    padding={{ top: percentageHeight('2%'), bottom: percentageHeight('12%'), left: percentageWidth('15%'), right: percentageWidth('10%') }}
                    domainPadding={percentageWidth('5%')}
                    height={percentageHeight('38%')}
                  >
                    <VictoryAxis dependentAxis orientation="left" offsetX={percentageWidth('15%')} label="Carbon footprint" />
                    <VictoryAxis label="Month" domain={[-5, 0]} tickFormat={(t) => ((month + t) >= 0) ? monthList[month + t] : monthList[month + t + 12]} />
                    <VictoryStack colorScale={['olivedrab', 'gold', 'skyblue', 'firebrick']}>
                      <VictoryBar data={monthlyComposition['Plant based']} x="monthly" y="p_monthly_cf" label="Vegetables" />
                      <VictoryBar data={monthlyComposition['Eggs and dairy']} x="monthly" y="p_monthly_cf" label="Eggs & Dairy" />
                      <VictoryBar data={monthlyComposition.Fish} x="monthly" y="p_monthly_cf" label="Fish" />
                      <VictoryBar data={monthlyComposition.Meat} x="monthly" y="p_monthly_cf" label="Meat" />
                    </VictoryStack>
                    <VictoryLegend
                      data={[{ name: 'Plant' }, { name: 'Eggs & Dairy' }, { name: 'Fish' }, { name: 'Meat' }]}
                      colorScale={['olivedrab', 'gold', 'skyblue', 'firebrick']}
                      orientation="horizontal"
                      x={percentageWidth('15%')}
                      y={percentageHeight('32%')}
                    />
                    <VictoryLine data={monthlyUserAverage} x="month" y="footprint" />
                  </VictoryChart>
                </View>
              </View>
            )}
          <View>
            {/*<VictoryLegend*/}
            {/*    x={percentageWidth('10%')}*/}
            {/*    y={percentageHeight('90%')}*/}
            {/*    orientation="horizontal"*/}
            {/*    gutter={20}*/}
            {/*    style={{ border: { stroke: "black" } }}*/}
            {/*    colorScale={['olivedrab', 'gold', 'skyblue', 'firebrick']}*/}
            {/*    data={[*/}
            {/*      { name: 'Plant' }, { name: 'Eggs & Dairy' }, { name: 'Fish' }, { name: 'Meat' }*/}
            {/*    ]}*/}
            {/*    standalone={true}*/}
            {/*/>*/}
          </View>
        </View>
        {/*Overlay for welcome screen*/}
        <Overlay isVisible={isVisible} onBackdropPress={() => setVisibility(false)}>
          <ScrollView>
            <View style={styles.contentContainer}>
              <Text style={styles.title}>Welcome to FoodPrint!</Text>
              <Text style={styles.text}>
                You can now know the carbon footprint of the food you buy simply by scanning its barcode or taking a picture
                of it!
            </Text>
              <Image
                source={require('../images/heart-eyes-smiley.png')}
                style={styles.image}
              />
              <Text style={styles.text}>
                To get started, simply click on the Camera icon in the top left corner!
            </Text>
            </View>
          </ScrollView>
        </Overlay>
      </ScrollView>
      <TouchableOpacity onPress={takePicture} containerStyle={{ backgroundColor: '#008000', width: 64, height: 64, position: 'absolute', bottom: 25, right: 25, borderRadius: 32, alignItems: 'center', justifyContent: 'center' }}>
        <MaterialCommunityIcons name="camera" color={'white'} size={28} />
      </TouchableOpacity>
      {/* <FAB buttonColor="#008000" iconTextColor="#FFFFFF" onClickAction={takePicture} visible={true} iconTextComponent={} /> */}
    </SafeAreaView >
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
  contentContainer: { justifyContent: 'center', alignItems: 'center', margin: percentageWidth('4%'), marginBottom: 64 },
  text: { fontSize: percentageWidth('4%'), textAlign: 'center', margin: percentageHeight('3%') },
  title: { fontSize: percentageWidth('7%'), margin: percentageHeight('2%'), textAlign: 'center' },
  image: { width: percentageWidth('38%'), height: percentageHeight('18%') },
  score: { fontSize: percentageWidth('6%'), color: 'grey' },
  buttonTitle: { fontSize: percentageWidth('5%') },
  button: { width: percentageWidth('30%'), height: 45 },
});

export default Foodprint;
