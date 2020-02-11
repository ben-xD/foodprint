import {Image, View} from "react-native";
import {Button, Input, Overlay, Text} from "react-native-elements";
import React, {useState} from "react";


const ErrorMessage = ({ isVisible, onBackdropPress, onChangeText, onSubmitEditing }) => {
  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={() => onBackdropPress() }
    >
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{flex:2, justifyContent:'center'}}>
        <Text h3 style={{ textAlign: 'center' }}>We're sorry we couldn't find your item...</Text>
      </View>
      <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
        <Image
            style={{ height: 250, width:250 }}
            source={{ uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/fc4a1059120725.5a15c9fa08f78.gif' }}
        />
      </View>
      <View style={{ flex:1, justifyContent:'center'}}>
        <Text style={{ fontSize: 22, textAlign: 'center', margin:20 }}>Let us know what it was, so we can improve our
          app:</Text>
      </View>
      <View style={{flex:1.5 }}>
        <View style={{margin:20}}>
          <Input
              placeholder="e.g. Cucumber"
              onChangeText={onChangeText}
              onSubmitEditing={onSubmitEditing}
          />
          <Button
              buttonStyle={{ backgroundColor: 'green', marginTop:20 }}
              titleStyle={{ fontSize: 24 }}
              title="Submit"
              onPress={() => alert('Implement')}
          />
        </View>
      </View>
    </View>
  </Overlay>
  );
};

export default ErrorMessage;