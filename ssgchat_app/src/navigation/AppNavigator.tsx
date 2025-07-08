import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import EntryScreen from '../screens/EntryScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator({ userId, nickname }) {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Chat"
        children={(props) => (
          <ChatScreen {...props} userId={userId} nickname={nickname} />
        )}
      />
      <Stack.Screen name="Entry" component={EntryScreen} />
    </Stack.Navigator>
  );
}
