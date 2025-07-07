// App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { useLocationTracker } from './src/hooks/useLocationTracker'; // 상대 경로로 맞춰서 import

export default function App() {
  useLocationTracker(); // 위치 추적 시작

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}