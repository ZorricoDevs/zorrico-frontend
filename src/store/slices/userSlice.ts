import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  documents?: {
    panCard?: string;
    aadhaarCard?: string;
    salarySlips?: string[];
    bankStatements?: string[];
  };
  preferences?: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    communication: {
      language: string;
      timezone: string;
    };
  };
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
  };
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
  preferences: {
    theme: 'light',
    language: 'en',
    notifications: true,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    updateAddress: (state, action: PayloadAction<Partial<UserProfile['address']>>) => {
      if (state.profile && state.profile.address) {
        state.profile.address = { ...state.profile.address, ...action.payload } as any;
      } else if (state.profile) {
        state.profile.address = action.payload as any;
      }
    },
    updateDocuments: (state, action: PayloadAction<Partial<UserProfile['documents']>>) => {
      if (state.profile && state.profile.documents) {
        state.profile.documents = { ...state.profile.documents, ...action.payload } as any;
      } else if (state.profile) {
        state.profile.documents = action.payload as any;
      }
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    clearProfile: (state) => {
      state.profile = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setProfile,
  updateProfile,
  updateAddress,
  updateDocuments,
  updatePreferences,
  clearProfile,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
