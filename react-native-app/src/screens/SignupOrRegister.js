import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
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

  const handleSignInAnonymously = async () => {
    setIsPressed(true);
    await signInAnonymously();
    setIsPressed(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          FoodPrint
        </Text>
      </View>
      <View style={styles.bodyContainer}>
        <View>
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
      </View>
      <View style={styles.skipButtonContainer}>
        <Button
          disabled={isPressed}
          title="Skip login"
          titleStyle={styles.skipButton}
          onPress={handleSignInAnonymously}
          type="clear"
        />
      </View>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center', height: '100%' },
  bodyContainer: { width: percentageWidth('80%') },
  title: { fontSize: percentageWidth('15%') },
  titleContainer: { position: 'absolute', top: percentageHeight('5%'), alignItems: 'center', marginTop: percentageHeight('5%') },
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
});

export default SignupOrRegister;
