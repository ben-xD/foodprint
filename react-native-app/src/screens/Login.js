import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import Password from '../components/Password';
import Email from '../components/Email';
import { AuthContext } from '../store/Auth';
import auth from '@react-native-firebase/auth';


export default Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef(null);

  const { signIn } = React.useContext(AuthContext);

  const loginHandler = async () => {
    signIn({ email, password });
  };

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', flex:1 }} style={{ width: '100%', height: '100%' }}>
      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 150 }}>
        <Text h1>
          FoodPrint
        </Text>
      </View>
      <View style={{ height:'70%', width: '80%', justifyContent:'center'  }}>
        <View>
          <Email nextFieldRef={passwordRef} setEmail={setEmail} email={email} />
          <Password ref={passwordRef} submitHandler={loginHandler} setPassword={setPassword} password={password} />
        </View>
      </View>
      <View style={{ position:'absolute', bottom:156, width: '80%' }}>
        <Button
          buttonStyle={{ backgroundColor: 'green' }}
          titleStyle={{ fontSize: 24 }}
          title="Login"
          onPress={loginHandler}
        />
      </View>
    </ScrollView>
  );
};
