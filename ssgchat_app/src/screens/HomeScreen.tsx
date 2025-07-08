// 협업 파트 임시로 구현

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useLocationTracker } from '../hooks/useLocationTracker';

import auth from '@react-native-firebase/auth'; // ✅ Firebase Auth 추가
import messaging from '@react-native-firebase/messaging'; // ✅ FCM 추가
import { getOrCreateNickname } from '../utils/nicknameService'; // ✅ 닉네임 영구 저장 유틸

export default function HomeScreen({ navigation }) {
  const [rooms, setRooms] = useState([]);
  const [ready, setReady] = useState(false); // ✅ 모든 값 초기화 완료 여부
  const [userId, setUserId] = useState('');
  const [deviceToken, setDeviceToken] = useState('');
  const [nickname, setNickname] = useState(''); // ✅ 상태로 관리

  // ✅ 최초 실행 시 userId, deviceToken, nickname 준비
  useEffect(() => {
    const init = async () => {
      const authUser = await auth().signInAnonymously(); // ✅ 익명 로그인
      const token = await messaging().getToken();         // ✅ FCM 토큰 발급
      const nick = await getOrCreateNickname();           // ✅ 닉네임 불러오기 (없으면 생성 후 저장)

      setUserId(authUser.user.uid);
      setDeviceToken(token);
      setNickname(nick);
      setReady(true); // ✅ 모든 정보가 준비되었을 때만 위치 추적 시작
    };
    init();
  }, []);

  // ✅ 위치 추적 실행 (모든 값 준비된 경우에만 실행)
  if (ready) {
    useLocationTracker(userId, nickname, deviceToken); // ✅ 위치 바뀌면 채팅방 퇴장/입장 + recentUsers 갱신
  }

  // ✅ 실시간 채팅방 목록 수신
  useEffect(() => {
    const q = query(collection(db, 'spaces'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roomList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomList); // ✅ 채팅방 리스트 화면에 표시
    });

    return () => unsubscribe(); // ✅ 화면 나갈 때 수신 해제
  }, []);

  // ✅ 채팅방 목록 렌더링
  const renderRoom = ({ item }) => (
    <TouchableOpacity
      style={{
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
      }}
      onPress={() => navigation.navigate('Chat', { spaceId: item.id })} // ✅ 채팅방 ID를 넘겨 이동
    >
      <Text style={{ fontSize: 16 }}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Welcome to SsgChat!</Text>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={renderRoom}
      />
    </View>
  );
}