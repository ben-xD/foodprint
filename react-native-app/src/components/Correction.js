import { Image, View, ActivityIndicator } from 'react-native';
import { Input, Text } from 'react-native-elements';
import React, { useState, useEffect } from 'react';

import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { widthPercentageToDP as percentageWidth, heightPercentageToDP as percentageHeight } from 'react-native-responsive-screen';


// GraphQL schema for correction mutation
const POST_CORRECTION_MUTATION = gql`
mutation PostCorrectionMutation($name: String!) {
  postCorrection(name: $name) {
    name
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
    if (correctionData && correctionData.postCorrection.carbonFootprintPerKg) {
      setMeal({
        ...meal,
        score: correctionData.postCorrection.carbonFootprintPerKg,
        description: correctedName,
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
        <ScrollView>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>We could not find your item.</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/fc4a1059120725.5a15c9fa08f78.gif' }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Input
              placeholder="Cucumber"
              onChangeText={value => setCorrectedName(value.toLowerCase())}
              onSubmitEditing={handleCorrection}
            />
          </View>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Let us know what it was, so we can improve our app.</Text>
          </View>
        </ScrollView>
      </View >
    );
};

const styles = StyleSheet.create({
  loading: {
    height: '100%',
    justifyContent: 'center',
  },
  container: { flex: 1, justifyContent: 'center' },
  titleContainer: { flex: 2, justifyContent: 'center', marginTop: percentageHeight('10%') },
  title: { textAlign: 'center', fontSize: percentageWidth('7%') },
  imageContainer: { flex: 2.5, alignItems: 'center', justifyContent: 'center', marginTop: percentageHeight('5%') },
  image: { height: percentageWidth('30%'), width: percentageWidth('30%') },
  subtitleContainer: { flex: 1, justifyContent: 'center' },
  subtitle: { fontSize: percentageWidth('5%'), textAlign: 'center', marginHorizontal: percentageWidth('5%') },
  inputContainer: { flex: 1.5, margin: percentageWidth('5%') },
});

export default Correction;
