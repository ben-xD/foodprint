import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';

// const SIGN_UP = qgl`
//   mutation signUp($email: String!, $password: String!) {

//   }
// `

export default Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      console.log({ res });
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
          <Input label={'Your Email Address'} autoCapitalize={'none'} placeholder="banana@foodprint.co" value={email} onChangeText={value => setEmail(value)} />
          <Input label={'Password'} autoCapitalize={'none'} placeholder="Password" value={password} onChangeText={value => setPassword(value)} secureTextEntry={true} />
        </View>
      </View>
      <View style={{ width: '80%' }}>
        <Button
          buttonStyle={{ backgroundColor: 'green', marginVertical: 100 }}
          titleStyle={{ fontSize: 24 }}
          title="Register"
          onPress={signUpHandler}
        />
      </View>
    </ScrollView>
  );
};
