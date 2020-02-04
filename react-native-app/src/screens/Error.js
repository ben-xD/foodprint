import React from 'react';
import { View, Image } from 'react-native';
import { Text, Button, Input} from 'react-native-elements';

export default ErrorScreen = ({ navigation }) => {
  return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection:'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{flex:1}}/>
          <Text h3 style={{flex:4, textAlign:'center'}}>We're sorry we couldn't find your item...</Text>
          <View style={{flex:1}}/>
        </View>
        <View style={{ flex: 1.5, alignItems: 'center', justifyContent: 'center'  }}>
          <Image
              style={{height: 250, width:250}}
              source={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/fc4a1059120725.5a15c9fa08f78.gif'}}
          />
        </View>
        <View style={{ flexDirection:'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{flex:1}}/>
          <Text style={{ fontSize: 24, flex:4, textAlign:'center'}}>Let us know what your item was, so we can improve our app:</Text>
          <View style={{flex:1}}/>
        </View>
        <View style={{ flex: 1.5, flexDirection: 'row' }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 4, flexDirection: 'column', justifyContent:'space-between' }}>
            <Input
                placeholder="e.g. Cucumber"
            />
            <Button
                buttonStyle={{ backgroundColor: 'green' }}
                titleStyle={{ fontSize: 24 }}
                title="Submit"
                onPress={() => alert('Implement')}
            />
            <View style={{flex:0.5}}/>
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </View>
  );
}