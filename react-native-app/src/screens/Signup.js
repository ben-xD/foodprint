import React, { useState, useRef, useContext } from 'react';
import { View, Image, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';
import Password from '../components/Password';
import Email from '../components/Email';
import AuthContext from '../context/AuthContext';
import { widthPercentageToDP as percentageWidth, heightPercentageToDP as percentageHeight } from 'react-native-responsive-screen';


const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef(null);
  const [isPressed, setIsPressed] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { signUp } = useContext(AuthContext);

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const signUpHandler = async () => {
    setIsPressed(true);

    if (!EMAIL_REGEX.test(email)) {
      setEmailError('That is not a valid email.');
      setIsPressed(false);
      return;
    } else {
      setEmailError('');
    }

    if (password.length < 8) {
      setPasswordError('Your chosen password is too short.');
      setIsPressed(false);
      return;
    } else {
      setPasswordError('');
    }

    await signUp(email, password);
    setIsPressed(false);
  };

  return (
      <KeyboardAvoidingView
          behavior="padding"
          style={styles.container}
      >
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../images/logoGreen.png')} />
        </View>
        <View style={styles.inputContainer}>
          <View>
            {emailError === '' ? <></> : <Text>{emailError}</Text>}
            <Email nextFieldRef={passwordRef} setEmail={setEmail} email={email} />
            {passwordError === '' ? <></> : <Text>{passwordError}</Text>}
            <Password ref={passwordRef} submitHandler={signUpHandler} setPassword={setPassword} password={password} />
            <Button
              testID={'joinButton'}
              disabled={isPressed}
              buttonStyle={styles.button}
              containerStyle={styles.buttonContainer}
              titleStyle={styles.buttonText}
              title="JOIN"
              onPress={signUpHandler}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: percentageWidth('100%'),
    height: percentageHeight('80%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: { height:percentageHeight('40%'), justifyContent: 'center' },
  logo: {
    height: percentageHeight('15%'),
    resizeMode: 'contain',
  },
  inputContainer: { width: percentageWidth('80%') },
  button: { backgroundColor: 'green', marginVertical: percentageHeight('2%') },
  buttonContainer: { marginBottom:percentageHeight('7%') },
  buttonText: { fontSize: percentageWidth('5%') },
});

export default Signup;
