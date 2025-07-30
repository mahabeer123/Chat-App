import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  notifications: [],
  showProfile: false,
  showToast: false,
  toastMessage: '',
  toastType: 'info',
  theme: 'light',
  sidebarOpen: false,
  modalOpen: false,
  modalType: null,
  modalData: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setShowProfile: (state, action) => {
      state.showProfile = action.payload;
    },
    showToast: (state, action) => {
      const { message, type = 'info' } = action.payload;
      state.showToast = true;
      state.toastMessage = message;
      state.toastType = type;
    },
    hideToast: (state) => {
      state.showToast = false;
      state.toastMessage = '';
      state.toastType = 'info';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action) => {
      const { type, data } = action.payload;
      state.modalOpen = true;
      state.modalType = type;
      state.modalData = data;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.modalType = null;
      state.modalData = null;
    },
    resetUI: (state) => {
      state.isLoading = false;
      state.notifications = [];
      state.showProfile = false;
      state.showToast = false;
      state.toastMessage = '';
      state.toastType = 'info';
      state.sidebarOpen = false;
      state.modalOpen = false;
      state.modalType = null;
      state.modalData = null;
    },
  },
});

export const {
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  setShowProfile,
  showToast,
  hideToast,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer; 