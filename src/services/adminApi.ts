import api from './api';

// Fetch dashboard statistics
export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard/stats');
  return response.data.data;
};

// Fetch analytics data
export const getAnalyticsData = async () => {
  const response = await api.get('/admin/analytics');
  return response.data.data;
};

// Fetch all users
export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data.data.users;
};

// Fetch all leads for admin
export const getAllLeads = async () => {
  try {
    const response = await api.get('/admin/leads');
    return response.data; // Backend returns leads directly
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    throw error;
  }
};

// Assign broker to lead
export const assignBrokerToLead = async (leadId: string, brokerId: string) => {
  try {
    const response = await api.put(`/admin/leads/${leadId}/assign`, { brokerId });
    return response.data;
  } catch (error) {
    console.error('Failed to assign broker to lead:', error);
    throw error;
  }
};

// Assign builder to lead
export const assignBuilderToLead = async (leadId: string, builderId: string) => {
  try {
    const response = await api.put(`/admin/leads/${leadId}/assign-builder`, { builderId });
    return response.data;
  } catch (error) {
    console.error('Failed to assign builder to lead:', error);
    throw error;
  }
};

// Update lead (edit details or status)
export const updateLead = async (leadId: string, updates: any) => {
  try {
    const response = await api.put(`/admin/leads/${leadId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Failed to update lead:', error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId: string) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

// Reset user password (admin)
export const resetUserPassword = async (userId: string, newPassword: string, sendNotification = false) => {
  const response = await api.post(`/admin/users/${userId}/reset-password`, { newPassword, sendNotification });
  return response.data;
};

// Delete lead (admin)
export const deleteLead = async (leadId: string) => {
  const response = await api.delete(`/admin/leads/${leadId}`);
  return response.data;
};