import React from 'react';
import { Input } from 'react-native-elements';
import { StyleSheet } from 'react-native';

const Email = ({ setEmail, email, nextFieldRef }) => {
  return (
    <Input
      // label={'Your Email Address'}
      autoCorrect={false}
      autoCapitalize={'none'}
      placeholder="Email"
      value={email} returnKeyType={'next'}
      onChangeText={value => setEmail(value)}
      onSubmitEditing={() => nextFieldRef.current.focus()}
      containerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
});

export default Email;
