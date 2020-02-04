import React, {useState} from 'react';
import { View, Image } from 'react-native';
import {Text, Button, Rating, Overlay, Input} from 'react-native-elements';



export default Feedback = ({ navigation }) => {

  const [isVisible, setVisibility] = useState(false);

  function calculateRating(carbonFootprint) {
    if (carbonFootprint < 4) {
      return 5;
    } else if (carbonFootprint < 8) {
      return 4;
    } else if (carbonFootprint < 12) {
      return 3;
    } else if (carbonFootprint < 16) {
      return 2;
    } else if (carbonFootprint < 20) {
      return 1;
    } else {
      return 0;
    }
  };


  return (
      <View style={{ flex: 1 }}>


        <Overlay
            isVisible={isVisible}
            onBackdropPress={() => setVisibility(false)}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection:'row', flex: 2, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{flex:1}}/>
              <Text h3 style={{flex:5, textAlign:'center'}}>We're sorry we couldn't find your item...</Text>
              <View style={{flex:1}}/>
            </View>
            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center'  }}>
              <Image
                  style={{height: 200, width:200}}
                  source={{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/fc4a1059120725.5a15c9fa08f78.gif'}}
              />
            </View>
            <View style={{ flexDirection:'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{flex:1}}/>
              <Text style={{ fontSize: 18, flex:4, textAlign:'center'}}>Let us know what it was, so we can improve our app:</Text>
              <View style={{flex:1}}/>
            </View>
            <View style={{ flex: 1.5, flexDirection: 'row' }}>
              <View style={{ flex: 1 }} />
              <View style={{ flex: 4, flexDirection: 'column', justifyContent:'center' }}>
                <Input
                    placeholder="e.g. Cucumber"
                />
                <View style={{height:20}}/>
                <Button
                    buttonStyle={{ backgroundColor: 'green' }}
                    titleStyle={{ fontSize: 24 }}
                    title="Submit"
                    onPress={() => alert('Implement')}
                />
                <View style={{height:50}}/>
              </View>
              <View style={{ flex: 1 }} />
            </View>
          </View>
        </Overlay>


        <View style={{ flex: 1}}/>
        <View style={{ flex: 3.5, alignItems: 'center', justifyContent: 'center', backgroundColor: "white"  }}>
          <Image
              style={{height: 200, width:200}}
              source={{uri: 'https://www.fifteenspatulas.com/wp-content/uploads/2018/07/How-to-Cut-Cabbage-Fifteen-Spatulas-1-640x427.jpg'}}
          />
          <View style={{height: 10}}/>
          <Text h2>Name</Text>
          <View style={{height: 10}}/>
          <Rating
              readonly
              startingValue= {calculateRating(13)}
          />
          <View style={{height: 10}}/>
          <Text style={{fontSize: 18}}>13 kg of CO2 eq/kg</Text>
        </View>
        <View style={{ flex: 0.5}}/>
        <View style={{ flex: 2, flexDirection: 'row'  }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 4, flexDirection: 'column' }}>
            <Button
                buttonStyle={{ backgroundColor: 'darkred' }}
                titleStyle={{ fontSize: 24 }}
                title="This isn't my item..."
                onPress={() => setVisibility(true)}
            />
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </View>
  );
}
