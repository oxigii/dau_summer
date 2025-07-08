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

// 🔹 네비게이션 파라미터 타입 정의
type RouteParams = {
  params: {
    spaceId: string;
  };
};

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const spaceId = route.params.spaceId;         // ✅ 실제 공간 ID로 교체 (동적)
  const userId = 'user123';                      // 익명 로그인 기반
  const nickname = '익명펭귄17';                 // 랜덤 닉네임 기반

  // ✅ 참가자 입장/퇴장 처리
  useFocusEffect(
    React.useCallback(() => {
      enterChatRoom(spaceId, userId, nickname);
      return () => exitChatRoom(spaceId, userId);
    }, [spaceId])
  );

  // ✅ 실시간 메시지 수신
  useEffect(() => {
    const unsubscribe = listenToMessages(spaceId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    return () => unsubscribe();
  }, [spaceId]);

  // ✅ 메시지 전송
  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      await sendMessage(spaceId, input.trim(), nickname);
      setInput('');
      Keyboard.dismiss(); // 키보드 닫기
    } catch (e) {
      console.error('전송 실패:', e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80} // 필요에 따라 조절 (헤더 높이 대응)
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

// --------------------------------------------------------------------------------

 // <View style={{ flex: 1, padding: 16, justifyContent: 'flex-end' }}>
    //   <FlatList
    //     data={messages}
    //     keyExtractor={(_, index) => index.toString()}
    //     renderItem={({ item }) => <Text>{item.sender}: {item.text}</Text>}
    //     style={{ marginBottom: 8, flex: 1 }}
    //   />
    //   <TextInput
    //     placeholder="메시지를 입력하세요."
    //     value={input}
    //     onChangeText={setInput}
    //     style={{
    //       borderWidth: 1,
    //       borderColor: '#ccc',
    //       padding: 8,
    //       marginBottom: 8,
    //     }}
    //   />
    //   <View style={{ marginBottom: 16 }}>
    //     <Button title="보내기" onPress={handleSend} />
    //   </View>
    // </View>