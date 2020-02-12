import React, {useEffect, useState} from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { RNCamera } from 'react-native-camera';
import {gql} from "apollo-boost";
import {useMutation} from "@apollo/react-hooks";
import ErrorMessage from "../components/ErrorMessage";


// GraphQL schema for picture posting mutation
const POST_PICTURE_MUTATION = gql`
  mutation PostPictureMutation($file: PictureFile) {
    postPicture(file: $file) {
      product {
        name
      }
      carbonFootprintPerKg
    }
  }
`;

const Camera = ({ route, navigation }) => {

  const [isVisible, setVisibility] = useState(false);
  const meal = {};
  const [postPictureMutation, { loading: pictureLoading,
                                error: pictureError,
                                data: pictureData }] = useMutation(POST_PICTURE_MUTATION)

  // Respond to changes in picture data
  // useEffect(() => {
  //   if (pictureData) {
  //     console.log({'pictureData': pictureData});
  //     meal.score = pictureData.postPicture.carbonFootprintPerKg;
  //     meal.description = pictureData.postPicture.product.name;
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pictureData]);

  const classifyPicture = async (image) => {
    try {
      await postPictureMutation({ variables: { file: image } });
      // Wait for picture data
      // while (!pictureData) {
      //   console.log('Waiting for one second...');
      //   await new Promise(r => setTimeout(r, 1000));
      // }
      // Get picture data
      console.log({'pictureData': pictureData});
      meal.score = pictureData.postPicture.carbonFootprintPerKg;
      meal.description = pictureData.postPicture.product.name;
      console.log({meal});
    } catch (err) {
      console.log(err);
    }
  };


  const takePictureHandler = async (camera) => {
    const options = { quality: 0.5, base64: true };
    const image = await camera.takePictureAsync(options);
    meal.uri = image.uri;
    await classifyPicture(image);
    await new Promise(r => setTimeout(r, 5000));
    console.log({'cameraMeal': meal});
    navigation.navigate('Feedback', {meal: meal});
  };

  const barCodeHandler = ({ data, rawData, type, bounds }) => {
    console.log({ data, rawData, type, bounds });
    // save the barcode info into a different components state
    navigation.navigate('Feedback', {image: data});
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
              // <View>
              // <ErrorMessage
              //     isVisible={isVisible}
              //     onBackdropPress={() => setVisibility(false)}
              //     onChangeText={value => setCorrectedName(value)}
              //     onSubmitEditing={() => {
              //       handleCorrection(correctedName);
              //       setVisibility(false);
              //     }}
              // />
              // </View>
            <View style={{ flex:1, justifyContent:'flex-end', alignItems:'center', marginBottom:50 }}>
              <TouchableOpacity
                  onPress={() => takePictureHandler(camera)}
                  style={styles.capture}>
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
