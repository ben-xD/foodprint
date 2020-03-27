import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Text,
  Image,
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  VictoryPie,
} from 'victory-native';
import { Button } from 'react-native-elements';
import { widthPercentageToDP as percentageWidth, heightPercentageToDP as percentageHeight } from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import WelcomeScreen from '../components/WelcomeScreen';
import WeeklyDisplay from '../components/WeeklyDisplay';
import MonthlyDisplay from '../components/MonthlyDisplay';
import gql from 'graphql-tag';
import {useMutation, useQuery} from '@apollo/react-hooks';

// //GraphQL schema
// const GET_AVERAGE = gql`
//   query getUserAvg
// `;

const Foodprint = ({ navigation }) => {

  const [isVisible, setVisibility] = useState(true);
  const [timeSpan, setTimeSpan] = useState('weekly');

  const takePicture = async () => {
    navigation.navigate('Camera');
  };

  function totalAverage() {
    // const { loading, error, data } = useQuery(GET_AVERAGE);
    //
    // if (loading) {return 'Loading...';}
    // if (error) {return `Error! ${error.message}`;}
    // return data;
    return 17.25;
  }

  //Mock-up data: Total average
  const averageFootprint = [
    { label: ' ', footprint: totalAverage() },
    { label: ' ', footprint: 26.7 - totalAverage() },
  ];

  const calculateColour = (carbonFootprint) => {
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

  const calculateSmiley = (carbonFootprint) => {
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


  return (
    <SafeAreaView>
      <ScrollView>
        {/*General carbon footprint score*/}
        <View style={{ height: percentageHeight('29%'), alignItems: 'center' }}>
          <Image
            source={calculateSmiley(totalAverage())}
            style={{ height: percentageHeight('10%'), width: percentageWidth('20%'), position: 'absolute', alignSelf: 'center', marginTop: percentageHeight('12%') }}
          />
          <Text style={[styles.score, { position: 'absolute', alignSelf: 'center', marginTop: percentageHeight('24%') }]}>{totalAverage()} units</Text>
          <VictoryPie
            data={averageFootprint}
            x="label"
            y="footprint"
            standalone={true}
            colorScale={[calculateColour(totalAverage()), 'transparent']}
            startAngle={-90}
            endAngle={90}
            innerRadius={percentageHeight('16%')}
            height={percentageHeight('40%')}
          />
        </View>

        {/*Monthly vs Weekly buttons*/}

        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: percentageHeight('2%') }}>
          <Button
            title="Weekly"
            titleStyle={styles.buttonTitle}
            buttonStyle={[styles.button, { backgroundColor: ((timeSpan === 'weekly') ? 'green' : 'grey') }]}
            containerStyle={{ paddingHorizontal: percentageWidth('2%') }}
            onPress={() => setTimeSpan('weekly')}
          />
          <Button
            title="Monthly"
            titleStyle={styles.buttonTitle}
            buttonStyle={[styles.button, { backgroundColor: ((timeSpan === 'monthly') ? 'green' : 'grey') }]}
            containerStyle={{ paddingHorizontal: percentageWidth('2%') }}
            onPress={() => setTimeSpan('monthly')}
          />
        </View>

        {/*Monthly or weekly carbon footprint composition display*/}

        <View>
          {(timeSpan === 'weekly') ? (
              <WeeklyDisplay/>
          ) : (
              <MonthlyDisplay/>
            )}
        </View>
        <WelcomeScreen setVisibility={setVisibility} isVisible={isVisible}/>
      </ScrollView>
      <TouchableOpacity onPress={takePicture} containerStyle={{ backgroundColor: '#008000', width: 64, height: 64, position: 'absolute', bottom: 25, right: 25, borderRadius: 32, alignItems: 'center', justifyContent: 'center' }}>
        <MaterialCommunityIcons name="camera" color={'white'} size={28} />
      </TouchableOpacity>
      {/* <FAB buttonColor="#008000" iconTextColor="#FFFFFF" onClickAction={takePicture} visible={true} iconTextComponent={} /> */}
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  score: { fontSize: percentageWidth('6%'), color: 'grey' },
  buttonTitle: { fontSize: percentageWidth('5%') },
  button: { width: percentageWidth('30%'), height: 45 },
});

export default Foodprint;
