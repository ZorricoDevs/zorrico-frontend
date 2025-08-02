import api from './api';

export interface Lead {
  _id: string;
  name: string;
  contact: string;
  email: string;
  loanAmount: number;
  propertyDetails: string;
  status: 'new' | 'contacted' | 'qualified' | 'processing' | 'converted';
  createdDate: string;
  lastContact?: string;
  source: string;
  priority: 'high' | 'medium' | 'low';
  brokerId: string;
  deletedByBroker?: boolean;
}

export interface BrokerApplication {
  id: string;
  leadId: string;
  customerName: string;
  email: string;
  phone: string;
  loanAmount: number;
  loanType: string;
  applicationDate: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  bankName: string;
  interestRate?: number;
  commission?: number;
  tenure: number;
  brokerId: string;
}

export interface BrokerStats {
  totalLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  totalApplications: number;
  approvedApplications: number;
  totalCommission: number;
  monthlyCommission: number;
  conversionRate: number;
  avgLoanAmount: number;
  activeClients: number;
}

export interface BrokerAnalytics {
  monthlyTrends: {
    month: string;
    leads: number;
    applications: number;
    conversions: number;
    commission: number;
  }[];
  leadSources: {
    source: string;
    count: number;
    percentage: number;
  }[];
  statusDistribution: {
    status: string;
    count: number;
    percentage: number;
  }[];
  topPerformingBanks: {
    bankName: string;
    applications: number;
    approvalRate: number;
    avgCommission: number;
  }[];
}

class BrokerApiService {
  // Dashboard Stats
  async getBrokerStats(): Promise<BrokerStats> {
    try {
      console.log('BrokerAPI Debug - Fetching broker stats...');
      const response = await api.get('/broker/stats');
      console.log('BrokerAPI Debug - Stats response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('BrokerAPI Debug - Failed to fetch broker stats:', error);
      console.error('BrokerAPI Debug - Stats error response:', error.response?.data);
      throw error;
    }
  }

  // Analytics
  async getBrokerAnalytics(): Promise<BrokerAnalytics> {
    try {
      const response = await api.get('/broker/analytics');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch broker analytics:', error);
      throw error;
    }
  }

  // Lead Management
  async getLeads(): Promise<Lead[]> {
    try {
      console.log('BrokerAPI Debug - Fetching leads...');
      const response = await api.get('/broker/leads');
      console.log('BrokerAPI Debug - Leads response:', response.data);

      // Ensure response is an array
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.leads)) {
        return response.data.leads;
      } else {
        console.warn('BrokerAPI Debug - Unexpected leads response format:', response.data);
        return [];
      }
    } catch (error: any) {
      console.error('BrokerAPI Debug - Failed to fetch leads:', error);
      console.error('BrokerAPI Debug - Error response:', error.response?.data);

      // If the broker-specific endpoint fails, try a fallback approach
      if (error.response?.status === 404 || error.response?.status === 500) {
        console.log('BrokerAPI Debug - Trying fallback leads endpoint...');
        try {
          const fallbackResponse = await api.get('/leads?assignedTo=broker');
          console.log('BrokerAPI Debug - Fallback leads response:', fallbackResponse.data);
          return Array.isArray(fallbackResponse.data) ? fallbackResponse.data : [];
        } catch (fallbackError) {
          console.error('BrokerAPI Debug - Fallback also failed:', fallbackError);
        }
      }

      throw error;
    }
  }

  async createLead(
    leadData: Omit<Lead, '_id' | 'createdDate' | 'brokerId' | 'status'>
  ): Promise<Lead> {
    try {
      const response = await api.post('/broker/leads', leadData);
      return response.data;
    } catch (error) {
      console.error('Failed to create lead:', error);
      throw error;
    }
  }

  async updateLead(leadId: string, updates: Partial<Lead>): Promise<Lead> {
    try {
      const response = await api.patch(`/broker/leads/${leadId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update lead:', error);
      throw error;
    }
  }

  async deleteLead(leadId: string): Promise<void> {
    try {
      await api.delete(`/broker/leads/${leadId}`);
    } catch (error) {
      console.error('Failed to delete lead:', error);
      throw error;
    }
  }

  // Application Management
  async getApplications(): Promise<BrokerApplication[]> {
    try {
      const response = await api.get('/broker/applications');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      throw error;
    }
  }

  async createApplication(
    applicationData: Omit<BrokerApplication, 'id' | 'applicationDate' | 'brokerId'>
  ): Promise<BrokerApplication> {
    try {
      const response = await api.post('/broker/applications', applicationData);
      return response.data;
    } catch (error) {
      console.error('Failed to create application:', error);
      throw error;
    }
  }

  async updateApplication(
    applicationId: string,
    updates: Partial<BrokerApplication>
  ): Promise<BrokerApplication> {
    try {
      const response = await api.patch(`/broker/applications/${applicationId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update application:', error);
      throw error;
    }
  }

  // Commission Tracking
  async getCommissionHistory(): Promise<
    {
      month: string;
      totalCommission: number;
      applications: number;
      avgCommissionPerApp: number;
    }[]
  > {
    try {
      const response = await api.get('/broker/commission-history');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch commission history:', error);
      throw error;
    }
  }

  // Performance Metrics
  async getPerformanceMetrics(period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<{
    leadsGenerated: number;
    applicationsSubmitted: number;
    approvalRate: number;
    conversionRate: number;
    avgLoanAmount: number;
    totalCommission: number;
    ranking: number;
    totalBrokers: number;
  }> {
    try {
      const response = await api.get(`/broker/performance?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error);
      throw error;
    }
  }
}

export const brokerApi = new BrokerApiService();
