import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AuthContext from '../context/AuthContext';


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
        <Text h1>
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
                size={28}
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
          title="skip"
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
  bodyContainer: { width: '80%' },
  titleContainer: { position: 'absolute', top: 32, alignItems: 'center', marginTop: 32 },
  googleContainer: { marginVertical: 8 },
  google: { backgroundColor: 'white' },
  googleText: { fontSize: 24, color: 'black' },
  googleIconContainer: { marginRight: 24 },
  googleIcon: { paddingRight: 5 },
  signUpContainer: { marginVertical: 8 },
  signUpText: { fontSize: 24 },
  signUp: { backgroundColor: 'green' },

  loginButtonContainer: { marginVertical: 12 },
  loginText: { fontSize: 18, textAlign: 'center', color: 'grey' },
  loginButton: { color: 'green', fontSize: 24 },
  skipButtonContainer: { position: 'absolute', bottom: 32 },
  skipButton: { color: 'grey', fontSize: 18 },
});

export default SignupOrRegister;
