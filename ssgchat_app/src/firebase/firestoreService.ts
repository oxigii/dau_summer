import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const sendMessage = async (spaceId: string, text: string, nickname: string) => {
  await addDoc(collection(db, `spaces/${spaceId}/messages`), {
    text,
    sender: nickname,
    timestamp: serverTimestamp(),
    expiresAt: Date.now() + 86400000
  });
};
