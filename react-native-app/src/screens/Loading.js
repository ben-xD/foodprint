import React from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Image,
} from 'react-native';

const Loading = props => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../images/logo-white.png')} />
      </View>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  logo: {
    width: 150,
    resizeMode: 'contain',
  },
  container: {
    backgroundColor: '#5C5C5C',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
