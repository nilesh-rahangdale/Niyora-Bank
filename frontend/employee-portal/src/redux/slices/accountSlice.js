import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const createAccount = createAsyncThunk(
  'accounts/createAccount',
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/accounts/create', accountData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create account');
    }
  }
);

export const getAccountsByCustomer = createAsyncThunk(
  'accounts/getAccountsByCustomer',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/accounts/customer/${customerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch customer accounts');
    }
  }
);

export const getAccountsByBranch = createAsyncThunk(
  'accounts/getAccountsByBranch',
  async (branchCode, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/accounts/branchCode/${branchCode}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch branch accounts');
    }
  }
);

export const getAccountByNumber = createAsyncThunk(
  'accounts/getAccountByNumber',
  async (accountNumber, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/accounts/accountNumber/${accountNumber}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Account not found');
    }
  }
);

export const cashDeposit = createAsyncThunk(
  'accounts/cashDeposit',
  async ({ accountNumber, amount }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/accounts/cashDeposit', { accountNumber, amount });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Deposit failed');
    }
  }
);

export const cashWithdraw = createAsyncThunk(
  'accounts/cashWithdraw',
  async ({ accountNumber, amount }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/accounts/cashWithdraw', { accountNumber, amount });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Withdrawal failed');
    }
  }
);

export const internalTransfer = createAsyncThunk(
  'accounts/internalTransfer',
  async ({ fromAccountNumber, toAccountNumber, amount }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/accounts/transfer/internal', { fromAccountNumber, toAccountNumber, amount });
      return response.data; // e.g. "Transfer successful"
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Transfer failed');
    }
  }
);

export const chequeDeposit = createAsyncThunk(
  'accounts/chequeDeposit',
  async (chequeData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/accounts/chequeDeposit', chequeData);
      return response.data; // e.g. "Cheque deposit successful"
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Cheque deposit failed');
    }
  }
);

const initialState = {
  accounts: [],
  selectedAccount: null,
  loading: false,
  error: null,
  success: false,
  successMessage: null,
};

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    clearAccountState: (state) => {
      state.error = null;
      state.success = false;
      state.successMessage = null;
      state.selectedAccount = null;
    },
  },
  extraReducers: (builder) => {
    const setPending = (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.successMessage = null;
    };
    const setRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.successMessage = null;
    };

    builder
      // Create Account
      .addCase(createAccount.pending, setPending)
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.accounts.push(action.payload);
        state.selectedAccount = action.payload;
      })
      .addCase(createAccount.rejected, setRejected)

      // Get Accounts by Customer ID
      .addCase(getAccountsByCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.successMessage = null;
        state.accounts = [];
      })
      .addCase(getAccountsByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(getAccountsByCustomer.rejected, (state, action) => {
        state.loading = false;
        state.accounts = [];
        const errMsg = action.payload?.toString() || '';
        if (
          errMsg.toLowerCase().includes('no account') || 
          errMsg.toLowerCase().includes('not found') || 
          errMsg.toLowerCase().includes('empty')
        ) {
          state.error = null;
        } else {
          state.error = action.payload;
        }
      })

      // Get Accounts by Branch Code
      .addCase(getAccountsByBranch.pending, setPending)
      .addCase(getAccountsByBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(getAccountsByBranch.rejected, setRejected)

      // Get Account by Account Number
      .addCase(getAccountByNumber.pending, setPending)
      .addCase(getAccountByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAccount = action.payload;
      })
      .addCase(getAccountByNumber.rejected, setRejected)

      // Cash Deposit
      .addCase(cashDeposit.pending, setPending)
      .addCase(cashDeposit.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.selectedAccount = action.payload;
        state.successMessage = 'Cash deposited successfully.';
        state.accounts = state.accounts.map((acc) =>
          acc.accountNumber === action.payload.accountNumber ? action.payload : acc
        );
      })
      .addCase(cashDeposit.rejected, setRejected)

      // Cash Withdraw
      .addCase(cashWithdraw.pending, setPending)
      .addCase(cashWithdraw.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.selectedAccount = action.payload;
        state.successMessage = 'Cash withdrawn successfully.';
        state.accounts = state.accounts.map((acc) =>
          acc.accountNumber === action.payload.accountNumber ? action.payload : acc
        );
      })
      .addCase(cashWithdraw.rejected, setRejected)

      // Internal Transfer
      .addCase(internalTransfer.pending, setPending)
      .addCase(internalTransfer.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.successMessage = 'Internal transfer executed successfully.';
      })
      .addCase(internalTransfer.rejected, setRejected)

      // Cheque Deposit
      .addCase(chequeDeposit.pending, setPending)
      .addCase(chequeDeposit.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.successMessage = 'Cheque deposit completed successfully.';
      })
      .addCase(chequeDeposit.rejected, setRejected);
  },
});

export const { clearAccountState } = accountSlice.actions;
export default accountSlice.reducer;
