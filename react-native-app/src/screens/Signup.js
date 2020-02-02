import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

export default Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const signUpHandler = () => {
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
          <Input label={'Your Email Address'} placeholder="banana@foodprint.co" value={email} onChangeText={value => setEmail(value)} />
          <Input label={'Password'} placeholder="Password" value={password} onChangeText={value => setPassword(value)} secureTextEntry={true} />
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
