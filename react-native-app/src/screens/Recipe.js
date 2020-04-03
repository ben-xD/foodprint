import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import React, { useState, useEffect } from 'react';
import { widthPercentageToDP as percentageWidth, heightPercentageToDP as percentageHeight } from 'react-native-responsive-screen';
import {Button, Input } from 'react-native-elements';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import Snackbar from 'react-native-snackbar';


const POST_RECIPE_MUTATION = gql`
mutation($url: String!) {
  postRecipe(url: $url) {
     name
     carbonFootprintPerKg
  }
}`;


const Recipe = ( { navigation } ) => {
 const [ url, setURL ] = useState('');
 const [postRecipe, { loading: recipeLoading, error: recipeError, data: recipeData }] = useMutation(POST_RECIPE_MUTATION);

 const handleSubmit = async () => {
  try {
   await postRecipe({ variables: { url: url } });
  } catch (err) {
    console.warn({err});
  }
 };

 useEffect(() => {
  if (!recipeError) {
   return;
  }
  Snackbar.show({
   text: 'Oops, something went wrong :(',
   duration: Snackbar.LENGTH_SHORT,
  });
 }, [recipeError]);


 useEffect(() => {
  if (recipeData && recipeData.postRecipe.carbonFootprintPerKg === null) {
   Snackbar.show({
    text: "Oops, we couldn't find a carbon footprint from this URL :(",
    duration: Snackbar.LENGTH_SHORT,
   });
  }
 }, [recipeData]);


 useEffect(() => {
  if (recipeData && recipeData.postRecipe.carbonFootprintPerKg != null) {
   navigation.navigate('Feedback', { recipeMeal: {
     uri: 'http://www.bagherra.eu/wp-content/uploads/2016/11/orionthemes-placeholder-image-1.png',
     score: recipeData.postRecipe.carbonFootprintPerKg,
     description: recipeData.postRecipe.name,
    }, loading: false });
  }
     }
 );


 return (
     <View style={ styles.container }>
       <Image
          source={require('../images/full-smiley.png')}
          style={ styles.image }
       />
       <Text style={ styles.text }>
         Want to know the carbon footprint of a meal you want to cook? Paste the URL of the
         recipe in the following field!
       </Text>
       <Input
           containerStyle={ styles.input }
           onChangeText = {value => setURL(value)}
       />
      {(recipeLoading) ? (
          <ActivityIndicator style={ styles.loading }/>
      ) : (
          <Button
              title="Submit"
              buttonStyle={ styles.button }
              containerStyle={ styles.buttonContainer }
              titleStyle={ styles.buttonTitle }
              onPress={handleSubmit}
          />
      )}
     </View>
 );
};

const styles = StyleSheet.create({
   container: { flex:1, justifyContent:'center', alignItems:'center', margin:percentageHeight('5%')},
   image: { height: percentageHeight('25%'), width:percentageWidth('45%'), marginBottom:percentageHeight('5%') },
   text: { fontSize:percentageWidth('4%') },
   input: { marginVertical:percentageHeight('2%') },
   button: { backgroundColor:'green', width:percentageWidth('30%'), height:45 },
   buttonContainer: { marginVertical:percentageHeight('2%') },
   buttonTitle: { fontSize:percentageWidth('5%') },
   loading: { height: 45, marginVertical:percentageHeight('2%') },
 });

export default Recipe;
