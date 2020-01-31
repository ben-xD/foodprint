import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button } from "react-native-elements";

const Settings = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: 'row' }}/>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Avatar size={'xlarge'} rounded icon={{ name: 'home' }} />
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}/>
      <View style={{ flex: 1, flexDirection: 'row', justify: 'flex-start', alignItems: 'center' }}>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 5 }}>
          <Button
              buttonStyle={{flexDirection: 'row', justifyContent: 'flex-start'}}
              titleStyle={{color: 'black', fontSize: 18}}
              title="Change username"
              type="clear"
          />
          <Button
              buttonStyle={{flexDirection: 'row', justifyContent: 'flex-start'}}
              titleStyle={{color: 'black', fontSize: 18}}
              title="Change email address"
              type="clear"
          />
          <Button
              buttonStyle={{flexDirection: 'row', justifyContent: 'flex-start'}}
              titleStyle={{color: 'black', fontSize: 18, textAlign: 'left'}}
              title="Change password"
              type="clear"
          />
          <Button
              buttonStyle={{flexDirection: 'row', justifyContent: 'flex-start'}}
              titleStyle={{color: 'black', fontSize: 18}}
              title="Log out"
              type="clear"
              onPress={() => navigation.navigate('SignupOrRegister')}
          />
        </View>
        <View style={{ flex: 1 }} />
      </View>
      <View style={{ flex: 2, flexDirection: 'row' }}/>
    </SafeAreaView>
  );
};

export default Settings;
