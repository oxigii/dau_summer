import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';
import { sendMessage, listenToMessages } from '../firebase/firestoreService';
import { enterChatRoom, exitChatRoom } from '../services/chatService';

type RouteParams = {
  params: {
    spaceId: string;
  };
};

export default function ChatScreen({ userId, nickname }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const spaceId = route.params.spaceId;

  useFocusEffect(
    React.useCallback(() => {
      enterChatRoom(spaceId, userId, nickname);
      return () => exitChatRoom(spaceId, userId);
    }, [spaceId, userId, nickname])
  );

  useEffect(() => {
    const unsubscribe = listenToMessages(spaceId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    return () => unsubscribe();
  }, [spaceId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      await sendMessage(spaceId, input.trim(), nickname);
      setInput('');
      Keyboard.dismiss();
    } catch (e) {
      console.error('전송 실패:', e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <View style={{ flex: 1, padding: 16, justifyContent: 'flex-end' }}>
        <FlatList
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={{ marginVertical: 4 }}>
              {item.sender}: {item.text}
            </Text>
          )}
          style={{ flex: 1, marginBottom: 8 }}
        />
        <TextInput
          placeholder="메시지를 입력하세요."
          value={input}
          onChangeText={setInput}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 8,
            borderRadius: 6,
            marginBottom: 8,
          }}
        />
        <View style={{ marginBottom: 16 }}>
          <Button title="보내기" onPress={handleSend} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
