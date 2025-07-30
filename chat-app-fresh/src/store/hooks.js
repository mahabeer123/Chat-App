import { useDispatch, useSelector } from 'react-redux';

// Typed versions of useDispatch and useSelector
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;

// Chat hooks
export const useChat = () => {
  return useSelector((state) => state.chat);
};

export const useMessages = () => {
  return useSelector((state) => state.chat.messages);
};

export const useCurrentChat = () => {
  return useSelector((state) => state.chat.currentChat);
};

export const useChatLoading = () => {
  return useSelector((state) => state.chat.loading);
};

export const useChatError = () => {
  return useSelector((state) => state.chat.error);
};

export const useTypingUsers = () => {
  return useSelector((state) => state.chat.typingUsers);
};

export const useUnreadCount = () => {
  return useSelector((state) => state.chat.unreadCount);
};

// User hooks
export const useUser = () => {
  return useSelector((state) => state.user);
};

export const useCurrentUser = () => {
  return useSelector((state) => state.user.currentUser);
};

export const useUsers = () => {
  return useSelector((state) => state.user.users);
};

export const useContacts = () => {
  return useSelector((state) => state.user.contacts);
};

export const useFilteredUsers = () => {
  return useSelector((state) => state.user.filteredUsers);
};

export const useSearchQuery = () => {
  return useSelector((state) => state.user.searchQuery);
};

export const useUserLoading = () => {
  return useSelector((state) => state.user.loading);
};

export const useUserError = () => {
  return useSelector((state) => state.user.error);
};

// UI hooks
export const useUI = () => {
  return useSelector((state) => state.ui);
};

export const useLoading = () => {
  return useSelector((state) => state.ui.isLoading);
};

export const useNotifications = () => {
  return useSelector((state) => state.ui.notifications);
};

export const useShowProfile = () => {
  return useSelector((state) => state.ui.showProfile);
};

export const useToast = () => {
  return useSelector((state) => ({
    show: state.ui.showToast,
    message: state.ui.toastMessage,
    type: state.ui.toastType,
  }));
};

export const useTheme = () => {
  return useSelector((state) => state.ui.theme);
};

export const useSidebar = () => {
  return useSelector((state) => state.ui.sidebarOpen);
};

export const useModal = () => {
  return useSelector((state) => ({
    open: state.ui.modalOpen,
    type: state.ui.modalType,
    data: state.ui.modalData,
  }));
}; 