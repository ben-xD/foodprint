import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';
import Password from '../components/Password';
import Email from '../components/Email';
import { AuthContext } from '../store/Auth';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef(null);
  const [isPressed, setIsPressed] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { signIn } = React.useContext(AuthContext);

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const loginHandler = async () => {
    setIsPressed(true);

    if (!EMAIL_REGEX.test(email)) {
      setEmailError('That\s not a valid email.');
      setIsPressed(false);
      return;
    } else {
      setEmailError('');
    }

    if (password.length === 0) {
      setPasswordError('Your password doesn\'t seem long enough.');
      setIsPressed(false);
      return;
    } else {
      setPasswordError('');
    }

    await signIn({ email, password });
    setIsPressed(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.containerContent} style={styles.container}>
      <View style={styles.titleContainer}>
        <Text h1>
          FoodPrint
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <View>
          {emailError === '' ? <></> : <Text>{emailError}</Text>}
          <Email nextFieldRef={passwordRef} setEmail={setEmail} email={email} />
          {passwordError === '' ? <></> : <Text>{passwordError}</Text>}
          <Password ref={passwordRef} submitHandler={loginHandler} setPassword={setPassword} password={password} />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          disabled={isPressed}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
          testID="loginButton"
          title="Login"
          onPress={loginHandler}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', height: '100%' },
  containerContent: { alignItems: 'center' },
  titleContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: 50 },
  inputContainer: { width: '80%' },
  buttonContainer: { width: '80%' },
  button: { backgroundColor: 'green', marginVertical: 100 },
  buttonText: { fontSize: 24 },
});

export default Login;
