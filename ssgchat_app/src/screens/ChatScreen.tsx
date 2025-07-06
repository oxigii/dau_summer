import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { sendMessage, listenToMessages } from '../firebase/firestoreService';
import { enterChatRoom, exitChatRoom } from '../services/chatService';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const spaceId = 'space_demo_001';       // 실제 공간 ID로 교체 가능
  const userId = 'user123';               // 익명 로그인 기반
  const nickname = '익명펭귄17';          // 랜덤 닉네임 생성 기반

  // ✅ 참가자 입장/퇴장 처리 (useFocusEffect 사용)
  useFocusEffect(
    React.useCallback(() => {
      enterChatRoom(spaceId, userId, nickname); // 입장 처리
      return () => exitChatRoom(spaceId, userId); // 퇴장 처리
    }, [])
  );

  // ✅ 실시간 메시지 수신
  useEffect(() => {
    const unsubscribe = listenToMessages(spaceId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    return () => unsubscribe();
  }, []);

  // ✅ 메시지 전송
  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(spaceId, input.trim(), nickname);
    setInput('');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <Text>{item.sender}: {item.text}</Text>}
        style={{ marginBottom: 8 }}
      />
      <TextInput
        placeholder="메시지를 입력하세요."
        value={input}
        onChangeText={setInput}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginBottom: 8,
        }}
      />
      <Button title="보내기" onPress={handleSend} />
    </View>
  );
}