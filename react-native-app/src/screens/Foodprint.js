import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Button } from 'react-native-elements';
import {
  widthPercentageToDP as percentageWidth,
  heightPercentageToDP as percentageHeight,
} from 'react-native-responsive-screen';
import WeeklyDisplay from '../components/WeeklyDisplay';
import MonthlyDisplay from '../components/MonthlyDisplay';
import CarbonFootprintScore from '../components/CarbonFootprintScore';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import WelcomeScreen from '../components/WelcomeScreen';
import { FloatingAction } from 'react-native-floating-action';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const UNIT_INFORMATION =
  'The carbon footprint displayed in this app, including this page, ' +
  'are given in kilograms of CO2 per kilogram of food. The weight of ' +
  'any food item is systematically normalised to 1kg to get to this result.';

export const GET_USER_HISTORY_REPORT = gql`
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

const Foodprint = ({ navigation, route }) => {
  const [introductoryOverlayVisible, setIntroductoryOverlayVisible] = useState(false);
  const [timeSpan, setTimeSpan] = useState('weekly');
  const [historyReport, setHistoryReport] = useState(null);
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);

  const floatingActionButtons = [
    {
      text: 'Scan food or barcode',
      name: 'camera',
      color: '#008000',
      icon: require('../images/camera.png'),
    },
    {
      text: 'Add recipe',
      name: 'recipe',
      color: '#008000',
      icon: require('../images/receipt.png'),
    },
  ];

  const showOverlayIfNewUser = async () => {
    try {
      const userHasSeenOverlayPreviously = await AsyncStorage.getItem('introductoryOverlaySeen');
      console.log({ userHasSeenOverlayPreviously });
      if (userHasSeenOverlayPreviously) {
        return;
      }
    } catch (e) { } // If value does not exist in storage, ignore the error.

    // Show overlay
    AsyncStorage.setItem('introductoryOverlaySeen', JSON.stringify(true));
    setIntroductoryOverlayVisible(true);
  };

  useEffect(() => {
    showOverlayIfNewUser();
  }, []);

  // Occurs everytime the screen if focused
  useFocusEffect(useCallback(() => {
    if (route.params && route.params.refresh) {
      refetch(); // refetch data if refresh param set
    }

    if (route.params && route.params.showIntroductoryOverlay) {
      showOverlayIfNewUser(); // show overlay if showIntroductoryOverlay param set
    }
  }, [refetch, route]));



  const refetch = useCallback(() => {
    console.log('Refetching data.');
    setRefreshing(true);
    setHistoryReport(null);
    refetchHistoryReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToCamera = async () => {
    navigation.navigate('Camera');
  };

  const goToRecipe = async () => {
    navigation.navigate('Recipe');
  };

  // useMemo will recalculate only if dependencies change,
  // and since it was given none, it won't be recomputed.
  const timezoneOffsetInHours = useMemo(() => {
    const date = new Date();
    const timeOffsetInMinutes = date.getTimezoneOffset();
    return timeOffsetInMinutes / 60;
  }, []);

  const {
    loading: historyReportLoading,
    error: historyReportError,
    data: historyReportData,
    refetch: refetchHistoryReport,
  } = useQuery(GET_USER_HISTORY_REPORT, {
    variables: { timezone: timezoneOffsetInHours, resolutions: ['WEEK', 'MONTH'] },
  });

  useEffect(() => {
    if (historyReportData && historyReportData.getUserHistoryReport) {
      setHistoryReport(historyReportData.getUserHistoryReport);
      console.log('Successfully received user history report data, caching locally.');
      cacheHistoryReportLocally(historyReportData.getUserHistoryReport);
    } else if (historyReportData) {
      // TODO why is the historyReportData.getUserHistoryReport null?
      console.log('No history, showing user no history.');
    }
    setRefreshing(false);
    console.log({ historyReportData });
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
      await AsyncStorage.setItem('historyReport', JSON.stringify(data));
    } catch (e) {
      console.error('AsyncStorage failed for historyReport', e);
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
      <ScrollView style={{ height: '100%' }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}>
        <CarbonFootprintScore historyReport={historyReport} loading={historyReportLoading} error={historyReportError} />
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
          <Text style={{ fontSize: 12 }}>{UNIT_INFORMATION}</Text>
        </View>
      </ScrollView>
      <FloatingAction
        visible={isFocused}
        actions={floatingActionButtons}
        color={'#008000'}
        onPressItem={name => {
          if (name === 'camera') {
            goToCamera();
          } else if (name === 'recipe') {
            goToRecipe();
          }
          console.log(`selected button: ${name}`);
        }}
      />
      <WelcomeScreen setVisibility={setIntroductoryOverlayVisible} isVisible={introductoryOverlayVisible} />
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  score: { fontSize: percentageWidth('6%'), color: 'grey' },
  footnote: { margin: percentageWidth('5%'), marginTop: percentageHeight('7%'), marginBottom: percentageHeight('15%') },
  buttonContainer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: percentageHeight('2%') },
  buttonTitle: { fontSize: percentageWidth('5%') },
  button: { width: percentageWidth('30%'), height: 45 },
  camera: { backgroundColor: '#008000', width: 64, height: 64, position: 'absolute', bottom: 100, right: 25, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  graphContainer: { height: percentageHeight('38%'), justifyContent: 'center', marginVertical: percentageHeight('2%') },
  recipe: { backgroundColor: '#008000', width: 64, height: 64, position: 'absolute', bottom: 25, right: 25, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
});

export default Foodprint;
