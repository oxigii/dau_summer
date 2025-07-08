import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import AuthAnonymousScreen from './src/screens/AuthAnonymousScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppNavigator />
      ) : (
        <AuthAnonymousScreen onAuthSuccess={() => setIsAuthenticated(true)} />
      )}
    </NavigationContainer>
  );
}
