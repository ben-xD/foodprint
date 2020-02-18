import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { Text, Button } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../store/Auth';


export default SignupOrRegister = ({ navigation }) => {
  const { signInWithGoogle, signInAnonymously } = React.useContext(AuthContext);
  const [isPressed, setIsPressed] = useState(false);

  const handleSignInWithGoogle = async () => {
    setIsPressed(true);
    await signInWithGoogle();
    setIsPressed(false);
  };

  const handleSignInAnonymously = async () => {
    setIsPressed(true);
    await signInAnonymously();
    setIsPressed(false);
  };

  return (
    <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <View style={{ position: 'absolute', top: 32, alignItems: 'center', marginTop: 32 }}>
        <Text h1>
          FoodPrint
        </Text>
      </View>
      <View style={{ width: '80%' }}>
        <View>
          <Button
            disabled={isPressed}
            iconContainerStyle={{ marginRight: 24 }}
            icon={
              <AntDesign
                style={{ paddingRight: 5 }}
                name="google"
                size={28}
                color="black"
              />
            }
            containerStyle={{ marginVertical: 8 }}
            buttonStyle={{ backgroundColor: 'white' }}
            titleStyle={{ fontSize: 24, color: 'black' }}
            title="Join using Google"
            onPress={handleSignInWithGoogle}
          />
          <Button
            disabled={isPressed}
            containerStyle={{ marginVertical: 8 }}
            buttonStyle={{ backgroundColor: 'green' }}
            titleStyle={{ fontSize: 24 }}
            title="Join using email"
            onPress={() => navigation.navigate('Signup')}
          />
          <View style={{ marginVertical: 12 }}>
            <Text style={{ fontSize: 18, textAlign: 'center', color: 'grey' }}>Existing user?</Text>
            <Button
              title="LOGIN"
              disabled={isPressed}
              titleStyle={{ color: 'green', fontSize: 24 }}
              onPress={() => navigation.navigate('Login')}
              type="clear"
            />
            <Button
              disabled={isPressed}
              title="skip"
              titleStyle={{ color: 'grey', fontSize: 24 }}
              onPress={handleSignInAnonymously}
              type="clear"
            />
          </View>
        </View>
      </View>
    </SafeAreaView >
  );
}
  ;
