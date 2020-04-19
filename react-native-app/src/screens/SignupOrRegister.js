import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AuthContext from '../context/AuthContext';
import { widthPercentageToDP as percentageWidth, heightPercentageToDP as percentageHeight } from 'react-native-responsive-screen';
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';
import Snackbar from 'react-native-snackbar';

const DAILY_MESSAGE = 'Wash your hands often - Foodprint Team';

const greenLogo = require('../images/logoGreen.png');
const logo = require('../images/logo.png');

const SignupOrRegister = ({ navigation }) => {
  const netInfo = useNetInfo();
  const { signInWithGoogle } = React.useContext(AuthContext);
  const [allButtonsDisabled, setAllButtonsDisabled] = useState(false);

  useEffect(() => {
    if (netInfo.details !== null && !netInfo.isConnected) {
      setAllButtonsDisabled(true);
      Snackbar.show({
        text: 'No internet connection, you can\'t log in.',
        duration: Snackbar.LENGTH_INDEFINITE,
      });
    }
    else {
      Snackbar.dismiss();
      setAllButtonsDisabled(false);
    }
  }, [netInfo]);

  const handleSignInWithGoogle = async () => {
    setAllButtonsDisabled(true);
    await signInWithGoogle();
    setAllButtonsDisabled(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={allButtonsDisabled ? logo : greenLogo} />
      </View>
      <View style={styles.bodyContainer}>
        <Button
          disabled={allButtonsDisabled}
          iconContainerStyle={styles.googleIconContainer}
          testID={'googleButton'}
          icon={
            <AntDesign
              style={styles.googleIcon}
              name="google"
              size={percentageWidth('5%')}
              color="black"
            />
          }
          containerStyle={styles.googleContainer}
          buttonStyle={styles.google}
          titleStyle={styles.googleText}
          title="Join using Google"
          onPress={handleSignInWithGoogle}
        />
        <Button
          disabled={allButtonsDisabled}
          containerStyle={styles.signUpContainer}
          buttonStyle={styles.signUp}
          titleStyle={styles.signUpText}
          title="Join using email"
          onPress={() => navigation.navigate('Signup')}
        />
        <View style={styles.loginButtonContainer}>
          <Text style={styles.loginText}>Existing user?</Text>
          <Button
            title="LOGIN"
            testID="skipButton"
            disabled={allButtonsDisabled}
            titleStyle={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
            type="clear"
          />
        </View>
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>{DAILY_MESSAGE}</Text>
      </View>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', height: '100%', justifyContent: 'center' },
  logoContainer: { height:percentageHeight('40%'), justifyContent: 'center' },
  logo: {
    height: percentageHeight('15%'),
    resizeMode: 'contain',
  },
  bodyContainer: { height: percentageHeight('40%'), width: '80%', justifyContent: 'center', paddingTop: 32 },
  title: { fontSize: percentageWidth('15%') },
  googleContainer: { marginVertical: percentageHeight('1%') },
  google: { backgroundColor: 'white' },
  googleText: { fontSize: percentageWidth('5%'), color: 'black' },
  googleIconContainer: { marginRight: percentageHeight('5%') },
  googleIcon: { paddingRight: percentageWidth('3%') },
  signUpContainer: { marginVertical: percentageHeight('1%') },
  signUpText: { fontSize: percentageWidth('5%') },
  signUp: { backgroundColor: 'green' },
  loginButtonContainer: { marginVertical: percentageHeight('3%') },
  loginText: { fontSize: percentageWidth('5%'), textAlign: 'center', color: 'grey' },
  loginButton: { color: 'green', fontSize: percentageWidth('7%') },
  skipButtonContainer: { position: 'absolute', bottom: percentageHeight('5%') },
  skipButton: { color: 'grey', fontSize: percentageWidth('5%') },
  footerContainer: {
    height: percentageHeight('20%'), justifyContent: 'center',
  },
  footerText: { textAlign: 'center', marginHorizontal: 64 },
});

export default SignupOrRegister;
