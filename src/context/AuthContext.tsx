import React, { createContext, useState, useEffect, ReactNode } from 'react';
import FinanceLoader from '../components/UI/FinanceLoader';
import { authAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'customer' | 'broker' | 'lender' | 'builder' | 'banker';
  userType?: 'customer' | 'broker' | 'lender' | 'admin' | 'builder' | 'banker';
  status: 'pending' | 'approved' | 'rejected';
  avatar?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isApproved: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (parseError) {
          console.error('Error parsing saved user:', parseError);
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save user to localStorage when user changes
  useEffect(() => {
    if (isLoading) {
      return; // Don't save during initial load
    }

    try {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }, [user, isLoading]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Use proper authentication API with environment configuration
      const data = await authAPI.login({ email, password, role: 'user' });

      if (data.success) {
        const user: User = {
          id: data.user.id || data.user._id,
          name: data.user.fullName || data.user.firstName || data.user.name,
          email: data.user.email,
          role: data.user.role,
          status: data.user.status,
          avatar: data.user.avatar || '',
        };

        console.log('AuthContext Debug - Login response:', data);
        console.log('AuthContext Debug - User object:', user);
        console.log('AuthContext Debug - User role:', user.role);

        // Store token
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        setUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    try {
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const safeSetUser = (newUser: User | null) => {
    try {
      setUser(newUser);
    } catch (error) {
      console.error('Error setting user:', error);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isApproved = user?.status === 'approved';

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    isApproved,
    isLoading,
    login,
    logout,
    setUser: safeSetUser,
  };

  // Show branded loading screen during initial auth check
  if (isLoading) {
    return <FinanceLoader />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
export { AuthContext };
export type { User, AuthContextType };
