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
import WelcomeScreen from '../components/WelcomeScreen';
import WeeklyDisplay from "../components/WeeklyDisplay";

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
      { month: 0, monthly_cf: 13.50 },
      { month: -1, monthly_cf: 19.00 },
      { month: -2, monthly_cf: 16.50 },
      { month: -3, monthly_cf: 14.25 },
      { month: -4, monthly_cf: 13.00 },
      { month: -5, monthly_cf: 16.50 },
    ],
    'Fish': [
      { month: 0, monthly_cf: 13.50 },
      { month: -1, monthly_cf: 13.00 },
      { month: -2, monthly_cf: 16.50 },
      { month: -3, monthly_cf: 19.00 },
      { month: -4, monthly_cf: 14.25 },
      { month: -5, monthly_cf: 13.00 },
    ],
    'Meat': [
      { month: 0, monthly_cf: 13.50 },
      { month: -1, monthly_cf: 16.50 },
      { month: -2, monthly_cf: 19.00 },
      { month: -3, monthly_cf: 13.00 },
      { month: -4, monthly_cf: 14.25 },
      { month: -5, monthly_cf: 16.50 },
    ],
    'Eggs and dairy': [
      { month: 0, monthly_cf: 13.50 },
      { month: -1, monthly_cf: 16.5 },
      { month: -2, monthly_cf: 19 },
      { month: -3, monthly_cf: 13 },
      { month: -4, monthly_cf: 14.25 },
      { month: -5, monthly_cf: 13 },
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
  const thisMonth = monthlyComposition['Plant based'][0].monthly_cf + monthlyComposition.Fish[0].monthly_cf + monthlyComposition.Meat[0].monthly_cf + monthlyComposition['Eggs and dairy'][0].monthly_cf;
  const lastMonth = monthlyComposition['Plant based'][1].monthly_cf + monthlyComposition.Fish[1].monthly_cf + monthlyComposition.Meat[1].monthly_cf + monthlyComposition['Eggs and dairy'][1].monthly_cf;
  const changeSinceLastMonth = ((thisMonth - lastMonth) * 100) / thisMonth;
  const monthSign = ((changeSinceLastMonth > 0) ? '+' : '');


  // // Mock up data: weekly
  // const weeklyComposition = {
  //   'Plant based': [
  //     { week: 0, weekly_cf: 3.8 },
  //     { week: -1, weekly_cf: 2.7 },
  //     { week: -2, weekly_cf: 3.3 },
  //     { week: -3, weekly_cf: 2.85 },
  //     { week: -4, weekly_cf: 2.6 },
  //     { week: -5, weekly_cf: 3.3 },
  //   ],
  //   'Fish': [
  //     { week: 0, weekly_cf: 3.8 },
  //     { week: -1, weekly_cf: 2.6 },
  //     { week: -2, weekly_cf: 3.3 },
  //     { week: -3, weekly_cf: 2.7 },
  //     { week: -4, weekly_cf: 2.85 },
  //     { week: -5, weekly_cf: 2.6 },
  //   ],
  //   'Meat': [
  //     { week: 0, weekly_cf: 3.8 },
  //     { week: -1, weekly_cf: 3.3 },
  //     { week: -2, weekly_cf: 2.85 },
  //     { week: -3, weekly_cf: 2.6 },
  //     { week: -4, weekly_cf: 2.7 },
  //     { week: -5, weekly_cf: 3.3 },
  //   ],
  //   'Eggs and dairy': [
  //     { week: 0, weekly_cf: 3.8 },
  //     { week: -1, weekly_cf: 3.3 },
  //     { week: -2, weekly_cf: 2.85 },
  //     { week: -3, weekly_cf: 2.6 },
  //     { week: -4, weekly_cf: 2.7 },
  //     { week: -5, weekly_cf: 2.6 },
  //   ],
  // };
  //
  //
  // const weeklyAverage = 12.8;
  //
  // const weeklyUserAverage = [
  //   { week: 0, footprint: weeklyAverage },
  //   { week: -1, footprint: weeklyAverage },
  //   { week: -2, footprint: weeklyAverage },
  //   { week: -3, footprint: weeklyAverage },
  //   { week: -4, footprint: weeklyAverage },
  //   { week: -5, footprint: weeklyAverage },
  // ];
  //
  // // This week's carbon footprint
  // const thisWeek = weeklyComposition['Plant based'][0].weekly_cf + weeklyComposition.Fish[0].weekly_cf + weeklyComposition.Meat[0].weekly_cf + weeklyComposition['Eggs and dairy'][0].weekly_cf;
  // const lastWeek = weeklyComposition['Plant based'][1].weekly_cf + weeklyComposition.Fish[1].weekly_cf + weeklyComposition.Meat[1].weekly_cf + weeklyComposition['Eggs and dairy'][1].weekly_cf;
  // const changeSinceLastWeek = ((thisWeek - lastWeek) * 100) / thisWeek;
  // const weekSign = ((changeSinceLastWeek > 0) ? '+' : '');


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
              <WeeklyDisplay/>
            // <View style={styles.contentContainer}>
            //   <View style={{ flexDirection: 'row' }}>
            //     <Text style={styles.score}>{thisWeek} units this week</Text>
            //     <Text style={{ fontSize: percentageWidth('3%'), marginLeft: percentageWidth('2%') }}>{weekSign}{Math.round(changeSinceLastWeek)}% compared{'\n'}to last week</Text>
            //   </View>
            //   <View style={{ marginVertical: percentageHeight('2%') }}>
            //     <VictoryChart
            //       padding={{ top: percentageHeight('2%'), bottom: percentageHeight('12%'), left: percentageWidth('15%'), right: percentageWidth('10%') }}
            //       domainPadding={percentageWidth('5%')}
            //       height={percentageHeight('38%')}
            //     >
            //       <VictoryAxis dependentAxis orientation="left" offsetX={percentageWidth('15%')} label="Carbon footprint" />
            //       <VictoryAxis label="Week" domain={[-5,0.01]} tickFormat={(t) => (t === 0) ? 'Now' : ('s' + t)} />
            //       <VictoryStack colorScale={['olivedrab', 'gold', 'skyblue', 'firebrick']}>
            //         <VictoryBar data={weeklyComposition['Plant based']} sortKey="week" x="week" y="weekly_cf" label="Vegetables" />
            //         <VictoryBar data={weeklyComposition['Eggs and dairy']} sortKey="week" x="week" y="weekly_cf" label="Eggs & Dairy" />
            //         <VictoryBar data={weeklyComposition.Fish} sortKey="week" x="week" y="weekly_cf" label="Fish" />
            //         <VictoryBar data={weeklyComposition.Meat} sortKey="week" x="week" y="weekly_cf" label="Meat" />
            //       </VictoryStack>
            //       <VictoryLegend
            //         data={[{ name: 'Plant' }, { name: 'Eggs & Dairy' }, { name: 'Fish' }, { name: 'Meat' }]}
            //         colorScale={['olivedrab', 'gold', 'skyblue', 'firebrick']}
            //         orientation="horizontal"
            //         x={percentageWidth('15%')}
            //         y={percentageHeight('32%')}
            //       />
            //       <VictoryLine data={weeklyUserAverage} x="week" y="footprint" />
            //     </VictoryChart>
            //   </View>
            // </View>
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
                    <VictoryAxis label="Month" domain={[-5,0.01]} tickFormat={(t) => ((month + t) >= 0) ? monthList[month + t] : monthList[month + t + 12]} />
                    <VictoryStack colorScale={['olivedrab', 'gold', 'skyblue', 'firebrick']}>
                      <VictoryBar data={monthlyComposition['Plant based']} sortKey="month" x="month" y="monthly_cf" />
                      <VictoryBar data={monthlyComposition['Eggs and dairy']} sortKey="month" x="month" y="monthly_cf" />
                      <VictoryBar data={monthlyComposition.Fish} sortKey="month" x="month" y="monthly_cf" />
                      <VictoryBar data={monthlyComposition.Meat} sortKey="month" x="month" y="monthly_cf" />
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
        </View>
        <WelcomeScreen setVisibility={setVisibility} isVisible={isVisible}/>
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
