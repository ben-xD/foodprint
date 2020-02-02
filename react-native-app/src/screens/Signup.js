import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import Password from '../components/Password';
import Email from '../components/Email';
import { useRef } from 'react';

// const SIGN_UP = qgl`
//   mutation signUp($email: String!, $password: String!) {

//   }
// `

export default Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef(null);

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const signUpHandler = async () => {
    if (!EMAIL_REGEX.test(email)) {
      return console.warn('alert user, email invalid.');
    }

    if (password.length < 8) {
      return console.warn('alert user, password too short ');
    }

    // TODO add more password security checks
    // TODO change view to move button up when keyboard is shown

    const userDetails = {
      email,
      password,
    };
    console.log({ userDetails });
    try {
      const userCredentials = await auth().createUserWithEmailAndPassword(email, password);
      console.log({ userCredentials });
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        return console.warn('tell user email is already used');
      } else if (e.code === 'auth/invalid-email') {
        return console.warn('tell user invalid email');
      } else if (e.code === 'auth/operation-not-allowed') {
        return console.warn('tell user server has problems');
      } else if (e.code === 'auth/weak-password') {
        return console.warn('tell user password too weak');
      }
      else { console.error(e); }
    }
  };

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center' }} style={{ width: '100%', height: '100%' }}>
      <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 50 }}>
        <Text h1>
          FoodPrint
          </Text>
      </View>
      <View style={{ width: '80%' }}>
        <View>
          <Email nextFieldRef={passwordRef} setEmail={setEmail} email={email} />
          <Password ref={passwordRef} submitHandler={signUpHandler} setPassword={setPassword} password={password} />
        </View>
      </View>
      <View style={{ width: '80%' }}>
        <Button
          buttonStyle={{ backgroundColor: 'green', marginVertical: 100 }}
          titleStyle={{ fontSize: 24 }}
          title="Join"
          onPress={signUpHandler}
        />
      </View>
    </ScrollView>
  );
};
