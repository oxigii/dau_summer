import React from 'react';
import { SafeAreaView } from 'react-native';
import AuthAnonymousScreen from './src/screens/AuthAnonymousScreen';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AuthAnonymousScreen />
    </SafeAreaView>
  );
}
