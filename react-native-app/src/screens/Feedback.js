import React from 'react';
import { View, Image } from 'react-native';
import { Text, Button } from 'react-native-elements';

export default Feedback = ({ navigation }) => {
  return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}/>
        <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: 'yellow'  }}>
          <Image
              style={{height: 200, width:200}}
              source={{uri: 'http://sunonefruits.com/wp-content/uploads/2018/07/apple.jpg'}}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor:'pink' }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 4, flexDirection: 'column' }}>
            <Button
                buttonStyle={{ backgroundColor: 'darkred' }}
                titleStyle={{ fontSize: 24 }}
                title="Not my item..."
                onPress={() => alert('Create screen')}
            />
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </View>
  );
}