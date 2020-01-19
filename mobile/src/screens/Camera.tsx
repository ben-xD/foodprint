import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {RNCamera} from 'react-native-camera';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from 'axios';

interface Props {}

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Text>Waiting</Text>
  </View>
);

const Camera: React.FC<Props> = ({navigation}) => {
  const takePicture = async (camera: RNCamera) => {
    const options = {quality: 0.5, base64: true};
    try {
      const data = await camera.takePictureAsync(options);
      console.log(data);
      // send image to backend
      const endpoint = 'http://c24984a5.ngrok.io/';
      const config = {
        headers: {'content-type': 'multipart/form-data'},
      };
      await Axios.post(endpoint, data.base64, config);
      console.log('Image uploaded');
    } catch (err) {
      console.log('One error');
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        captureAudio={false}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera to scan food',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        // onGoogleVisionBarcodesDetected={({ barcodes }) => {
        //     console.log(barcodes);
        // }}
      >
        {({camera, status}) => {
          if (status !== 'READY') return <PendingView />;
          return (
            <View
              style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => takePicture(camera)}
                style={styles.capture}>
                <MaterialCommunityIcons name="food" color="grey" size={100} />
              </TouchableOpacity>
            </View>
          );
        }}
      </RNCamera>
    </View>
  );
};

export default Camera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
    width: 125,
    height: 125,
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 15,
  },
});
