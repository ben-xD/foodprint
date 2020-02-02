import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-elements';
import Config from 'react-native-config';

export default SignupOrRegister = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text h1 h1Style={{}}>
          FoodPrint
        </Text>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 4, flexDirection: 'column' }}>
          <Button
            buttonStyle={{ backgroundColor: 'green' }}
            titleStyle={{ fontSize: 24 }}
            title="Sign up"
            onPress={() => navigation.navigate('Signup')}
          />
          <Button
            title="Log in"
            titleStyle={{ color: 'green', fontSize: 24 }}
            onPress={() => navigation.navigate('Login')}
            type="clear"
          />
          {Config.DEVELOPMENT === 'true' ? <Button
            title="DEV: Skip login screen"
            titleStyle={{ color: 'red', fontSize: 24 }}
            onPress={() => navigation.navigate('Tabs')}
            type="clear"
          /> : <></>}
        </View>
        <View style={{ flex: 1 }} />
      </View>
    </View>
  );
}
  ;
