import { StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as percentageHeight, widthPercentageToDP as percentageWidth } from 'react-native-responsive-screen';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLegend, VictoryLine, VictoryStack } from 'victory-native';
import React from 'react';
import { Tooltip } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCallback } from 'react';
import { FOODPRINT_UNIT } from '../strings';

const TOOLTIP_CONTENT = 'This bar chart breaks down your weekly diet into the different food categories. ' +
  'Meat has the highest carbon footprint. The more sustainable food you eat, the shorter the bars get. Aim for that :).';

const WeeklyDisplay = ({ average, composition }) => {

  // This week's carbon footprint
  const sum = useCallback(() => {
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
  }, [composition.eggsAndDairy, composition.fish, composition.meat, composition.plantBased]);

  const changeSinceLastWeek = useCallback(() => {
    const value = sum();
    return (((value[0] - value[1]) * 100) / value[0]);
  }, [sum]);

  const weekSign = ((changeSinceLastWeek() > 0) ? '+' : '');

  return (
    <View style={styles.contentContainer}>
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>{sum()[0].toFixed(1)} {FOODPRINT_UNIT} this week</Text>
        {(isNaN(changeSinceLastWeek())) ? <></> : (
          <Text style={styles.comparison}>{weekSign}{changeSinceLastWeek().toFixed(0)}% compared{'\n'}to last week</Text>
        )
        }
        <Tooltip
          popover={<View>
            <Text style={styles.tooltipContent}>{TOOLTIP_CONTENT}</Text>
          </View>}
          backgroundColor={'#008000'}
          height={percentageHeight('30%')}
          width={percentageWidth('65%')}
        >
          <MaterialCommunityIcons name="help-circle" color={'grey'} size={24} />
        </Tooltip>
      </View>
      <View style={styles.graphContainer}>
        <VictoryChart
          padding={{ top: percentageHeight('8%'), bottom: percentageHeight('18%'), left: percentageWidth('15%'), right: percentageWidth('10%') }}
          domainPadding={percentageWidth('5%')}
          height={percentageHeight('50%')}
          domain={(average === 0.0 && sum()[0] === 0.0) ? { y: [0, 1] } : {}}
        >
          <VictoryAxis dependentAxis orientation="left" offsetX={percentageWidth('15%')} />
          <VictoryAxis crossAxis={false} label="Week" domain={[-5, 0.01]} tickFormat={(t) => (t === 0) ? 'Now' : ('s' + t)} />
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
  scoreContainer: { flexDirection: 'row', zIndex: 100 },
  graphContainer: { height: percentageHeight('38%'), justifyContent: 'center', marginVertical: 16 },
  contentContainer: { justifyContent: 'center', alignItems: 'center', margin: percentageWidth('4%') },
  score: { fontSize: 18, color: 'grey' },
  comparison: { fontSize: 12, marginLeft: percentageWidth('2%') },
  tooltipContent: { color: 'white', fontSize: 16 },
});

export default WeeklyDisplay;
