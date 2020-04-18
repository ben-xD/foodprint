import { Image, View } from 'react-native';
import { Input, Text, Button } from 'react-native-elements';
import React, { useState, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { widthPercentageToDP as percentageWidth, heightPercentageToDP as percentageHeight } from 'react-native-responsive-screen';
import Snackbar from 'react-native-snackbar';

// GraphQL schema for correction mutation
const POST_CORRECTION_MUTATION = gql`
mutation PostCorrectionMutation($name: String!) {
  postCorrection(name: $name) {
    name
    carbonFootprintPerKg
  }
}
`;

const Correction = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [correctedName, setCorrectedName] = useState('');
  const [postCorrection, { loading: correctionLoading, error: correctionError, data: correctionData }] = useMutation(POST_CORRECTION_MUTATION);

  const postCorrectionHandler = async () => {
    setLoading(true);
    await postCorrection({ variables: { name: correctedName } });
  };

  useEffect(() => {
    if (correctionError) {
      setLoading(false);
      Snackbar.show({
        text: 'We couldn\'t save that to your history.',
        duration: Snackbar.LENGTH_INDEFINITE,
        action: {
          text: 'RETRY',
          textColor: 'red',
          onPress: postCorrectionHandler,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctionError]);

  // Respond to changes in correction data (following correction)
  useEffect(() => {
    if (correctionData && correctionData.postCorrection.carbonFootprintPerKg) {
      navigation.push('Feedback', {
        meal: {
          score: correctionData.postCorrection.carbonFootprintPerKg,
          description: correctedName,
          item: correctionData.postCorrection.name, // Item returned from back-end
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctionData]);

  return correctionLoading || loading ?
    <View style={styles.loading}>
      <LottieView source={require('../animations/18473-flying-avocado.json')} autoPlay loop />
    </View > : (
      <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps={'handled'} >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Sorry, we could not find your item.</Text>
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
              autoFocus
              onChangeText={value => setCorrectedName(value.toLowerCase())}
              onSubmitEditing={postCorrectionHandler}
            />
          </View>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Let us know what it was, so we can improve our app.</Text>
          </View>
          <Button
            title="SUBMIT"
            onPress={postCorrectionHandler}
            buttonStyle={styles.button}
            containerStyle={styles.buttonContainer}
            titleStyle={styles.buttonTitle}
          />
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
  button: { backgroundColor: 'green', width: percentageWidth('30%'), height: 45, marginTop: percentageHeight('2%') },
  buttonContainer: { marginVertical: percentageHeight('2%'), alignItems: 'center' },
});

export default Correction;
