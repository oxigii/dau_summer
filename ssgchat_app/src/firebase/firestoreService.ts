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

// 메시지 전송
export const sendMessage = async (spaceId: string, text: string, nickname: string) => {
  await addDoc(collection(db, `spaces/${spaceId}/messages`), {
    text,
    sender: nickname,
    timestamp: serverTimestamp(),
    expiresAt: Date.now() + 86400000
  });
};

// 메시지 실시간 수신
export const listenToMessages = (spaceId, onMessage) => {
  const q = query(
    collection(db, `spaces/${spaceId}/messages`),
    orderBy('timestamp', 'asc')
  );
  return onSnapshot(q, snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        onMessage({ id: change.doc.id, ...change.doc.data() });
      }
    });
  });
};

// 참가자 입장
export const joinChatRoom = async (spaceId, userId, nickname) => {
  await setDoc(doc(db, `spaces/${spaceId}/participants/${userId}`), {
    nickname,
    joinedAt: serverTimestamp()
  });
};

// 참가자 퇴장
export const leaveChatRoom = async (spaceId, userId) => {
  await deleteDoc(doc(db, `spaces/${spaceId}/participants/${userId}`));
};

// recentUsers 업데이트
export const updateRecentUser = async (userId, spaceId, deviceToken) => {
  await setDoc(doc(db, `recentUsers/${userId}`), {
    space_id: spaceId,
    deviceToken,
    updatedAt: serverTimestamp()
  });
};

// 최근 5분 내 사용자 조회
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