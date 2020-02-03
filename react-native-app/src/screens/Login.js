import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';

export default Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginHandler = () => {
    console.warn('Not implemented');
    // TODO store login details in AsyncStorage
  };


  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text h1 h1Style={{}}>
          FoodPrint
        </Text>
      </View>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 5 }}>
          <Input placeholder="Email" onChangeText={(value) => setEmail(value)} value={email} />
          <Input placeholder="Password" onChangeText={(value) => setPassword(value)} value={password} secureTextEntry={true} />
        </View>
        <View style={{ flex: 1 }} />
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 4, flexDirection: 'column' }}>
          <Button
            buttonStyle={{ backgroundColor: 'green' }}
            titleStyle={{ fontSize: 24 }}
            title="Confirm"
            onPress={loginHandler}
          />
        </View>
        <View style={{ flex: 1 }} />
      </View>
    </View>
  );
};
