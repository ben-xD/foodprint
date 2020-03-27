import {StyleSheet, Text, View} from 'react-native';
import { heightPercentageToDP as percentageHeight, widthPercentageToDP as percentageWidth} from 'react-native-responsive-screen';
import {VictoryAxis, VictoryBar, VictoryChart, VictoryLegend, VictoryLine, VictoryStack} from 'victory-native';
import React from 'react';

const MonthlyDisplay = () => {

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

 const month = new Date().getMonth(); //Current Month
 const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

 return (
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
 );
};

const styles = StyleSheet.create({
 contentContainer: { justifyContent: 'center', alignItems: 'center', margin: percentageWidth('4%'), marginBottom: 64 },
 score: { fontSize: percentageWidth('6%'), color: 'grey' },
});

export default MonthlyDisplay;
