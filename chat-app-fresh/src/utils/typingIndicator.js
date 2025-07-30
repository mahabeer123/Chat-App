import { doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const startTyping = async (chatId, userId, userName) => {
  try {
    const typingRef = doc(db, 'typing', chatId);
    await setDoc(typingRef, {
      [userId]: {
        name: userName,
        timestamp: new Date().toISOString()
      }
    }, { merge: true });
  } catch (error) {
    console.error('Error starting typing indicator:', error);
  }
};

export const stopTyping = async (chatId, userId) => {
  try {
    const typingRef = doc(db, 'typing', chatId);
    await setDoc(typingRef, {
      [userId]: null
    }, { merge: true });
  } catch (error) {
    console.error('Error stopping typing indicator:', error);
  }
};

export const subscribeToTyping = (chatId, callback) => {
  const typingRef = doc(db, 'typing', chatId);
  
  return onSnapshot(typingRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      const activeTypers = Object.entries(data)
        .filter(([_, value]) => value !== null)
        .map(([userId, userData]) => userData);
      
      callback(activeTypers);
    } else {
      callback([]);
    }
  });
}; 