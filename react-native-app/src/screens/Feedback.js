import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import { gql } from 'apollo-boost';
import { StyleSheet } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { Rating, Button } from 'react-native-elements';

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

const POST_BARCODE_MUTATION = gql`
  mutation PostBarcodeMutation($barcode: String!) {
      postBarcode(barcode: $barcode) {
        product {
          name
        }
        carbonFootprintPerKg
      }
  }
`;

const Feedback = ({ route, navigation }) => {
  const [meal, setMeal] = useState(null);
  const [uploadPicture, { loading: pictureLoading, data: pictureData, error: pictureError }] = useMutation(POST_PICTURE_MUTATION);
  const [postBarcodeMutation, { loading: barcodeLoading, error: barcodeError, data: barcodeData }] = useMutation(POST_BARCODE_MUTATION);

  // When component is loaded and provided with a file or barcode, make a request
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
    // TODO set error, and display.
    console.warn('Error!');
  }, [pictureError, barcodeError]);

  useEffect(() => {
    if (pictureError) {
      console.warn({ pictureError });
    }
    // console.log({ pictureData, pictureLoading, pictureError });
    if (pictureData) {
      setMeal({
        uri: route.params.uri,
        score: pictureData.postPicture.carbonFootprintPerKg,
        description: pictureData.postPicture.product.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pictureData]);

  useEffect(() => {
    if (barcodeError) {
      console.warn({ barcodeError });
    }
    // console.log({ barcodeData, barcodeLoading, barcodeError });
    if (barcodeData) {
      setMeal({
        score: barcodeData.postBarcode.carbonFootprintPerKg,
        description: barcodeData.postBarcode.product.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barcodeData]);

  const calculateRating = (carbonFootprint) => {
    if (carbonFootprint < 2) {
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

  return pictureLoading || barcodeLoading ?
    <View style={styles.loading}>
      <ActivityIndicator />
    </View > :
    // todo fix this, no meal yet thing
    !meal ? <Text>No meal yet</Text> :
      <View style={styles.container}>
        <View style={styles.body}>
          {meal.uri == null ? <></> :
            <Image
              style={styles.image}
              source={{ uri: meal.uri }}
            />
          }
          <Text h2 style={styles.description}>{meal.description}</Text>
          <Rating
            readonly
            startingValue={calculateRating(meal.score)}
          />
          <Text style={styles.score}>{meal.score}kg of CO2 eq/kg</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
            title="This isn't my item..."
            // TODO don't pass setMeal, and don't call Post correction in correction. Do it in Feedback instead.
            onPress={() => navigation.navigate('Correction', { meal, setMeal })}
          />
        </View>
      </View>;
};

const styles = StyleSheet.create({
  loading: {
    height: '100%',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  body: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 10,
    marginTop: 100,
    marginBottom: 30,
  },
  image: { height: 350, width: 350 },
  description: { marginTop: 20, marginBottom: 10 },
  score: { fontSize: 18, margin: 10 },
  buttonContainer: { flex: 1, flexDirection: 'column', marginLeft: 50, marginRight: 50 },
  button: { backgroundColor: 'darkred' },
  buttonText: { fontSize: 24 },
});

export default Feedback;
