import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const getAllComplaints = createAsyncThunk(
  'complaints/getAllComplaints',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/requests/complaints');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch complaints');
    }
  }
);

export const getComplaintById = createAsyncThunk(
  'complaints/getComplaintById',
  async (complaintId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/requests/complaints/${complaintId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Complaint not found');
    }
  }
);

export const handleComplaint = createAsyncThunk(
  'complaints/handleComplaint',
  async ({ complaintId, status, rejectReason }, { rejectWithValue }) => {
    try {
      const payload = { status };
      if (rejectReason) {
        payload.rejectReason = rejectReason;
      }
      const response = await axiosInstance.patch(`/api/requests/complaints/${complaintId}/handle`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update complaint status');
    }
  }
);

const initialState = {
  complaints: [],
  selectedComplaint: null,
  loading: false,
  error: null,
  success: false,
};

const complaintSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    clearComplaintState: (state) => {
      state.error = null;
      state.success = false;
      state.selectedComplaint = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Complaints
      .addCase(getAllComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload;
      })
      .addCase(getAllComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Complaint By ID
      .addCase(getComplaintById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComplaintById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedComplaint = action.payload;
      })
      .addCase(getComplaintById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle Complaint (Resolve/Reject)
      .addCase(handleComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(handleComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.selectedComplaint = action.payload;
        state.complaints = state.complaints.map((c) =>
          c.complaintId === action.payload.complaintId ? action.payload : c
        );
      })
      .addCase(handleComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearComplaintState } = complaintSlice.actions;
export default complaintSlice.reducer;
