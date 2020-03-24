import { Image, View, ActivityIndicator } from 'react-native';
import { Input, Text } from 'react-native-elements';
import React, { useState, useEffect } from 'react';

import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/client';
import { StyleSheet } from 'react-native';


// GraphQL schema for correction mutation
const POST_CORRECTION_MUTATION = gql`
mutation PostCorrectionMutation($name: String!) {
  postCorrection(name: $name) {
    product {
      name
    }
    carbonFootprintPerKg
  }
}
`;

const Correction = ({ route, navigation }) => {
  const { meal, setMeal } = route.params;
  const [correctedName, setCorrectedName] = useState('');
  const [postCorrection, { loading: correctionLoading, error: correctionError, data: correctionData }] = useMutation(POST_CORRECTION_MUTATION);

  // Handle correction from input field
  const handleCorrection = async () => {
    try {
      await postCorrection({ variables: { name: correctedName } });
    } catch (err) {
      console.warn({ err });
    }
  };

  useEffect(() => {
    if (!correctionError) {
      return;
    }
    // TODO show error to user
    console.warn('Error in correction request');
  }, [correctionError]);

  // Respond to changes in correction data (following correction)
  useEffect(() => {
    if (correctionData) {
      setMeal({
        ...meal,
        score: correctionData.postCorrection.carbonFootprintPerKg,
        description: correctionData.postCorrection.product.name,
      });
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctionData]);

  return correctionLoading ?
    <View style={styles.loading}>
      <ActivityIndicator />
    </View > : (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text h3 style={styles.title}>We couldn't find your item.</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{ uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/fc4a1059120725.5a15c9fa08f78.gif' }}
          />
        </View>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Let us know what it was, so we can improve our
          app:</Text>
        </View>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Cucumber"
            onChangeText={value => setCorrectedName(value)}
            onSubmitEditing={handleCorrection}
          />
        </View>
      </View >
    );
};

const styles = StyleSheet.create({
  loading: {
    height: '100%',
    justifyContent: 'center',
  },
  container: { flex: 1, justifyContent: 'center' },
  titleContainer: { flex: 2, justifyContent: 'center' },
  title: { textAlign: 'center' },
  imageContainer: { flex: 2.5, alignItems: 'center', justifyContent: 'center' },
  image: { height: 200, width: 200 },
  subtitleContainer: { flex: 1, justifyContent: 'center' },
  subtitle: { fontSize: 22, textAlign: 'center', marginHorizontal: 20 },
  inputContainer: { flex: 1.5, margin: 20 },
});

export default Correction;
