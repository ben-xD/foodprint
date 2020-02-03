import React from 'react';
import { View, Image } from 'react-native';
import { Text, Button, Rating } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from "react-native-gesture-handler";

export default Feedback = ({ navigation }) => {
  return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {/*<TouchableOpacity onPress={() => navigation.navigate('FoodOverview')}*/}
          {/*  <MaterialCommunityIcons name="arrow-left" color={'grey'} size={50} />*/}
          {/*</TouchableOpacity>*/}
        </View>
        <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center'  }}>
          <Image
              style={{height: 200, width:200}}
              source={{uri: 'http://sunonefruits.com/wp-content/uploads/2018/07/apple.jpg'}}
          />
          <Text h2>Name</Text>
          <Rating
              readonly
              ratingBackgroundColor='green'
          />
          <Text h4>42 bla</Text>
        </View>
        <View style={{ flex: 2, flexDirection: 'row'  }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 4, flexDirection: 'column' }}>
            <Button
                buttonStyle={{ backgroundColor: 'darkred' }}
                titleStyle={{ fontSize: 24 }}
                title="Not my item..."
                onPress={() => navigation.navigate('Error')}
            />
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </View>
  );
}