import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { RNCamera } from 'react-native-camera';

const Camera = ({ route, navigation }) => {
  const [liveClass, setLiveClass] = useState(null);

  const { classifyPicture } = route.params;

  const takePictureHandler = async (camera) => {
    const options = { quality: 0.5, base64: true };
    const data = await camera.takePictureAsync(options);
    classifyPicture(data);
    // navigation.goBack();
    // Following section is new
    navigation.navigate("Feedback");
    // End of changes
  };

  const barCodeHandler = ({ data, rawData, type, bounds }) => {
    console.log({ data, rawData, type, bounds });
    // save the barcode info into a different components state
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <RNCamera
        onBarCodeRead={barCodeHandler}
        style={styles.preview}
        captureAudio={false}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      >
        {({ camera, status, recordAudioPermissionStatus }) => {
          if (status !== 'READY') { return <Text>Not ready</Text>; }
          return (
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems:'center' }}>
              <TouchableOpacity
                  onPress={() => takePictureHandler(camera)}
                  style={styles.capture}>
                {/*<Text style={{ fontSize: 14 }}>{liveClass ? liveClass : 'thinking...'}</Text>*/}
              </TouchableOpacity>
              <View style={{height: 75}}/>
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
    // flex: 0,
    // backgroundColor: '#fff',
    // borderRadius: 5,
    // padding: 15,
    // paddingHorizontal: 20,
    // alignSelf: 'center',
    // margin: 20,
    borderWidth:4,
    borderColor:'lightgrey',
    alignItems:'center',
    justifyContent:'center',
    width:80,
    height:80,
    backgroundColor:'red',
    borderRadius:50,
  },
});
