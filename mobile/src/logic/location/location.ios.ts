import Geolocation from 'react-native-geolocation-service';
import { LocationType } from '../../types/LocationType';

const getLocation = (): Promise<LocationType> => {
  Geolocation.requestAuthorization();
  return new Promise((resolve, _) => {
    Geolocation.getCurrentPosition(info => {
      const { latitude, longitude } = info.coords;
      const { timestamp } = info
      resolve({
        latitude,
        longitude,
        timestamp
      })
    }).catch(err => console.error(err))
  });
  // TODO im requesting auth every time..
  // TODO Geolocation.stopObserving()?
};

export default getLocation;
