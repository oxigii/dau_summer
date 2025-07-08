import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  deleteDoc,
  doc,
  getDocs,
  where
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// ✅ 채팅방 생성 (expiresAt 포함)
export const createChatRoom = async (spaceId: string) => {
  const expiresAt = new Date(Date.now() + 86400000); // 24시간 후
  await setDoc(doc(db, `spaces/${spaceId}`), {
    createdAt: serverTimestamp(),
    expiresAt
  }, { merge: true });
};

// ✅ 메시지 전송 (expiresAt 필드 포함)
export const sendMessage = async (spaceId: string, text: string, nickname: string) => {
  await addDoc(collection(db, `spaces/${spaceId}/messages`), {
    text,
    sender: nickname,
    timestamp: serverTimestamp(),
    expiresAt: Date.now() + 86400000 // ✅ TTL용 필드 포함
  });
};

// ✅ 메시지 실시간 수신 (expiresAt 필터링 추가됨)
export const listenToMessages = (spaceId, onMessage) => {
  const q = query(
    collection(db, `spaces/${spaceId}/messages`),
    orderBy('timestamp', 'asc')
  );
  return onSnapshot(q, snapshot => {
    const now = Date.now(); // ✅ 현재 시각 기준 TTL 비교
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        const data = change.doc.data();
        if (data.expiresAt > now) { // ✅ TTL 만료된 메시지 제외
          onMessage({ id: change.doc.id, ...data });
        }
      }
    });
  });
};

// ✅ 참가자 입장
export const joinChatRoom = async (spaceId, userId, nickname) => {
  await setDoc(doc(db, `spaces/${spaceId}/participants/${userId}`), {
    nickname,
    joinedAt: serverTimestamp()
  });
};

// ✅ 참가자 퇴장
export const leaveChatRoom = async (spaceId, userId) => {
  await deleteDoc(doc(db, `spaces/${spaceId}/participants/${userId}`));
};

// ✅ recentUsers 업데이트 (deviceToken 저장 추가됨)
export const updateRecentUser = async (userId, spaceId, deviceToken) => {
  await setDoc(doc(db, `recentUsers/${userId}`), {
    space_id: spaceId,
    deviceToken, // ✅ 새로 추가된 필드
    updatedAt: serverTimestamp()
  });
};

// ✅ 최근 5분 내 사용자 조회 (변경 없음)
export const getRecentUsersInSpace = async (spaceId) => {
  const now = Date.now();
  const fiveMinutesAgo = new Date(now - 5 * 60 * 1000);

  const q = query(
    collection(db, 'recentUsers'),
    where('space_id', '==', spaceId),
    where('updatedAt', '>', fiveMinutesAgo)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
};

// --------------------------------------------------------------------------------

// 수정 전(위의 코드가 안 될 시 테스트용)

// import {
//   collection,
//   addDoc,
//   serverTimestamp,
//   query,
//   orderBy,
//   onSnapshot,
//   setDoc,
//   deleteDoc,
//   doc,
//   getDocs,
//   where
// } from 'firebase/firestore';
// import { db } from './firebaseConfig';

// // ✅ 채팅방 생성 (expiresAt 포함)
// export const createChatRoom = async (spaceId: string) => {
//   const expiresAt = new Date(Date.now() + 86400000); // 24시간 후
//   await setDoc(doc(db, `spaces/${spaceId}`), {
//     createdAt: serverTimestamp(),
//     expiresAt
//   }, { merge: true });
// };

// // 메시지 전송
// export const sendMessage = async (spaceId: string, text: string, nickname: string) => {
//   await addDoc(collection(db, `spaces/${spaceId}/messages`), {
//     text,
//     sender: nickname,
//     timestamp: serverTimestamp(),
//     expiresAt: Date.now() + 86400000
//   });
// };

// // 메시지 실시간 수신
// export const listenToMessages = (spaceId, onMessage) => {
//   const q = query(
//     collection(db, `spaces/${spaceId}/messages`),
//     orderBy('timestamp', 'asc')
//   );
//   return onSnapshot(q, snapshot => {
//     snapshot.docChanges().forEach(change => {
//       if (change.type === 'added') {
//         onMessage({ id: change.doc.id, ...change.doc.data() });
//       }
//     });
//   });
// };

// // 참가자 입장
// export const joinChatRoom = async (spaceId, userId, nickname) => {
//   await setDoc(doc(db, `spaces/${spaceId}/participants/${userId}`), {
//     nickname,
//     joinedAt: serverTimestamp()
//   });
// };

// // 참가자 퇴장
// export const leaveChatRoom = async (spaceId, userId) => {
//   await deleteDoc(doc(db, `spaces/${spaceId}/participants/${userId}`));
// };

// // recentUsers 업데이트
// export const updateRecentUser = async (userId, spaceId, deviceToken) => {
//   await setDoc(doc(db, `recentUsers/${userId}`), {
//     space_id: spaceId,
//     deviceToken,
//     updatedAt: serverTimestamp()
//   });
// };

// // 최근 5분 내 사용자 조회
// export const getRecentUsersInSpace = async (spaceId) => {
//   const now = Date.now();
//   const fiveMinutesAgo = new Date(now - 5 * 60 * 1000);

//   const q = query(
//     collection(db, 'recentUsers'),
//     where('space_id', '==', spaceId),
//     where('updatedAt', '>', fiveMinutesAgo)
//   );

//   const snapshot = await getDocs(q);
//   return snapshot.docs.map(doc => doc.data());
// };