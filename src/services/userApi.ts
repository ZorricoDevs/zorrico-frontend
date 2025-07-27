import api from './api';

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  occupation?: string;
  monthlyIncome?: number;
  employmentType?: string;
  companyName?: string;
  workExperience?: string;
  panNumber?: string;
  aadharNumber?: string;
  isVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  occupation?: string;
  monthlyIncome?: number;
  employmentType?: string;
  companyName?: string;
  workExperience?: string;
  panNumber?: string;
  aadharNumber?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  loanUpdates: boolean;
  securityAlerts: boolean;
}

// User API functions
export const userApi = {
  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get('/user/profile');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData: UpdateProfileData): Promise<UserProfile> => {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData: ChangePasswordData): Promise<void> => {
    try {
      await api.put('/user/change-password', passwordData);
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  // Get notification settings
  getNotificationSettings: async (): Promise<NotificationSettings> => {
    try {
      const response = await api.get('/user/notification-settings');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  },

  // Update notification settings
  updateNotificationSettings: async (settings: NotificationSettings): Promise<NotificationSettings> => {
    try {
      const response = await api.put('/user/notification-settings', settings);
      return response.data.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },

  // Delete user account
  deleteAccount: async (): Promise<void> => {
    try {
      await api.delete('/user/account');
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw error;
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await api.post('/user/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data.profilePictureUrl;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    try {
      await api.post('/user/verify-email', { token });
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  },

  // Resend verification email
  resendVerificationEmail: async (): Promise<void> => {
    try {
      await api.post('/user/resend-verification');
    } catch (error) {
      console.error('Error resending verification email:', error);
      throw error;
    }
  }
};

export default userApi;