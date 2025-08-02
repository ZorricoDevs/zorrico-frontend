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

// Fetch users with filters
export const getUsersWithFilters = async (
  role?: string,
  status?: string,
  search?: string,
  page?: number,
  limit?: number
) => {
  const params = new URLSearchParams();
  if (role) params.append('role', role);
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());

  const response = await api.get(`/admin/users?${params.toString()}`);
  return response.data.data;
};

// Update user details
export const updateUser = async (userId: string, updates: any) => {
  const response = await api.put(`/admin/users/${userId}`, updates);
  return response.data;
};

// Create new user
export const createUser = async (userData: any) => {
  const response = await api.post('/admin/users', userData);
  return response.data;
};

// Fetch all leads for admin
export const getAllLeads = async () => {
  try {
    console.log('AdminAPI Debug - Fetching all leads for admin...');
    const response = await api.get('/admin/leads');
    console.log('AdminAPI Debug - All leads response:', response.data);
    console.log(
      'AdminAPI Debug - Leads with deletedByBroker:',
      response.data.filter((lead: any) => lead.deletedByBroker)
    );
    return response.data; // Backend returns leads directly
  } catch (error) {
    console.error('AdminAPI Debug - Failed to fetch leads:', error);
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

// Restore lead (remove deletedByBroker flag)
export const restoreLead = async (leadId: string) => {
  try {
    console.log('AdminAPI Debug - Restoring lead:', leadId);
    const response = await api.patch(`/admin/leads/${leadId}/restore`);
    console.log('AdminAPI Debug - Restore response:', response.data);
    return response.data;
  } catch (error) {
    console.error('AdminAPI Debug - Failed to restore lead:', error);
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
export const resetUserPassword = async (
  userId: string,
  newPassword: string,
  sendNotification = false
) => {
  const response = await api.post(`/admin/users/${userId}/reset-password`, {
    newPassword,
    sendNotification,
  });
  return response.data;
};

// Delete lead (admin)
export const deleteLead = async (leadId: string) => {
  const response = await api.delete(`/admin/leads/${leadId}`);
  return response.data;
};
