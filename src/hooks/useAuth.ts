import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../context/AuthContext';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    // Instead of throwing an error immediately, return a safe fallback during development
    console.warn('useAuth must be used within an AuthProvider. Returning fallback values.');
    return {
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isApproved: false,
      isLoading: false,
      login: async () => false,
      logout: () => { /* No auth context available */ },
      setUser: () => { /* No auth context available */ }
    };
  }
  return context;
};
