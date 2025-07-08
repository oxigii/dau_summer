// src/screens/EntryScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { saveNickname } from '../utils/nicknameService';

export default function EntryScreen({ navigation }) {
  console.log('[🧭] EntryScreen 렌더링됨');
  console.log('[🧭] navigation:', navigation);
  console.log('[🧭] navigation.replace:', navigation?.replace);

  const [nickname, setNickname] = useState('');

  const handleEnter = async () => {
    if (!nickname.trim()) {
      Alert.alert('닉네임을 입력해주세요.');
      return;
    }
    await saveNickname(nickname.trim());
    navigation.replace('Home'); // ✅ 저장 후 홈으로 이동
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>닉네임을 입력하세요</Text>
      <TextInput
        placeholder="예: 익명여우52"
        value={nickname}
        onChangeText={setNickname}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 10,
          marginBottom: 16,
        }}
      />
      <Button title="입장하기" onPress={handleEnter} />
    </View>
  );
}