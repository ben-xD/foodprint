import React from 'react'
import {View, Text, Image} from 'react-native'
import {Input} from "react-native-elements";

const NoInternet = () => {
  return (
      <View style={{ flex: 1, justifyContent: 'center', margin:40 }}>
        <View style={{flex:1, justifyContent:'center'}}>
          <Text h3 style={{ fontSize:36, textAlign: 'center', fontWeight:"bold" }}>No Internet connection...</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Image
              style={{ height: 300, width:300 }}
              source={{ uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/d8094059120725.5a15c9fa09761.gif' }}
          />
        </View>
        <View style={{ flex:1, justifyContent:'center'}}>
          <Text style={{ fontSize: 22, textAlign: 'center', margin:20 }}>Turn off flight mode, move to a different location, or
            change mobile phone provider...</Text>
        </View>
      </View>
  )
}

export default NoInternet
