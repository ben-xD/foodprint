import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const DeleteAccount = ({ navigation }) => {
  const { deleteAccount } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text h3>Are you sure you want to delete your account?</Text>
        <Text h4 style={styles.subtitle}>This can't be undone.</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button title="Delete" containerStyle={styles.buttonContainer} buttonStyle={styles.confirmDeleteButton} onPress={deleteAccount} />
        <Button title="Cancel" containerStyle={styles.buttonContainer} buttonStyle={styles.cancelDeleteButton} onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  titleContainer: {
    margin: 8,
  },
  subtitle: {
    marginTop: 16,
    fontWeight: '100',
  },
  buttonsContainer: {
    position: 'absolute', bottom: 0, width: '100%',
  },
  buttonContainer: { margin: 8 },
  confirmDeleteButton: {
    backgroundColor: '#bc0303',
    height: 64,
  },
  cancelDeleteButton: { height: 64 },
});

export default DeleteAccount;
