import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import { gql } from 'apollo-boost';
import { StyleSheet } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { Rating, Button } from 'react-native-elements';
import { widthPercentageToDP as percentageWidth, heightPercentageToDP as percentageHeight } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import Snackbar from 'react-native-snackbar';
import { CommonActions } from '@react-navigation/native';

// GraphQL schema for picture posting mutation
const POST_PICTURE_MUTATION = gql`
  mutation PostPictureMutation($file: PictureFile) {
    postPicture(file: $file) {
      name
      carbonFootprintPerKg
    }
  }
`;

const POST_BARCODE_MUTATION = gql`
  mutation PostBarcodeMutation($barcode: String!) {
      postBarcode(barcode: $barcode) {
        name
        carbonFootprintPerKg
      }
  }
`;

const Post_User_History_Entry = gql`
  mutation postUserHistoryEntry($item: String) {
    postUserHistoryEntry(item: $item)
  }
`;

const Feedback = ({ route, navigation }) => {
  const [meal, setMeal] = useState(null);
  const [uploadPicture, { loading: pictureLoading, data: pictureData, error: pictureError }] = useMutation(POST_PICTURE_MUTATION);
  const [postBarcodeMutation, { loading: barcodeLoading, error: barcodeError, data: barcodeData }] = useMutation(POST_BARCODE_MUTATION);
  const [postUserHistoryEntryMutation, { loading: historyLoading, error: historyError, data: historyData }] = useMutation(Post_User_History_Entry);

  // make relevant request when component is loaded AND provided with either file or barcode
  useEffect(() => {
    const { file, barcode } = route.params;
    if (file) {
      uploadPicture({ variables: { file } });
    } else if (barcode) {
      postBarcodeMutation({ variables: { barcode } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pictureError && !barcodeError) {
      return;
    }
    Snackbar.show({
      text: 'Oops, something went wrong :(',
      duration: Snackbar.LENGTH_SHORT,
    });
  }, [pictureError, barcodeError]);

  useEffect(() => {
    if (pictureData) {
      if (pictureData.postPicture.name && pictureData.postPicture.carbonFootprintPerKg) {
        // If a name was found for the picture, display it
        setMeal({
          uri: route.params.uri,
          score: pictureData.postPicture.carbonFootprintPerKg.toFixed(1),
          description: pictureData.postPicture.name,
        });
      } else {
        // Otherwise, go to error correction screen
        setMeal({
          uri: route.params.uri,
        });
        navigation.navigate('Correction', { meal, setMeal });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, pictureData, route.params.uri]);

  useEffect(() => {
    if (barcodeData) {
      if (barcodeData.postBarcode.name && barcodeData.postBarcode.carbonFootprintPerKg) {
        // If unknown name from barcode, go to error correction screen
        navigation.navigate('Correction', { meal, setMeal });
      } else {
        setMeal({
          ...meal,
          score: barcodeData.postBarcode.carbonFootprintPerKg,
          description: barcodeData.postBarcode.name,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barcodeData, navigation]);

  // Add item to user history
  const addToHistory = async (item) => {
    await postUserHistoryEntryMutation({ variables: { item } });
  };

  const calculateRating = (carbonFootprint) => {
    if (carbonFootprint < 0) {
      return 0;
    } else if (carbonFootprint < 2) {
      return 5;
    } else if (carbonFootprint < 4) {
      return 4.5;
    } else if (carbonFootprint < 6) {
      return 4;
    } else if (carbonFootprint < 8) {
      return 3.5;
    } else if (carbonFootprint < 10) {
      return 3;
    } else if (carbonFootprint < 12) {
      return 2.5;
    } else if (carbonFootprint < 14) {
      return 2;
    } else if (carbonFootprint < 16) {
      return 1.5;
    } else if (carbonFootprint < 18) {
      return 1;
    } else if (carbonFootprint < 20) {
      return 0.5;
    } else {
      return 0;
    }
  };

  return pictureLoading || barcodeLoading || !meal ?
    <View style={styles.loading}>
      <ActivityIndicator />
    </View > :
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.body}>
          {meal.uri == null ? <></> :
            <Image
              style={styles.image}
              source={{ uri: meal.uri }}
            />
          }
          <Text style={styles.description}>{meal.description}</Text>
          <Rating
            readonly
            startingValue={calculateRating(meal.score)}
            type="star" // Optionally customisible
            imageSize={percentageWidth('7%')}
          />
          <Text style={styles.score}>{meal.score} kg of CO2 eq/kg</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            buttonStyle={styles.redButtonStyle}
            titleStyle={styles.buttonText}
            title="Wrong item"
            // TODO don't pass setMeal, and don't call Post correction in correction. Do it in Feedback instead.
            onPress={() => navigation.navigate('Correction', { meal, setMeal })}
          />
          <Button
            buttonStyle={styles.greenButtonStyle}
            titleStyle={styles.buttonText}
            title="Add to history"
            onPress={() => {
              addToHistory(meal.description);
              console.log('Sent item to to user history...');
              // Reset navigation, so user go back (hardware back press) to current screen
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    { name: 'Your Foodprint' },
                  ],
                })
              );
            }}
          />
        </View>
      </ScrollView>
    </View>;
};

const styles = StyleSheet.create({
  loading: {
    height: '100%',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  body: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: percentageWidth('3%'),
    marginTop: percentageHeight('1%'),
  },
  image: {
    height: percentageWidth('85%'),
    width: percentageWidth('85%'),
    marginTop: percentageHeight('2%'),
    marginBottom: percentageHeight('2%'),
  },
  description: {
    textTransform: 'capitalize',
    fontSize: percentageWidth('8%'),
    marginTop: percentageHeight('1%'),
    marginBottom: percentageHeight('1%'),
  },
  score: { fontSize: percentageWidth('5%'), margin: percentageWidth('2%') },
  buttonContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
  redButtonStyle: { backgroundColor: 'gray', width: percentageWidth('45%') },
  greenButtonStyle: { backgroundColor: 'green', width: percentageWidth('45%') },
  buttonText: { fontSize: percentageWidth('5%') },
});

export default Feedback;
