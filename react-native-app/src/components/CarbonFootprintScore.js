import { heightPercentageToDP as percentageHeight, widthPercentageToDP as percentageWidth } from 'react-native-responsive-screen';
import { VictoryPie } from 'victory-native';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { Tooltip } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CarbonFootprintScore = ({ loading, error, historyReport }) => {

  const getColorFromCarbonFootprint = (carbonFootprint) => {
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

  const getSmileyFromCarbonFootprint = (carbonFootprint) => {
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

  const TOOLTIP_MESSAGE = 'This score corresponds to the average carbon footprint of ' +
    'all the items you have added to your history since you have started using Foodprint.';

  const renderTooltip = () => (
    <Tooltip popover={<Text style={styles.tooltipContent}>{TOOLTIP_MESSAGE}</Text>}
      backgroundColor={'green'}
      height={percentageHeight('20%')}
      width={percentageWidth('65%')}>
      <MaterialCommunityIcons name="help-circle" color={'grey'} size={percentageWidth('4%')} />
    </Tooltip>
  );

  return (
    <View>
      {loading || error || !historyReport?.userAvg ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      ) : (
          <View style={styles.graphContainer}>
            <Image
              source={getSmileyFromCarbonFootprint(historyReport.userAvg)}
              style={styles.image}
            />
            <View style={styles.scoreContainer}>
              <Text style={styles.score}>{Math.round(historyReport.userAvg)} units</Text>
              {renderTooltip()}
            </View>
            <VictoryPie
              data={[{ x: ' ', y: historyReport.userAvg }, { x: ' ', y: 26.7 - historyReport.userAvg }]}
              standalone={true}
              colorScale={[getColorFromCarbonFootprint(historyReport.userAvg), 'transparent']}
              startAngle={-90}
              endAngle={90}
              innerRadius={percentageHeight('16%')}
              height={percentageHeight('40%')}
            />
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { height: percentageHeight('29%'), alignItems: 'center', justifyContent: 'center' },
  graphContainer: { height: percentageHeight('29%'), alignItems: 'center' },
  tooltipContent: { color: 'white', fontSize: percentageWidth('4%') },
  image: { height: percentageHeight('10%'), width: percentageWidth('20%'), position: 'absolute', alignSelf: 'center', marginTop: percentageHeight('12%') },
  scoreContainer: { position: 'absolute', alignSelf: 'center', marginTop: percentageHeight('24%'), flexDirection: 'row' },
  score: { fontSize: percentageWidth('6%'), color: 'grey', margin: percentageWidth('1%') },
});

export default CarbonFootprintScore;
