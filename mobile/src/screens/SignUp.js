import React from 'react';
import { View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';

export default Signup = () => {
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
          <Input placeholder="Username" />
          <Input placeholder="Email address" />
          <Input placeholder="Password" />
          <Input placeholder="Confirm password" />
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
            onPress={() => alert('You clicked on Confirm!')}
          />
        </View>
        <View style={{ flex: 1 }} />
      </View>
    </View>
  );
}
