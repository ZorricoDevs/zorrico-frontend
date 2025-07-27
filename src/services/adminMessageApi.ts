import api from './api';

export interface AdminMessage {
  id?: string;
  _id?: string;
  brokerName?: string;
  brokerEmail?: string;
  leadName?: string;
  leadId?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Fetch broker-to-admin messages
export const getAdminMessages = async (query: string = ''): Promise<AdminMessage[]> => {
  try {
    const response = await api.get(`/admin/messages${query}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching admin messages:', error);
    throw error;
  }
};

// Mark a message as read
export const markAdminMessageAsRead = async (messageId: string): Promise<void> => {
  await api.post('/admin/messages/read', { messageId });
};
