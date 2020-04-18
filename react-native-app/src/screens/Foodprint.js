import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text, RefreshControl,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { ButtonGroup } from 'react-native-elements';
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
import { FloatingAction } from 'react-native-floating-action';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';

const WEEKLY_TIMESPAN = 0;
const MONTHLY_TIMESPAN = 1;

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
  const [timeSpan, setTimeSpan] = useState(WEEKLY_TIMESPAN);
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
    } catch (e) { } // If value does not exist in storage, an error occurs, keep going.
    AsyncStorage.setItem('introductoryOverlaySeen', JSON.stringify(true));
    navigation.navigate('Onboarding');
  };

  useEffect(() => {
    showOverlayIfNewUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Occurs everytime the screen if focused
  useFocusEffect(useCallback(() => {
    if (route.params && route.params.showIntroductoryOverlay) {
      showOverlayIfNewUser(); // show overlay if showIntroductoryOverlay param set
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]));

  const refetch = () => {
    console.log('Refetching data.');
    setRefreshing(true);
    setHistoryReport(null);
    refetchHistoryReport();
  };

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
    networkStatus,
  } = useQuery(GET_USER_HISTORY_REPORT, {
    variables: { timezone: timezoneOffsetInHours, resolutions: ['WEEK', 'MONTH'] },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    console.log({ historyReportData });
    if (!historyReportLoading && historyReportData && historyReportData.getUserHistoryReport) {
      setHistoryReport(historyReportData.getUserHistoryReport);
      console.log('Successfully received user history report data, caching locally.');
      cacheHistoryReportLocally(historyReportData.getUserHistoryReport);
      setRefreshing(false);
    }
  }, [historyReportData, historyReportLoading]);

  useEffect(() => {
    const retrieveHistoryReportDataFromCache = async () => {
      try {
        const retrievedHistoryReport = await AsyncStorage.getItem('historyReport');
        console.log({ retrievedHistoryReport });
        setHistoryReport(JSON.parse(retrievedHistoryReport));
        setRefreshing(false);
      } catch (e) {
        console.log('Error retrieving user history report data:' + e);
      }
    };
    if (historyReportError) {
      Snackbar.show({
        text: "We couldn't get your data, loading last known data",
        duration: Snackbar.LENGTH_LONG,
      });
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
    if (timeSpan === WEEKLY_TIMESPAN) {
      return (
        (!historyReport || networkStatus === 4) ? (
          <View style={styles.graphContainer}>
            <LottieView source={require('../animations/18252-just-cheese.json')} autoPlay loop />
          </View>
        ) : (
            <WeeklyDisplay average={historyReport.periodAvgs[0]} composition={historyReport.categoryReports[0]} />
          )
      );
    }
    if (timeSpan === MONTHLY_TIMESPAN) {
      return (
        (!historyReport || networkStatus === 4) ? (
          <View style={styles.graphContainer}>
            <LottieView source={require('../animations/18534-flying-hotdog.json')} autoPlay loop />
          </View>
        ) : (
            <MonthlyDisplay average={historyReport.periodAvgs[1]} composition={historyReport.categoryReports[1]} />
          )
      );
    }
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}>
        <CarbonFootprintScore historyReport={historyReport} loading={historyReportLoading} error={historyReportError} />
        <ButtonGroup onPress={(index) => {
          switch (index) {
            case 0:
              return setTimeSpan(WEEKLY_TIMESPAN);
            case 1:
              return setTimeSpan(MONTHLY_TIMESPAN);
            default:
              console.warn('Unhandled index in button group');
          }
        }}
          buttons={[{
            element: () => (<Text>WEEK</Text>),
          },
          {
            element: () => (<Text>MONTH</Text>),
          }]}
          selectedIndex={timeSpan}
          textStyle={{ color: 'white' }}
          containerStyle={{ zIndex: 100, marginTop: 16 }}
          selectedButtonStyle={{ backgroundColor: 'white' }}
          buttonStyle={{ backgroundColor: 'lightgrey' }}
        />
        <View>
          {renderFootprintChart()}
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
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: { height: '100%' },
  score: { fontSize: percentageWidth('6%'), color: 'grey' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: percentageHeight('2%') },
  buttonTitle: { fontSize: percentageWidth('5%') },
  button: { width: percentageWidth('30%'), height: 45 },
  camera: { backgroundColor: '#008000', width: 64, height: 64, position: 'absolute', bottom: 100, right: 25, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  graphContainer: { height: percentageHeight('38%'), justifyContent: 'center', marginVertical: percentageHeight('2%') },
  recipe: { backgroundColor: '#008000', width: 64, height: 64, position: 'absolute', bottom: 25, right: 25, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
});

export default Foodprint;
