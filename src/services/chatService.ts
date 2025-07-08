import {
  sendMessage,
  listenToMessages,
  joinChatRoom,
  leaveChatRoom
} from '../firebase/firebase/firestoreService';

// 메시지 전송
export const sendChat = async (spaceId, message, nickname) => {
  return sendMessage(spaceId, message, nickname);
};

// 메시지 수신 연결
export const subscribeToChat = (spaceId, onMessage) => {
  return listenToMessages(spaceId, onMessage);
};

// 채팅방 입장
export const enterChatRoom = async (spaceId, userId, nickname) => {
  return joinChatRoom(spaceId, userId, nickname);
};

// 채팅방 퇴장
export const exitChatRoom = async (spaceId, userId) => {
  return leaveChatRoom(spaceId, userId);
};