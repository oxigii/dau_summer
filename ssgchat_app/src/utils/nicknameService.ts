import AsyncStorage from '@react-native-async-storage/async-storage';

const NICKNAME_KEY = 'nickname';

const generateNickname = () => {
  const animals = ['펭귄', '여우', '호랑이', '너구리', '토끼'];
  const adjectives = ['익명', '귀여운', '조용한', '신속한', '반짝이는'];
  const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  return `${rand(adjectives)}${rand(animals)}${Math.floor(Math.random() * 100)}`;
};

export const getOrCreateNickname = async (): Promise<string> => {
  const saved = await AsyncStorage.getItem(NICKNAME_KEY);
  if (saved) return saved;

  const newNick = generateNickname();
  await AsyncStorage.setItem(NICKNAME_KEY, newNick);
  return newNick;
};

export const saveNickname = async (nickname: string): Promise<void> => {
  await AsyncStorage.setItem(NICKNAME_KEY, nickname);
};

export const resetNickname = async () => {
  await AsyncStorage.removeItem(NICKNAME_KEY);
};