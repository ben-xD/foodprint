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
        <Text h1>
          FoodPrint
        </Text>
      </View>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 5 }}>
          <Input label={'Email Address'} placeholder="banana@foodprint.co" onChangeText={(value) => setEmail(value)} value={email} />
          <View style={{height:20}}/>
          <Input label={'Password'} placeholder="Password" onChangeText={(value) => setPassword(value)} value={password} secureTextEntry={true} />
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
          <Button
              title="Forgotten password"
              titleStyle={{ color: 'green', fontSize: 18 }}
              onPress={() => alert('Need to implement')}
              type="clear"
          />
        </View>
        <View style={{ flex: 1 }} />
      </View>
    </View>
  );
};
