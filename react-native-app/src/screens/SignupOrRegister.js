import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-elements';
import Config from 'react-native-config';


export default SignupOrRegister = ({ navigation }) => {
  // const signInWithGoogle = () => {
  //   console.log('Google sign in not implemented');
  // };

  return (
    <View style={{ flex:1, alignItems: 'center' }}>
      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 150 }}>
        <Text h1>
          FoodPrint
        </Text>
      </View>
      <View style={{ width: '80%', position:'absolute', bottom:100 }}>
        <View>
          {/* <Button
            containerStyle={{ marginVertical: 8 }}
            buttonStyle={{ backgroundColor: 'grey' }}
            titleStyle={{ fontSize: 24 }}
            title="Login with Google"
            onPress={() => signInWithGoogle()}
          /> */}
          <Button
            containerStyle={{ marginVertical: 8 }}
            buttonStyle={{ backgroundColor: 'green' }}
            titleStyle={{ fontSize: 24 }}
            title="Register"
            onPress={() => navigation.navigate('Signup')}
          />
          <Button
            title="Log in"
            titleStyle={{ color: 'green', fontSize: 24 }}
            onPress={() => navigation.navigate('Login')}
            type="clear"
          />
        </View>
      </View>
    </View >
  );
}
  ;
