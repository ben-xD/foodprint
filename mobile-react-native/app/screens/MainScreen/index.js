import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';

export default class MainScreen extends React.Component {
  render() {
    return (
      <View>
        <View style={styles.buttonView}>
          <Button
            title="Solid Button"
          />
        </View>
      </View>
    )
  }
}
