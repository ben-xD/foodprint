import {heightPercentageToDP as percentageHeight, widthPercentageToDP as percentageWidth} from 'react-native-responsive-screen';
import {VictoryPie} from 'victory-native';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import { Tooltip } from 'react-native-elements';
//DO NOT DELETE THE FOLLOWING COMMENTED CODE
import gql from 'graphql-tag';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import {useQuery} from '@apollo/react-hooks';


//DO NOT DELETE THE FOLLOWING COMMENTED CODE
// GraphQL schema
// const GET_AVERAGE = gql`query {
//   getUserAvg
// }`;


const GeneralDisplay = () => {
 //DO NOT DELETE THE FOLLOWING COMMENTED CODE
 // const { loading, error, data } = useQuery(GET_AVERAGE);

 //Following code is here to mimick response from back-end
 const loading = false;
 const error = false;
 const data = 17.25;

 const calculateColour = (carbonFootprint) => {
   if (carbonFootprint < 4) {
     return 'forestgreen';
   } else if (carbonFootprint < 12) {
     return 'yellowgreen';
   } else if (carbonFootprint < 16) {
     return 'yellow';
   } else if (carbonFootprint < 20) {
     return 'orange';
   }
     return 'red';
 };

 const calculateSmiley = (carbonFootprint) => {
   if (carbonFootprint < 4) {
     return require('../images/sparkling-eyes-smiley.png');
   } else if (carbonFootprint < 12) {
     return require('../images/happy-smiley.png');
   } else if (carbonFootprint < 16) {
     return require('../images/shy-smiley.png');
   } else if (carbonFootprint < 20) {
     return require('../images/unimpressed-smiley.png');
   }
   return require('../images/crying-smiley.png');
 };

 return (
   <View>
     {(loading) ? (
       <View style={ styles.messageContainer }>
         <Text>Your data is loading</Text>
       </View>
     ) : ((error) ? (
       <View style={ styles.messageContainer }>
         <Text>An error has occurred</Text>
       </View>
     ) : (
       <View style={ styles.graphContainer }>
         <Image
           source={calculateSmiley(data)}
           style={ styles.image }
         />
         <View style={ [ styles.score, { flexDirection:'row'} ]}>
           <Text style={{ margin:percentageWidth('1%')}}>{data} units</Text>
           <Tooltip
               popover={<Text style={ styles.tooltipContent }>This score corresponds to the average carbon footprint of
                all the items you have added to your history since you have started using Foodprint.</Text>}
               backgroundColor={'green'}
               height={percentageHeight('20%')}
               width={percentageWidth('65%')}
           >
             <MaterialCommunityIcons name="help-circle" color={'grey'} size={percentageWidth('4%')} />
           </Tooltip>
         </View>
         <VictoryPie
           data={[ {x: ' ', y: data}, {x: ' ', y: 26.7 - data} ]}
           standalone={true}
           colorScale={[calculateColour(data), 'transparent']}
           startAngle={-90}
           endAngle={90}
           innerRadius={percentageHeight('16%')}
           height={percentageHeight('40%')}
         />
       </View>
     ))}
   </View>
 );
};

const styles = StyleSheet.create({
 messageContainer: { height: percentageHeight('29%'), alignItems: 'center', justifyContent:'center' },
 graphContainer: { height: percentageHeight('29%'), alignItems: 'center' },
 tooltipContent: { color:'white', fontSize:percentageWidth('4%') },
 image: { height: percentageHeight('10%'), width: percentageWidth('20%'), position: 'absolute', alignSelf: 'center', marginTop: percentageHeight('12%') },
 score: { fontSize: percentageWidth('6%'), color: 'grey', position: 'absolute', alignSelf: 'center', marginTop: percentageHeight('24%') },
});

export default GeneralDisplay;
