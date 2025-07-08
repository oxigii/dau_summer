import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import AuthAnonymousScreen from './src/screens/AuthAnonymousScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppNavigator userId={userId} nickname={nickname} />
      ) : (
        <AuthAnonymousScreen
          onAuthSuccess={(uid: string, nick: string) => {
            setUserId(uid);
            setNickname(nick);
            setIsAuthenticated(true);
          }}
        />
      )}
    </NavigationContainer>
  );
}