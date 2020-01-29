import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-elements';

export default Main = ({ navigation }) => {
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
        </View>
        <View style={{ flex: 1 }} />
      </View>
    </View>
  );
}