import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: 'customer' | 'broker' | 'lender' | 'admin' | 'builder';
    lastLogin?: Date;
  };
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
  };
}

// Authentication API functions
export const authAPI = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Register user
  register: async (userData: RegisterData): Promise<RegisterResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token: string) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  }
};

export default authAPI;
