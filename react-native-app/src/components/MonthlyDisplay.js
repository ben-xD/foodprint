import {StyleSheet, Text, View} from 'react-native';
import { heightPercentageToDP as percentageHeight, widthPercentageToDP as percentageWidth} from 'react-native-responsive-screen';
import {VictoryAxis, VictoryBar, VictoryChart, VictoryLegend, VictoryLine, VictoryStack} from 'victory-native';
import React from 'react';
//DO NOT DELETE THE FOLLOWING COMMENTED CODE
// import gql from 'graphql-tag';
// import {useQuery} from '@apollo/react-hooks';

//DO NOT DELETE THE FOLLOWING COMMENTED CODE
// const GET_AVERAGE = gql`query {
//   getPeriodAvg(timezone: $timezone, resolution:MONTH) {
//     periodNumber
//     avgCarbonFootprint
//   }
// }`;

//DO NOT DELETE THE FOLLOWING COMMENTED CODE
// const GET_COMPOSITION = gql`query {
//   reportByCategory(timezone: $timezone, resolution:MONTH) {
//     category
//     timeReport {
//       periodNumber
//       avgCarbonFootprint
//     }
//   }
// }
// `;


const MonthlyDisplay = ({ timeDifference }) => {

 //DO NOT DELETE THE FOLLOWING COMMENTED CODE
 // const { loading: averageLoading, error: averageError, data: averageData } = useQuery(GET_AVERAGE, {
 //  variables: { timeDifference },
 // });
 // const { loading: compositionLoading, error: compositionError, data: compositionData } = useQuery(GET_COMPOSITION, {
 //  variables: { timeDifference },
 // });

 //Following code is here to mimick response from back-end
 const averageLoading = false;
 const averageError = false;
 const averageData = 64;
 const compositionLoading = false;
 const compositionError = false;
 const compositionData = {
  'Plant based': [
   { 'periodNumber': 0, 'avgCarbonFootprint': 13.50 },
   { 'periodNumber': -1, 'avgCarbonFootprint': 19.00 },
   { 'periodNumber': -2, 'avgCarbonFootprint': 16.50 },
   { 'periodNumber': -3, 'avgCarbonFootprint': 14.25 },
   { 'periodNumber': -4, 'avgCarbonFootprint': 13.00 },
   { 'periodNumber': -5, 'avgCarbonFootprint': 16.50 },
  ],
  'Fish': [
   { 'periodNumber': 0, 'avgCarbonFootprint': 13.50 },
   { 'periodNumber': -1, 'avgCarbonFootprint': 13.00 },
   { 'periodNumber': -2, 'avgCarbonFootprint': 16.50 },
   { 'periodNumber': -3, 'avgCarbonFootprint': 19.00 },
   { 'periodNumber': -4, 'avgCarbonFootprint': 14.25 },
   { 'periodNumber': -5, 'avgCarbonFootprint': 13.00 },
  ],
  'Meat': [
   { 'periodNumber': 0, 'avgCarbonFootprint': 13.50 },
   { 'periodNumber': -1, 'avgCarbonFootprint': 16.50 },
   { 'periodNumber': -2, 'avgCarbonFootprint': 19.00 },
   { 'periodNumber': -3, 'avgCarbonFootprint': 13.00 },
   { 'periodNumber': -4, 'avgCarbonFootprint': 14.25 },
   { 'periodNumber': -5, 'avgCarbonFootprint': 16.50 },
  ],
  'Eggs and dairy': [
   { 'periodNumber': 0, 'avgCarbonFootprint': 13.50 },
   { 'periodNumber': -1, 'avgCarbonFootprint': 16.5 },
   { 'periodNumber': -2, 'avgCarbonFootprint': 19 },
   { 'periodNumber': -3, 'avgCarbonFootprint': 13 },
   { 'periodNumber': -4, 'avgCarbonFootprint': 14.25 },
   { 'periodNumber': -5, 'avgCarbonFootprint': 13 },
  ],
 };

 const monthlyUserAverage = [
  { 'periodNumber': 0, 'avgCarbonFootprint': averageData },
  { 'periodNumber': -1, 'avgCarbonFootprint': averageData },
  { 'periodNumber': -2, 'avgCarbonFootprint': averageData },
  { 'periodNumber': -3, 'avgCarbonFootprint': averageData },
  { 'periodNumber': -4, 'avgCarbonFootprint': averageData },
  { 'periodNumber': -5, 'avgCarbonFootprint': averageData },
 ];

 // This months's carbon footprint
 const thisMonth = compositionData['Plant based'][0].avgCarbonFootprint + compositionData.Fish[0].avgCarbonFootprint + compositionData.Meat[0].avgCarbonFootprint + compositionData['Eggs and dairy'][0].avgCarbonFootprint;
 const lastMonth = compositionData['Plant based'][1].avgCarbonFootprint + compositionData.Fish[1].avgCarbonFootprint + compositionData.Meat[1].avgCarbonFootprint + compositionData['Eggs and dairy'][1].avgCarbonFootprint;
 const changeSinceLastMonth = ((thisMonth - lastMonth) * 100) / thisMonth;
 const monthSign = ((changeSinceLastMonth > 0) ? '+' : '');

 const month = new Date().getMonth(); //Current Month
 const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

 return (
   <View style={styles.contentContainer}>
     {(averageLoading) ? (
       <View style={ styles.messageContainer }>
         <Text>Your data is loading</Text>
       </View>
     ) : ((averageError) ? (
       <View style={ styles.messageContainer }>
         <Text>An error has occurred</Text>
       </View>
     ) : (
       <View style={ styles.scoreContainer }>
         <Text style={ styles.score }>{thisMonth} units this month</Text>
         <Text style={ styles.comparison }>{monthSign}{Math.round(changeSinceLastMonth)}% compared{'\n'}to last month</Text>
       </View>
     ))}
     {(compositionLoading) ? (
       <View style={ styles.graphContainer }>
         <Text>Your data is loading</Text>
       </View>
     ) : ((compositionError) ? (
       <View style={ styles.graphContainer }>
         <Text>An error has occurred</Text>
       </View>
     ) : (
       <View style={ styles.graphContainer }>
         <VictoryChart
           padding={{ top: percentageHeight('2%'), bottom: percentageHeight('12%'), left: percentageWidth('15%'), right: percentageWidth('10%') }}
           domainPadding={percentageWidth('5%')}
           height={percentageHeight('38%')}
         >
           <VictoryAxis dependentAxis orientation="left" offsetX={percentageWidth('15%')} label="Carbon footprint" />
           <VictoryAxis label="Month" domain={[-5,0.01]} tickFormat={(t) => ((month + t) >= 0) ? monthList[month + t] : monthList[month + t + 12]} />
           <VictoryStack colorScale={['olivedrab', 'gold', 'skyblue', 'firebrick']}>
             <VictoryBar data={compositionData['Plant based']} sortKey="periodNumber" x="periodNumber" y="avgCarbonFootprint" />
             <VictoryBar data={compositionData['Eggs and dairy']} sortKey="periodNumber" x="periodNumber" y="avgCarbonFootprint" />
             <VictoryBar data={compositionData.Fish} sortKey="periodNumber" x="periodNumber" y="avgCarbonFootprint" />
             <VictoryBar data={compositionData.Meat} sortKey="periodNumber" x="periodNumber" y="avgCarbonFootprint" />
           </VictoryStack>
           <VictoryLegend
             data={[{ name: 'Plant' }, { name: 'Eggs & Dairy' }, { name: 'Fish' }, { name: 'Meat' }]}
             colorScale={['olivedrab', 'gold', 'skyblue', 'firebrick']}
             orientation="horizontal"
             x={percentageWidth('15%')}
             y={percentageHeight('32%')}
           />
           <VictoryLine data={monthlyUserAverage} x="periodNumber" y="avgCarbonFootprint" />
         </VictoryChart>
       </View>
     ))}
   </View>
 );
};


const styles = StyleSheet.create({
 messageContainer: { height:percentageHeight('4%') },
 scoreContainer: { flexDirection: 'row' },
 graphContainer: { height:percentageHeight('38%'), justifyContent:'center', marginVertical: percentageHeight('2%') },
 contentContainer: { justifyContent: 'center', alignItems: 'center', margin: percentageWidth('4%'), marginBottom: 64 },
 score: { fontSize: percentageWidth('6%'), color: 'grey' },
 comparison: { fontSize: percentageWidth('3%'), marginLeft: percentageWidth('2%') },
});

export default MonthlyDisplay;
