import firestore from '@react-native-firebase/firestore';

export const sendMessage = async (spaceId, text, nickname) => {
  await firestore()
    .collection(`spaces/${spaceId}/messages`)
    .add({
      text,
      sender: nickname,
      timestamp: firestore.FieldValue.serverTimestamp(),
      expiresAt: Date.now() + 86400000,
    });
};

export const listenToMessages = (spaceId, onMessage) => {
  return firestore()
    .collection(`spaces/${spaceId}/messages`)
    .orderBy('timestamp', 'asc')
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          onMessage({ id: change.doc.id, ...change.doc.data() });
        }
      });
    });
};

export const joinChatRoom = async (spaceId, userId, nickname) => {
  await firestore()
    .doc(`spaces/${spaceId}/participants/${userId}`)
    .set({
      nickname,
      joinedAt: firestore.FieldValue.serverTimestamp(),
    });
};

export const leaveChatRoom = async (spaceId, userId) => {
  await firestore()
    .doc(`spaces/${spaceId}/participants/${userId}`)
    .delete();
};

export const updateRecentUser = async (userId, spaceId, deviceToken) => {
  await firestore()
    .doc(`recentUsers/${userId}`)
    .set({
      space_id: spaceId,
      deviceToken,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
};

export const getRecentUsersInSpace = async (spaceId) => {
  const fiveMinutesAgo = firestore.Timestamp.fromDate(new Date(Date.now() - 5 * 60 * 1000));

  const snapshot = await firestore()
    .collection('recentUsers')
    .where('space_id', '==', spaceId)
    .where('updatedAt', '>', fiveMinutesAgo)
    .get();

  return snapshot.docs.map(doc => doc.data());
};
