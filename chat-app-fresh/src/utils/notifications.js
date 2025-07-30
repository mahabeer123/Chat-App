import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

let messaging = null;

// Initialize messaging if supported
if ('serviceWorker' in navigator && 'PushManager' in window) {
  try {
    messaging = getMessaging();
  } catch (error) {
    console.warn('Firebase messaging not available:', error);
  }
}

export const requestNotificationPermission = async () => {
  if (!messaging) {
    console.warn('Messaging not available');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY' // Replace with your VAPID key
      });
      
      // Store token in Firestore
      const tokenRef = doc(db, 'notificationTokens', token);
      await setDoc(tokenRef, {
        token,
        createdAt: new Date().toISOString(),
        platform: 'web'
      });
      
      return token;
    }
    return false;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export const subscribeToNotifications = (userId) => {
  if (!messaging) return;

  // Handle foreground messages
  onMessage(messaging, (payload) => {
    console.log('Message received:', payload);
    
    const { notification } = payload;
    if (notification) {
      // Show custom notification
      new Notification(notification.title, {
        body: notification.body,
        icon: '/icons/icon-144x144.png',
        badge: '/icons/icon-144x144.png',
        tag: 'chat-message',
        requireInteraction: true,
        actions: [
          {
            action: 'open',
            title: 'Open Chat'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ]
      });
    }
  });
};

export const sendNotification = async (userId, title, body, data = {}) => {
  try {
    // This would typically be done on the server side
    // For demo purposes, we'll just log it
    console.log('Sending notification:', { userId, title, body, data });
    
    // In a real app, you'd call your backend API
    // await fetch('/api/send-notification', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId, title, body, data })
    // });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export const removeNotificationToken = async (token) => {
  try {
    const tokenRef = doc(db, 'notificationTokens', token);
    await deleteDoc(tokenRef);
  } catch (error) {
    console.error('Error removing notification token:', error);
  }
}; 