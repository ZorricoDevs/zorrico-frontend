import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string; // Full name for compatibility
  role: 'customer' | 'broker' | 'lender' | 'admin';
  userType?: 'customer' | 'broker' | 'lender' | 'admin'; // Alternative field name
  phoneNumber?: string;
  phone?: string; // Alternative field name
  address?: string;
  occupation?: string;
  dateOfBirth?: string;
  avatar?: string;
  isApproved: boolean;
  mfaSettings?: {
    isEnabled: boolean;
    email: boolean;
    sms: boolean;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  mfaRequired: boolean;
  mfaVerified: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  mfaRequired: false,
  mfaVerified: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.mfaRequired = false;
      state.mfaVerified = false;
      state.error = null;
    },
    setMfaRequired: (state, action: PayloadAction<boolean>) => {
      state.mfaRequired = action.payload;
    },
    setMfaVerified: (state, action: PayloadAction<boolean>) => {
      state.mfaVerified = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setMfaRequired,
  setMfaVerified,
  updateUser,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
