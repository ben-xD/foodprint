import React, { useEffect, useState } from 'react';
import {View, Text, ActivityIndicator, Image, SafeAreaView, FlatList} from 'react-native';
import { gql } from 'apollo-boost';
import { StyleSheet, Linking } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import {Rating, Button, Overlay} from 'react-native-elements';
import { widthPercentageToDP as percentageWidth, heightPercentageToDP as percentageHeight } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import Snackbar from 'react-native-snackbar';
import { StackActions } from '@react-navigation/native';

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

const POST_USER_HISTORY_ENTRY = gql`
  mutation postUserHistoryEntry($item: String) {
    postUserHistoryEntry(item: $item)
  }
`;

const Feedback = ({ route, navigation }) => {
  const [meal, setMeal] = useState(null);
  const [overlayInfo, setOverlayInfo] = useState(null);
  const [isVisible, setVisibility] = useState(false);
  const [uploadPicture, { loading: pictureLoading, data: pictureData, error: pictureError }] = useMutation(POST_PICTURE_MUTATION);
  const [postBarcodeMutation, { loading: barcodeLoading, error: barcodeError, data: barcodeData }] = useMutation(POST_BARCODE_MUTATION);
  const [postUserHistoryEntryMutation, { loading: historyLoading, error: historyError, data: historyData }] = useMutation(POST_USER_HISTORY_ENTRY);

  // make relevant request when component is loaded AND provided with either file or barcode
  useEffect(() => {
    const { file, barcode, recipeMeal, extraInfo } = route.params;
    if (file) {
      uploadPicture({ variables: { file } });
    } else if (barcode) {
      postBarcodeMutation({ variables: { barcode } });
    } else if (recipeMeal && extraInfo) {
      setMeal(recipeMeal);
      setOverlayInfo(extraInfo);
    }
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
  }, [navigation, pictureData, route.params.uri]);

  useEffect(() => {
    if (barcodeData) {
      if (barcodeData.postBarcode.name && barcodeData.postBarcode.carbonFootprintPerKg) {
        // If unknown name from barcode, go to error correction screen
        navigation.navigate('Correction', { meal, setMeal });
      } else {
        setMeal({
          score: barcodeData.postBarcode.carbonFootprintPerKg,
          description: barcodeData.postBarcode.name,
        });
      }
    }
  }, [barcodeData, navigation]);

  // Add item to user history
  const addToHistory = async (item) => {
    await postUserHistoryEntryMutation({ variables: { item } });
  };

  const getRatingFromCarbonFootprint = (carbonFootprint) => {
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

  const getColourFromCarbonFootprint = (carbonFootprint) => {
    if (carbonFootprint < 0) {
      return 'black';
    } else if (carbonFootprint < 4) {
      return 'forestgreen';
    } else if (carbonFootprint < 8) {
      return 'yellowgreen';
    } else if (carbonFootprint < 12) {
      return 'gold';
    } else if (carbonFootprint < 16) {
      return 'orange';
    } else if (carbonFootprint < 20) {
      return 'red';
    } else {
      return 'darkred';
    }
  };

  return pictureLoading || barcodeLoading || !meal ?
    <View style={styles.loading}>
      <ActivityIndicator />
    </View > :
    <SafeAreaView style={styles.container}>
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
            startingValue={getRatingFromCarbonFootprint(meal.score)}
            type="star" // Optionally customisible
            imageSize={percentageWidth('7%')}
          />
          <Text style={styles.score}>{meal.score} units</Text>
          {(overlayInfo) ? (
              <Button title="More information about this number" type="clear" onPress={() => setVisibility(true)} />
          ) : <></>
          }
        </View>
        <View style={styles.buttonContainer}>
          <Button
            buttonStyle={styles.redButtonStyle}
            titleStyle={styles.buttonText}
            title="Wrong item"
            onPress={() => navigation.navigate('Correction', { meal, setMeal })}
          />
          <Button
            buttonStyle={styles.greenButtonStyle}
            titleStyle={styles.buttonText}
            title="Add to history"
            onPress={() => {
              addToHistory(meal.item ? meal.item : meal.description);
              navigation.dispatch(StackActions.pop(2));
            }}
          />
        </View>
      </ScrollView>
      {(overlayInfo) ? (
          <Overlay isVisible={isVisible} onBackdropPress={() => setVisibility(false)}>
            <SafeAreaView style={ styles.overlayContainer }>
              <Text style={ styles.overlayText }>The carbon footprint of this recipe was obtained from the following ingredients:</Text>
              <FlatList
                  data={overlayInfo.ingredients}
                  style={ styles.overlayList }
                  renderItem={({item}) => (item.carbonFootprintPerKg && item.amountKg*item.carbonFootprintPerKg >= 0.01) ? (
                      <Text style={ styles.overlayText }>- {item.amountKg} kg of {item.ingredient}:
                        <Text style={{ fontWeight:'bold', color: getColourFromCarbonFootprint(item.carbonFootprintPerKg) }}> {(item.amountKg * item.carbonFootprintPerKg).toFixed(2)}</Text> units</Text>
                  ) : <></>}
                  keyExtractor={(item,index) => index.toString()}
              />
              <Text style={ styles.overlayText }>To see the full recipe, click on the following link:{'\n'}</Text>
              <Text style={ styles.overlayHyperlink } onPress={() => Linking.openURL(overlayInfo.recipeUrl)}>{overlayInfo.recipeUrl}</Text>
              <Text style={ styles.overlayFootnote }><Text style={{fontWeight:'bold'}}>Note</Text>: Ingredients used in very small quantity, which have a
                negligeable carbon footprint, or which were unknown to our database are not shown. </Text>
            </SafeAreaView>
          </Overlay>
      ) : <></>
      }
    </SafeAreaView>;
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
    textAlign: 'center',
    fontSize: percentageWidth('8%'),
    marginTop: percentageHeight('1%'),
    marginBottom: percentageHeight('1%'),
  },
  overlayContainer: {
    marginTop: percentageHeight('5%'),
    marginHorizontal: percentageWidth('3%'),
  },
  overlayText: {
    fontSize: percentageWidth('4%'),
  },
  overlayList: {
    fontSize: percentageWidth('4%'),
    marginVertical: percentageHeight('4%')
  },
  overlayHyperlink: {
    fontSize: percentageWidth('4%'),
    color:'blue',
  },
  overlayFootnote: {
    fontSize: percentageWidth('3%'),
    marginTop: percentageHeight('5%')
  },
  score: { fontSize: percentageWidth('5%'), margin: percentageWidth('2%') },
  buttonContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
  redButtonStyle: { backgroundColor: 'gray', width: percentageWidth('45%') },
  greenButtonStyle: { backgroundColor: 'green', width: percentageWidth('45%') },
  buttonText: { fontSize: percentageWidth('5%') },
});

export default Feedback;
