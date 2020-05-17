import React from 'react';
import { Button } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { widthPercentageToDP as percentageWidth, heightPercentageToDP as percentageHeight } from 'react-native-responsive-screen';
import { StyleSheet } from 'react-native';


const SignInWithAppleButton = ({ disabled, handleSignInWithApple }) => {
  return (
    <Button
      disabled={disabled}
      iconContainerStyle={styles.googleIconContainer}
      testID={'googleButton'}
      icon={
        <AntDesign
          style={styles.googleIcon}
          name="apple1"
          size={percentageWidth('5%')}
          color={disabled ? 'black' : 'white'}
        />
      }
      containerStyle={styles.googleContainer}
      buttonStyle={styles.google}
      titleStyle={styles.appleText}
      title="Sign in with Apple"
      onPress={handleSignInWithApple}
    />
  );
};

const styles = StyleSheet.create({
  googleContainer: { marginVertical: percentageHeight('1%') },
  google: { backgroundColor: 'black' },
  appleText: { fontSize: percentageWidth('5%'), color: 'white' },
  googleIconContainer: { marginRight: percentageHeight('5%') },
  googleIcon: { paddingRight: percentageWidth('3%') },
});

export default SignInWithAppleButton;


