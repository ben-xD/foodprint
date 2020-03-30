import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as percentageHeight, widthPercentageToDP as percentageWidth } from 'react-native-responsive-screen';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLegend, VictoryLine, VictoryStack } from 'victory-native';
import React, { useEffect } from 'react';
import { Tooltip } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//DO NOT DELETE THE FOLLOWING COMMENTED CODE
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import AsyncStorage from "@react-native-community/async-storage";

//DO NOT DELETE THE FOLLOWING COMMENTED CODE
export const GET_WEEKLY_AVERAGE = gql`query($timezone: Int!) {
  getPeriodAvg(timezone: $timezone, resolution:WEEK)
}`;

//DO NOT DELETE THE FOLLOWING COMMENTED CODE
export const GET_WEEKLY_COMPOSITION = gql`query($timezone: Int!) {
  reportByCategory(timezone: $timezone, resolution:WEEK) {
     plantBased {
      periodNumber
      avgCarbonFootprint
    }
     fish {
      periodNumber
      avgCarbonFootprint
    }
    meat {
      periodNumber
      avgCarbonFootprint
    }
    eggsAndDairy {
      periodNumber
      avgCarbonFootprint
    }
   }
 }`;


const WeeklyDisplay = ({ timeDifference }) => {

  //DO NOT DELETE THE FOLLOWING COMMENTED CODE
  let { loading: averageLoading, error: averageError, data: averageData } = useQuery(GET_WEEKLY_AVERAGE, {
    variables: { timezone: timeDifference },
  });
  let { loading: compositionLoading, error: compositionError, data: compositionData } = useQuery(GET_WEEKLY_COMPOSITION, {
    variables: { timezone: timeDifference },
  });

  const saveWeeklyData = async (weeklyAverage, weeklyComposition) => {
    try {
      await AsyncStorage.setItem('weeklyAverage', weeklyAverage);
      await AsyncStorage.setItem('weeklyComposition', weeklyComposition);
    } catch (e) {
      console.log('Error saving weekly data' + e);
    }
  };

  const getWeeklyDataCache = async () => {
    try {
      const retrievedAverage = await AsyncStorage.getItem('weeklyAverage');
      averageData.getPeriodAvg = JSON.parse(retrievedAverage);
      const retrievedComposition = await AsyncStorage.getItem('weeklyComposition');
      compositionData.reportByCategory = JSON.parse(retrievedComposition);
    } catch (e) {
      console.log('Error retrieving weekly data' + e);
    }
  }

  useEffect(() => {
        if (averageData && compositionData) {
          saveWeeklyData(JSON.stringify(averageData.getPeriodAvg),JSON.stringify(compositionData.reportByCategory));
        }
      }
  );

  useEffect(() => {
        if (averageError || compositionError) {
          getWeeklyDataCache();
        }
      }
  );

  // This week's carbon footprint
  const sum = () => {
    if (compositionLoading || compositionError) { return 0; }

    let thisWeek = 0;
    let lastWeek = 0;

    for (let i = 0; i < compositionData.reportByCategory.plantBased.length; i++) {

      if (compositionData.reportByCategory.plantBased[i].periodNumber === 0) {
        thisWeek += compositionData.reportByCategory.plantBased[i].avgCarbonFootprint;
      } else if (compositionData.reportByCategory.plantBased[i].periodNumber === -1) {
        lastWeek += compositionData.reportByCategory.plantBased[i].avgCarbonFootprint;
      }

      if (compositionData.reportByCategory.eggsAndDairy[i].periodNumber === 0) {
        thisWeek += compositionData.reportByCategory.eggsAndDairy[i].avgCarbonFootprint;
      } else if (compositionData.reportByCategory.eggsAndDairy[i].periodNumber === -1) {
        lastWeek += compositionData.reportByCategory.eggsAndDairy[i].avgCarbonFootprint;
      }

      if (compositionData.reportByCategory.fish[i].periodNumber === 0) {
        thisWeek += compositionData.reportByCategory.fish[i].avgCarbonFootprint;
      } else if (compositionData.reportByCategory.fish[i].periodNumber === -1) {
        lastWeek += compositionData.reportByCategory.fish[i].avgCarbonFootprint;
      }

      if (compositionData.reportByCategory.meat[i].periodNumber === 0) {
        thisWeek += compositionData.reportByCategory.meat[i].avgCarbonFootprint;
      } else if (compositionData.reportByCategory.meat[i].periodNumber === -1) {
        lastWeek += compositionData.reportByCategory.meat[i].avgCarbonFootprint;
      }
    }
    return [thisWeek, lastWeek];
  };

  const changeSinceLastWeek = () => {
    if (compositionLoading || compositionError) { return 0; }
    const value = sum();
    return (((value[0] - value[1]) * 100) / value[0]);
  };

  const weekSign = ((changeSinceLastWeek() > 0) ? '+' : '');


  return (
    <View style={styles.componentContainer}>
      {(averageLoading || compositionLoading) ? (
        <View style={styles.graphContainer}>
          <ActivityIndicator />
        </View>
      // ) : ((averageError || compositionError) ? (
      //   <View style={styles.graphContainer}>
      //     <Text>An error has occurred</Text>
      //   </View>
      ) : (
          <View style={styles.contentContainer}>
            <View style={styles.scoreContainer}>
              <Text style={styles.score}>{sum()[0]} units this week</Text>
              <Text style={styles.comparison}>{weekSign}{Math.round(changeSinceLastWeek())}% compared{'\n'}to last week</Text>
              <Tooltip
                popover={<Text style={styles.tooltipContent}>These scores correspond to your carbon footprint this week,
            and how it compares to last week’s.{'\n\n'}The following graph shows your weekly carbon footprint over the
            last 6 weeks with respect to each of the following food categories: "Plant" (e.g. cereal, fruits,
            vegetables), "Eggs & Dairy", "Fish" and "Meat".{'\n\n'}Your personal average weekly carbon footprint is also
            given by the black line.</Text>}
                backgroundColor={'green'}
                height={percentageHeight('40%')}
                width={percentageWidth('84%')}
              >
                <MaterialCommunityIcons name="help-circle" color={'grey'} size={percentageWidth('4%')} />
              </Tooltip>
            </View>
            <View style={styles.graphContainer}>
              <VictoryChart
                padding={{ top: percentageHeight('8%'), bottom: percentageHeight('18%'), left: percentageWidth('15%'), right: percentageWidth('10%') }}
                domainPadding={percentageWidth('5%')}
                height={percentageHeight('50%')}
              >
                <VictoryAxis dependentAxis orientation="left" offsetX={percentageWidth('15%')} label="Carbon footprint" />
                <VictoryAxis label="Week" domain={[-5, 0.01]} tickFormat={(t) => (t === 0) ? 'Now' : ('s' + t)} />
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
                  itemsPerRow={2}
                  gutter={percentageWidth('15%')}
                  x={percentageWidth('15%')}
                  y={percentageHeight('40%')}
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
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: { height: percentageHeight('4%') },
  scoreContainer: { flexDirection: 'row' },
  graphContainer: { height: percentageHeight('38%'), justifyContent: 'center', marginVertical: percentageHeight('2%') },
  contentContainer: { justifyContent: 'center', alignItems: 'center', margin: percentageWidth('4%') },
  componentContainer: { alignItems: 'center' },
  score: { fontSize: percentageWidth('6%'), color: 'grey' },
  comparison: { fontSize: percentageWidth('3%'), marginLeft: percentageWidth('2%') },
  tooltipContent: { color: 'white', fontSize: percentageWidth('4%') },
});

export default WeeklyDisplay;
