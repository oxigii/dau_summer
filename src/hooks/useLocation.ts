import * as Location from 'expo-location';
import { getSpaceId } from '../utils/getSpaceId';

export const getCurrentSpaceId = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;

  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;
  return getSpaceId(latitude, longitude);
};
