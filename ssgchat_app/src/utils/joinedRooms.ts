import AsyncStorage from '@react-native-async-storage/async-storage';

const JOINED_KEY = 'joinedRooms';

export const addRoomToManualJoinList = async (spaceId: string) => {
  const stored = await AsyncStorage.getItem(JOINED_KEY);
  const list = stored ? JSON.parse(stored) : [];
  if (!list.includes(spaceId)) {
    list.push(spaceId);
    await AsyncStorage.setItem(JOINED_KEY, JSON.stringify(list));
  }
};

export const getManualJoinList = async (): Promise<string[]> => {
  const stored = await AsyncStorage.getItem(JOINED_KEY);
  return stored ? JSON.parse(stored) : [];
};