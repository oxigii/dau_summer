import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { useLocationTracker } from './src/hooks/useLocationTracker';
import { requestUserPermission, onMessageListener } from './src/firebase/messagingService';

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);

  useLocationTracker(); // 위치 추적 시작

  useEffect(() => {
    const getPermission = async () => {
      const permission = await requestUserPermission();
      setHasPermission(permission);
    };

    getPermission();
    onMessageListener(); // FCM 리스너
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
