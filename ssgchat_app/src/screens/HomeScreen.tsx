import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>Welcome to SsukChat!</Text>
      <Button title="Enter Chat" onPress={() => navigation.navigate('Chat')} />
    </View>
  );
}
