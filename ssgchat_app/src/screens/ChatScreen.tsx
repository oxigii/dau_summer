import React from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';

export default function ChatScreen() {
  return (
    <View>
      <FlatList data={[]} renderItem={({ item }) => <Text>{item.text}</Text>} />
      <TextInput placeholder="Enter message..." />
      <Button title="Send" onPress={() => {}} />
    </View>
  );
}
