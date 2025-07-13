import firestore from '@react-native-firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // ✅ 추가

// ✅ 채팅방 생성 (좌표 + uuid 기반 고유 ID)
export const createChatRoom = async (lat: number, lng: number): Promise<string> => {
  const spaceId = `${lat.toFixed(3)}_${lng.toFixed(3)}_${uuidv4()}`;
  const expiresAt = Date.now() + 86400000;

  await firestore().collection('spaces').doc(spaceId).set(
    {
      lat,
      lng,
      createdAt: firestore.FieldValue.serverTimestamp(),
      expiresAt,
    },
    { merge: true }
  );

  return spaceId;
};

// ✅ 메시지 전송
export const sendMessage = async (spaceId: string, text: string, nickname: string) => {
  await firestore().collection('spaces').doc(spaceId).collection('messages').add({
    text,
    sender: nickname,
    timestamp: firestore.FieldValue.serverTimestamp(),
    expiresAt: Date.now() + 86400000,
  });
};

// ✅ 실시간 수신
export const listenToMessages = (spaceId: string, onMessage) => {
  return firestore()
    .collection('spaces')
    .doc(spaceId)
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .onSnapshot(snapshot => {
      const now = Date.now();
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          if (data.expiresAt > now) {
            onMessage({ id: change.doc.id, ...data });
          }
        }
      });
    });
};

// ✅ 참가자 입장
export const joinChatRoom = async (spaceId, userId, nickname) => {
  await firestore()
    .collection('spaces')
    .doc(spaceId)
    .collection('participants')
    .doc(userId)
    .set({
      nickname,
      joinedAt: firestore.FieldValue.serverTimestamp(),
    });
};

// ✅ 참가자 퇴장
export const leaveChatRoom = async (spaceId, userId) => {
  await firestore()
    .collection('spaces')
    .doc(spaceId)
    .collection('participants')
    .doc(userId)
    .delete();
};

// ✅ recentUsers 저장
export const updateRecentUser = async (userId, spaceId, deviceToken) => {
  await firestore().collection('recentUsers').doc(userId).set(
    {
      space_id: spaceId,
      deviceToken,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
};

// ✅ 최근 사용자 조회
export const getRecentUsersInSpace = async (spaceId) => {
  const now = Date.now();
  const fiveMinutesAgo = new Date(now - 5 * 60 * 1000);

  const snapshot = await firestore()
    .collection('recentUsers')
    .where('space_id', '==', spaceId)
    .where('updatedAt', '>', fiveMinutesAgo)
    .get();

  return snapshot.docs.map(doc => doc.data());
};

//=================================================================================
// // 의견 조율 전 코드
// import firestore from '@react-native-firebase/firestore';

// // ✅ 채팅방 생성 (expiresAt 포함)
// export const createChatRoom = async (spaceId: string) => {
//   const expiresAt = Date.now() + 86400000;
//   await firestore().collection('spaces').doc(spaceId).set(
//     {
//       createdAt: firestore.FieldValue.serverTimestamp(),
//       expiresAt,
//     },
//     { merge: true }
//   );
// };

// // ✅ 메시지 전송
// export const sendMessage = async (spaceId: string, text: string, nickname: string) => {
//   await firestore().collection('spaces').doc(spaceId).collection('messages').add({
//     text,
//     sender: nickname,
//     timestamp: firestore.FieldValue.serverTimestamp(),
//     expiresAt: Date.now() + 86400000,
//   });
// };

// // ✅ 실시간 수신
// export const listenToMessages = (spaceId: string, onMessage) => {
//   return firestore()
//     .collection('spaces')
//     .doc(spaceId)
//     .collection('messages')
//     .orderBy('timestamp', 'asc')
//     .onSnapshot(snapshot => {
//       const now = Date.now();
//       snapshot.docChanges().forEach(change => {
//         if (change.type === 'added') {
//           const data = change.doc.data();
//           if (data.expiresAt > now) {
//             onMessage({ id: change.doc.id, ...data });
//           }
//         }
//       });
//     });
// };

// // ✅ 참가자 입장
// export const joinChatRoom = async (spaceId, userId, nickname) => {
//   await firestore()
//     .collection('spaces')
//     .doc(spaceId)
//     .collection('participants')
//     .doc(userId)
//     .set({
//       nickname,
//       joinedAt: firestore.FieldValue.serverTimestamp(),
//     });
// };

// // ✅ 참가자 퇴장
// export const leaveChatRoom = async (spaceId, userId) => {
//   await firestore()
//     .collection('spaces')
//     .doc(spaceId)
//     .collection('participants')
//     .doc(userId)
//     .delete();
// };

// // ✅ recentUsers 저장
// export const updateRecentUser = async (userId, spaceId, deviceToken) => {
//   await firestore().collection('recentUsers').doc(userId).set(
//     {
//       space_id: spaceId,
//       deviceToken,
//       updatedAt: firestore.FieldValue.serverTimestamp(),
//     },
//     { merge: true }
//   );
// };

// // ✅ 최근 사용자 조회
// export const getRecentUsersInSpace = async (spaceId) => {
//   const now = Date.now();
//   const fiveMinutesAgo = new Date(now - 5 * 60 * 1000);

//   const snapshot = await firestore()
//     .collection('recentUsers')
//     .where('space_id', '==', spaceId)
//     .where('updatedAt', '>', fiveMinutesAgo)
//     .get();

//   return snapshot.docs.map(doc => doc.data());
// };