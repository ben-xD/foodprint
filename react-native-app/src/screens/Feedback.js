import React, {useEffect, useState} from 'react';
import {View, Image} from 'react-native';
import {Text, Button, Rating, Overlay, Input} from 'react-native-elements';
import {gql} from 'apollo-boost';
import {/*useQuery, */useMutation} from '@apollo/react-hooks';
import ErrorMessage from '../components/ErrorMessage';


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

const Feedback = ({route, navigation}) => {

  const [isVisible, setVisibility] = useState(false);
  // const [meal, setMeal] = useState(route.params);
  const meal = route.params.meal;
  const [correctedName, setCorrectedName] = useState(null);
  const [postCorrection, {loading: correctionLoading, error: correctionError, data: correctionData}] = useMutation(POST_CORRECTION_MUTATION);

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
      return 2, 5;
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

  // // Handle correction from input field
  // const handleCorrection = (name) => {
  //   console.log({'Corrected name': name});
  //   postCorrectionFunction(name);
  // };

  // // Post correction mutation to backend
  // const postCorrectionFunction = async (correctedName) => {
  //   try {
  //     console.log({'Sending': correctedName});
  //     await postCorrection({variables: {name: correctedName}});
  //   } catch (err) {
  //     console.warn({err});
  //   }
  // };

  // // Respond to changes in correction data (following correction)
  // useEffect(() => {
  //   if (correctionData) {
  //     console.log({'correctionData': correctionData});
  //     setMeal({
  //       ...meal,
  //       score: correctionData.postCorrection.carbonFootprintPerKg,
  //       description: correctionData.postCorrection.product.name,
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [correctionData]);


  return (
      <View style={{flex: 1}}>
        {/*<ErrorMessage*/}
        {/*    isVisible={isVisible}*/}
        {/*    onBackdropPress={() => setVisibility(false)}*/}
        {/*    onChangeText={value => setCorrectedName(value)}*/}
        {/*    onSubmitEditing={() => {*/}
        {/*      handleCorrection(correctedName);*/}
        {/*      setVisibility(false);*/}
        {/*    }}*/}
        {/*/>*/}
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{
            flex: 4,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            margin: 10,
            marginTop: 100,
            marginBottom: 30
          }}>
            <Image
                style={{height: 350, width: 350}}
                source={{uri: meal.uri}}
            />
            <Text h2 style={{marginTop: 20, marginBottom: 10}}>{meal.description}</Text>
            <Rating
                readonly
                startingValue={calculateRating(meal.score)}
            />
            <Text style={{fontSize: 18, margin: 10}}>{meal.score}kg of CO2 eq/kg</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'column', marginLeft: 50, marginRight: 50}}>
            <Button
                buttonStyle={{backgroundColor: 'darkred'}}
                titleStyle={{fontSize: 24}}
                title="This isn't my item..."
                onPress={() => setVisibility(true)}
            />
          </View>
        </View>
      </View>
  );
};

export default Feedback;
