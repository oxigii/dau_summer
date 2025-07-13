import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useLocationTracker } from '../hooks/useLocationTracker';
import { usePushNotifications } from '../hooks/usePushNotifications';

import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import { getOrCreateNickname } from '../utils/nicknameService';
import { createChatRoom } from '../firebase/firestoreService';
import { addRoomToManualJoinList, getManualJoinList } from '../utils/joinedRooms';
import * as Location from 'expo-location';

export default function HomeScreen({ navigation }) {
  const [rooms, setRooms] = useState([]);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState('');
  const [deviceToken, setDeviceToken] = useState('');
  const [nickname, setNickname] = useState('');

  usePushNotifications(navigation);

  useEffect(() => {
    const init = async () => {
      const authUser = await auth().signInAnonymously();
      const token = await messaging().getToken();
      const nick = await getOrCreateNickname();

      setUserId(authUser.user.uid);
      setDeviceToken(token);
      setNickname(nick);
      setReady(true);
    };
    init();
  }, []);

  if (ready) {
    useLocationTracker(userId, nickname, deviceToken);
  }

  useEffect(() => {
    const q = query(collection(db, 'spaces'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const roomList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const manualRooms = await getManualJoinList();
      const filtered = roomList.filter((room) => manualRooms.includes(room.id));
      setRooms(filtered);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateRoom = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('위치 권한이 필요합니다.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const spaceId = await createChatRoom(latitude, longitude);

      await addRoomToManualJoinList(spaceId);
      navigation.navigate('Chat', { spaceId });
    } catch (err) {
      console.error('방 생성 실패:', err);
    }
  };

  const renderRoom = ({ item }) => (
    <TouchableOpacity
      style={{
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
      }}
      onPress={() => navigation.navigate('Chat', { spaceId: item.id })}
    >
      <Text style={{ fontSize: 16 }}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>내가 들어간 채팅방 목록</Text>
      <Button title="채팅방 생성하기" onPress={handleCreateRoom} />
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={renderRoom}
      />
    </View>
  );
}

//=================================================================================
// // 의견 조율 전 코드
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity } from 'react-native';
// import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
// import { db } from '../firebase/firebaseConfig';
// import { useLocationTracker } from '../hooks/useLocationTracker';
// import { usePushNotifications } from '../hooks/usePushNotifications'; // ✅ 통합된 푸시 핸들러

// import auth from '@react-native-firebase/auth';
// import messaging from '@react-native-firebase/messaging';
// import { getOrCreateNickname } from '../utils/nicknameService';

// export default function HomeScreen({ navigation }) {
//   const [rooms, setRooms] = useState([]);
//   const [ready, setReady] = useState(false);
//   const [userId, setUserId] = useState('');
//   const [deviceToken, setDeviceToken] = useState('');
//   const [nickname, setNickname] = useState('');

//   // ✅ 푸시 권한 요청 및 알림 클릭 시 팝업 처리
//   usePushNotifications(navigation);

//   useEffect(() => {
//     const init = async () => {
//       const authUser = await auth().signInAnonymously();
//       const token = await messaging().getToken();
//       const nick = await getOrCreateNickname();

//       setUserId(authUser.user.uid);
//       setDeviceToken(token);
//       setNickname(nick);
//       setReady(true);
//     };
//     init();
//   }, []);

//   // ✅ 위치 추적 시작
//   if (ready) {
//     useLocationTracker(userId, nickname, deviceToken);
//   }

//   // ✅ 채팅방 목록 실시간 수신
//   useEffect(() => {
//     const q = query(collection(db, 'spaces'), orderBy('createdAt', 'desc'));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const roomList = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setRooms(roomList);
//     });

//     return () => unsubscribe();
//   }, []);

//   // ✅ 채팅방 렌더링
//   const renderRoom = ({ item }) => (
//     <TouchableOpacity
//       style={{
//         padding: 12,
//         borderBottomWidth: 1,
//         borderColor: '#ccc',
//       }}
//       onPress={() => navigation.navigate('Chat', { spaceId: item.id })}
//     >
//       <Text style={{ fontSize: 16 }}>{item.id}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={{ padding: 20, flex: 1 }}>
//       <Text style={{ fontSize: 20, marginBottom: 10 }}>Welcome to SsgChat!</Text>
//       <FlatList
//         data={rooms}
//         keyExtractor={(item) => item.id}
//         renderItem={renderRoom}
//       />
//     </View>
//   );
// }