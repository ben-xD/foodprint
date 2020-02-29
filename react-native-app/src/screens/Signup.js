import React, { useState, useContext } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-elements';
import Password from '../components/Password';
import Email from '../components/Email';
import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import AuthContext from '../context/AuthContext';

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
      setEmailError('That\s not a valid email.');
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
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.containerContent} style={styles.container}>
        <View style={styles.titleContainer}>
          <Text h1>
            Foodprint
          </Text>
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
              titleStyle={styles.title}
              title="Join"
              onPress={signUpHandler}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  containerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  inputContainer: {
    width: '80%',
  },
  button: { backgroundColor: 'green', marginVertical: 16 },
});

export default Signup;
