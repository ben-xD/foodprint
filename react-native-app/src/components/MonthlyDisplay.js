import { StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as percentageHeight, widthPercentageToDP as percentageWidth } from 'react-native-responsive-screen';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLegend, VictoryLine, VictoryStack } from 'victory-native';
import React from 'react';
import { Tooltip } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const MonthlyDisplay = ({ average, composition }) => {

  // This months's carbon footprint
  const sum = () => {

    let thisMonth = 0;
    let lastMonth = 0;

    for (let i = 0; i < composition.plantBased.length; i++) {

      if (composition.plantBased[i].periodNumber === 0) {
        thisMonth += composition.plantBased[i].avgCarbonFootprint;
      } else if (composition.plantBased[i].periodNumber === -1) {
        lastMonth += composition.plantBased[i].avgCarbonFootprint;
      }

      if (composition.eggsAndDairy[i].periodNumber === 0) {
        thisMonth += composition.eggsAndDairy[i].avgCarbonFootprint;
      } else if (composition.eggsAndDairy[i].periodNumber === -1) {
        lastMonth += composition.eggsAndDairy[i].avgCarbonFootprint;
      }

      if (composition.fish[i].periodNumber === 0) {
        thisMonth += composition.fish[i].avgCarbonFootprint;
      } else if (composition.fish[i].periodNumber === -1) {
        lastMonth += composition.fish[i].avgCarbonFootprint;
      }

      if (composition.meat[i].periodNumber === 0) {
        thisMonth += composition.meat[i].avgCarbonFootprint;
      } else if (composition.meat[i].periodNumber === -1) {
        lastMonth += composition.meat[i].avgCarbonFootprint;
      }
    }
    return [thisMonth, lastMonth];
  };

  const changeSinceLastMonth = () => {
    const value = sum();
    return (((value[0] - value[1]) * 100) / value[0]);
  };

  const monthSign = ((changeSinceLastMonth() > 0) ? '+' : '');

  // Calculate current month for x-axis display
  const month = new Date().getMonth(); //Current Month
  const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
          <View style={styles.contentContainer}>
            <View style={styles.scoreContainer}>
              <Text style={styles.score}>{Math.round(sum()[0])} units this month</Text>
              <Text style={styles.comparison}>{monthSign}{Math.round(changeSinceLastMonth())}% compared{'\n'}to last month</Text>
              <Tooltip
                popover={<Text style={styles.tooltipContent}>These scores correspond to your carbon footprint this
               month, and how it compares to last month’s.{'\n\n'}The following graph shows your monthly carbon
               footprint over the last 6 months with respect to each of the following food categories: "Plant" (e.g.
               cereal, fruits, vegetables), "Eggs & Dairy", "Fish" and "Meat".{'\n\n'}Your personal average monthly
               carbon footprint is also given by the black line.</Text>}
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
                <VictoryAxis label="Month" domain={[-5, 0.01]} tickFormat={(t) => ((month + t) >= 0) ? monthList[month + t] : monthList[month + t + 12]} />
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

export default MonthlyDisplay;
