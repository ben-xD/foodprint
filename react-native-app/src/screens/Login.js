import React, { useState, useRef } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import Password from '../components/Password';
import Email from '../components/Email';
import { AuthContext } from '../store/Auth';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef(null);
  const [isPressed, setIsPressed] = useState(false);


  const { signIn } = React.useContext(AuthContext);

  const loginHandler = async () => {
    setIsPressed(true);
    await signIn({ email, password });
    setIsPressed(false);
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
          <Password ref={passwordRef} submitHandler={loginHandler} setPassword={setPassword} password={password} />
        </View>
      </View>
      <View style={{ width: '80%' }}>
        <Button
          disabled={isPressed}
          buttonStyle={{ backgroundColor: 'green', marginVertical: 100 }}
          titleStyle={{ fontSize: 24 }}
          title="Login"
          onPress={loginHandler}
        />
      </View>
    </ScrollView>
  );
};

export default Login;
