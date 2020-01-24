import React, {useEffect, useState} from 'react';
import {View, Linking, FlatList, StyleSheet} from 'react-native';
import {Button, ListItem} from 'react-native-elements';
import {LocationType} from '../types/LocationType';
import getLocation from '../logic/location/location';
import {SafeAreaView} from 'react-native-safe-area-context';

interface Props {}

let timerID: number;

const Location: React.FC<Props> = () => {
  const [location, setLocation] = useState<LocationType | undefined>(undefined);
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [locationLogging, setLocationLogging] = useState<boolean>(false);

  const clear = () => {
    setLocation(undefined);
    setLocations([]);
  };

  const setCurrentLocation = async () => {
    console.log('Getting current location');
    const location = await getLocation();
    setLocation(location);
    setLocations(locations => [...locations, location]);
  };

  const uploadLocationData = () => {
    // TODO send post request to backend
    console.log(locations);
    console.warn('Unimplemented, but see logs for json object.');
  };

  const openBrowser = (url: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  useEffect(() => {
    const logLocation = async () => {
      console.log({timerID});
      if (!locationLogging) {
        if (timerID) {
          clearInterval(timerID);
        }
      } else {
        setCurrentLocation();
        timerID = setInterval(setCurrentLocation, 1000);
      }
    };

    logLocation();

    return () => {
      // clean up logger
    };
  }, [locationLogging]);

  return (
    <SafeAreaView>
      <Button
        containerStyle={styles.button}
        title={'Log once'}
        onPress={setCurrentLocation}
      />
      <View style={styles.buttonRow}>
        <Button
          containerStyle={styles.button}
          title={'Start location logging'}
          onPress={() => setLocationLogging(true)}
        />
        <Button
          containerStyle={styles.button}
          title={'Stop location logging'}
          onPress={() => setLocationLogging(false)}
        />
      </View>
      {location ? (
        <>
          <View style={styles.buttonRow}>
            <Button
              containerStyle={styles.button}
              title={'Clear'}
              onPress={clear}
            />
            <Button
              containerStyle={styles.button}
              title={'Upload to Fresla.co'}
              onPress={uploadLocationData}
            />
          </View>
          <Button
            containerStyle={styles.button}
            title="Open map"
            onPress={() =>
              openBrowser(
                `https://www.google.com/maps/@${location.latitude},${location.longitude},15z`,
              )
            }
          />
        </>
      ) : (
        <></>
      )}
      <FlatList
        nestedScrollEnabled={true}
        keyExtractor={(item, index) => index.toString()}
        data={locations}
        renderItem={({item}) => (
          <ListItem
            bottomDivider
            topDivider
            title={`${item.latitude}, ${item.longitude}`}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Location;

const styles = StyleSheet.create({
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonRow: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  button: {
    margin: 8,
  },
  location: {
    fontSize: 24,
  },
});
