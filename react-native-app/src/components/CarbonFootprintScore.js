import { heightPercentageToDP as percentageHeight, widthPercentageToDP as percentageWidth } from 'react-native-responsive-screen';
import { VictoryPie } from 'victory-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Tooltip } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FOODPRINT_UNIT, FOODPRINT_UNIT_INFORMATION } from '../strings';

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

  const TOOLTIP_MESSAGE = FOODPRINT_UNIT_INFORMATION + '\nIt goes down when your diet is more sustainable, and doesn\'t take into quantities.';

  const renderTooltip = () => (
    <Tooltip popover={<Text style={styles.tooltipContent}>{TOOLTIP_MESSAGE}</Text>}
      backgroundColor={'#008000'}
      height={percentageHeight('40%')}
      width={percentageWidth('80%')}>
      <MaterialCommunityIcons name="help-circle" color={'grey'} size={24} />
    </Tooltip>
  );

  return (
    <View>
      {!historyReport ? (
        <View style={styles.loadingContainer}>
          <LottieView source={require('../animations/18473-flying-avocado.json')} autoPlay loop />
        </View>
      ) : (
          <View style={styles.graphContainer}>
            <Image
              source={getSmileyFromCarbonFootprint(historyReport.userAvg)}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={styles.scoreContainer}>
              <Text style={styles.score}>{historyReport.userAvg.toFixed(1)} {FOODPRINT_UNIT}</Text>
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
  tooltipContent: { color: 'white', fontSize: 16 },
  image: { height: percentageHeight('10%'), position: 'absolute', alignSelf: 'center', marginTop: percentageHeight('12%') },
  scoreContainer: { zIndex: 100, position: 'absolute', marginTop: percentageHeight('24%'), flexDirection: 'row', alignItems: 'center' },
  score: { fontSize: 24, color: 'grey' },
});

export default CarbonFootprintScore;
