import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useLocationTracker } from '../hooks/useLocationTracker';

export default function HomeScreen({ navigation }) {
  const [rooms, setRooms] = useState([]);

  const [userReady, setUserReady] = useState(false);
  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');

  // 닉네임 랜덤 생성
  const generateNickname = () => {
    const animals = ['펭귄', '여우', '호랑이', '너구리', '토끼'];
    const adj = ['궁금한', '귀여운', '조용한', '신속한', '반짝이는'];
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return `${rand(adj)}${rand(animals)}${Math.floor(Math.random() * 100)}`;
  };

  // 익명 로그인 + 준비
  useEffect(() => {
    const init = async () => {
      try {
        const userCredential = await auth().signInAnonymously();
        setUserId(userCredential.user.uid);
        setNickname(generateNickname());
        setUserReady(true);
      } catch (error) {
        console.error('익명 로그인 실패:', error);
      }
    };
    init();
  }, []);

  // 위치 추적 시작
  useEffect(() => {
    if (userReady) {
      useLocationTracker(userId, nickname);
    }
  }, [userReady]);

  // Firestore에서 공간 목록 받아오기
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('spaces')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const roomList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(roomList);
      });

    return () => unsubscribe();
  }, []);

  const renderRoom = ({ item }) => (
    <TouchableOpacity
      style={{
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc'
      }}
      onPress={() => navigation.navigate('Chat', { spaceId: item.id })}
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


// --------------------------------------------------------------------------------

// 협업 파트 임시로 구현

// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity } from 'react-native';
// import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
// import { db } from '../firebase/firebaseConfig';
// import { useLocationTracker } from '../hooks/useLocationTracker';

// import auth from '@react-native-firebase/auth'; // ✅ Firebase Auth 추가
// import messaging from '@react-native-firebase/messaging'; // ✅ FCM 추가

// export default function HomeScreen({ navigation }) {
//   const [rooms, setRooms] = useState([]);
//   const [ready, setReady] = useState(false); // ✅ 모든 값 초기화 완료 여부
//   const [userId, setUserId] = useState('');
//   const [deviceToken, setDeviceToken] = useState('');
//   const [nickname] = useState(() => generateNickname()); // ✅ 랜덤 닉네임 생성

//   // ✅ 랜덤 닉네임 생성 함수 (간단 예시)
//   const generateNickname = () => {
//     const animals = ['펭귄', '여우', '호랑이', '너구리', '토끼'];
//     const adj = ['익명', '귀여운', '조용한', '신속한', '반짝이는'];
//     const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
//     return `${rand(adj)}${rand(animals)}${Math.floor(Math.random() * 100)}`;
//   };

//   // ✅ 최초 실행 시 userId, token 준비
//   useEffect(() => {
//     const init = async () => {
//       const authUser = await auth().signInAnonymously(); // ✅ 익명 로그인
//       const token = await messaging().getToken(); // ✅ deviceToken 받기
//       setUserId(authUser.user.uid);
//       setDeviceToken(token);
//       setReady(true); // ✅ 모든 값 준비 완료
//     };
//     init();
//   }, []);

//   // ✅ 위치 추적 실행 (userId, nickname, token 준비된 경우에만)
//   if (ready) {
//     useLocationTracker(userId, nickname, deviceToken); // ✅ 실행
//   }

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

//   const renderRoom = ({ item }) => (
//     <TouchableOpacity
//       style={{
//         padding: 12,
//         borderBottomWidth: 1,
//         borderColor: '#ccc'
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