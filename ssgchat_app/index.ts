// firebase emulators:start

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// 채팅방 문서 삭제 시 → messages, participants 하위 컬렉션도 삭제
export const onChatRoomDeleted = functions.firestore
  .document('spaces/{spaceId}')
  .onDelete(async (snap, context) => {
    const spaceId = context.params.spaceId;

    // 메시지 삭제
    const messagesRef = db.collection(`spaces/${spaceId}/messages`);
    const messagesSnap = await messagesRef.get();
    const deleteMessages = messagesSnap.docs.map((doc) => doc.ref.delete());

    // 참가자 삭제
    const participantsRef = db.collection(`spaces/${spaceId}/participants`);
    const participantsSnap = await participantsRef.get();
    const deleteParticipants = participantsSnap.docs.map((doc) => doc.ref.delete());

    await Promise.all([...deleteMessages, ...deleteParticipants]);
    console.log(`✅ Deleted all data in spaceId: ${spaceId}`);
  });

// (선택) 방 삭제 5분 전 푸시 알림
export const notifyBeforeDeletion = functions.pubsub.schedule('every 5 minutes').onRun(async () => {
  const now = Date.now();
  const fiveMinutesFromNow = new Date(now + 5 * 60 * 1000);

  const expiringRoomsSnap = await db.collection('spaces')
    .where('expiresAt', '<=', fiveMinutesFromNow)
    .where('expiresAt', '>', new Date(now))
    .get();

  for (const room of expiringRoomsSnap.docs) {
    const spaceId = room.id;
    const data = room.data();

    // 여기에 FCM 알림 전송 로직 추가 가능 (선택)
    console.log(`⚠️ 채팅방 ${spaceId}는 곧 만료됩니다.`);
  }

  return null;
});