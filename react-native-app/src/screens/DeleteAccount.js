import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo';
import { useEffect } from 'react';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-community/async-storage';

const DELETE_ACCOUNT = gql`
  mutation {
    deleteData
  }
`;

const DeleteAccount = ({ navigation }) => {
  const { deleteAccount } = useContext(AuthContext);
  const [postDeleteAccount, { loading, error, data }] = useMutation(DELETE_ACCOUNT);

  useEffect(() => {
    console.log({ data });

    if (data) {
      Snackbar.show({
        text: 'Logging you out for the last time.',
        duration: Snackbar.LENGTH_LONG,
      });
      deleteAccount();
    }

    if (error) {
      Snackbar.show({
        text: 'We were unable to delete your data.',
        duration: Snackbar.LENGTH_LONG,
        action: {
          text: 'RETRY',
          textColor: 'red',
          onPress: postDeleteAccount,
        },
      });
    }
  }, [data, deleteAccount, error, postDeleteAccount]);

  return (
    loading ? (<ActivityIndicator />) : (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text h3>Are you sure you want to delete your account?</Text>
          <Text h4 style={styles.subtitle}>This can't be undone.</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <Button title="Delete" containerStyle={styles.buttonContainer} buttonStyle={styles.confirmDeleteButton} onPress={postDeleteAccount} />
          <Button title="Cancel" containerStyle={styles.buttonContainer} buttonStyle={styles.cancelDeleteButton} onPress={() => navigation.goBack()} />
        </View>
      </View>
    )
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
