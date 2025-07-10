import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { sendMessage, listenToMessages } from '../firebase/firebase/firestoreService';  // firestoreService에서 import
import { enterChatRoom, exitChatRoom } from '../services/chatService';

// 메시지 타입 정의
interface Message {
  sender: string;
  text: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);  // 메시지 배열의 타입 지정
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
    const unsubscribe = listenToMessages(spaceId, (newMessage: Message) => {  // newMessage의 타입을 명시
      setMessages((prev: Message[]) => [...prev, newMessage]);  // 메시지를 state에 추가
    });
    return () => unsubscribe();  // unsubscription
  }, []);  // 컴포넌트 마운트 시에만 실행

  // ✅ 메시지 전송
  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(spaceId, input.trim(), nickname);  // 메시지 전송
    setInput('');  // 입력란 초기화
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}  // keyExtractor로 고유 키 생성
        renderItem={({ item }) => (
          <Text>{item.sender}: {item.text}</Text>  // sender와 text를 출력
        )}
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
