import React from 'react';
import { View, Text, Button } from 'react-native';
import { useLocationTracker } from '../hooks/useLocationTracker';

export default function HomeScreen({ navigation }) {
  useLocationTracker(); // 위치 추적 실행

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Welcome to SsgChat!</Text>
      <Button title="Enter Chat" onPress={() => navigation.navigate('Chat')} />
    </View>
  );
}
