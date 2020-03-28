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
//      plantBased {
//       periodNumber
//       avgCarbonFootprint
//     }
//      fish {
//       periodNumber
//       avgCarbonFootprint
//     }
//     meat {
//       periodNumber
//       avgCarbonFootprint
//     }
//     eggsAndDairy {
//       periodNumber
//       avgCarbonFootprint
//     }
//    }
//  }`;


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
 const averageData = { getPeriodAvg: 64};
 const compositionLoading = false;
 const compositionError = false;
 const compositionData = {
  reportByCategory: {
   plantBased: [
    { 'periodNumber': 0, 'avgCarbonFootprint': 13.50 },
    { 'periodNumber': -1, 'avgCarbonFootprint': 19.00 },
    { 'periodNumber': -2, 'avgCarbonFootprint': 16.50 },
    { 'periodNumber': -3, 'avgCarbonFootprint': 14.25 },
    { 'periodNumber': -4, 'avgCarbonFootprint': 13.00 },
    { 'periodNumber': -5, 'avgCarbonFootprint': 16.50 },
   ],
   fish: [
    { 'periodNumber': 0, 'avgCarbonFootprint': 13.50 },
    { 'periodNumber': -1, 'avgCarbonFootprint': 13.00 },
    { 'periodNumber': -2, 'avgCarbonFootprint': 16.50 },
    { 'periodNumber': -3, 'avgCarbonFootprint': 19.00 },
    { 'periodNumber': -4, 'avgCarbonFootprint': 14.25 },
    { 'periodNumber': -5, 'avgCarbonFootprint': 13.00 },
   ],
   meat: [
    { 'periodNumber': 0, 'avgCarbonFootprint': 13.50 },
    { 'periodNumber': -1, 'avgCarbonFootprint': 16.50 },
    { 'periodNumber': -2, 'avgCarbonFootprint': 19.00 },
    { 'periodNumber': -3, 'avgCarbonFootprint': 13.00 },
    { 'periodNumber': -4, 'avgCarbonFootprint': 14.25 },
    { 'periodNumber': -5, 'avgCarbonFootprint': 16.50 },
   ],
   eggsAndDairy: [
    { 'periodNumber': 0, 'avgCarbonFootprint': 13.50 },
    { 'periodNumber': -1, 'avgCarbonFootprint': 16.5 },
    { 'periodNumber': -2, 'avgCarbonFootprint': 19 },
    { 'periodNumber': -3, 'avgCarbonFootprint': 13 },
    { 'periodNumber': -4, 'avgCarbonFootprint': 14.25 },
    { 'periodNumber': -5, 'avgCarbonFootprint': 13 },
   ],
  },
 };
 

 // This months's carbon footprint
 const thisMonth = compositionData.reportByCategory.plantBased[0].avgCarbonFootprint + compositionData.reportByCategory.fish[0].avgCarbonFootprint + compositionData.reportByCategory.meat[0].avgCarbonFootprint + compositionData.reportByCategory.eggsAndDairy[0].avgCarbonFootprint;
 const lastMonth = compositionData.reportByCategory.plantBased[1].avgCarbonFootprint + compositionData.reportByCategory.fish[1].avgCarbonFootprint + compositionData.reportByCategory.meat[1].avgCarbonFootprint + compositionData.reportByCategory.eggsAndDairy[1].avgCarbonFootprint;
 const changeSinceLastMonth = ((thisMonth - lastMonth) * 100) / thisMonth;
 const monthSign = ((changeSinceLastMonth > 0) ? '+' : '');

 const month = new Date().getMonth(); //Current Month
 const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

 return (
   <View>
     {(averageLoading || compositionLoading) ? (
       <View style={ styles.graphContainer }>
         <Text>Your data is loading</Text>
       </View>
     ) : ((averageError || compositionError) ? (
       <View style={ styles.graphContainer }>
         <Text>An error has occurred</Text>
       </View>
     ) : (
         <View style={styles.contentContainer}>
         <View style={ styles.scoreContainer }>
          <Text style={ styles.score }>{thisMonth} units this month</Text>
          <Text style={ styles.comparison }>{monthSign}{Math.round(changeSinceLastMonth)}% compared{'\n'}to last month</Text>
         </View>
       <View style={ styles.graphContainer }>
         <VictoryChart
           padding={{ top: percentageHeight('2%'), bottom: percentageHeight('12%'), left: percentageWidth('15%'), right: percentageWidth('10%') }}
           domainPadding={percentageWidth('5%')}
           height={percentageHeight('38%')}
         >
           <VictoryAxis dependentAxis orientation="left" offsetX={percentageWidth('15%')} label="Carbon footprint" />
           <VictoryAxis label="Month" domain={[-5,0.01]} tickFormat={(t) => ((month + t) >= 0) ? monthList[month + t] : monthList[month + t + 12]} />
           <VictoryStack colorScale={['olivedrab', 'gold', 'skyblue', 'firebrick']}>
             <VictoryBar data={compositionData.reportByCategory.plantBased} sortKey="periodNumber" x="periodNumber" y="avgCarbonFootprint" />
             <VictoryBar data={compositionData.reportByCategory.eggsAndDairy} sortKey="periodNumber" x="periodNumber" y="avgCarbonFootprint" />
             <VictoryBar data={compositionData.reportByCategory.fish} sortKey="periodNumber" x="periodNumber" y="avgCarbonFootprint" />
             <VictoryBar data={compositionData.reportByCategory.meat} sortKey="periodNumber" x="periodNumber" y="avgCarbonFootprint" />
           </VictoryStack>
           <VictoryLegend
             data={[{ name: 'Plant' }, { name: 'Eggs & Dairy' }, { name: 'Fish' }, { name: 'Meat' }]}
             colorScale={['olivedrab', 'gold', 'skyblue', 'firebrick']}
             orientation="horizontal"
             x={percentageWidth('15%')}
             y={percentageHeight('32%')}
           />
           <VictoryLine data={[
            { x: 0, y: averageData.getPeriodAvg },
            { x: -1, y: averageData.getPeriodAvg },
            { x: -2, y: averageData.getPeriodAvg },
            { x: -3, y: averageData.getPeriodAvg },
            { x: -4, y: averageData.getPeriodAvg },
            { x: -5, y: averageData.getPeriodAvg },
           ]} />
         </VictoryChart>
       </View>
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
