import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark';
  isLoading: boolean;
  notification: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  } | null;
  confirmDialog: {
    open: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
  } | null;
  drawerOpen: boolean;
}

const initialState: UIState = {
  theme: 'light',
  isLoading: false,
  notification: null,
  confirmDialog: null,
  drawerOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    showNotification: (state, action: PayloadAction<{
      message: string;
      severity: 'success' | 'error' | 'warning' | 'info';
    }>) => {
      state.notification = {
        open: true,
        ...action.payload,
      };
    },
    hideNotification: (state) => {
      state.notification = null;
    },
    showConfirmDialog: (state, action: PayloadAction<{
      title: string;
      message: string;
      onConfirm?: () => void;
    }>) => {
      state.confirmDialog = {
        open: true,
        ...action.payload,
      };
    },
    hideConfirmDialog: (state) => {
      state.confirmDialog = null;
    },
    toggleDrawer: (state) => {
      state.drawerOpen = !state.drawerOpen;
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.drawerOpen = action.payload;
    },
  },
});

export const {
  setTheme,
  setLoading,
  showNotification,
  hideNotification,
  showConfirmDialog,
  hideConfirmDialog,
  toggleDrawer,
  setDrawerOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
