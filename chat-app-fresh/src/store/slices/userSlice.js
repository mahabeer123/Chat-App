import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { logger } from '../../utils/logger';
import { validateName, validateStatus } from '../../utils/validation';

// Async thunk for fetching all users
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getDocs(collection(db, 'users'));
      const users = data.docs.map((doc) => ({
        id: doc.id,
        userData: doc.data(),
      }));
      
      logger.info('Users loaded', { count: users.length });
      return users;
    } catch (error) {
      logger.error('Failed to load users', { error: error.message });
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching specific user
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: userId, ...docSnap.data() };
      }
      throw new Error('User not found');
    } catch (error) {
      logger.error('Failed to fetch user', { error: error.message, userId });
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating user name
export const updateUserName = createAsyncThunk(
  'user/updateUserName',
  async ({ userId, name }, { rejectWithValue }) => {
    try {
      const validation = validateName(name);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      await updateDoc(doc(db, "users", userId), {
        name: validation.sanitized,
      });

      logger.info('Name updated successfully', { userId, newName: validation.sanitized });
      return { userId, name: validation.sanitized };
    } catch (error) {
      logger.error('Failed to update name', { error: error.message, userId });
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating user status
export const updateUserStatus = createAsyncThunk(
  'user/updateUserStatus',
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const validation = validateStatus(status);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      await updateDoc(doc(db, "users", userId), {
        status: validation.sanitized,
      });

      logger.info('Status updated successfully', { userId, newStatus: validation.sanitized });
      return { userId, status: validation.sanitized };
    } catch (error) {
      logger.error('Failed to update status', { error: error.message, userId });
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentUser: null,
  users: [],
  contacts: [],
  loading: false,
  error: null,
  searchQuery: '',
  filteredUsers: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilteredUsers: (state, action) => {
      state.filteredUsers = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      const { id, ...updates } = action.payload;
      const userIndex = state.users.findIndex(user => user.id === id);
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...updates };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUsers: (state) => {
      state.users = [];
      state.contacts = [];
      state.filteredUsers = [];
    },
    logout: (state) => {
      state.currentUser = null;
      state.users = [];
      state.contacts = [];
      state.filteredUsers = [];
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.contacts = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        const userIndex = state.users.findIndex(user => user.id === action.payload.id);
        if (userIndex !== -1) {
          state.users[userIndex] = action.payload;
        } else {
          state.users.push(action.payload);
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserName.fulfilled, (state, action) => {
        const { userId, name } = action.payload;
        const userIndex = state.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
          state.users[userIndex].userData.name = name;
        }
        if (state.currentUser && state.currentUser.id === userId) {
          state.currentUser.name = name;
        }
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { userId, status } = action.payload;
        const userIndex = state.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
          state.users[userIndex].userData.status = status;
        }
        if (state.currentUser && state.currentUser.id === userId) {
          state.currentUser.status = status;
        }
      });
  },
});

export const {
  setCurrentUser,
  setSearchQuery,
  setFilteredUsers,
  addUser,
  updateUser,
  clearError,
  clearUsers,
  logout,
} = userSlice.actions;

export default userSlice.reducer; 