import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { View } from 'react-native';
import AuthContext from '../context/AuthContext';
import { Linking } from 'react-native';
import { useState } from 'react';
import { ListItem, Text } from 'react-native-elements';
import { StyleSheet } from 'react-native';

const Settings = ({ navigation }) => {
  const [errors, setErrors] = useState([]);
  const { signOut } = useContext(AuthContext);

  const openEmail = () => {
    Linking.openURL('mailto:ben@fresla.co?subject=Foodprint%20%20Support').catch(
      err => {
        console.warn(err);
        setErrors(['Unable to open mail app, do you have one set?']);
      },
    );
  };

  return (
    <SafeAreaView>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{'Settings'}</Text>
        <Text>let us know if you need help.</Text>
      </View>
      <View style={styles.listContainer}>
        <ListItem
          containerStyle={styles.buttonContainer}
          title="Email us"
          topDivider
          bottomDivider
          onPress={openEmail}
        />
        <ListItem
          containerStyle={styles.buttonContainer}
          title="Delete account"
          bottomDivider
          onPress={() => navigation.navigate('Delete Account')}
        />
        <ListItem
          containerStyle={styles.buttonContainer}
          title="Log out"
          bottomDivider
          onPress={signOut}
        />
      </View>
      <View>
        {errors.map((error, i) => (
          <Text key={i}>Error: {error}</Text>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  modalContainer: { padding: 16 },
  titleContainer: {
    margin: 8,
  },
  title: {
    fontSize: 24,
  },
  listContainer: {
    width: '100%',
  },
  buttonContainer: {
    marginTop: 0,
    width: '100%',
  },
  button: {
    height: 48,
  },
});

