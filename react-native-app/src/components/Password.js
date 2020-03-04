import React from 'react';
import { Input } from 'react-native-elements';
import { StyleSheet } from 'react-native';

const Password = React.forwardRef((props, ref) => {
  const { password, setPassword, submitHandler } = props;
  return (
    <Input
      ref={ref}
      // label={'Password'}
      autoCorrect={false}
      autoCapitalize={'none'}
      placeholder="Password"
      value={password}
      onChangeText={value => setPassword(value)}
      secureTextEntry={true}
      returnKeyType={'join'}
      onSubmitEditing={submitHandler}
      containerStyle={styles.container}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
});

export default Password;
