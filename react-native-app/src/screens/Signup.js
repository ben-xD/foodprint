import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

// const SIGN_UP = qgl`
//   mutation signUp($email: String!, $password: String!) {

//   }
// `

export default Signup = ({ navigation }) => {
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

    navigation.navigate('FoodOverview')
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex:1, alignItems: 'center', justifyContent: 'center' }}>
        <Text h1>
          FoodPrint
          </Text>
      </View>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }} />
        <View style={{ flex:5 }}>
          <Input label={'Email Address'} placeholder="banana@foodprint.co" value={email} onChangeText={value => setEmail(value)} />
          <View style={{height:20}}/>
          <Input label={'Password'} placeholder="Password" value={password} onChangeText={value => setPassword(value)} secureTextEntry={true} />
        </View>
        <View style={{ flex: 1 }} />
      </View>
      <View style={{ flex:1, flexDirection:'row' }}>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 4, flexDirection: 'column' }}>
          <Button
            buttonStyle={{ backgroundColor: 'green' }}
            titleStyle={{ fontSize: 24 }}
            title="Register"
            onPress={signUpHandler}
          />
        </View>
        <View style={{ flex: 1 }} />
      </View>
    </View>
  );
};
