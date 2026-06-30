import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// --- Generic Users ---
export const getUserById = createAsyncThunk('users/getUserById', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/api/users/getUserById/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'User not found');
  }
});

export const getAllUsers = createAsyncThunk('users/getAllUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/users/getAllUsers');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch users');
  }
});

export const changePassword = createAsyncThunk('users/changePassword', async ({ id, oldPassword, newPassword, confirmNewPassword }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/api/users/changePassword/${id}`, { oldPassword, newPassword, confirmNewPassword });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to change password');
  }
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, userData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/api/users/updateUser/${id}`, userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update user');
  }
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/api/users/deleteUser/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to delete user');
  }
});

// --- Admins ---
export const registerAdmin = createAsyncThunk('users/registerAdmin', async (adminData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/api/admin/registerAdminUser', adminData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to register admin');
  }
});

export const getAllAdmins = createAsyncThunk('users/getAllAdmins', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/admin');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch admins');
  }
});

export const updateAdmin = createAsyncThunk('users/updateAdmin', async ({ adminId, adminData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/api/admin/${adminId}`, adminData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update admin');
  }
});

// --- Managers ---
export const registerManager = createAsyncThunk('users/registerManager', async ({ branchId, managerData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/api/manager/registerManager/${branchId}`, managerData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to register manager');
  }
});

export const getAllManagers = createAsyncThunk('users/getAllManagers', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/manager');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch managers');
  }
});

export const updateManager = createAsyncThunk('users/updateManager', async ({ managerId, managerData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/api/manager/${managerId}`, managerData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update manager');
  }
});

// --- Tellers ---
export const registerTeller = createAsyncThunk('users/registerTeller', async ({ branchId, tellerData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/api/teller/registerTeller/${branchId}`, tellerData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to register teller');
  }
});

export const getAllTellers = createAsyncThunk('users/getAllTellers', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/teller');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch tellers');
  }
});

export const updateTeller = createAsyncThunk('users/updateTeller', async ({ tellerId, tellerData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/api/teller/${tellerId}`, tellerData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update teller');
  }
});

export const setCashDrawer = createAsyncThunk('users/setCashDrawer', async (cashDrawerId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/api/teller/setCashDrawer/${cashDrawerId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to set cash drawer');
  }
});

export const setLastBalanced = createAsyncThunk('users/setLastBalanced', async (dateString, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/api/teller/setLastBalanced/?lastBalancedDate=${dateString}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to balance cash drawer');
  }
});

export const getTellerById = createAsyncThunk('users/getTellerById', async (tellerId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/api/teller/${tellerId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Teller details not found');
  }
});

export const getCsoById = createAsyncThunk('users/getCsoById', async (csoId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/api/cso/${csoId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'CSO details not found');
  }
});

// --- CSOs ---
export const registerCso = createAsyncThunk('users/registerCso', async ({ branchId, csoData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/api/cso/registerCso/${branchId}`, csoData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to register CSO');
  }
});

export const getAllCsos = createAsyncThunk('users/getAllCsos', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/cso');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch CSOs');
  }
});

export const updateCso = createAsyncThunk('users/updateCso', async ({ csoId, csoData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/api/cso/${csoId}`, csoData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update CSO');
  }
});

// --- Customers ---
export const registerCustomer = createAsyncThunk('users/registerCustomer', async (customerData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/api/customers/register', customerData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to register customer');
  }
});

export const getCustomerById = createAsyncThunk('users/getCustomerById', async (customerId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/api/customers/${customerId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Customer not found');
  }
});

export const updateCustomerKyc = createAsyncThunk('users/updateCustomerKyc', async ({ customerId, kycData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch(`/api/customers/${customerId}/KYC`, kycData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update customer KYC');
  }
});

const initialState = {
  usersList: [],
  adminsList: [],
  managersList: [],
  tellersList: [],
  csosList: [],
  selectedUser: null,
  selectedCustomer: null,
  currentTeller: null,
  currentCso: null,
  loading: false,
  error: null,
  success: false,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.error = null;
      state.success = false;
      state.selectedUser = null;
      state.selectedCustomer = null;
    },
  },
  extraReducers: (builder) => {
    // We will hook common layouts for pending/fulfilled/rejected
    const setPending = (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    };
    const setRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    };

    builder
      // Change Password
      .addCase(changePassword.pending, setPending)
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(changePassword.rejected, setRejected)

      // Get All Users
      .addCase(getAllUsers.pending, setPending)
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.usersList = action.payload;
      })
      .addCase(getAllUsers.rejected, setRejected)

      // Get User By ID
      .addCase(getUserById.pending, setPending)
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, setRejected)

      // Register Admin
      .addCase(registerAdmin.pending, setPending)
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.adminsList.push(action.payload);
      })
      .addCase(registerAdmin.rejected, setRejected)

      // Get All Admins
      .addCase(getAllAdmins.pending, setPending)
      .addCase(getAllAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.adminsList = action.payload;
      })
      .addCase(getAllAdmins.rejected, setRejected)

      // Update Admin
      .addCase(updateAdmin.pending, setPending)
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.adminsList = state.adminsList.map((admin) => 
          admin.userId === action.payload.userId ? action.payload : admin
        );
      })
      .addCase(updateAdmin.rejected, setRejected)

      // Register Manager
      .addCase(registerManager.pending, setPending)
      .addCase(registerManager.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.managersList.push(action.payload);
      })
      .addCase(registerManager.rejected, setRejected)

      // Get All Managers
      .addCase(getAllManagers.pending, setPending)
      .addCase(getAllManagers.fulfilled, (state, action) => {
        state.loading = false;
        state.managersList = action.payload;
      })
      .addCase(getAllManagers.rejected, setRejected)

      // Update Manager
      .addCase(updateManager.pending, setPending)
      .addCase(updateManager.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.managersList = state.managersList.map((mgr) => 
          mgr.managerId === action.payload.managerId ? action.payload : mgr
        );
      })
      .addCase(updateManager.rejected, setRejected)

      // Register Teller
      .addCase(registerTeller.pending, setPending)
      .addCase(registerTeller.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.tellersList.push(action.payload);
      })
      .addCase(registerTeller.rejected, setRejected)

      // Get All Tellers
      .addCase(getAllTellers.pending, setPending)
      .addCase(getAllTellers.fulfilled, (state, action) => {
        state.loading = false;
        state.tellersList = action.payload;
      })
      .addCase(getAllTellers.rejected, setRejected)

      // Update Teller / Cash Drawer
      .addCase(updateTeller.pending, setPending)
      .addCase(updateTeller.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.tellersList = state.tellersList.map((tel) => 
          tel.tellerId === action.payload.tellerId ? action.payload : tel
        );
      })
      .addCase(updateTeller.rejected, setRejected)

      .addCase(setCashDrawer.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentTeller = action.payload;
        state.tellersList = state.tellersList.map((tel) => 
          tel.tellerId === action.payload.tellerId ? action.payload : tel
        );
      })
      .addCase(setCashDrawer.rejected, setRejected)

      .addCase(setLastBalanced.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentTeller = action.payload;
        state.tellersList = state.tellersList.map((tel) => 
          tel.tellerId === action.payload.tellerId ? action.payload : tel
        );
      })
      .addCase(setLastBalanced.rejected, setRejected)

      // Get Teller By ID
      .addCase(getTellerById.pending, setPending)
      .addCase(getTellerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTeller = action.payload;
      })
      .addCase(getTellerById.rejected, setRejected)

      // Get CSO By ID
      .addCase(getCsoById.pending, setPending)
      .addCase(getCsoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCso = action.payload;
      })
      .addCase(getCsoById.rejected, setRejected)

      // Register CSO
      .addCase(registerCso.pending, setPending)
      .addCase(registerCso.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.csosList.push(action.payload);
      })
      .addCase(registerCso.rejected, setRejected)

      // Get All CSOs
      .addCase(getAllCsos.pending, setPending)
      .addCase(getAllCsos.fulfilled, (state, action) => {
        state.loading = false;
        state.csosList = action.payload;
      })
      .addCase(getAllCsos.rejected, setRejected)

      // Update CSO
      .addCase(updateCso.pending, setPending)
      .addCase(updateCso.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.csosList = state.csosList.map((cso) => 
          cso.csoId === action.payload.csoId ? action.payload : cso
        );
      })
      .addCase(updateCso.rejected, setRejected)

      // Register Customer
      .addCase(registerCustomer.pending, setPending)
      .addCase(registerCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.selectedCustomer = action.payload;
      })
      .addCase(registerCustomer.rejected, setRejected)

      // Get Customer By ID
      .addCase(getCustomerById.pending, setPending)
      .addCase(getCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCustomer = action.payload;
      })
      .addCase(getCustomerById.rejected, setRejected)

      // Update Customer KYC
      .addCase(updateCustomerKyc.pending, setPending)
      .addCase(updateCustomerKyc.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (state.selectedCustomer && state.selectedCustomer.customerId === action.payload.customerId) {
          state.selectedCustomer = action.payload;
        }
      })
      .addCase(updateCustomerKyc.rejected, setRejected)

      // Delete User
      .addCase(deleteUser.pending, setPending)
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.usersList = state.usersList.filter((user) => user.id !== action.payload);
        state.adminsList = state.adminsList.filter((adm) => adm.userId !== action.payload);
        state.managersList = state.managersList.filter((mgr) => mgr.managerId !== action.payload);
        state.tellersList = state.tellersList.filter((tel) => tel.tellerId !== action.payload);
        state.csosList = state.csosList.filter((cso) => cso.csoId !== action.payload);
      })
      .addCase(deleteUser.rejected, setRejected);
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
