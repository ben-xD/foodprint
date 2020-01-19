import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';
import {
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';

setUpdateIntervalForType(SensorTypes.gyroscope, 100);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{x: 0, y: 0, z: 0, t: new Date().getUTCDate()}],
      tracking: false,
    };
  }

  start() {
    if (this.state.tracking) {
      alert('Already started!');
    } else {
      this.gyro_subscription = gyroscope.subscribe(({x, y, z, timestamp}) => {
        this.setState({
          history: this.state.history.concat({x, y: y, z: z, t: new Date().get()}),
          tracking: true,
        });
        console.log(this.state.history);
      });
    }
  }

  stop() {
    if (!this.state.tracking) {
      alert('Not started!');
    } else {
      alert('Stopped');
      this.gyro_subscription.unsubscribe();
      this.setState({tracking: false});
    }
  }

  render() {
    const history = this.state.history;
    const state = history[history.length - 1];
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button title="Start" onPress={() => this.start()} />
        <Button title="Stop" onPress={() => this.stop()} />
        <Text />
        <Text>Gyroscope values</Text>
        <Text />
        <Value name="t" value={state.t} />
        <Value name="x" value={state.x} />
        <Value name="y" value={state.y} />
        <Value name="z" value={state.z} />
      </View>
    );
  }
}

const Value = ({name, value}) => (
  <View>
    <Text>
      {name}: {String(value).substr(0, 8)}
    </Text>
  </View>
);
