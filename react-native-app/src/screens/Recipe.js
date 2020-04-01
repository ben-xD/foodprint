import {Image, Text, View} from "react-native";
import React from "react";
import { widthPercentageToDP as percentageWidth, heightPercentageToDP as percentageHeight } from 'react-native-responsive-screen';
import {Button, Input} from "react-native-elements";


const Recipe = ( {navigation} ) => {
 return (
     <View style={{ flex:1, justifyContent:'center', alignItems:'center', margin:percentageHeight('5%')}}>
       <Image
          source={require('../images/full-smiley.png')}
          style={{ height: percentageHeight('23%'), width:percentageWidth('50%'), marginBottom:percentageHeight('5%') }}
       />
       <Text style={{ fontSize:percentageWidth('4%') }}>Want to know the carbon foodprint of a meal you want to cook? Paste the URL of the recipe in the following field!</Text>
       <Input containerStyle={{ marginVertical:percentageHeight('2%') }}/>
       <Button
           title="Submit"
           buttonStyle={{ backgroundColor:'green', width:percentageWidth('30%'), height:45 }}
           containerStyle={{ marginVertical:percentageHeight('2%') }}
           titleStyle={{ fontSize:percentageWidth('5%') }}
       />
     </View>
 )
};

export default Recipe;