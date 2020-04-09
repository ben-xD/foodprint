import { Overlay } from 'react-native-elements';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { heightPercentageToDP as percentageHeight, widthPercentageToDP as percentageWidth } from 'react-native-responsive-screen';

const WelcomeScreen = ({ setVisibility, isVisible }) => {
  return (
    <Overlay isVisible={isVisible} onBackdropPress={() => setVisibility(false)}>
      <ScrollView>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Welcome to FoodPrint!</Text>
          <Text style={styles.text}>
            You can now know the carbon footprint of the food you buy simply by scanning its barcode or taking a picture
            of it!
     </Text>
          <Image
            source={require('../images/heart-eyes-smiley.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.text}>
            To get started, simply click on the Camera icon in the top left corner!
     </Text>
        </View>
      </ScrollView>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  contentContainer: { justifyContent: 'center', alignItems: 'center', margin: percentageWidth('4%'), marginBottom: 64 },
  text: { fontSize: percentageWidth('4%'), textAlign: 'center', margin: percentageHeight('3%') },
  title: { fontSize: percentageWidth('7%'), margin: percentageHeight('2%'), textAlign: 'center' },
  image: { height: percentageHeight('18%') },
});

export default WelcomeScreen;
