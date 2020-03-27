import {StyleSheet, Text, View} from 'react-native';
import { heightPercentageToDP as percentageHeight, widthPercentageToDP as percentageWidth} from 'react-native-responsive-screen';
import {VictoryAxis, VictoryBar, VictoryChart, VictoryLegend, VictoryLine, VictoryStack} from 'victory-native';
import React from 'react';
//DO NOT DELETE THE FOLLOWING COMMENTED CODE
// import gql from 'graphql-tag';
// import {useQuery} from '@apollo/react-hooks';

//DO NOT DELETE THE FOLLOWING COMMENTED CODE
// const GET_AVERAGE = gql`query {
//   getPeriodAvg(timezone: $timezone, resolution:WEEK) {
//     periodNumber
//     avgCarbonFootpring
//   }
// }`;

//DO NOT DELETE THE FOLLOWING COMMENTED CODE
// const GET_COMPOSITION = gql`query {
//   reportByCategory(timezone: $timezone, resolution:WEEK) {
//     category
//     timeReport {
//       periodNumber
//       avgCarbonFootpring
//     }
//   }
// }
// `;


const WeeklyDisplay = ({ timeDifference }) => {

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
 const averageData = 13.4;
 const compositionLoading = false;
 const compositionError = false;
 const compositionData = {
  'Plant based': [
   { 'periodNumber': 0, 'avgCarbonFootpring': 3.8 },
   { 'periodNumber': -1, 'avgCarbonFootpring': 2.7 },
   { 'periodNumber': -2, 'avgCarbonFootpring': 3.3 },
   { 'periodNumber': -3, 'avgCarbonFootpring': 2.85 },
   { 'periodNumber': -4, 'avgCarbonFootpring': 2.6 },
   { 'periodNumber': -5, 'avgCarbonFootpring': 3.3 },
  ],
  'Fish': [
   { 'periodNumber': 0, 'avgCarbonFootpring': 3.8 },
   { 'periodNumber': -1, 'avgCarbonFootpring': 2.6 },
   { 'periodNumber': -2, 'avgCarbonFootpring': 3.3 },
   { 'periodNumber': -3, 'avgCarbonFootpring': 2.7 },
   { 'periodNumber': -4, 'avgCarbonFootpring': 2.85 },
   { 'periodNumber': -5, 'avgCarbonFootpring': 2.6 },
  ],
  'Meat': [
   { 'periodNumber': 0, 'avgCarbonFootpring': 3.8 },
   { 'periodNumber': -1, 'avgCarbonFootpring': 3.3 },
   { 'periodNumber': -2, 'avgCarbonFootpring': 2.85 },
   { 'periodNumber': -3, 'avgCarbonFootpring': 2.6 },
   { 'periodNumber': -4, 'avgCarbonFootpring': 2.7 },
   { 'periodNumber': -5, 'avgCarbonFootpring': 3.3 },
  ],
  'Eggs and dairy': [
   { 'periodNumber': 0, 'avgCarbonFootpring': 3.8 },
   { 'periodNumber': -1, 'avgCarbonFootpring': 3.3 },
   { 'periodNumber': -2, 'avgCarbonFootpring': 2.85 },
   { 'periodNumber': -3, 'avgCarbonFootpring': 2.6 },
   { 'periodNumber': -4, 'avgCarbonFootpring': 2.7 },
   { 'periodNumber': -5, 'avgCarbonFootpring': 2.6 },
  ],
 };

 const weeklyUserAverage = [
  { 'periodNumber': 0, 'avgCarbonFootpring': averageData },
  { 'periodNumber': -1, 'avgCarbonFootpring': averageData },
  { 'periodNumber': -2, 'avgCarbonFootpring': averageData },
  { 'periodNumber': -3, 'avgCarbonFootpring': averageData },
  { 'periodNumber': -4, 'avgCarbonFootpring': averageData },
  { 'periodNumber': -5, 'avgCarbonFootpring': averageData },
 ];

 // This week's carbon footprint
 const thisWeek = compositionData['Plant based'][0].avgCarbonFootpring + compositionData.Fish[0].avgCarbonFootpring + compositionData.Meat[0].avgCarbonFootpring + compositionData['Eggs and dairy'][0].avgCarbonFootpring;
 const lastWeek = compositionData['Plant based'][1].avgCarbonFootpring + compositionData.Fish[1].avgCarbonFootpring + compositionData.Meat[1].avgCarbonFootpring + compositionData['Eggs and dairy'][1].avgCarbonFootpring;
 const changeSinceLastWeek = ((thisWeek - lastWeek) * 100) / thisWeek;
 const weekSign = ((changeSinceLastWeek > 0) ? '+' : '');


 return (
 <View style={ styles.contentContainer }>
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
       <Text style={ styles.score }>{thisWeek} units this week</Text>
       <Text style={ styles.comparison }>{weekSign}{Math.round(changeSinceLastWeek)}% compared{'\n'}to last week</Text>
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
           domainPadding={ percentageWidth('5%') }
           height={ percentageHeight('38%') }
       >
       <VictoryAxis dependentAxis orientation="left" offsetX={percentageWidth('15%')} label="Carbon footprint" />
       <VictoryAxis label="Week" domain={[-5,0.01]} tickFormat={(t) => (t === 0) ? 'Now' : ('s' + t)} />
       <VictoryStack colorScale={['olivedrab', 'gold', 'skyblue', 'firebrick']}>
         <VictoryBar data={compositionData['Plant based']} sortKey="periodNumber" x="periodNumber" y="avgCarbonFootpring"/>
         <VictoryBar data={compositionData['Eggs and dairy']} sortKey="periodNumber" x="periodNumber" y="avgCarbonFootpring"/>
         <VictoryBar data={compositionData.Fish} sortKey="periodNumber" x="periodNumber" y="avgCarbonFootpring"/>
         <VictoryBar data={compositionData.Meat} sortKey="periodNumber" x="periodNumber" y="avgCarbonFootpring"/>
       </VictoryStack>
       <VictoryLegend
            data={[{ name: 'Plant' }, { name: 'Eggs & Dairy' }, { name: 'Fish' }, { name: 'Meat' }]}
            colorScale={['olivedrab', 'gold', 'skyblue', 'firebrick']}
            orientation="horizontal"
            x={percentageWidth('15%')}
            y={percentageHeight('32%')}
       />
       <VictoryLine data={weeklyUserAverage} x="periodNumber" y="avgCarbonFootpring" />
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

export default WeeklyDisplay;
