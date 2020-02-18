import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import ErrorMessage from '../components/ErrorMessage';
import { StyleSheet } from 'react-native';


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
  const [uri, setUri] = useState({});
  const [meal, setMeal] = useState({});
  const [cameraIsReady, setCameraIsReady] = useState(true);
  const [postPictureMutation, { loading: pictureLoading, error: pictureError, data: pictureData }] = useMutation(POST_PICTURE_MUTATION);

  // Respond to changes in picture data
  useEffect(() => {
    if (pictureData) {
      console.log({ pictureData });
      // If no carbon footprint was found, show the error correction overlay
      if (pictureData.postPicture.carbonFootprintPerKg === null) {
        setVisibility(true);
      } else {
        const mealObject = {
          uri,
          score: pictureData.postPicture.carbonFootprintPerKg,
          description: pictureData.postPicture.product.name,
        };
        console.log({ mealObject });
        console.log('Navigating to feedback directly...');
        navigation.navigate('Feedback', { meal: mealObject });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pictureData]);

  // Respond to changes in meal (indicating corrected classification)
  useEffect(() => {
    // If score is set, navigate to feedback screen
    if (meal.score !== undefined) {
      console.log({ meal });
      const mealObject = {
        uri,
        score: meal.score,
        description: meal.description,
      };
      console.log({ mealObject });
      console.log('Navigating to feedback following correction...');
      navigation.navigate('Feedback', { meal: mealObject });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meal]);

  const takePictureHandler = async (camera) => {
    setCameraIsReady(false);
    const options = { quality: 0.5, base64: true };
    const image = await camera.takePictureAsync(options);
    setUri(image.uri);
    await postPictureMutation({ variables: { file: image } });
    setCameraIsReady(true);
  };

  const barCodeHandler = ({ data, rawData, type, bounds }) => {
    console.log({ data, rawData, type, bounds });
    // save the barcode info into a different components state
    navigation.navigate('Feedback', { image: data });
  };

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
          if (!cameraIsReady || status !== 'READY') {
            return <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
              <ActivityIndicator
                style={styles.noCapture} color={'white'} />
            </View>;
          }
          return (
            <View style={{ flex: 1 }}>
              <ErrorMessage
                isVisible={isVisible}
                setVisibility={setVisibility}
                meal={meal}
                setMeal={setMeal}
              />
              <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => takePictureHandler(camera)}
                  style={styles.capture} />
              </View>
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
