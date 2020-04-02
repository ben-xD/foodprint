// The following file abuses graphQL
// TODO consider merging 4 requests into 1 (may need backend work?)

import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Button } from 'react-native-elements';
import { widthPercentageToDP as percentageWidth, heightPercentageToDP as percentageHeight } from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import WelcomeScreen from '../components/WelcomeScreen';
import WeeklyDisplay from '../components/WeeklyDisplay';
import MonthlyDisplay from '../components/MonthlyDisplay';
import CarbonFootprintScoreView from '../components/CarbonFootprintScore';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';

const UNIT_INFORMATION =
  'The carbon footprint displayed in this app, including this page, ' +
  'are given in kilograms of CO2 per kilogram of food. The weight of ' +
  'any food item is systematically normalised to 1kg to get to this result.';

export const GET_WEEKLY_AVERAGE = gql`query($timezone: Int!) {
  getPeriodAvg(timezone: $timezone, resolution: WEEK)
}`;

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

export const GET_MONTHLY_AVERAGE = gql`query($timezone: Int!) {
  getPeriodAvg(timezone: $timezone, resolution:MONTH)
}`;

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

export const GET_CARBON_FOODPRINT = gql`query {
  getUserAvg
}`;

const Foodprint = ({ navigation }) => {
  const [welcomeScreenIsVisible, setWelcomeScreenIsVisible] = useState(false);
  const [timeSpan, setTimeSpan] = useState('weekly');
  const [weeklyAvg, setWeeklyAvg] = useState(null);
  const [weeklyComp, setWeeklyComp] = useState(null);
  const [monthlyAvg, setMonthlyAvg] = useState(null);
  const [monthlyComp, setMonthlyComp] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // show overlay when user logs in first time
  useEffect(() => {
    const checkIfUserIsLoggedIn = async () => {
      try {
        const firstTimeUser = await AsyncStorage.getItem('firstTimeUser');
        if (firstTimeUser === null) {
          setWelcomeScreenIsVisible(true);
          AsyncStorage.setItem('firstTimeUser', JSON.stringify(false));
        }
      } catch (e) {
        // error reading value, because it doesn't exist, so the user is new.
        setWelcomeScreenIsVisible(true);
        AsyncStorage.setItem('firstTimeUser', JSON.stringify(false));
      }
    };
    checkIfUserIsLoggedIn();
  }, []);

  const goToCamera = async () => {
    navigation.navigate('Camera');
  };

  const getTimeDifference = () => {
    const date = new Date();
    const timeDifference = date.getTimezoneOffset();
    return (timeDifference / 60);
  };

  // Comment the following lines to test the caching
  const { loading: weeklyAvgLoading, error: weeklyAvgError, data: weeklyAvgData, refetch: refetchWeeklyAvg } = useQuery(GET_WEEKLY_AVERAGE, {
    variables: { timezone: getTimeDifference() },
  });
  const { loading: weeklyCompLoading, error: weeklyCompError, data: weeklyCompData, refetch: refetchWeelklyComp } = useQuery(GET_WEEKLY_COMPOSITION, {
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
  const { loading: monthlyAvgLoading, error: monthlyAvgError, data: monthlyAvgData, refetch: refetchMonthlyAvg } = useQuery(GET_MONTHLY_AVERAGE, {
    variables: { timezone: getTimeDifference() },
  });
  const { loading: monthlyCompLoading, error: monthlyCompError, data: monthlyCompData, refetch: refetchMonthlyComp } = useQuery(GET_MONTHLY_COMPOSITION, {
    variables: { timezone: getTimeDifference() },
  });

  let { loading: foodprintLoading, error: foodprintError, data: foodprintData, refetch: refetchFoodprint } = useQuery(GET_CARBON_FOODPRINT);

  const refetch = () => {
    setRefreshing(true);
    setWeeklyAvg(null);
    setWeeklyComp(null);
    setMonthlyAvg(null);
    setMonthlyComp(null);
    refetchWeeklyAvg();
    refetchWeelklyComp();
    refetchMonthlyAvg();
    refetchMonthlyComp();
    refetchFoodprint();
  };

  useEffect(() => {
    if (monthlyAvgData && monthlyCompData) {
      setMonthlyAvg(monthlyAvgData);
      setMonthlyComp(monthlyCompData);
      console.log('Successfully received monthly data, caching locally.');
      cacheHistoricalDataLocally('monthly', JSON.stringify(monthlyAvgData), JSON.stringify(monthlyCompData));
      setRefreshing(false);
    }
  }, [monthlyAvgData, monthlyCompData]);

  useEffect(() => {
    if (weeklyAvgData && weeklyCompData) {
      setWeeklyAvg(weeklyAvgData);
      setWeeklyComp(weeklyCompData);
      console.log('Successfully received weekly data, caching locally.');
      cacheHistoricalDataLocally('weekly', JSON.stringify(weeklyAvgData), JSON.stringify(weeklyCompData));
      setRefreshing(false);
    }
  }, [weeklyAvgData, weeklyCompData]);

  useEffect(() => {
    const retrieveWeeklyDataFromCache = async () => {
      try {
        const retrievedAvgData = await AsyncStorage.getItem('weeklyAverage');
        setWeeklyAvg(JSON.parse(retrievedAvgData));
        const retrievedCompData = await AsyncStorage.getItem('weeklyComposition');
        setWeeklyComp(JSON.parse(retrievedCompData));
      } catch (e) {
        // TODO Sandrine, the user won't see anything if nothing is in cache, and there is a network error?
        console.log('Error retrieving weekly data ' + e);
      }
    };

    if (weeklyCompError || weeklyAvgError) {
      retrieveWeeklyDataFromCache();
    }
  }, [weeklyCompError, weeklyAvgError]);

  useEffect(() => {
    const retrieveMonthlyDataFromCache = async () => {
      try {
        const retrievedAvgData = await AsyncStorage.getItem('monthlyAverage');
        setMonthlyAvg(JSON.parse(retrievedAvgData));
        const retrievedCompData = await AsyncStorage.getItem('monthlyComposition');
        setMonthlyComp(JSON.parse(retrievedCompData));
      } catch (e) {
        console.log('Error retrieving monthly data ' + e);
      }
    };

    if (monthlyAvgError || monthlyCompError) {
      retrieveMonthlyDataFromCache();
    }
  }, [monthlyAvgError, monthlyCompError]);

  // Uncomment the following lines to test the caching
  // let monthlyAvgLoading = false;
  // let monthlyCompLoading = false;
  // let monthlyAvgError = true;
  // let monthlyCompError = true;
  // let monthlyAvgData = null;
  // let monthlyCompData = null;

  const cacheHistoricalDataLocally = async (timeSpan, average, composition) => {
    try {
      await AsyncStorage.setItem(`${timeSpan}Average`, average);
      await AsyncStorage.setItem(`${timeSpan}Composition`, composition);
    } catch (e) {
      console.error(`AsyncStorage failed for ${timeSpan}`, e);
    }
  };

  const renderFootprintChart = () => {
    if (timeSpan === 'weekly') {
      return (
        (!weeklyAvg || !weeklyComp) ? (
          <View style={styles.graphContainer}>
            <ActivityIndicator />
          </View>
        ) : (
            <WeeklyDisplay average={weeklyAvg} composition={weeklyComp} />
          )
      );
    }
    if (timeSpan === 'monthly') {
      return (
        (!monthlyAvg || !monthlyComp) ? (
          <View style={styles.graphContainer}>
            <ActivityIndicator />
          </View>
        ) : (
            <MonthlyDisplay average={monthlyAvg} composition={monthlyComp} />
          )
      );
    }
  };

  return (
    <SafeAreaView>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}>
        <CarbonFootprintScoreView data={foodprintData} loading={foodprintLoading} error={foodprintError} />
        <View>
          {renderFootprintChart()}
        </View>
        <View style={styles.buttonContainer}>
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
        <View style={styles.footnote}>
          <Text style={{ fontSize: percentageWidth('3%') }}>{UNIT_INFORMATION}</Text>
        </View>
        <WelcomeScreen setVisibility={setWelcomeScreenIsVisible} isVisible={welcomeScreenIsVisible} />
      </ScrollView>
      <TouchableOpacity onPress={goToCamera} containerStyle={styles.camera}>
        <MaterialCommunityIcons name="camera" color={'white'} size={28} />
      </TouchableOpacity>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  score: { fontSize: percentageWidth('6%'), color: 'grey' },
  footnote: { margin: percentageWidth('5%'), marginTop: percentageHeight('7%'), marginBottom: percentageHeight('15%') },
  buttonContainer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: percentageHeight('2%') },
  buttonTitle: { fontSize: percentageWidth('5%') },
  button: { width: percentageWidth('30%'), height: 45 },
  camera: { backgroundColor: '#008000', width: 64, height: 64, position: 'absolute', bottom: 25, right: 25, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  graphContainer: { height: percentageHeight('38%'), justifyContent: 'center', marginVertical: percentageHeight('2%') },
});

export default Foodprint;
