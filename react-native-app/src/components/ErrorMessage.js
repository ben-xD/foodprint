import { Image, View } from 'react-native';
import { Input, Overlay, Text } from 'react-native-elements';
import React, { useState, useEffect } from 'react';

import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';


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

const ErrorMessage = ({ isVisible, setVisibility, meal, setMeal }) => {

  const [correctedName, setCorrectedName] = useState(null);
  const [postCorrection, { loading: correctionLoading, error: correctionError, data: correctionData }] = useMutation(POST_CORRECTION_MUTATION);

  // Handle correction from input field
  const handleCorrection = (name) => {
    console.log({ 'Corrected name': name });
    postCorrectionFunction(name);
  };

  // Post correction mutation to backend
  const postCorrectionFunction = async (name) => {
    try {
      console.log({ 'Sending': correctedName });
      await postCorrection({ variables: { name } });
    } catch (err) {
      console.warn({ err });
    }
  };

  // Respond to changes in correction data (following correction)
  useEffect(() => {
    if (correctionData) {
      console.log({ 'correctionData': correctionData });
      setMeal({
        ...meal,
        score: correctionData.postCorrection.carbonFootprintPerKg,
        description: correctionData.postCorrection.product.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctionData]);

  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={() => setVisibility(false)}
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ flex: 2, justifyContent: 'center' }}>
          <Text h3 style={{ textAlign: 'center' }}>We're sorry we couldn't find your item...</Text>
        </View>
        <View style={{ flex: 2.5, alignItems: 'center', justifyContent: 'center' }}>
          <Image
            style={{ height: 200, width: 200 }}
            source={{ uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/fc4a1059120725.5a15c9fa08f78.gif' }}
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontSize: 22, textAlign: 'center', marginHorizontal: 20 }}>Let us know what it was, so we can improve our
          app:</Text>
        </View>
        <View style={{ flex: 1.5 }}>
          <View style={{ margin: 20 }}>
            <Input
              placeholder="e.g. Cucumber"
              onChangeText={value => setCorrectedName(value)}
              onSubmitEditing={() => {
                handleCorrection(correctedName);
                setVisibility(false);
              }}
            />
          </View>
        </View>
      </View>
    </Overlay>
  );
};

export default ErrorMessage;
