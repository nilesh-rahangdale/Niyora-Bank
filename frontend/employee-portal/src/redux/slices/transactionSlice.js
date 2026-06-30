import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const getTransactionsByAccount = createAsyncThunk(
  'transactions/getTransactionsByAccount',
  async (accountNumber, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/accounts/transactions/${accountNumber}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch transactions');
    }
  }
);

const initialState = {
  transactions: [],
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactionState: (state) => {
      state.error = null;
      state.transactions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactionsByAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionsByAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(getTransactionsByAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTransactionState } = transactionSlice.actions;
export default transactionSlice.reducer;
