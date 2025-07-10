import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';

const AuthAnonymousScreen = ({ onAuthSuccess }) => {
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        onAuthSuccess();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const userCredential = await auth().signInAnonymously();
      console.log('Signed in anonymously:', userCredential.user);
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