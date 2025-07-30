import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase';
import { logger } from '../../utils/logger';
import { validateMessage } from '../../utils/validation';

// Async thunk for fetching messages
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (chatId, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "user-chats", chatId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data().messages || [];
      }
      return [];
    } catch (error) {
      logger.error('Failed to fetch messages', { error: error.message, chatId });
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for sending messages
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, message, senderId, receiverId }, { rejectWithValue }) => {
    try {
      const validation = validateMessage(message);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const date = new Date();
      const timeStamp = date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      const messageData = {
        text: validation.sanitized,
        time: timeStamp,
        sender: senderId,
        receiver: receiverId,
        timestamp: date.getTime(),
      };

      const docRef = doc(db, "user-chats", chatId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          chatId: chatId,
          messages: [messageData],
        });
      } else {
        await updateDoc(docRef, {
          messages: arrayUnion(messageData),
        });
      }

      logger.info('Message sent successfully', { chatId, senderId });
      return messageData;
    } catch (error) {
      logger.error('Failed to send message', { error: error.message, chatId });
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  messages: [],
  currentChat: null,
  chatParticipants: {},
  loading: false,
  error: null,
  unreadCounts: {}, // Track unread counts per contact
  typingUsers: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setChatParticipants: (state, action) => {
      state.chatParticipants = { ...state.chatParticipants, ...action.payload };
    },
    setTypingUser: (state, action) => {
      const { userId, isTyping } = action.payload;
      if (isTyping) {
        state.typingUsers[userId] = true;
      } else {
        delete state.typingUsers[userId];
      }
    },
    // Increment unread count for a specific contact
    incrementUnreadCount: (state, action) => {
      const { contactId } = action.payload;
      if (!state.unreadCounts[contactId]) {
        state.unreadCounts[contactId] = 0;
      }
      state.unreadCounts[contactId] += 1;
    },
    // Clear unread count for a specific contact
    clearUnreadCount: (state, action) => {
      const { contactId } = action.payload;
      if (state.unreadCounts[contactId]) {
        state.unreadCounts[contactId] = 0;
      }
    },
    // Set unread count for a specific contact
    setUnreadCount: (state, action) => {
      const { contactId, count } = action.payload;
      state.unreadCounts[contactId] = count;
    },
    // Clear all unread counts
    clearAllUnreadCounts: (state) => {
      state.unreadCounts = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    clearChat: (state) => {
      state.messages = [];
      state.currentChat = null;
      state.typingUsers = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentChat,
  addMessage,
  setMessages,
  setChatParticipants,
  setTypingUser,
  incrementUnreadCount,
  clearUnreadCount,
  setUnreadCount,
  clearAllUnreadCounts,
  clearError,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer; 