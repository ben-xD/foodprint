import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';

export default Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginHandler = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      console.log({ userCredential });
      // TODO store login details in AsyncStorage

    } catch (e) {
      if (e.code === 'auth/invalid-email') {
        return console.warn('tell user email invalid');
      } else if (e.code === 'auth/user-disabled') {
        return console.warn('tell user disabled');
      } else if (e.code === 'auth/user-not-found') {
        return console.warn('tell user does not exist');
      } else if (e.code === 'auth/wrong-password') {
        return console.warn('tell user wrong pw');
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
          title="Login"
          onPress={loginHandler}
        />
      </View>
    </ScrollView>
  );
};
