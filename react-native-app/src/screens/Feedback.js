import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { Text, Button, Rating, Overlay } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from "react-native-gesture-handler";

export default Feedback = ({ navigation }) => {

  function calculateRating(carbonFootprint) {
    if (carbonFootprint < 4) {
      return 5;
    } else if (carbonFootprint < 8) {
      return 4;
    } else if (carbonFootprint < 12) {
      return 3;
    } else if (carbonFootprint < 16) {
      return 2;
    } else if (carbonFootprint < 20) {
      return 1;
    } else {
      return 0;
    }
  };


  return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1}}/>
        <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center'  }}>
          <Image
              style={{height: 200, width:200}}
              source={{uri: 'http://sunonefruits.com/wp-content/uploads/2018/07/apple.jpg'}}
          />
          <Text h2>Name</Text>
          <Rating
              readonly
              ratingBackgroundColor='green'
              startingValue= {calculateRating(26)}
          />
          <Text h4>3 kg of CO2 eq/kg</Text>
        </View>
        <View style={{ flex: 2, flexDirection: 'row'  }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 4, flexDirection: 'column' }}>
            <Button
                buttonStyle={{ backgroundColor: 'darkred' }}
                titleStyle={{ fontSize: 24 }}
                title="Not my item..."
                onPress={() => navigation.navigate('ErrorScreen')}
            />
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </View>
  );
}



class UserFeedback extends Component {

  state = { isVisible: false };

  render () {
    <Overlay isVisible={this.state.isVisible}>
      <Text>Hello</Text>
    </Overlay>
  }
}