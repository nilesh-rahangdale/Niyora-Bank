import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const registerBranch = createAsyncThunk(
  'branches/registerBranch',
  async (branchData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/branches/register', branchData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to register branch');
    }
  }
);

export const getBranchById = createAsyncThunk(
  'branches/getBranchById',
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/branches/${branchId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Branch not found');
    }
  }
);

export const getBranchByIfsc = createAsyncThunk(
  'branches/getBranchByIfsc',
  async (ifsc, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/branches/ifsc/${ifsc}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Branch not found');
    }
  }
);

export const getBranchByCode = createAsyncThunk(
  'branches/getBranchByCode',
  async (branchCode, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/branches/branchCode/${branchCode}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Branch not found');
    }
  }
);

export const getAllBranches = createAsyncThunk(
  'branches/getAllBranches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/branches');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch branches');
    }
  }
);

const initialState = {
  branches: [],
  currentBranch: null,
  loading: false,
  error: null,
  success: false,
};

const branchSlice = createSlice({
  name: 'branches',
  initialState,
  reducers: {
    clearBranchState: (state) => {
      state.error = null;
      state.success = false;
      state.currentBranch = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Branch
      .addCase(registerBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branches.push(action.payload);
        state.success = true;
        state.error = null;
      })
      .addCase(registerBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get Branch by ID
      .addCase(getBranchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBranchById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBranch = action.payload;
      })
      .addCase(getBranchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Branch by IFSC
      .addCase(getBranchByIfsc.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBranchByIfsc.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBranch = action.payload;
      })
      .addCase(getBranchByIfsc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Branch by Code
      .addCase(getBranchByCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBranchByCode.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBranch = action.payload;
      })
      .addCase(getBranchByCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Branches
      .addCase(getAllBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(getAllBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBranchState } = branchSlice.actions;
export default branchSlice.reducer;
