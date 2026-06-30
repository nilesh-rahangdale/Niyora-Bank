import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import branchReducer from './slices/branchSlice';
import userReducer from './slices/userSlice';
import accountReducer from './slices/accountSlice';
import transactionReducer from './slices/transactionSlice';
import complaintReducer from './slices/complaintSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    branches: branchReducer,
    users: userReducer,
    accounts: accountReducer,
    transactions: transactionReducer,
    complaints: complaintReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevents warnings for date strings/objects
    }),
});

export default store;
