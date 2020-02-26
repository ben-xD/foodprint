import React from 'react';
import { View, Text, Image } from 'react-native';
import { StyleSheet } from 'react-native';

const NoInternet = () => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text h3 style={styles.title}>No Internet connection...</Text>
      </View>
      <View style={styles.body}>
        <Image
          style={styles.image}
          source={{ uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/d8094059120725.5a15c9fa09761.gif' }}
        />
      </View>
      <View style={styles.messageContainer}>
        <Text style={styles.message}>Turn off flight mode, move to a different location, or
            change mobile phone provider...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 40,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 300,
    width: 300,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    fontSize: 22,
    textAlign: 'center',
    margin: 20,
  },
});

export default NoInternet;
