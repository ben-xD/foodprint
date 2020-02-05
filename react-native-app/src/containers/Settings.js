import React from 'react';
import { Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../store/Auth';
import { useContext } from 'react';
import { Avatar, Button } from "react-native-elements";

const Settings = () => {
  const { signOut } = useContext(AuthContext);

export default Settings = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: 'row' }}/>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Avatar
            size={'xlarge'}
            rounded icon={{ name: 'home' }}
            onPress={() => alert('Implement "Change avatar"')}
        />
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
              onPress={() => alert('Implement "Change username"')}
          />
          <Button
              buttonStyle={{flexDirection: 'row', justifyContent: 'flex-start'}}
              titleStyle={{color: 'black', fontSize: 18}}
              title="Change email address"
              type="clear"
              onPress={() => alert('Implement "Change email address"')}
          />
          <Button
              buttonStyle={{flexDirection: 'row', justifyContent: 'flex-start'}}
              titleStyle={{color: 'black', fontSize: 18, textAlign: 'left'}}
              title="Change password"
              type="clear"
              onPress={() => alert('Implement "Change password"')}
          />
          <Button
              buttonStyle={{flexDirection: 'row', justifyContent: 'flex-start'}}
              titleStyle={{color: 'black', fontSize: 18}}
              title="Log out"
              type="clear"
              onPress={() => navigation.navigate('Back')}
          />
        </View>
        <View style={{ flex: 1 }} />
      </View>
      <View style={{ flex: 2, flexDirection: 'row' }}/>
    </SafeAreaView>
  );
};

export default Settings;
