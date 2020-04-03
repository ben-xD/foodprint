import { StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as percentageHeight, widthPercentageToDP as percentageWidth } from 'react-native-responsive-screen';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLegend, VictoryLine, VictoryStack } from 'victory-native';
import React from 'react';
import { Tooltip } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const WeeklyDisplay = ({ average, composition }) => {

  // This week's carbon footprint
  const sum = () => {

    let thisWeek = 0;
    let lastWeek = 0;

    for (let i = 0; i < composition.plantBased.length; i++) {

      if (composition.plantBased[i].periodNumber === 0) {
        thisWeek += composition.plantBased[i].avgCarbonFootprint;
      } else if (composition.plantBased[i].periodNumber === -1) {
        lastWeek += composition.plantBased[i].avgCarbonFootprint;
      }

      if (composition.eggsAndDairy[i].periodNumber === 0) {
        thisWeek += composition.eggsAndDairy[i].avgCarbonFootprint;
      } else if (composition.eggsAndDairy[i].periodNumber === -1) {
        lastWeek += composition.eggsAndDairy[i].avgCarbonFootprint;
      }

      if (composition.fish[i].periodNumber === 0) {
        thisWeek += composition.fish[i].avgCarbonFootprint;
      } else if (composition.fish[i].periodNumber === -1) {
        lastWeek += composition.fish[i].avgCarbonFootprint;
      }

      if (composition.meat[i].periodNumber === 0) {
        thisWeek += composition.meat[i].avgCarbonFootprint;
      } else if (composition.meat[i].periodNumber === -1) {
        lastWeek += composition.meat[i].avgCarbonFootprint;
      }
    }
    return [thisWeek, lastWeek];
  };

  const changeSinceLastWeek = () => {
    const value = sum();
    return (((value[0] - value[1]) * 100) / value[0]);
  };

  const weekSign = ((changeSinceLastWeek() > 0) ? '+' : '');


  return (
    <View style={styles.contentContainer}>
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>{Math.round(sum()[0])} units this week</Text>
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
            <VictoryBar data={composition.plantBased} sortKey="periodNumber" x="periodNumber" y="avgCarbonFootprint" />
            <VictoryBar data={composition.eggsAndDairy} sortKey="periodNumber" x="periodNumber" y="avgCarbonFootprint" />
            <VictoryBar data={composition.fish} sortKey="periodNumber" x="periodNumber" y="avgCarbonFootprint" />
            <VictoryBar data={composition.meat} sortKey="periodNumber" x="periodNumber" y="avgCarbonFootprint" />
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
            { x: 0, y: average },
            { x: -1, y: average },
            { x: -2, y: average },
            { x: -3, y: average },
            { x: -4, y: average },
            { x: -5, y: average },
          ]} />
        </VictoryChart>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: { height: percentageHeight('4%') },
  scoreContainer: { flexDirection: 'row' },
  graphContainer: { height: percentageHeight('38%'), justifyContent: 'center', marginVertical: percentageHeight('2%') },
  contentContainer: { justifyContent: 'center', alignItems: 'center', margin: percentageWidth('4%') },
  score: { fontSize: percentageWidth('6%'), color: 'grey' },
  comparison: { fontSize: percentageWidth('3%'), marginLeft: percentageWidth('2%') },
  tooltipContent: { color: 'white', fontSize: percentageWidth('4%') },
});

export default WeeklyDisplay;
