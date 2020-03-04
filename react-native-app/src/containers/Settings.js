import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../store/Auth';
import { useContext } from 'react';
import { Avatar, Button } from 'react-native-elements';
import { View } from 'react-native';

const Settings = ({ navigation }) => {

  const { signOut } = useContext(AuthContext);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1.5, alignItems: 'center', justifyContent: 'center' }}>
        <Avatar
          size={'xlarge'}
          rounded icon={{ name: 'home' }}
          onPress={() => console.warn('Implement "Change avatar"')}
        />
      </View>
      <View style={{ flex: 1, justify: 'flex-start', alignItems: 'flex-start', marginHorizontal: 50 }}>
        <Button
          buttonStyle={{ flexDirection: 'row', justifyContent: 'flex-start' }}
          titleStyle={{ color: 'black', fontSize: 18 }}
          title="Change username"
          type="clear"
          onPress={() => console.warn('Implement "Change username"')}
        />
        <Button
          buttonStyle={{ flexDirection: 'row', justifyContent: 'flex-start' }}
          titleStyle={{ color: 'black', fontSize: 18 }}
          title="Change email address"
          type="clear"
          onPress={() => console.warn('Implement "Change email address"')}
        />
        <Button
          buttonStyle={{ flexDirection: 'row', justifyContent: 'flex-start' }}
          titleStyle={{ color: 'black', fontSize: 18, textAlign: 'left' }}
          title="Change password"
          type="clear"
          onPress={() => console.warn('Implement "Change password"')}
        />
        <Button
          buttonStyle={{ flexDirection: 'row', justifyContent: 'flex-start' }}
          titleStyle={{ color: 'black', fontSize: 18 }}
          title="Log out"
          type="clear"
          onPress={signOut}
        />
      </View>
    </SafeAreaView>
  );
};

export default Settings;
