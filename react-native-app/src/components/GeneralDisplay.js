import { heightPercentageToDP as percentageHeight, widthPercentageToDP as percentageWidth } from 'react-native-responsive-screen';
import { VictoryPie } from 'victory-native';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { Tooltip } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//DO NOT DELETE THE FOLLOWING COMMENTED CODE
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';


//DO NOT DELETE THE FOLLOWING COMMENTED CODE
export const GET_INDEFINITE_AVERAGE = gql`query {
  getUserAvg
}`;


const GeneralDisplay = () => {
  //Comment the following line to test caching
  let { loading, error, data } = useQuery(GET_INDEFINITE_AVERAGE);

  // Uncomment the following lines to test caching
  // let loading = false;
  // let error = true;
  // let data = null;

  const [resolved, setResolved] = useState(false);
  const [localData, setData] = useState(null);

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

 const saveGeneralScore = async (value) => {
  try {
   await AsyncStorage.setItem('generalScore', value);
  } catch (e) {
   console.log('Error saving generalScore' + e);
  }
 };

 const retrieveData = async () => {
  try {
    const retrievedData = await AsyncStorage.getItem('generalScore');
    setData(JSON.parse(retrievedData));
  } catch (e) {
    console.log('Error retrieving generalScore' + e);
  }
  setResolved(true);
 };

 useEffect(() => {
   if (data) {
      saveGeneralScore(JSON.stringify(data));
     }
 });

 useEffect(() => {
   if (error) {
     retrieveData();
   }
});

 const whichData = () => {
  if (data) {return data;}
  return localData;
 };

 return (
   <View>
     {(loading || (error && !resolved)) ? (
       <View style={ styles.messageContainer }>
        <ActivityIndicator/>
       </View>
     ) : (
       <View style={ styles.graphContainer }>
         <Image
           source={calculateSmiley(whichData().getUserAvg)}
           style={ styles.image }
         />
         <View style={ [ styles.scoreContainer ]}>
           <Text style={ styles.score }>{Math.round(whichData().getUserAvg)} units</Text>
           <Tooltip
               popover={<Text style={ styles.tooltipContent }>This score corresponds to the average carbon footprint of
                all the items you have added to your history since you have started using Foodprint.</Text>}
                backgroundColor={'green'}
                height={percentageHeight('20%')}
                width={percentageWidth('65%')}
              >
                <MaterialCommunityIcons name="help-circle" color={'grey'} size={percentageWidth('4%')} />
              </Tooltip>
            </View>
            <VictoryPie
              data={[{ x: ' ', y: whichData().getUserAvg }, { x: ' ', y: 26.7 - whichData().getUserAvg }]}
              standalone={true}
              colorScale={[calculateColour(whichData().getUserAvg), 'transparent']}
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
  messageContainer: { height: percentageHeight('29%'), alignItems: 'center', justifyContent: 'center' },
  graphContainer: { height: percentageHeight('29%'), alignItems: 'center' },
  tooltipContent: { color: 'white', fontSize: percentageWidth('4%') },
  image: { height: percentageHeight('10%'), width: percentageWidth('20%'), position: 'absolute', alignSelf: 'center', marginTop: percentageHeight('12%') },
  scoreContainer: { position: 'absolute', alignSelf: 'center', marginTop: percentageHeight('24%'), flexDirection: 'row' },
  score: { fontSize: percentageWidth('6%'), color: 'grey', margin: percentageWidth('1%') },
});

export default GeneralDisplay;
