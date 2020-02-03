import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import Password from '../components/Password';
import Email from '../components/Email';
import { useRef } from 'react';
import { AuthContext } from '../store/Auth';

// const SIGN_UP = qgl`
//   mutation signUp($email: String!, $password: String!) {

//   }
// `

export default Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef(null);

  const { signUp } = React.useContext(AuthContext);

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const signUpHandler = async () => {
    if (!EMAIL_REGEX.test(email)) {
      return console.warn('alert user, email invalid.');
    }

    if (password.length < 8) {
      return console.warn('alert user, password too short ');
    }

    signUp(email, password);
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
