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

const GET_USER_HISTORY_REPORT = gql`
  query GetUserHistoryReport ($timezone: Int!, $resolutions: [ReportResolution!]!) {
    getUserHistoryReport (timezone: $timezone, resolutions: $resolutions) {
      userAvg
      periodAvgs
      categoryReports {
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
    }
  }
`;

const Foodprint = ({ navigation }) => {
  const [welcomeScreenIsVisible, setWelcomeScreenIsVisible] = useState(false);
  const [timeSpan, setTimeSpan] = useState('weekly');
  const [historyReport, setHistoryReport] = useState(null);
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
  const { loading: historyReportLoading, error: historyReportError, data: historyReportData, refetch: refetchHistoryReport } = useQuery(GET_USER_HISTORY_REPORT, {
    variables: { timezone: getTimeDifference(), resolutions: ['WEEK', 'MONTH'] },
  });

  // Uncomment the following lines to test the caching
  // let historyReportLoading = false;
  // let historyReportError = true;
  // let historyReportData = null;

  const refetch = () => {
    setRefreshing(true);
    setHistoryReport(null);
    refetchHistoryReport();
  };

  useEffect(() => {
    if (historyReportData && historyReportData.getUserHistoryReport) {
      setHistoryReport(historyReportData.getUserHistoryReport);
      console.log('Successfully received user history report data, caching locally.');
      cacheHistoryReportLocally(historyReportData.getUserHistoryReport);
      setRefreshing(false);
    }
  }, [historyReportData]);

  useEffect(() => {
    const retrieveHistoryReportDataFromCache = async () => {
      try {
        const retrievedHistoryReport = await AsyncStorage.getItem('historyReport');
        setHistoryReport(JSON.parse(retrievedHistoryReport));
      } catch (e) {
        console.log('Error retrieving user history report data:' + e);
      }
    };
    if (historyReportError) {
      retrieveHistoryReportDataFromCache();
    }
  }, [historyReportError]);

  const cacheHistoryReportLocally = async (data) => {
    try {
      await AsyncStorage.setItem(`historyReport`, JSON.stringify(data));
    } catch (e) {
      console.error(`AsyncStorage failed for historyReport`, e);
    }
  };

  const renderFootprintChart = () => {
    if (timeSpan === 'weekly') {
      return (
        (!historyReport) ? (
          <View style={styles.graphContainer}>
            <ActivityIndicator />
          </View>
        ) : (
            <WeeklyDisplay average={historyReport.periodAvgs[0]} composition={historyReport.categoryReports[0]} />
          )
      );
    }
    if (timeSpan === 'monthly') {
      return (
        (!historyReport) ? (
          <View style={styles.graphContainer}>
            <ActivityIndicator />
          </View>
        ) : (
            <MonthlyDisplay average={historyReport.periodAvgs[1]} composition={historyReport.categoryReports[1]} />
          )
      );
    }
  };

  return (
    <SafeAreaView>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}>
        <CarbonFootprintScoreView data={historyReportData} loading={historyReportLoading} error={historyReportError} />
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
