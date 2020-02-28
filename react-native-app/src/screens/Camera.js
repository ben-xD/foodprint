import React, { useState } from 'react';
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useIsFocused } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const Camera = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [cameraIsReady, setCameraIsReady] = useState(true);

  const takePictureHandler = async (camera) => {
    setCameraIsReady(false);
    const options = { quality: 0.5, base64: true };
    const image = await camera.takePictureAsync(options);
    setCameraIsReady(true);
    navigation.navigate('Feedback', { file: image });
  };

  const barCodeHandler = ({ data, rawData, type, bounds }) => {
    console.log({ data, rawData, type, bounds });
    navigation.navigate('Feedback', { barcode: data });
  };

  return (
    <View accessible={true} style={styles.container}>
      {!isFocused ? <></> :
        <RNCamera
          onBarCodeRead={barCodeHandler}
          accessible={true}
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
            if (!cameraIsReady || status !== 'READY') {
              return <View style={styles.loadingContainer}>
                <ActivityIndicator
                  style={styles.noCapture} color={'white'} />
              </View>;
            }
            return (
              <View accessible={true} style={styles.nonLoadingContainer}>
                <View accessible={true} style={styles.captureContainer}>
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
      }
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
