import React from 'react';
import { View, Text, Button } from 'react-native';
import { useLocationTracker } from '../hooks/useLocationTracker'; // 🔹 추가

export default function HomeScreen({ navigation }) {
  useLocationTracker(); // ✅ 위치 추적 훅 실행 (앱 켜지면 자동 실행)

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Welcome to SsgChat!</Text>
      <Button title="Enter Chat" onPress={() => navigation.navigate('Chat')} />
    </View>
  );
}
