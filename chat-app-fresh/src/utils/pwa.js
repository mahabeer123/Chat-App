// PWA (Progressive Web App) utilities
export const initializePWA = async () => {
  try {
    // Temporarily disable service worker in development mode
    if (import.meta.env.DEV) {
      console.log('PWA disabled in development mode');
      return { success: true, disabled: true };
    }
    
    // Check if service worker is supported
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return { success: true, registration };
    } else {
      console.log('Service Worker not supported');
      return { success: false, error: 'Service Worker not supported' };
    }
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return { success: false, error: error.message };
  }
};

export const requestNotificationPermission = async () => {
  try {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  } catch (error) {
    console.error('Notification permission request failed:', error);
    return false;
  }
};

export const showNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/icons/icon-144x144.svg',
      badge: '/icons/icon-144x144.svg',
      ...options
    });
  }
};

export const checkPWAInstallability = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}; 