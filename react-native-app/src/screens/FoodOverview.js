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
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>
            Scan a barcode or snap a picture.
          </Text>
          <Image
            source={{ uri: 'https://png2.cleanpng.com/sh/4618a1d69c3326bc75ab0d6a0d3cd256/L0KzQYm3VcIyN5NvjJH0aYP2gLBuTfVud6Vue9H3LXXwf7vwTgN1cZRwfeQ2ZnHmdbP2jBsucZ9oReV2aXzoiX68gsAzPWNnfKdrM0LmQXA9WMIyOGE7T6MAMka7R4mCUMk0P2Q7RuJ3Zx==/kisspng-emoticon-emoji-sticker-facebook-inc-smiley-5b0252bd5b32c1.6821006715268789093736.png' }}
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
  title: { fontSize: 36, marginVertical: 20, textAlign: 'center' },
  subtitle: { fontSize: 20, textAlign: 'center', marginTop: 20 },
  image: { width: 200, height: 200, marginTop: 10 },
});

export default FoodOverview;
