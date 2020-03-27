import {StyleSheet, Text, View} from 'react-native';
import { heightPercentageToDP as percentageHeight, widthPercentageToDP as percentageWidth} from 'react-native-responsive-screen';
import {VictoryAxis, VictoryBar, VictoryChart, VictoryLegend, VictoryLine, VictoryStack} from 'victory-native';
import React from 'react';

const WeeklyDisplay = () => {

 // Mock up data: weekly
 const weeklyComposition = {
  'Plant based': [
   { week: 0, weekly_cf: 3.8 },
   { week: -1, weekly_cf: 2.7 },
   { week: -2, weekly_cf: 3.3 },
   { week: -3, weekly_cf: 2.85 },
   { week: -4, weekly_cf: 2.6 },
   { week: -5, weekly_cf: 3.3 },
  ],
  'Fish': [
   { week: 0, weekly_cf: 3.8 },
   { week: -1, weekly_cf: 2.6 },
   { week: -2, weekly_cf: 3.3 },
   { week: -3, weekly_cf: 2.7 },
   { week: -4, weekly_cf: 2.85 },
   { week: -5, weekly_cf: 2.6 },
  ],
  'Meat': [
   { week: 0, weekly_cf: 3.8 },
   { week: -1, weekly_cf: 3.3 },
   { week: -2, weekly_cf: 2.85 },
   { week: -3, weekly_cf: 2.6 },
   { week: -4, weekly_cf: 2.7 },
   { week: -5, weekly_cf: 3.3 },
  ],
  'Eggs and dairy': [
   { week: 0, weekly_cf: 3.8 },
   { week: -1, weekly_cf: 3.3 },
   { week: -2, weekly_cf: 2.85 },
   { week: -3, weekly_cf: 2.6 },
   { week: -4, weekly_cf: 2.7 },
   { week: -5, weekly_cf: 2.6 },
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
 const thisWeek = weeklyComposition['Plant based'][0].weekly_cf + weeklyComposition.Fish[0].weekly_cf + weeklyComposition.Meat[0].weekly_cf + weeklyComposition['Eggs and dairy'][0].weekly_cf;
 const lastWeek = weeklyComposition['Plant based'][1].weekly_cf + weeklyComposition.Fish[1].weekly_cf + weeklyComposition.Meat[1].weekly_cf + weeklyComposition['Eggs and dairy'][1].weekly_cf;
 const changeSinceLastWeek = ((thisWeek - lastWeek) * 100) / thisWeek;
 const weekSign = ((changeSinceLastWeek > 0) ? '+' : '');


 return (
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
    <VictoryAxis label="Week" domain={[-5,0.01]} tickFormat={(t) => (t === 0) ? 'Now' : ('s' + t)} />
    <VictoryStack colorScale={['olivedrab', 'gold', 'skyblue', 'firebrick']}>
     <VictoryBar data={weeklyComposition['Plant based']} sortKey="week" x="week" y="weekly_cf" label="Vegetables" />
     <VictoryBar data={weeklyComposition['Eggs and dairy']} sortKey="week" x="week" y="weekly_cf" label="Eggs & Dairy" />
     <VictoryBar data={weeklyComposition.Fish} sortKey="week" x="week" y="weekly_cf" label="Fish" />
     <VictoryBar data={weeklyComposition.Meat} sortKey="week" x="week" y="weekly_cf" label="Meat" />
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
 );
};

const styles = StyleSheet.create({
 contentContainer: { justifyContent: 'center', alignItems: 'center', margin: percentageWidth('4%'), marginBottom: 64 },
 score: { fontSize: percentageWidth('6%'), color: 'grey' },
});

export default WeeklyDisplay;
