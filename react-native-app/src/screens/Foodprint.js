import React, {useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text, ActivityIndicator,
} from 'react-native';
import { Button } from 'react-native-elements';
import { widthPercentageToDP as percentageWidth, heightPercentageToDP as percentageHeight } from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import WelcomeScreen from '../components/WelcomeScreen';
import WeeklyDisplay from '../components/WeeklyDisplay';
import MonthlyDisplay from '../components/MonthlyDisplay';
import GeneralDisplay from '../components/GeneralDisplay';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';


//DO NOT DELETE THE FOLLOWING COMMENTED CODE
export const GET_WEEKLY_AVERAGE = gql`query($timezone: Int!) {
  getPeriodAvg(timezone: $timezone, resolution: WEEK)
}`;

//DO NOT DELETE THE FOLLOWING COMMENTED CODE
export const GET_WEEKLY_COMPOSITION = gql`query($timezone: Int!) {
  reportByCategory(timezone: $timezone, resolution: WEEK) {
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

//DO NOT DELETE THE FOLLOWING COMMENTED CODE
export const GET_MONTHLY_AVERAGE = gql`query($timezone: Int!) {
  getPeriodAvg(timezone: $timezone, resolution:MONTH)
}`;

//DO NOT DELETE THE FOLLOWING COMMENTED CODE
export const GET_MONTHLY_COMPOSITION = gql`query($timezone: Int!) {
  reportByCategory(timezone: $timezone, resolution:MONTH) {
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


const Foodprint = ({ navigation }) => {

  const [isVisible, setVisibility] = useState(true);
  const [timeSpan, setTimeSpan] = useState('weekly');
  const [weeklyResolved, setWeeklyResolved] = useState(false);
  const [localWeeklyAvg, setWeeklyAvg] = useState(null);
  const [localWeeklyComp, setWeeklyComp] = useState(null);
  const [localMonthlyAvg, setMonthlyAvg] = useState(null);
  const [localMonthlyComp, setMonthlyComp] = useState(null);
  const [monthlyResolved, setMonthlyResolved] = useState(false);

  const takePicture = async () => {
    navigation.navigate('Camera');
  };

  const getTimeDifference = () => {
    const date = new Date();
    const timeDifference = date.getTimezoneOffset();
    return (timeDifference / 60);
  };

  // Comment the following lines to test the caching
  const { loading: weeklyAvgLoading, error: weeklyAvgError, data: weeklyAvgData } = useQuery(GET_WEEKLY_AVERAGE, {
    variables: { timezone: getTimeDifference() },
  });
  const { loading: weeklyCompLoading, error: weeklyCompError, data: weeklyCompData } = useQuery(GET_WEEKLY_COMPOSITION, {
    variables: { timezone: getTimeDifference() },
  });

  // Uncomment the following lines to test the caching
  // let weeklyAvgLoading = false;
  // let weeklyCompLoading = false;
  // let weeklyAvgError = true;
  // let weeklyCompError = true;
  // let weeklyAvgData = null;
  // let weeklyCompData = null;

  // Comment the following lines to test the caching
  const { loading: monthlyAvgLoading, error: monthlyAvgError, data: monthlyAvgData } = useQuery(GET_MONTHLY_AVERAGE, {
    variables: { timezone: getTimeDifference() },
  });
  const { loading: monthlyCompLoading, error: monthlyCompError, data: monthlyCompData } = useQuery(GET_MONTHLY_COMPOSITION, {
    variables: { timezone: getTimeDifference() },
  });

  // Uncomment the following lines to test the caching
  // let monthlyAvgLoading = false;
  // let monthlyCompLoading = false;
  // let monthlyAvgError = true;
  // let monthlyCompError = true;
  // let monthlyAvgData = null;
  // let monthlyCompData = null;


  const saveWeeklyData = async (weeklyAverage, weeklyComposition) => {
    try {
      await AsyncStorage.setItem('weeklyAverage', weeklyAverage);
      await AsyncStorage.setItem('weeklyComposition', weeklyComposition);
    } catch (e) {
      console.log('Error saving weekly data' + e);
    }
  };

  const saveMonthlyData = async (monthlyAverage, monthlyComposition) => {
    try {
      await AsyncStorage.setItem('monthlyAverage', monthlyAverage);
      await AsyncStorage.setItem('monthlyComposition', monthlyComposition);
    } catch (e) {
      console.log('Error saving monthly data' + e);
    }
  };


  const retrieveWeeklyData = async () => {
    try {
      const retrievedAvgData = await AsyncStorage.getItem('weeklyAverage');
      setWeeklyAvg(JSON.parse(retrievedAvgData));
      const retrievedCompData = await AsyncStorage.getItem('weeklyComposition');
      setWeeklyComp(JSON.parse(retrievedCompData));
    } catch (e) {
      console.log('Error retrieving weekly data ' + e);
    }
    setWeeklyResolved(true);
  };

  const retrieveMonthlyData = async () => {
    try {
      const retrievedAvgData = await AsyncStorage.getItem('monthlyAverage');
      setMonthlyAvg(JSON.parse(retrievedAvgData));
      const retrievedCompData = await AsyncStorage.getItem('monthlyComposition');
      setMonthlyComp(JSON.parse(retrievedCompData));
    } catch (e) {
      console.log('Error retrieving monthly data ' + e);
    }
    setMonthlyResolved(true);
  };


  useEffect(() => {
    if (weeklyAvgData && weeklyCompData) {
      saveWeeklyData(JSON.stringify(weeklyAvgData),JSON.stringify(weeklyCompData));
    }
  });

  useEffect(() => {
    if (monthlyAvgData && monthlyCompData) {
      saveMonthlyData(JSON.stringify(monthlyAvgData),JSON.stringify(monthlyCompData));
    }
  });


  useEffect(() => {
    if (weeklyAvgError || weeklyCompError) {
      retrieveWeeklyData();
    }
    if (monthlyAvgError || monthlyCompError) {
      retrieveMonthlyData();
    }
  });

  const whichWeeklyAvg = () => {
    if (weeklyAvgData) {return weeklyAvgData;}
    return localWeeklyAvg;
  };

  const whichWeeklyComp = () => {
    if (weeklyCompData) {return weeklyCompData;}
    return localWeeklyComp;
  };

  const whichMonthlyAvg = () => {
    if (monthlyAvgData) {return monthlyAvgData;}
    return localMonthlyAvg;
  };

  const whichMonthlyComp = () => {
    if (monthlyCompData) {return monthlyCompData;}
    return localMonthlyComp;
  };

  return (
    <SafeAreaView>
      <ScrollView>

        {/*General carbon footprint score*/}
        <View>
          <GeneralDisplay/>
        </View>

        {/*Monthly vs Weekly buttons*/}
        <View style={ styles.buttonContainer }>
          <Button
            title="Weekly"
            titleStyle={ styles.buttonTitle }
            buttonStyle={ [ styles.button, {backgroundColor: ((timeSpan === 'weekly') ? 'green' : 'grey')} ] }
            containerStyle={{ paddingHorizontal: percentageWidth('2%') }}
            onPress={() => setTimeSpan('weekly')}
          />
          <Button
            title="Monthly"
            titleStyle={ styles.buttonTitle }
            buttonStyle={ [ styles.button, {backgroundColor: ((timeSpan === 'monthly') ? 'green' : 'grey')}] }
            containerStyle={{ paddingHorizontal: percentageWidth('2%') }}
            onPress={() => setTimeSpan('monthly')}
          />
        </View>

        {/*Monthly or weekly carbon footprint composition display*/}
        <View>
          {(timeSpan === 'weekly') ? (
            (weeklyAvgLoading || weeklyCompLoading || ((weeklyAvgError || weeklyCompError) && !weeklyResolved)) ? (
              <View style={ styles.graphContainer }>
                <ActivityIndicator/>
              </View>
            ) : (
              <WeeklyDisplay average={whichWeeklyAvg()} composition={whichWeeklyComp()}/>
              )
          ) : (
            (monthlyAvgLoading || monthlyCompLoading || ((monthlyAvgError || monthlyCompError) && !monthlyResolved)) ? (
              <View style={ styles.graphContainer }>
                <ActivityIndicator/>
              </View>
            ) : (
                <MonthlyDisplay average={whichMonthlyAvg()} composition={whichMonthlyComp()}/>
                )
            )}
        </View>
        <View style={ styles.footnote }>
          <Text style={{ fontSize:percentageWidth('3%')}}>The carbon footprint displayed in this app,
            including this page, are given in kilograms of CO2 per kilogram of food. The weight of any food item is
            systematically normalised to 1kg to get to this result.</Text>
        </View>
        <WelcomeScreen setVisibility={setVisibility} isVisible={isVisible}/>
      </ScrollView>

      {/*Camera button*/}
      <TouchableOpacity onPress={takePicture} containerStyle={ styles.camera }>
        <MaterialCommunityIcons name="camera" color={'white'} size={28} />
      </TouchableOpacity>
      {/* <FAB buttonColor="#008000" iconTextColor="#FFFFFF" onClickAction={takePicture} visible={true} iconTextComponent={} /> */}
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  score: { fontSize: percentageWidth('6%'), color: 'grey' },
  footnote: { margin:percentageWidth('5%'), marginTop:percentageHeight('7%'), marginBottom:percentageHeight('15%') },
  buttonContainer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: percentageHeight('2%') },
  buttonTitle: { fontSize: percentageWidth('5%') },
  button: { width: percentageWidth('30%'), height: 45 },
  camera: { backgroundColor: '#008000', width: 64, height: 64, position: 'absolute', bottom: 25, right: 25, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  graphContainer: { height: percentageHeight('38%'), justifyContent: 'center', marginVertical: percentageHeight('2%') },
});

export default Foodprint;
