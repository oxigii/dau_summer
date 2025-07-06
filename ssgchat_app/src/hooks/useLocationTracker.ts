import { useEffect } from 'react';
import * as Location from 'expo-location';
import { saveRecentUser } from '../services/userService';
import { getSpaceId } from '../utils/getSpaceId';

const userId = 'user123';
const deviceToken = 'abc123';
const updateInterval = 10000;

export const useLocationTracker = () => {
  useEffect(() => {
    let intervalId;

    const trackLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const spaceId = getSpaceId(latitude, longitude);

      await saveRecentUser(userId, spaceId, deviceToken);
    };

    trackLocation();
    intervalId = setInterval(trackLocation, updateInterval);

    return () => clearInterval(intervalId);
  }, []);
};