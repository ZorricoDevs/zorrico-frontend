import api from './api';

export interface Application {
  _id: string;
  applicationNumber: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  loanDetails: {
    requestedAmount: number;
    interestRate: number;
    tenure: number;
    monthlyEMI: number;
    selectedBank: string;
  };
  documents: {
    submitted: string[];
    pending: string[];
  };
  status: 'submitted' | 'under_review' | 'documents_pending' | 'documents_received' | 'submitted_to_bank' | 'under_bank_review' | 'approved_by_bank' | 'rejected_by_bank' | 'sanctioned' | 'disbursed' | 'rejected';
  timeline: Array<{
    event: string;
    description: string;
    date: string;
    performedBy: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationFilters {
  status?: string;
  customerName?: string;
  loanType?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateApplicationData {
  customerId: string;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  selectedBank: string;
  processingFee?: number;
}

export interface UpdateApplicationData {
  status?: string;
  notes?: string;
  documents?: {
    submitted?: string[];
    pending?: string[];
  };
  loanDetails?: Partial<Application['loanDetails']>;
}

export interface Customer {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  profile?: {
    employment?: {
      monthlyIncome?: number;
    };
    address?: {
      city?: string;
      state?: string;
    };
  };
}

// Application Management API
export const applicationApi = {
  // Admin endpoints
  getAllApplications: async (filters: ApplicationFilters = {}): Promise<{
    applications: Application[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/admin/applications?${params.toString()}`);
    return response.data.data;
  },

  getApplicationById: async (id: string): Promise<Application> => {
    const response = await api.get(`/admin/applications/${id}`);
    return response.data.data;
  },

  createApplication: async (data: CreateApplicationData): Promise<Application> => {
    const response = await api.post('/admin/applications', data);
    return response.data.data;
  },

  updateApplication: async (id: string, data: UpdateApplicationData): Promise<Application> => {
    const response = await api.put(`/admin/applications/${id}`, data);
    return response.data.data;
  },

  updateApplicationStatus: async (
    id: string,
    status: Application['status'],
    notes?: string
  ): Promise<Application> => {
    const response = await api.put(`/admin/applications/${id}/status`, { status, notes });
    return response.data.data;
  },

  deleteApplication: async (id: string): Promise<void> => {
    await api.delete(`/admin/applications/${id}`);
  },

  // Document management
  uploadDocument: async (applicationId: string, file: File, documentType: string): Promise<string> => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    const response = await api.post(`/admin/applications/${applicationId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.documentUrl;
  },

  verifyDocument: async (applicationId: string, documentName: string): Promise<void> => {
    await api.put(`/admin/applications/${applicationId}/documents/${documentName}/verify`);
  },

  // Get eligible customers for new application
  getEligibleCustomers: async (): Promise<Customer[]> => {
    const response = await api.get('/admin/users?role=customer&status=active');
    const users = response.data.data?.users || response.data.data || [];
    return users.map((user: any) => ({
      _id: user._id,
      fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email,
      phone: user.phone,
      customerId: user.customerId
    }));
  },

  // Customer endpoints
  getMyApplications: async (): Promise<Application[]> => {
    const response = await api.get('/application');
    return response.data;
  },

  getMyApplicationById: async (id: string): Promise<Application> => {
    const response = await api.get(`/application/${id}`);
    return response.data;
  },

  uploadMyDocument: async (applicationId: string, file: File, documentType: string): Promise<string> => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    const response = await api.post(`/application/${applicationId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.documentUrl;
  },

  // Real-time polling for updates
  pollApplicationUpdates: async (lastUpdateTime: string): Promise<Application[]> => {
    const response = await api.get(`/application/updates?since=${lastUpdateTime}`);
    return response.data;
  },

  // Application statistics
  getApplicationStats: async (): Promise<{
    totalApplications: number;
    byStatus: Record<string, number>;
    monthlyTrend: Array<{ month: string; count: number }>;
    avgProcessingTime: number;
  }> => {
    const response = await api.get('/admin/applications/stats');
    return response.data.data;
  }
};

export default applicationApi;
