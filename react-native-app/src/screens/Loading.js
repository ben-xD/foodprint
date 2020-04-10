import React from 'react';
import {
  View,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';

const Loading = props => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../images/logo.png')} />
      </View>
      <ActivityIndicator color={'white'} animating={true} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  logo: {},
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
