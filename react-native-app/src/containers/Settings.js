import React from 'react';
import { Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../store/Auth';
import { useContext } from 'react';

const Settings = () => {
  const { signOut } = useContext(AuthContext);

  return (
    <SafeAreaView>
      <Text>Settings</Text>
      <Button title={'logout'} onPress={signOut} />
    </SafeAreaView>
  );
};

export default Settings;
