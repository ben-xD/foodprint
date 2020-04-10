import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AuthContext from '../context/AuthContext';
import { widthPercentageToDP as percentageWidth, heightPercentageToDP as percentageHeight } from 'react-native-responsive-screen';


const SignupOrRegister = ({ navigation }) => {
  const { signInWithGoogle, signInAnonymously } = React.useContext(AuthContext);
  const [isPressed, setIsPressed] = useState(false);

  const handleSignInWithGoogle = async () => {
    setIsPressed(true);
    await signInWithGoogle();
    setIsPressed(false);
  };

  // const handleSignInAnonymously = async () => {
  //   setIsPressed(true);
  //   await signInAnonymously();
  //   setIsPressed(false);
  // };

  const image = isPressed ? require('../images/logo.png') : require('../images/logoGreen.png');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={image} />
      </View>
      <View style={styles.bodyContainer}>
        <Button
          disabled={isPressed}
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
          disabled={isPressed}
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
            disabled={isPressed}
            titleStyle={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
            type="clear"
          />
        </View>
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Wash your hands after touching your phone and before touching food.</Text>
      </View>
      {/* Commented out to disable 'skip login' functionality */}
      {/* <View style={styles.skipButtonContainer}>
        <Button
          disabled={isPressed}
          title="Skip login"
          titleStyle={styles.skipButton}
          onPress={handleSignInAnonymously}
          type="clear"
        />
      </View> */}
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', height: '100%', justifyContent: 'center' },
  logoContainer: { flex: 1, justifyContent: 'center' },
  logo: {
    height: percentageHeight('15%'),
    resizeMode: 'contain',
  },
  bodyContainer: { width: '80%', flex: 1 },
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
  footerContainer: { flex: 0.25, justifyContent: 'center', padding: 64 },
  footerText: { textAlign: 'center' },
});

export default SignupOrRegister;
