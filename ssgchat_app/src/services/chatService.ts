import {
  sendMessage,
  listenToMessages,
  joinChatRoom,
  leaveChatRoom,
  createChatRoom,
} from './firestoreService';

// 메시지 전송
export const sendChat = async (spaceId, message, nickname) => {
  return sendMessage(spaceId, message, nickname);
};

// 메시지 수신 연결
export const subscribeToChat = (spaceId, onMessage) => {
  return listenToMessages(spaceId, onMessage);
};

// 채팅방 입장: 방 생성 + 참가자 등록
export const enterChatRoom = async (spaceId, userId, nickname) => {
  await createChatRoom(spaceId);
  return joinChatRoom(spaceId, userId, nickname);
};

// 채팅방 퇴장
export const exitChatRoom = async (spaceId, userId) => {
  return leaveChatRoom(spaceId, userId);
};

// 참가자 제거
export const removeParticipant = async (spaceId, userId) => {
  await exitChatRoom(spaceId, userId);
};

// 참가자 추가
export const addParticipant = async (spaceId, userId, nickname) => {
  await enterChatRoom(spaceId, userId, nickname);
};