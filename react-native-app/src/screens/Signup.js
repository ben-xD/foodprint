import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';

export default Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const signUpHandler = () => {
    if (!EMAIL_REGEX.test(email)) {
      return console.warn('alert user, email invalid.');
    }

    if (password !== passwordConfirm) {
      return console.warn('alert user, mismatched password');
    }

    if (password.length < 8) {
      return console.warn('alert user, password too short ');
    }

    // TODO add more password security checks

    const userDetails = {
      email,
      password,
    };
    console.log({ userDetails });
  };


  return (
    <View style={{ width: '100%', flex: 1, alignItems: 'center' }}>
      <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 100 }}>
        <Text h1>
          FoodPrint
          </Text>
      </View>
      <View style={{ width: '80%' }}>
        <View>
          <Input label={'Your Email Address'} placeholder="banana@foodprint.co" value={email} onChangeText={value => setEmail(value)} />
          <Input label={'Password'} placeholder="Password" value={password} onChangeText={value => setPassword(value)} secureTextEntry={true} />
          <Input label={'Confirm Password'} placeholder="Confirm password" value={passwordConfirm} onChangeText={value => setPasswordConfirm(value)} secureTextEntry={true} />
        </View>
      </View>
      <View style={{ width: '80%', position: 'absolute', bottom: 50 }}>
        <Button
          buttonStyle={{ backgroundColor: 'green' }}
          titleStyle={{ fontSize: 24 }}
          title="Register"
          onPress={signUpHandler}
        />
      </View>
    </View>
  );
};
