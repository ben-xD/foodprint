import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { LocationType } from '../../types/LocationType';

// For Android Dialog permissions: After SDK 23.
// More permissions at https://facebook.github.io/react-native/docs/permissionsandroid

// import requestLocationPermissions from '../../store/location.android';
// import Geolocation from 'react-native-geolocation-service';

const locationRequestConfig = {
    title: 'Fresla Location Permission',
    message: 'Enable location based meal suggestions.',
    buttonNeutral: 'Ask Me Later',
    buttonNegative: 'Cancel',
    buttonPositive: 'OK',
};

const requestLocationPermissions = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            locationRequestConfig,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.info('Location permissions granted.');
        } else {
            console.log('Location permissions denied.');
        }
    } catch (e) {
        console.error(e);
    }
};

const getLocation = async (): Promise<LocationType> => {
    await requestLocationPermissions();
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                const { timestamp } = position;
                resolve({ latitude, longitude, timestamp })
            },
            error => {
                // See error code charts below.
                reject(error);
                console.error(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    })
};

export default getLocation;
