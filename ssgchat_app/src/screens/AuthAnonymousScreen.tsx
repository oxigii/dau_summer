import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { getOrCreateNickname } from '../utils/nicknameService';

const AuthAnonymousScreen = ({ onAuthSuccess }) => {
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        const nickname = await getOrCreateNickname();
        onAuthSuccess(user.uid, nickname); // ✅ uid와 nickname 전달
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const userCredential = await auth().signInAnonymously();
      const uid = userCredential.user.uid;
      const nickname = await getOrCreateNickname();
      onAuthSuccess(uid, nickname); // ✅ 직접 호출에서도 전달
    } catch (error) {
      console.error('Error signing in anonymously:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>환영합니다! 익명으로 로그인 중입니다.</Text>
      <Button title="익명으로 로그인" onPress={handleSignIn} />
    </View>
  );
};

export default AuthAnonymousScreen;