import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const getAdminDashboard = createAsyncThunk(
  'dashboard/getAdminDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/admin/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch admin dashboard statistics');
    }
  }
);

export const getManagerDashboard = createAsyncThunk(
  'dashboard/getManagerDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/manager/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch manager dashboard statistics');
    }
  }
);

const initialState = {
  adminData: null,
  managerData: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardState: (state) => {
      state.adminData = null;
      state.managerData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Dashboard
      .addCase(getAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.adminData = action.payload;
      })
      .addCase(getAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Manager Dashboard
      .addCase(getManagerDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getManagerDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.managerData = action.payload;
      })
      .addCase(getManagerDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
