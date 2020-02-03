import React from 'react';
import { View, Image } from 'react-native';
import { Text, Button, Input} from 'react-native-elements';

export default Error = ({ navigation }) => {
  return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text h3>We're sorry we couldn't find your item...</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'  }}>
          <Image
              style={{height: 200, width:200}}
              source={{uri: 'http://sunonefruits.com/wp-content/uploads/2018/07/apple.jpg'}}
          />
          <Text h2>Name</Text>
          <Text h4>42 bla</Text>
        </View>
        <View style={{ flex: 2, flexDirection: 'row'  }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 4, flexDirection: 'column' }}>
            <Button
                buttonStyle={{ backgroundColor: 'green' }}
                titleStyle={{ fontSize: 24 }}
                title="Submit"
                onPress={() => alert('Implement')}
            />
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </View>
  );
}