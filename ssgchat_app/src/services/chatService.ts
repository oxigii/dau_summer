import {
  sendMessage,
  listenToMessages,
  joinChatRoom,
  leaveChatRoom,
  createChatRoom
} from '../firebase/firestoreService';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// 메시지 전송
export const sendChat = async (spaceId, message, nickname) => {
  return sendMessage(spaceId, message, nickname);
};

// 메시지 수신 연결
export const subscribeToChat = (spaceId, onMessage) => {
  return listenToMessages(spaceId, onMessage);
};

// ✅ 채팅방 입장 시 → 방 생성 + 참가자 등록
export const enterChatRoom = async (spaceId, userId, nickname) => {
  await createChatRoom(spaceId); // 💡 expiresAt 설정 포함
  return joinChatRoom(spaceId, userId, nickname);
};

// 채팅방 퇴장
export const exitChatRoom = async (spaceId, userId) => {
  return leaveChatRoom(spaceId, userId);
};

// 최근 사용자 갱신
export const updateRecentUser = async (spaceId, userId) => {
  const ref = doc(db, 'chatRooms', spaceId);
  await updateDoc(ref, {
    [`recentUsers.${userId}`]: Date.now(),
  });
};

// 참가자 제거
export const removeParticipant = async (spaceId, userId) => {
  await exitChatRoom(spaceId, userId);
};

// 참가자 추가
export const addParticipant = async (spaceId, userId, nickname) => {
  await enterChatRoom(spaceId, userId, nickname);
};