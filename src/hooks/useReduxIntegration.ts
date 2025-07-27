import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginSuccess, logout, updateUser } from '../store/slices/authSlice';
import { useAuth } from './useAuth';

/**
 * Custom hook to sync Redux auth state with AuthContext
 * This provides a bridge between the existing context and new Redux store
 */
export const useAuthSync = () => {
  const dispatch = useAppDispatch();
  const reduxAuth = useAppSelector((state: any) => state.auth);
  const { user, isAuthenticated } = useAuth();

  // Sync context state to Redux when context changes
  useEffect(() => {
    if (isAuthenticated && user) {
      // Convert AuthContext user to Redux user format
      const contextUser = user as any;
      const reduxUser = {
        id: contextUser.uid || contextUser.id || '',
        email: contextUser.email || '',
        firstName: contextUser.displayName?.split(' ')[0] || contextUser.firstName || '',
        lastName: contextUser.displayName?.split(' ')[1] || contextUser.lastName || '',
        role: contextUser.role || 'customer',
        isApproved: true,
      };
      const mockToken = 'context-token';
      dispatch(loginSuccess({ user: reduxUser, token: mockToken }));
    } else if (!isAuthenticated) {
      dispatch(logout());
    }
  }, [isAuthenticated, user, dispatch]);

  // Return Redux state for components that prefer Redux
  return reduxAuth;
};

/**
 * Hook for form state management with Redux integration
 */
export const useFormState = <T extends Record<string, any>>(initialState: T) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state: any) => state.ui);

  const setState = (updates: Partial<T>) => {
    // You can dispatch to Redux here if needed
    // For now, we'll use local state but this can be extended
  };

  return {
    isLoading,
    setState,
  };
};
