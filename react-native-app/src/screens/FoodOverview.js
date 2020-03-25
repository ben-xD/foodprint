import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Text,
  SafeAreaView,
  Image,
  View,
  ScrollView,
} from 'react-native';
import { StyleSheet } from 'react-native';
import { useLayoutEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

const FoodOverview = ({ navigation }) => {
  <MaterialCommunityIcons name="camera" color={'grey'} size={35} />;

  useLayoutEffect(() => {
    const takePicture = async () => {
      navigation.navigate('Camera');
    };

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={takePicture} >
          <MaterialCommunityIcons name="camera" color={'grey'} size={28} style={styles.cameraButton} />
        </TouchableOpacity >
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.contentContainer}>
          <Text style={styles.subtitle}>
            Scan a barcode or snap a picture.
          </Text>
          <Image
            source={ require('../images/heart-eyes-smiley.png') }
            style={styles.image}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', height: '100%' },
  cameraButton: { marginRight: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  contentContainer: { justifyContent: 'center', alignItems: 'center', marginHorizontal: 40 },
  subtitle: { fontSize: 20, textAlign: 'center', marginTop: 20 },
  image: { width: 200, height: 200, marginTop: 10 },
});

export default FoodOverview;
