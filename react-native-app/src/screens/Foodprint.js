import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Button } from 'react-native-elements';
import { widthPercentageToDP as percentageWidth, heightPercentageToDP as percentageHeight } from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import WelcomeScreen from '../components/WelcomeScreen';
import WeeklyDisplay from '../components/WeeklyDisplay';
import MonthlyDisplay from '../components/MonthlyDisplay';
import GeneralDisplay from '../components/GeneralDisplay';



const Foodprint = ({ navigation }) => {

  const [isVisible, setVisibility] = useState(true);
  const [timeSpan, setTimeSpan] = useState('weekly');

  const takePicture = async () => {
    navigation.navigate('Camera');
  };

  const getTimeDifference = () => {
    const date = new Date();
    const timeDifference = date.getTimezoneOffset();
    return (timeDifference / 60);
  };


  return (
    <SafeAreaView>
      <ScrollView>

        {/*General carbon footprint score*/}
        <View style={ styles.generalDisplayContainer }>
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
              <WeeklyDisplay timeDifference={getTimeDifference()}/>
          ) : (
              <MonthlyDisplay timeDifference={getTimeDifference()}/>
            )}
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
  generalDisplayContainer: { marginTop:percentageHeight('3%')},
  score: { fontSize: percentageWidth('6%'), color: 'grey' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: percentageHeight('2%') },
  buttonTitle: { fontSize: percentageWidth('5%') },
  button: { width: percentageWidth('30%'), height: 45 },
  camera: { backgroundColor: '#008000', width: 64, height: 64, position: 'absolute', top: 30, left: 25, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
});

export default Foodprint;
