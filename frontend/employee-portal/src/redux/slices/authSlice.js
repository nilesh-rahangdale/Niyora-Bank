import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Helper to get user from localStorage
const getSavedUser = () => {
  try {
    const saved = localStorage.getItem('ebank_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/auth/loginUser', credentials);
      // Backend returns UserDto in body + sets JwtToken cookie
      const user = response.data;
      localStorage.setItem('ebank_user', JSON.stringify(user));
      return user;
    } catch (error) {
      const message = error.response?.data || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/api/auth/logoutUser');
      localStorage.removeItem('ebank_user');
      return null;
    } catch (error) {
      const message = error.response?.data || error.message || 'Logout failed';
      return rejectWithValue(message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/auth/getCurrentUser');
      const user = response.data;
      localStorage.setItem('ebank_user', JSON.stringify(user));
      return user;
    } catch (error) {
      // If unauthorized, clear local storage
      localStorage.removeItem('ebank_user');
      return rejectWithValue(error.response?.data || 'Session expired');
    }
  }
);

const initialState = {
  user: getSavedUser(),
  isAuthenticated: !!getSavedUser(),
  loading: false,
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        // Force log out anyway on the frontend if the user requests it
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.initialized = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.initialized = true;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
