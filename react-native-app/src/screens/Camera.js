import React, { useState } from 'react';
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useIsFocused } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';
import Snackbar from 'react-native-snackbar';

const Camera = ({ navigation }) => {
  const netInfo = useNetInfo();
  const isFocused = useIsFocused();
  const [cameraIsReady, setCameraIsReady] = useState(true);

  useEffect(() => {
    if (netInfo.details !== null && !netInfo.isConnected) {
      Snackbar.show({
        text: 'No internet connection, you can\'t do this! 🤣',
        duration: Snackbar.LENGTH_INDEFINITE,
      });
    } else if (netInfo.isConnected) {
      Snackbar.dismiss();
    }
  }, [netInfo]);

  const takePictureHandler = async (camera) => {
    setCameraIsReady(false);
    const options = { quality: 0.5, base64: true, width: 200 };
    const image = await camera.takePictureAsync(options);
    navigation.navigate('Feedback', { file: image, uri: image.uri, loading: true });
    setCameraIsReady(true);
  };

  const barCodeHandler = ({ data, rawData, type, bounds }) => {
    if (isFocused) {
      console.log({ data, rawData, type, bounds });
      navigation.navigate('Feedback', { barcode: data, loading: true });
    }
  };

  if (!isFocused) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <RNCamera
        onBarCodeRead={barCodeHandler}
        style={styles.preview}
        captureAudio={false}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      >
        {({ camera, status }) => {
          if (!netInfo.isConnected || !cameraIsReady || status !== 'READY') {
            return <View style={styles.loadingContainer}>
              <ActivityIndicator
                style={styles.noCapture} color={'white'} />
            </View>;
          }
          return (
            <View style={styles.nonLoadingContainer}>
              <View style={styles.captureContainer}>
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="take picture"
                  accessibilityHint="Take and upload picture to calculate carbon footprint"
                  onPress={() => takePictureHandler(camera)}
                  style={styles.capture} />
              </View>
            </View>
          );
        }}
      </RNCamera>
    </View >
  );
};

export default Camera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  nonLoadingContainer: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  captureContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    backgroundColor: 'rgba(9,9,9,0.1)',
    margin: 32,
    borderRadius: 50,
  },
  noCapture: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    margin: 32,
  },
});
