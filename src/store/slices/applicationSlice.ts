import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoanApplication {
  id: string;
  userId: string;
  loanType: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
  createdAt: string;
  updatedAt: string;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }>;
  eligibility?: {
    isEligible: boolean;
    maxAmount: number;
    interestRate: number;
  };
}

interface ApplicationState {
  applications: LoanApplication[];
  currentApplication: LoanApplication | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string[];
    loanType: string[];
    dateRange: {
      from: string | null;
      to: string | null;
    };
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: ApplicationState = {
  applications: [],
  currentApplication: null,
  isLoading: false,
  error: null,
  filters: {
    status: [],
    loanType: [],
    dateRange: {
      from: null,
      to: null,
    },
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setApplications: (state, action: PayloadAction<LoanApplication[]>) => {
      state.applications = action.payload;
    },
    addApplication: (state, action: PayloadAction<LoanApplication>) => {
      state.applications.unshift(action.payload);
    },
    updateApplication: (state, action: PayloadAction<{ id: string; updates: Partial<LoanApplication> }>) => {
      const index = state.applications.findIndex(app => app.id === action.payload.id);
      if (index !== -1) {
        state.applications[index] = { ...state.applications[index], ...action.payload.updates };
      }
      if (state.currentApplication?.id === action.payload.id) {
        state.currentApplication = { ...state.currentApplication, ...action.payload.updates };
      }
    },
    removeApplication: (state, action: PayloadAction<string>) => {
      state.applications = state.applications.filter(app => app.id !== action.payload);
      if (state.currentApplication?.id === action.payload) {
        state.currentApplication = null;
      }
    },
    setCurrentApplication: (state, action: PayloadAction<LoanApplication | null>) => {
      state.currentApplication = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ApplicationState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action: PayloadAction<Partial<ApplicationState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: [],
        loanType: [],
        dateRange: {
          from: null,
          to: null,
        },
      };
    },
  },
});

export const {
  setLoading,
  setError,
  setApplications,
  addApplication,
  updateApplication,
  removeApplication,
  setCurrentApplication,
  setFilters,
  setPagination,
  clearFilters,
} = applicationSlice.actions;

export default applicationSlice.reducer;
