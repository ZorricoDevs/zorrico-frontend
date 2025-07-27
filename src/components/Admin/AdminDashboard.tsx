import React, { useState, useEffect, useCallback } from 'react';
import { getAdminMessages, markAdminMessageAsRead, type AdminMessage } from '../../services/adminMessageApi';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  LinearProgress,
  Avatar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Snackbar,
  CircularProgress,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  Autocomplete
} from '@mui/material';
import {
  AdminPanelSettings,
  Assignment,
  Visibility,
  Edit,
  Delete,
  People,
  AccountBalance,
  Work,
  Phone,
  Email,
  Assessment,
  PersonAdd,
  ManageAccounts,
  Analytics,
  Refresh,
  Close,
  Save,
  Business,
  Mail,
  LockReset,
  Settings,
  Search,
  FilterList,
  MonetizationOn,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart,
  Timeline,
  Today,
  CalendarToday,
  Group,
  CheckCircle,
  Cancel,
  Pending,
  AttachMoney,
  Restore
} from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import { getDashboardStats, getAllUsers, deleteUser as deleteUserAPI, getAnalyticsData, getAllLeads, assignBrokerToLead, updateLead, resetUserPassword, deleteLead as deleteLeadAPI } from '../../services/adminApi';
import applicationApi, { Application, ApplicationFilters, Customer } from '../../services/applicationApi';
import { getAllProperties, createProperty, updateProperty } from '../../services/propertyApi';



// Messages Dialog Component
const MessagesDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  messages: AdminMessage[];
  onMarkAsRead: (messageId: string) => void;
}> = ({ open, onClose, messages, onMarkAsRead }) => {
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null);

  const handleMessageClick = (message: AdminMessage) => {
    setSelectedMessage(message);
    if (!message.read) {
      onMarkAsRead(message.id || message._id || '');
    }
  };

  // Helper function to render messages list
  function renderMessages() {
    if (messages.length === 0) {
      return (
        <ListItem>
          <ListItemText primary="No messages" />
        </ListItem>
      );
    }
    return messages.map((message) => {
      const isSelected = (selectedMessage?.id === message.id || selectedMessage?._id === message._id);
      const listItemSx = {
        cursor: 'pointer',
        borderLeft: message.read ? 'none' : '3px solid',
        borderColor: 'primary.main',
        pl: message.read ? '16px' : '13px',
        bgcolor: isSelected
          ? 'action.selected'
          : (message.read ? 'background.paper' : 'action.hover'),
        transition: 'background-color 0.2s ease-in-out',
        '&:hover': {
          bgcolor: 'action.hover'
        }
      };
      return (
        <ListItem
          key={message.id || message._id}
          onClick={() => handleMessageClick(message)}
          sx={listItemSx}
        >
          <ListItemText
            primary={
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle2" noWrap>
                  {message.brokerName || 'Unknown Broker'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {message.createdAt ? new Date(message.createdAt).toLocaleDateString() : ''}
                </Typography>
              </Box>
            }
            secondary={
              <Typography noWrap variant="body2">
                {message.leadName ? `Re: ${message.leadName}` : 'No lead reference'}
              </Typography>
            }
          />
        </ListItem>
      );
    });
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Broker Messages
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" height={500}>
            {/* Message List */}
            <Box sx={{ width: 300, borderRight: 1, borderColor: 'divider', overflow: 'auto' }}>
              <List>
                {renderMessages()}
              </List>
            </Box>

            {/* Message Content */}
            <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
              {selectedMessage ? (
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6">
                      {selectedMessage.leadName
                        ? `Message about ${selectedMessage.leadName}`
                        : 'Message from broker'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      From: {selectedMessage.brokerName} ({selectedMessage.brokerEmail})
                    </Typography>
                    {selectedMessage.leadId && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        Lead ID: {selectedMessage.leadId}
                      </Typography>
                    )}
                    <Typography variant="caption" display="block" color="text.secondary">
                      {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : ''}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedMessage.message || 'No message content'}
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">Select a message to view</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} startIcon={<Close />}>Close</Button>
          {selectedMessage?.leadId && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // Navigate to lead details
                console.log('View lead:', selectedMessage.leadId);
              }}
              startIcon={<Visibility />}
            >
              View Lead
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};

const AdminDashboard: React.FC = () => {
  // Messaging state (single source of truth)
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [messagesDialogOpen, setMessagesDialogOpen] = useState(false);


  // Fetch messages from backend
  const fetchMessages = useCallback(async (showRead = false) => {
    try {
      const query = showRead ? '?showRead=true' : '';
      const data = await getAdminMessages(query);
      setMessages(data);
      setUnreadCount(data.filter((msg: AdminMessage) => !msg.read).length);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages. Please try again later.');
    }
  }, []);

  // Poll for new messages only when dialog is closed
  useEffect(() => {
    // Always fetch once on mount
    fetchMessages();

    let interval: NodeJS.Timeout | undefined;
    if (!messagesDialogOpen) {
      // Only poll when dialog is closed
      interval = setInterval(() => {
        fetchMessages();
      }, 2592000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchMessages, messagesDialogOpen]);

  // When dialog opens, fetch all messages once and mark as read
  const handleMessagesDialogOpen = () => {
    setMessagesDialogOpen(true);
    fetchMessages(true); // Fetch all messages (including read)
    // Mark all unread messages as read
    messages.forEach(msg => {
      if (!msg.read) {
        handleMarkAsRead(msg.id || msg._id || '');
      }
    });
  };

  // When dialog closes, fetch again to refresh
  const handleMessagesDialogClose = () => {
    setMessagesDialogOpen(false);
    fetchMessages();
  };

  // Mark message as read
  const handleMarkAsRead = async (messageId: string) => {
    if (!messageId) return;

    try {
      await markAdminMessageAsRead(messageId);
      // Optimistically update the UI
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          (msg.id === messageId || msg._id === messageId)
            ? { ...msg, read: true }
            : msg
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark message as read:', err);
      setError('Failed to update message status. Please try again.');
    }
  };
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalCustomers: 0,
    totalBrokers: 0,
    totalBuilders: 0,
    totalAdmins: 0,
    activeUsers: 0,
    pendingApprovals: 0,
    totalApplications: 0,
    monthlyGrowth: 0,
    totalSanctionedLoans: 0,
    totalLeads: 0,
    unassignedLeads: 0,
    convertedLeads: 0,
    leadConversionRate: 0,
  });
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Add User Dialog State
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [addUserStep, setAddUserStep] = useState(0);
  const [newUserRole, setNewUserRole] = useState('customer');
  const [approvedCustomers, setApprovedCustomers] = useState<any[]>([]);
  const [selectedApprovedCustomer, setSelectedApprovedCustomer] = useState('');
  const [manualUser, setManualUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    companyName: '',
    licenseNumber: ''
  });
  const [autoPassword, setAutoPassword] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);

  // User List State
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states for user actions
  const [viewUser, setViewUser] = useState<any | null>(null);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [editUserData, setEditUserData] = useState<any>({});
  const [resetUser, setResetUser] = useState<any | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [deleteUser, setDeleteUser] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Lead Management State
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const [leadSearchQuery, setLeadSearchQuery] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');

  const [leadBrokerFilter, setLeadBrokerFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [leadDialog, setLeadDialog] = useState(false);
  const [assignBrokerDialog, setAssignBrokerDialog] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState('');
  const [brokers, setBrokers] = useState<any[]>([]);

  // Application Management State
  const [applications, setApplications] = useState<any[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState<string | null>(null);
  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [applicationDialog, setApplicationDialog] = useState(false);

  // Add after leadDialog state
  const [editLeadDialog, setEditLeadDialog] = useState(false);
  const [editLeadData, setEditLeadData] = useState<any>({});
  const [leadActionLoading, setLeadActionLoading] = useState(false);
  const [statusDialog, setStatusDialog] = useState(false);
  const [statusLead, setStatusLead] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');

  // Add after leadActionLoading state
  const [deleteLeadDialog, setDeleteLeadDialog] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<any>(null);

  // Fetch approved customers for dropdown
  useEffect(() => {
    if (addUserDialog && newUserRole === 'customer') {
      const fetchCustomers = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/admin/users?role=customer&status=active', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            const customers = data.data?.users || data.data || data.users || [];
            const formattedCustomers = customers.map((customer: any) => ({
              id: customer._id,
              customerId: customer.customerId || `CUST-${customer._id?.slice(-6).toUpperCase()}`,
              name: customer.fullName || `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
              email: customer.email,
              phone: customer.phone || customer.profile?.phone || 'N/A'
            }));
            setApprovedCustomers(formattedCustomers);
          } else {
            console.error('Failed to fetch customers:', response.statusText);
            // Fallback to empty array
            setApprovedCustomers([]);
          }
        } catch (error) {
          console.error('Error fetching customers:', error);
          // Fallback to empty array
          setApprovedCustomers([]);
        }
      };

      fetchCustomers();
    }
  }, [addUserDialog, newUserRole]);

  // Password generator
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAutoPassword(password);
    setManualUser((u) => ({ ...u, password }));
  };

  // Handle user creation
  const handleCreateUser = async () => {
    setCreatingUser(true);
    setError(null);

    try {
      // Generate customer ID for customers
      let customerId = '';
      if (newUserRole === 'customer') {
        const timestamp = Date.now().toString().slice(-6);
        const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
        customerId = `CUST-${timestamp}${randomSuffix}`;
      }

      const userData = {
        firstName: manualUser.firstName,
        lastName: manualUser.lastName,
        email: manualUser.email,
        phone: manualUser.phone,
        password: manualUser.password || autoPassword,
        role: newUserRole,
        ...(newUserRole === 'customer' && { customerId }),
        ...(newUserRole === 'broker' || newUserRole === 'builder' ? {
          companyName: manualUser.companyName,
          licenseNumber: manualUser.licenseNumber
        } : {})
      };

      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const result = await response.json();
        setCreatingUser(false);
        setAddUserDialog(false);
        setManualUser({ firstName: '', lastName: '', email: '', phone: '', password: '', companyName: '', licenseNumber: '' });
        setAutoPassword('');
        setSelectedApprovedCustomer('');

        // Refresh user list and stats
        fetchUsers();
        fetchDashboardStats();

        setSuccess(`${newUserRole.charAt(0).toUpperCase() + newUserRole.slice(1)} created successfully!${customerId ? ` Customer ID: ${customerId}` : ''}`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create user');
        setCreatingUser(false);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user. Please try again.');
      setCreatingUser(false);
    }
  };

  // Handle user actions (stubbed, replace with real API calls)
  const handleEditUserSave = async () => {
    setActionLoading(true);
    // TODO: Replace with real API call
    setTimeout(() => {
      setActionLoading(false);
      setEditUser(null);
      setEditUserData({});
      fetchUsers();
      setSuccess('User updated successfully!');
    }, 800);
  };

  const handleResetPasswordSave = async () => {
    if (!resetUser || !resetPassword) return;
    setActionLoading(true);
    try {
      await resetUserPassword(resetUser._id, resetPassword, false); // Do not send notification
      setActionLoading(false);
      setResetUser(null);
      setResetPassword('');
      setSuccess('Password reset successfully!');
    } catch (err) {
      setActionLoading(false);
      setError('Failed to reset password.');
    }
  };

  const handleDeleteUserConfirm = async () => {
    if (!deleteUser) return;

    setActionLoading(true);
    try {
      await deleteUserAPI(deleteUser._id);
      setActionLoading(false);
      setDeleteUser(null);
      fetchUsers();
      setSuccess('User deleted successfully!');
    } catch (error) {
      setActionLoading(false);
      setError('Failed to delete user. Please try again.');
      console.error('Delete user error:', error);
    }
  };

  const handleAssignBroker = async () => {
    if (!selectedLead) return;

    setActionLoading(true);
    try {
      await assignBrokerToLead(selectedLead._id, selectedBroker);
      setActionLoading(false);
      setAssignBrokerDialog(false);
      setSelectedBroker('');
      setSelectedLead(null);
      fetchLeads(); // Refresh leads to show updated assignment
      setSuccess('Broker assigned successfully!');
    } catch (error) {
      setActionLoading(false);
      setError('Failed to assign broker. Please try again.');
      console.error('Assign broker error:', error);
    }
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setResetPassword(password);
  };

  // Fetch analytics data
  const fetchAnalyticsData = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const data = await getAnalyticsData();
      setAnalyticsData(data);
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Analytics data error:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  // Fetch dashboard data
  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    try {
      const statsData = await getDashboardStats();
      setStats(statsData);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user list from backend
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (err) {
      setUsersError('Failed to fetch users');
      console.error('User list error:', err);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  // Fetch leads from backend
  const fetchLeads = useCallback(async () => {
    setLeadsLoading(true);
    setLeadsError(null);
    try {
      // Use the admin leads API
      const leadsData = await getAllLeads();
      setLeads(leadsData);

      // Also fetch brokers for assignment
      const brokersData = await getAllUsers();
      setBrokers(brokersData.filter((user: any) => user.role === 'broker'));
    } catch (err) {
      setLeadsError('Failed to fetch leads');
      console.error('Leads list error:', err);
    } finally {
      setLeadsLoading(false);
    }
  }, []);

  // Fetch applications from backend
  const fetchApplications = useCallback(async () => {
    setApplicationsLoading(true);
    setApplicationsError(null);
    try {
      const response = await applicationApi.getAllApplications();
      setApplications(response.applications);
    } catch (err) {
      setApplicationsError('Failed to fetch applications');
      console.error('Applications list error:', err);
    } finally {
      setApplicationsLoading(false);
    }
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (user.fullName || user.firstName || user.lastName || '')?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.phone?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query) ||
      user.customerId?.toLowerCase().includes(query)
    );
  });

  // Filter leads based on search query and filters
  const filteredLeads = leads.filter(lead => {
    // Search query filter
    if (leadSearchQuery) {
      const query = leadSearchQuery.toLowerCase();
      const matchesSearch =
        lead.name?.toLowerCase().includes(query) ||
        lead.email?.toLowerCase().includes(query) ||
        lead.contact?.toLowerCase().includes(query) ||
        lead.propertyDetails?.toLowerCase().includes(query) ||
        lead.source?.toLowerCase().includes(query) ||
        lead.notes?.toLowerCase().includes(query);

      if (!matchesSearch) return false;
    }

    // Status filter
    if (leadStatusFilter !== 'all' && lead.status !== leadStatusFilter) {
      return false;
    }



    // Broker filter
    if (leadBrokerFilter !== 'all') {
      if (leadBrokerFilter === 'unassigned') {
        if (lead.brokerId) return false;
      } else {
        // If brokerId is populated object, check email; if string, check if it matches broker ID
        const brokerMatch = typeof lead.brokerId === 'object' ?
          lead.brokerId?.email === leadBrokerFilter :
          brokers.find(b => b._id === lead.brokerId)?.email === leadBrokerFilter;

        if (!brokerMatch) return false;
      }
    }

    return true;
  });

  // Load data on component mount
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Fetch users on mount or when Users tab is selected
  useEffect(() => {
    if (tabValue === 0) fetchUsers();
    if (tabValue === 1) fetchAnalyticsData();
    if (tabValue === 2) fetchLeads();
    if (tabValue === 3) fetchApplications();
  }, [tabValue, fetchUsers, fetchAnalyticsData, fetchLeads, fetchApplications]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'customer': return 'primary';
      case 'broker': return 'warning';
      case 'builder': return 'success';
      case 'admin': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  // Edit Lead handler
  const handleEditLeadSave = async () => {
    setLeadActionLoading(true);
    try {
      await updateLead(editLeadData._id, editLeadData);
      setEditLeadDialog(false);
      setEditLeadData({});
      fetchLeads();
      setSuccess('Lead updated successfully!');
    } catch (err) {
      setError('Failed to update lead.');
    } finally {
      setLeadActionLoading(false);
    }
  };

  // Update Status handler
  const handleStatusUpdate = async () => {
    if (!statusLead || !newStatus) return;
    setLeadActionLoading(true);
    try {
      await updateLead(statusLead._id, { status: newStatus });
      setStatusDialog(false);
      setStatusLead(null);
      setNewStatus('');
      fetchLeads();
      setSuccess('Lead status updated!');
    } catch (err) {
      setError('Failed to update status.');
    } finally {
      setLeadActionLoading(false);
    }
  };

  // Lead delete handler
  const handleDeleteLeadConfirm = async () => {
    if (!leadToDelete) return;
    setLeadActionLoading(true);
    try {
      await deleteLeadAPI(leadToDelete._id);
      setDeleteLeadDialog(false);
      setLeadToDelete(null);
      fetchLeads();
      setSuccess('Lead deleted successfully!');
    } catch (err) {
      setError('Failed to delete lead.');
    } finally {
      setLeadActionLoading(false);
    }
  };


  // --- Property Management State ---
  const [showCreateProperty, setShowCreateProperty] = useState(false);
  const [propertyForm, setPropertyForm] = useState({
    name: '',
    location: '',
    type: '',
    builder: '',
    price: '',
    description: '',
    area: '',
    pricePerSqft: '',
    totalUnits: '',
    availableUnits: '',
    configuration: '',
    amenities: '',
    status: '',
    leadRequests: '',
    soldUnits: '',
    completionDate: ''
  });
  const [propertyActionLoading, setPropertyActionLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);

// Edit property dialog state
const [editProperty, setEditProperty] = useState<any | null>(null);
const [editPropertyForm, setEditPropertyForm] = useState<any | null>(null);

  // Fetch properties (admin sees all, including soft deleted)
  const fetchProperties = useCallback(async () => {
    setPropertiesLoading(true);
    setPropertiesError(null);
    try {
      // Replace with your API call
      const data = await getAllProperties();
      setProperties(data);
    } catch (err) {
      setPropertiesError('Failed to fetch properties');
    } finally {
      setPropertiesLoading(false);
    }
  }, []);

  // Create property handler
  const handleCreateProperty = async () => {
    setPropertyActionLoading(true);
    try {
      // Replace with your API call
      await createProperty({ ...propertyForm, isDeleted: false });
      setShowCreateProperty(false);
      setPropertyForm({
        name: '',
        location: '',
        type: '',
        builder: '',
        price: '',
        description: '',
        area: '',
        pricePerSqft: '',
        totalUnits: '',
        availableUnits: '',
        configuration: '',
        amenities: '',
        status: '',
        leadRequests: '',
        soldUnits: '',
        completionDate: ''
      });
      fetchProperties();
      setSuccess('Property created successfully!');
    } catch (err) {
      setError('Failed to create property');
    } finally {
      setPropertyActionLoading(false);
    }
  };

  // Soft delete/restore property handler
  const handleSoftDeleteProperty = async (property: any) => {
    setPropertyActionLoading(true);
    try {
      // Replace with your API call
      await updateProperty(property._id, { isDeleted: !property.isDeleted });
      fetchProperties();
      setSuccess(property.isDeleted ? 'Property restored!' : 'Property soft deleted!');
    } catch (err) {
      setError('Failed to update property');
    } finally {
      setPropertyActionLoading(false);
    }
  };

  // Edit property handler (stub)
  const handleEditProperty = (property: any) => {
    setEditProperty(property);
    setEditPropertyForm({ ...property, amenities: Array.isArray(property.amenities) ? property.amenities.join(', ') : property.amenities });
  };

  // Save edited property
  const handleEditPropertySave = async () => {
    if (!editPropertyForm) return;
    setPropertyActionLoading(true);
    try {
      await updateProperty(editPropertyForm._id, {
        ...editPropertyForm,
        amenities: typeof editPropertyForm.amenities === 'string' ? editPropertyForm.amenities.split(',').map((a: string) => a.trim()) : editPropertyForm.amenities
      });
      setEditProperty(null);
      setEditPropertyForm(null);
      fetchProperties();
      setSuccess('Property updated successfully!');
    } catch (err) {
      setError('Failed to update property');
    } finally {
      setPropertyActionLoading(false);
    }
  };
        {/* Edit Property Dialog */}
        <Dialog open={!!editProperty} onClose={() => setEditProperty(null)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Property</DialogTitle>
          <DialogContent>
            {editPropertyForm && (
              <Stack spacing={3} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Property Name"
                  value={editPropertyForm.name}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, name: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Type"
                  value={editPropertyForm.type}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, type: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Location"
                  value={editPropertyForm.location}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, location: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Area (sqft)"
                  value={editPropertyForm.area}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, area: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Price Per Sqft"
                  type="number"
                  value={editPropertyForm.pricePerSqft}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, pricePerSqft: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Total Units"
                  type="number"
                  value={editPropertyForm.totalUnits}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, totalUnits: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Available Units"
                  type="number"
                  value={editPropertyForm.availableUnits}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, availableUnits: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Configuration"
                  value={editPropertyForm.configuration}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, configuration: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Amenities (comma separated)"
                  value={editPropertyForm.amenities}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, amenities: e.target.value }))}
                />
                <TextField
                  fullWidth
                  label="Status"
                  value={editPropertyForm.status}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, status: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Lead Requests"
                  type="number"
                  value={editPropertyForm.leadRequests}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, leadRequests: e.target.value }))}
                />
                <TextField
                  fullWidth
                  label="Sold Units"
                  type="number"
                  value={editPropertyForm.soldUnits}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, soldUnits: e.target.value }))}
                />
                <TextField
                  fullWidth
                  label="Completion Date (YYYY-MM-DD)"
                  value={editPropertyForm.completionDate}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, completionDate: e.target.value }))}
                />
                <TextField
                  fullWidth
                  label="Builder"
                  value={editPropertyForm.builder}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, builder: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={editPropertyForm.description}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, description: e.target.value }))}
                  multiline
                  minRows={2}
                />
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditProperty(null)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleEditPropertySave}
              disabled={propertyActionLoading || !editPropertyForm || !editPropertyForm.name || !editPropertyForm.type || !editPropertyForm.location || !editPropertyForm.area || !editPropertyForm.pricePerSqft || !editPropertyForm.totalUnits || !editPropertyForm.availableUnits || !editPropertyForm.configuration || !editPropertyForm.status || !editPropertyForm.builder}
            >
              {propertyActionLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>

  // Fetch properties on mount or when Property Management tab is selected
  useEffect(() => {
    if (tabValue === 3) fetchProperties();
  }, [tabValue, fetchProperties]);

  // State for viewing a property in the Property Management tab
  const [viewProperty, setViewProperty] = useState<any | null>(null);

  // Show all leads for a property in a dialog
  function handleViewLeads(property: any): void {
    // Filter leads for this property and open the lead dialog with the first lead (if any)
    const propertyLeads = leads.filter(
      (lead) =>
        lead.propertyDetails &&
        (lead.propertyDetails === property.name ||
          lead.propertyDetails === property._id ||
          (typeof lead.propertyDetails === 'object' && lead.propertyDetails._id === property._id))
    );
    if (propertyLeads.length > 0) {
      setSelectedLead(propertyLeads[0]);
      setLeadDialog(true);
    } else {
      setSuccess('No leads found for this property.');
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          <AdminPanelSettings sx={{ mr: 2, verticalAlign: 'middle' }} />
          Admin Dashboard
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => {
              fetchDashboardStats();
            }}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<TrendingUp />}
            onClick={() => setTabValue(2)}
            sx={{ color: 'warning.main', borderColor: 'warning.main' }}
          >
            Manage Leads
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => {
              setAddUserDialog(true);
              setAddUserStep(0);
              setManualUser({ firstName: '', lastName: '', email: '', phone: '', password: '', companyName: '', licenseNumber: '' });
              setAutoPassword('');
              setSelectedApprovedCustomer('');
              setNewUserRole('customer');
            }}
          >
            Add User
          </Button>
        </Stack>
      </Box>

      {/* Add User Dialog */}
      <Dialog open={addUserDialog} onClose={() => setAddUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>User Role</InputLabel>
              <Select
                value={newUserRole}
                label="User Role"
                onChange={(e) => setNewUserRole(e.target.value)}
              >
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="broker">Broker</MenuItem>
                <MenuItem value="builder">Builder</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {newUserRole === 'customer' && (
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Approved Customer (optional)</InputLabel>
                <Select
                  value={selectedApprovedCustomer}
                  label="Approved Customer (optional)"
                  onChange={(e) => {
                    setSelectedApprovedCustomer(e.target.value);
                    const found = approvedCustomers.find(c => c.id === e.target.value);
                    if (found) {
                      setManualUser({
                        firstName: found.name.split(' ')[0],
                        lastName: found.name.split(' ').slice(1).join(' '),
                        email: found.email,
                        phone: found.phone,
                        password: '',
                        companyName: '',
                        licenseNumber: ''
                      });
                    }
                  }}
                >
                  <MenuItem value="">-- Manual Entry --</MenuItem>
                  {approvedCustomers.map((c: any) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.customerId ? `[${c.customerId}] ` : ''}{c.name} ({c.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              fullWidth
              label="First Name"
              value={manualUser.firstName}
              onChange={e => setManualUser(u => ({ ...u, firstName: e.target.value }))}
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              value={manualUser.lastName}
              onChange={(e) => setManualUser((u: any) => ({ ...u, lastName: e.target.value }))}
              required
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              value={manualUser.email}
              onChange={(e) => setManualUser((u: any) => ({ ...u, email: e.target.value }))}
              required
            />
            <TextField
              fullWidth
              label="Phone"
              value={manualUser.phone}
              onChange={(e) => setManualUser((u: any) => ({ ...u, phone: e.target.value }))}
              required
            />
          </Box>
          {(newUserRole === 'broker' || newUserRole === 'builder') && (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
              <TextField
                fullWidth
                label="Company Name"
                value={manualUser.companyName}
                onChange={(e) => setManualUser((u: any) => ({ ...u, companyName: e.target.value }))}
                required
              />
              <TextField
                fullWidth
                label="License Number (optional)"
                value={manualUser.licenseNumber}
                onChange={(e) => setManualUser((u: any) => ({ ...u, licenseNumber: e.target.value }))}
              />
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <TextField
              fullWidth
              label="Password"
              type="text"
              value={manualUser.password || autoPassword}
              onChange={(e) => setManualUser((u: any) => ({ ...u, password: e.target.value }))}
              required
            />
            <Button variant="outlined" onClick={generatePassword} sx={{ minWidth: 'auto', px: 2 }}>
              Generate Password
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddUserDialog(false)} startIcon={<Close />}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateUser}
            disabled={creatingUser || !manualUser.firstName || !manualUser.lastName || !manualUser.email || !manualUser.phone || !(manualUser.password || autoPassword)}
            startIcon={creatingUser ? <Refresh /> : <Save />}
          >
            {creatingUser ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #304FFE 0%, #5C6FFF 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.totalUsers}
                  </Typography>
                  <Typography color="rgba(255,255,255,0.8)">Total Users</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #00C853 0%, #4CAF50 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ManageAccounts sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.totalCustomers}
                  </Typography>
                  <Typography color="rgba(255,255,255,0.8)">Customers</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Work sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.totalBrokers}
                  </Typography>
                  <Typography color="rgba(255,255,255,0.8)">Brokers</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccountBalance sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.totalBuilders}
                  </Typography>
                  <Typography color="rgba(255,255,255,0.8)">Builders</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AdminPanelSettings sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.totalAdmins}
                  </Typography>
                  <Typography color="rgba(255,255,255,0.8)">Admins</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Additional Stats Row */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <MonetizationOn sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    ₹{stats.totalSanctionedLoans?.toLocaleString() || '0'}
                  </Typography>
                  <Typography color="rgba(255,255,255,0.8)">Total Sanctioned Loans</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.totalLeads || '0'}
                  </Typography>
                  <Typography color="rgba(255,255,255,0.8)">Total Leads</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #D32F2F 0%, #F44336 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assignment sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.unassignedLeads || '0'}
                  </Typography>
                  <Typography color="rgba(255,255,255,0.8)">Unassigned Leads</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assessment sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {stats.leadConversionRate?.toFixed(1) || '0'}%
                  </Typography>
                  <Typography color="rgba(255,255,255,0.8)">Lead Conversion</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Main Content */}
      <Card sx={{ mb: 3, overflow: 'visible' }}>
        <Box sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 3,
          borderRadius: '12px 12px 0 0'
        }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Dashboard Navigation
          </Typography>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'white',
                height: 3,
                borderRadius: '2px'
              },
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                minHeight: 60,
                px: 3,
                '&.Mui-selected': {
                  color: 'white',
                },
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2
                }
              }
            }}
          >
            <Tab
              label="Users"
              icon={<People sx={{ fontSize: 24 }} />}
              iconPosition="start"
              sx={{
                flexDirection: 'row',
                gap: 1,
                '& .MuiTab-iconWrapper': {
                  mb: 0
                }
              }}
            />
            <Tab
              label="Analytics"
              icon={<Analytics sx={{ fontSize: 24 }} />}
              iconPosition="start"
              sx={{
                flexDirection: 'row',
                gap: 1,
                '& .MuiTab-iconWrapper': {
                  mb: 0
                }
              }}
            />
            <Tab
              label="Lead Management"
              icon={<TrendingUp sx={{ fontSize: 24 }} />}
              iconPosition="start"
              sx={{
                flexDirection: 'row',
                gap: 1,
                '& .MuiTab-iconWrapper': {
                  mb: 0
                }
              }}
            />
            <Tab
              label="Property Management"
              icon={<Business sx={{ fontSize: 24 }} />}
              iconPosition="start"
              sx={{
                flexDirection: 'row',
                gap: 1,
                '& .MuiTab-iconWrapper': {
                  mb: 0
                }
              }}
            />
            <Tab
              label="Applications"
              icon={<Assignment sx={{ fontSize: 24 }} />}
              iconPosition="start"
              sx={{
                flexDirection: 'row',
                gap: 1,
                '& .MuiTab-iconWrapper': {
                  mb: 0
                }
              }}
            />
            <Tab
              label="Reports"
              icon={<Assessment sx={{ fontSize: 24 }} />}
              iconPosition="start"
              sx={{
                flexDirection: 'row',
                gap: 1,
                '& .MuiTab-iconWrapper': {
                  mb: 0
                }
              }}
            />
          </Tabs>
        </Box>
      </Card>

      {/* Users Tab */}
      {tabValue === 0 && (
        <Card>
          <CardContent>
            {/* Header with Search */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3,
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    User Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {filteredUsers.length} of {users.length} users
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Search Field */}
                <TextField
                  size="small"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ minWidth: 250 }}
                  InputProps={{
                    startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                    endAdornment: searchQuery && (
                      <IconButton
                        size="small"
                        onClick={() => setSearchQuery('')}
                        sx={{ p: 0.5 }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    )
                  }}
                />
              </Box>
            </Box>

            {/* User List Content */}
            {usersLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                <CircularProgress />
              </Box>
            ) : usersError ? (
              <Alert severity="error">{usersError}</Alert>
            ) : filteredUsers.length === 0 ? (
              <Box sx={{
                textAlign: 'center',
                py: 6,
                borderRadius: 2,
                bgcolor: 'background.default',
                border: '2px dashed',
                borderColor: 'divider'
              }}>
                {searchQuery ? (
                  <>
                    <Search sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No users found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your search terms
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => setSearchQuery('')}
                      sx={{ mt: 2 }}
                    >
                      Clear Search
                    </Button>
                  </>
                ) : (
                  <>
                    <People sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No users found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Users will appear here once they are added to the system
                    </Typography>
                  </>
                )}
              </Box>
            ) : (
              <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                {filteredUsers.map((user, index) => (
                  <React.Fragment key={user._id}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: 3,
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      {/* User Avatar & Info */}
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 3 }}>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: user.role === 'admin' ? 'error.main' :
                                    user.role === 'builder' ? 'warning.main' : 'success.main',
                            fontSize: '1.25rem',
                            fontWeight: 600
                          }}
                        >
                          {(user.fullName || user.firstName || user.email)?.charAt(0)?.toUpperCase()}
                        </Avatar>

                        {/* User Details */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User'}
                            </Typography>
                            <Chip
                              label={user.role}
                              size="small"
                              color={
                                user.role === 'admin' ? 'error' :
                                user.role === 'builder' ? 'warning' : 'success'
                              }
                              sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                            />
                            <Chip
                              label={user.status}
                              size="small"
                              variant="outlined"
                              color={user.status === 'active' ? 'success' : 'default'}
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {user.email}
                              </Typography>
                            </Box>

                            {user.phone && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {user.phone}
                                </Typography>
                              </Box>
                            )}

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Badge sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                }) : 'Unknown'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* Action Buttons */}
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => setViewUser(user)}>
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit User">
                            <IconButton size="small" onClick={() => { setEditUser(user); setEditUserData(user); }}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reset Password">
                            <IconButton size="small" onClick={() => { setResetUser(user); setResetPassword(''); }}>
                              <LockReset fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete User">
                            <IconButton size="small" color="error" onClick={() => setDeleteUser(user)}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                    </ListItem>
                    {index < filteredUsers.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      )}
      {/* Analytics Tab */}
      {tabValue === 1 && (
        <Box>
          {analyticsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <CircularProgress size={60} />
            </Box>
          ) : analyticsData ? (
            <>
              {/* Key Metrics Overview */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <Card sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="h4" fontWeight="bold" color="white">
                            {analyticsData.userAnalytics.newUsersThisMonth}
                          </Typography>
                          <Typography color="rgba(255,255,255,0.8)" variant="body2">
                            New Users This Month
                          </Typography>
                          <Box display="flex" alignItems="center" mt={1}>
                            {analyticsData.userAnalytics.userGrowthRate >= 0 ? (
                              <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                            ) : (
                              <TrendingDown sx={{ fontSize: 16, mr: 0.5 }} />
                            )}
                            <Typography variant="caption" color="rgba(255,255,255,0.9)">
                              {Math.abs(analyticsData.userAnalytics.userGrowthRate).toFixed(1)}% vs last month
                            </Typography>
                          </Box>
                        </Box>
                        <Group sx={{ fontSize: 40, opacity: 0.7 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <Card sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="h4" fontWeight="bold" color="white">
                            {analyticsData.applicationAnalytics.applicationsThisMonth}
                          </Typography>
                          <Typography color="rgba(255,255,255,0.8)" variant="body2">
                            Applications This Month
                          </Typography>
                          <Box display="flex" alignItems="center" mt={1}>
                            {analyticsData.applicationAnalytics.applicationGrowthRate >= 0 ? (
                              <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                            ) : (
                              <TrendingDown sx={{ fontSize: 16, mr: 0.5 }} />
                            )}
                            <Typography variant="caption" color="rgba(255,255,255,0.9)">
                              {Math.abs(analyticsData.applicationAnalytics.applicationGrowthRate).toFixed(1)}% vs last month
                            </Typography>
                          </Box>
                        </Box>
                        <Assignment sx={{ fontSize: 40, opacity: 0.7 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <Card sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="h4" fontWeight="bold" color="white">
                            {analyticsData.applicationAnalytics.approvalRate.toFixed(1)}%
                          </Typography>
                          <Typography color="rgba(255,255,255,0.8)" variant="body2">
                            Approval Rate
                          </Typography>
                          <Typography variant="caption" color="rgba(255,255,255,0.9)">
                            {analyticsData.applicationAnalytics.approvedApplications} of {analyticsData.applicationAnalytics.totalApplications} approved
                          </Typography>
                        </Box>
                        <CheckCircle sx={{ fontSize: 40, opacity: 0.7 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <Card sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="h4" fontWeight="bold" color="white">
                            ₹{(analyticsData.loanAnalytics.averageLoanAmount / 100000).toFixed(1)}L
                          </Typography>
                          <Typography color="rgba(255,255,255,0.8)" variant="body2">
                            Average Loan Amount
                          </Typography>
                          <Typography variant="caption" color="rgba(255,255,255,0.9)">
                            From {analyticsData.loanAnalytics.sanctionedLoansCount} sanctioned loans
                          </Typography>
                        </Box>
                        <AttachMoney sx={{ fontSize: 40, opacity: 0.7 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>

              {/* Charts and Detailed Analytics */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                {/* Application Status Distribution */}
                <Box sx={{ flex: '1 1 500px', minWidth: '500px' }}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PieChart color="primary" />
                        Application Status Distribution
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {analyticsData.applicationAnalytics.statusDistribution.map((status: any) => {
                          const percentage = (status.count / analyticsData.applicationAnalytics.totalApplications) * 100;
                          const getStatusColor = (statusName: string) => {
                            switch (statusName) {
                              case 'sanctioned':
                              case 'disbursed': return 'success';
                              case 'rejected': return 'error';
                              case 'submitted':
                              case 'under_review': return 'info';
                              default: return 'warning';
                            }
                          };

                          return (
                            <Box key={status._id} sx={{ mb: 2 }}>
                              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                  {status._id.replace('_', ' ')}
                                </Typography>
                                <Typography variant="body2" fontWeight="bold">
                                  {status.count} ({percentage.toFixed(1)}%)
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={percentage}
                                color={getStatusColor(status._id)}
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                            </Box>
                          );
                        })}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                {/* User Role Distribution */}
                <Box sx={{ flex: '1 1 500px', minWidth: '500px' }}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Group color="primary" />
                        User Role Distribution
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {analyticsData.userAnalytics.roleDistribution && analyticsData.userAnalytics.roleDistribution.length > 0 ? (
                          analyticsData.userAnalytics.roleDistribution.map((role: any) => {
                            const percentage = (role.count / analyticsData.userAnalytics.totalUsers) * 100;
                            const getRoleColor = (roleName: string) => {
                              switch (roleName) {
                                case 'admin': return 'secondary';
                                case 'broker': return 'primary';
                                case 'lender': return 'info';
                                case 'customer': return 'success';
                                default: return 'warning';
                              }
                            };
                            return (
                              <Box key={role._id} sx={{ mb: 2 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                    {role._id.replace('_', ' ')}
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {role.count} ({percentage.toFixed(1)}%)
                                  </Typography>
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={percentage}
                                  color={getRoleColor(role._id)}
                                  sx={{ height: 8, borderRadius: 4 }}
                                />
                              </Box>
                            );
                          })
                        ) : (
                          <Box textAlign="center">
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                              No Analytics Data Available
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                              Analytics data will appear here once there is sufficient application activity.
                            </Typography>
                            <Button
                              variant="outlined"
                              onClick={fetchAnalyticsData}
                              startIcon={<Refresh />}
                            >
                              Refresh Analytics
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress size={60} />
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* Lead Management Tab */}
      {tabValue === 2 && (
        <Card>
          <CardContent>
            {/* Header with Search and Filters */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3,
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Lead Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {filteredLeads.length} of {leads.length} leads
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  size="small"
                  placeholder="Search leads..."
                  value={leadSearchQuery}
                  onChange={(e) => setLeadSearchQuery(e.target.value)}
                  sx={{ minWidth: 200 }}
                  InputProps={{
                    startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={leadStatusFilter}
                    label="Status"
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="contacted">Contacted</MenuItem>
                    <MenuItem value="qualified">Qualified</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="converted">Converted</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Broker</InputLabel>
                  <Select
                    value={leadBrokerFilter}
                    label="Broker"
                    onChange={(e) => setLeadBrokerFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Brokers</MenuItem>
                    <MenuItem value="unassigned">Unassigned</MenuItem>
                    {brokers.map((broker) => (
                      <MenuItem key={broker._id} value={broker.email}>
                        {broker.fullName || `${broker.firstName} ${broker.lastName}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Leads Table */}
            {leadsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                <CircularProgress />
              </Box>
            ) : leadsError ? (
              <Alert severity="error">{leadsError}</Alert>
            ) : filteredLeads.length === 0 ? (
              <Box sx={{
                textAlign: 'center',
                py: 6,
                borderRadius: 2,
                bgcolor: 'background.default',
                border: '2px dashed',
                borderColor: 'divider'
              }}>
                {leadSearchQuery || leadStatusFilter !== 'all' || leadBrokerFilter !== 'all' ? (
                  <>
                    <Search sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No leads found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your search terms or filters
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setLeadSearchQuery('');
                        setLeadStatusFilter('all');
                        setLeadBrokerFilter('all');
                      }}
                      sx={{ mt: 2 }}
                    >
                      Clear Filters
                    </Button>
                  </>
                ) : (
                  <>
                    <TrendingUp sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No leads available
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Leads will appear here once they are added to the system
                    </Typography>
                  </>
                )}
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Lead Details</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Loan Amount</TableCell>
                      <TableCell>Property</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Messages</TableCell>
                      <TableCell>Assigned Broker</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead._id} sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {lead.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              ID: {lead._id}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{lead.email}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {lead.contact}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            ₹{(lead.loanAmount / 100000).toFixed(1)}L
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{lead.propertyDetails}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {lead.source}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={lead.status.toUpperCase()}
                            color={
                              lead.status === 'converted' ? 'success' :
                              lead.status === 'qualified' ? 'info' :
                              lead.status === 'processing' ? 'warning' :
                              lead.status === 'contacted' ? 'secondary' :
                              'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {/* Message icon with badge for new messages */}
                          <IconButton size="small" color="primary" onClick={() => {
                            setSelectedLead(lead);
                            setMessagesDialogOpen(true);
                          }}>
                            <Badge badgeContent={unreadCount} color="error">
                              <Mail fontSize="small" />
                            </Badge>
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          {lead.brokerId ? (
                            <Typography variant="body2">
                              {typeof lead.brokerId === 'object' && lead.brokerId !== null ?
                                `${lead.brokerId.firstName || ''} ${lead.brokerId.lastName || ''}`.trim() :
                                (() => {
                                  const broker = brokers.find(b => b._id === lead.brokerId);
                                  return broker ? `${broker.firstName || ''} ${broker.lastName || ''}`.trim() : 'Unknown Broker';
                                })()
                              }
                            </Typography>
                          ) : (
                            <Chip label="Unassigned" size="small" variant="outlined" />
                          )}
                        </TableCell>
                        <TableCell>{lead.source}</TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="View Details">
                              <IconButton size="small" onClick={() => { setSelectedLead(lead); setLeadDialog(true); }}>
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Assign Broker">
                              <IconButton size="small" color="primary" onClick={() => { setSelectedLead(lead); setAssignBrokerDialog(true); }}>
                                <Work fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Update Status">
                              <IconButton size="small" color="warning" onClick={() => { setStatusLead(lead); setNewStatus(lead.status); setStatusDialog(true); }}>
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Lead">
                              <IconButton size="small" color="error" onClick={() => { setDeleteLeadDialog(true); setLeadToDelete(lead); }}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}


  {/* Property Management Tab */}
  {tabValue === 3 && (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>Property Management</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Business />}
            onClick={() => setShowCreateProperty(true)}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Add Property
          </Button>
        </Box>
        {propertiesLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : propertiesError ? (
          <Alert severity="error">{propertiesError}</Alert>
        ) : properties.length === 0 ? (
          <Box textAlign="center" py={6} borderRadius={2} bgcolor="background.default" border="2px dashed" borderColor="divider">
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No properties found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Properties will appear here once they are added to the system
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Property</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Price/Sq.Ft</TableCell>
                  <TableCell>Units</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Builder</TableCell>
                  <TableCell>Lead Requests</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property._id} sx={{ opacity: property.isDeleted ? 0.5 : 1 }}>
                    {/* Property Name + Config */}
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0, lineHeight: 1.2 }}>{property.name}</Typography>
                        {property.configuration && (
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mt: 0.2, ml: 0.5 }}>
                            • {property.configuration}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    {/* Type as Chip */}
                    <TableCell>
                      <Chip label={property.type?.toUpperCase()} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600, letterSpacing: 0.5 }} />
                    </TableCell>
                    {/* Location + Area */}
                    <TableCell>
                      <Box>
                        <Typography variant="body1">{property.location}</Typography>
                        {property.area && (
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                            {property.area}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    {/* Price/Sqft in green */}
                    <TableCell>
                      <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 600 }}>
                        ₹{property.pricePerSqft}
                      </Typography>
                    </TableCell>
                    {/* Units: Available/Total */}
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Available: {property.availableUnits}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>Total: {property.totalUnits}</Typography>
                      </Box>
                    </TableCell>
                    {/* Status as Chip */}
                    <TableCell>
                      <Chip
                        label={property.status?.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: property.status === 'UNDER CONSTRUCTION' ? '#FFA726' : '#E0E0E0',
                          color: property.status === 'UNDER CONSTRUCTION' ? '#fff' : '#333',
                          fontWeight: 600,
                          borderRadius: 2,
                          px: 2
                        }}
                      />
                    </TableCell>
                    {/* Builder Name */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {property.builderName || '-'}
                      </Typography>
                    </TableCell>
                    {/* Lead Requests as blue link */}
                    <TableCell>
                      <Typography
                        variant="body1"
                        sx={{ color: '#1976d2', fontWeight: 600, cursor: 'pointer' }}
                        onClick={() => handleViewLeads(property)}
                      >
                        {property.leadRequests || 0}
                      </Typography>
                    </TableCell>
                    {/* Actions: View, Edit, Analytics (placeholder), styled icons */}
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View">
                          <span>
                            <IconButton onClick={() => setViewProperty(property)} sx={{ color: '#90caf9' }}>
                              <Visibility />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <span>
                            <IconButton onClick={() => handleEditProperty(property)} disabled={propertyActionLoading} sx={{ color: '#f48fb1' }}>
                              <Edit />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Analytics">
                          <span>
                            <IconButton sx={{ color: '#43a047', border: '1.5px solid #90caf9', borderRadius: '50%' }}>
                              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20 }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#388e3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="12" width="4" height="8"/><rect x="9" y="8" width="4" height="12"/><rect x="15" y="4" width="4" height="16"/></svg>
                              </span>
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Edit Property Dialog - must be inside the tab so state is correct */}
        <Dialog open={!!editProperty} onClose={() => { setEditProperty(null); setEditPropertyForm(null); }} maxWidth="md" fullWidth>
          <DialogTitle>Edit Property</DialogTitle>
          <DialogContent>
            {editPropertyForm && (
              <Stack spacing={3} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Property Name"
                  value={editPropertyForm.name}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, name: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Type"
                  value={editPropertyForm.type}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, type: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Location"
                  value={editPropertyForm.location}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, location: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Area (sqft)"
                  value={editPropertyForm.area}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, area: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Price Per Sqft"
                  type="number"
                  value={editPropertyForm.pricePerSqft}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, pricePerSqft: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Total Units"
                  type="number"
                  value={editPropertyForm.totalUnits}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, totalUnits: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Available Units"
                  type="number"
                  value={editPropertyForm.availableUnits}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, availableUnits: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Configuration"
                  value={editPropertyForm.configuration}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, configuration: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Amenities (comma separated)"
                  value={editPropertyForm.amenities}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, amenities: e.target.value }))}
                />
                <TextField
                  fullWidth
                  label="Status"
                  value={editPropertyForm.status}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, status: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Lead Requests"
                  type="number"
                  value={editPropertyForm.leadRequests}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, leadRequests: e.target.value }))}
                />
                <TextField
                  fullWidth
                  label="Sold Units"
                  type="number"
                  value={editPropertyForm.soldUnits}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, soldUnits: e.target.value }))}
                />
                <TextField
                  fullWidth
                  label="Completion Date (YYYY-MM-DD)"
                  value={editPropertyForm.completionDate}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, completionDate: e.target.value }))}
                />
                <TextField
                  fullWidth
                  label="Builder"
                  value={editPropertyForm.builderName || editPropertyForm.builder || ''}
                  disabled
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={editPropertyForm.description}
                  onChange={e => setEditPropertyForm((f: any) => ({ ...f, description: e.target.value }))}
                  multiline
                  minRows={2}
                />
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setEditProperty(null); setEditPropertyForm(null); }}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleEditPropertySave}
              disabled={propertyActionLoading || !editPropertyForm || !editPropertyForm.name || !editPropertyForm.type || !editPropertyForm.location || !editPropertyForm.area || !editPropertyForm.pricePerSqft || !editPropertyForm.totalUnits || !editPropertyForm.availableUnits || !editPropertyForm.configuration || !editPropertyForm.status || !editPropertyForm.builder}
            >
              {propertyActionLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Property Dialog */}
        <Dialog open={!!viewProperty} onClose={() => setViewProperty(null)} maxWidth="sm" fullWidth>
          <DialogTitle>Property Details</DialogTitle>
          <DialogContent>
            {viewProperty && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                <Typography variant="h6" fontWeight={600}>{viewProperty.name}</Typography>
                <Typography variant="body2" color="text.secondary">Type: {viewProperty.type}</Typography>
                <Typography variant="body2" color="text.secondary">Location: {viewProperty.location}</Typography>
                <Typography variant="body2" color="text.secondary">Area: {viewProperty.area}</Typography>
                <Typography variant="body2" color="text.secondary">Price/Sqft: {viewProperty.pricePerSqft}</Typography>
                <Typography variant="body2" color="text.secondary">Total Units: {viewProperty.totalUnits}</Typography>
                <Typography variant="body2" color="text.secondary">Available Units: {viewProperty.availableUnits}</Typography>
                <Typography variant="body2" color="text.secondary">Configuration: {viewProperty.configuration}</Typography>
                <Typography variant="body2" color="text.secondary">Amenities: {Array.isArray(viewProperty.amenities) ? viewProperty.amenities.join(', ') : viewProperty.amenities}</Typography>
                <Typography variant="body2" color="text.secondary">Status: {viewProperty.status}</Typography>
                <Typography variant="body2" color="text.secondary">Lead Requests: {viewProperty.leadRequests}</Typography>
                <Typography variant="body2" color="text.secondary">Sold Units: {viewProperty.soldUnits}</Typography>
                <Typography variant="body2" color="text.secondary">Completion Date: {viewProperty.completionDate}</Typography>
                <Typography variant="body2" color="text.secondary">Builder: {viewProperty.builderName || '-'}</Typography>
                <Typography variant="body2" color="text.secondary">Description: {viewProperty.description}</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewProperty(null)} startIcon={<Close />}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Create Property Dialog */}
        <Dialog open={showCreateProperty} onClose={() => setShowCreateProperty(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, fontSize: 22, pb: 0 }}>Create Property</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Property Name" value={propertyForm.name} onChange={e => setPropertyForm(f => ({ ...f, name: e.target.value }))} required fullWidth />
              <TextField label="Type" value={propertyForm.type} onChange={e => setPropertyForm(f => ({ ...f, type: e.target.value }))} required fullWidth />
              <TextField label="Location" value={propertyForm.location} onChange={e => setPropertyForm(f => ({ ...f, location: e.target.value }))} required fullWidth />
              <TextField label="Area (sqft)" value={propertyForm.area} onChange={e => setPropertyForm(f => ({ ...f, area: e.target.value }))} required fullWidth />
              <TextField label="Price Per Sqft" type="number" value={propertyForm.pricePerSqft} onChange={e => setPropertyForm(f => ({ ...f, pricePerSqft: e.target.value }))} required fullWidth />
              <TextField label="Total Units" type="number" value={propertyForm.totalUnits} onChange={e => setPropertyForm(f => ({ ...f, totalUnits: e.target.value }))} required fullWidth />
              <TextField label="Available Units" type="number" value={propertyForm.availableUnits} onChange={e => setPropertyForm(f => ({ ...f, availableUnits: e.target.value }))} required fullWidth />
              <TextField label="Configuration" value={propertyForm.configuration} onChange={e => setPropertyForm(f => ({ ...f, configuration: e.target.value }))} required fullWidth />
              <TextField label="Amenities (comma separated)" value={propertyForm.amenities} onChange={e => setPropertyForm(f => ({ ...f, amenities: e.target.value }))} fullWidth />
              <TextField label="Status" value={propertyForm.status} onChange={e => setPropertyForm(f => ({ ...f, status: e.target.value }))} required fullWidth />
              <TextField label="Lead Requests" type="number" value={propertyForm.leadRequests} onChange={e => setPropertyForm(f => ({ ...f, leadRequests: e.target.value }))} fullWidth />
              <TextField label="Sold Units" type="number" value={propertyForm.soldUnits} onChange={e => setPropertyForm(f => ({ ...f, soldUnits: e.target.value }))} fullWidth />
              <TextField label="Completion Date (YYYY-MM-DD)" value={propertyForm.completionDate} onChange={e => setPropertyForm(f => ({ ...f, completionDate: e.target.value }))} fullWidth />
              <TextField label="Builder" value={propertyForm.builder} onChange={e => setPropertyForm(f => ({ ...f, builder: e.target.value }))} required fullWidth />
              <TextField label="Description" value={propertyForm.description} onChange={e => setPropertyForm(f => ({ ...f, description: e.target.value }))} multiline minRows={2} fullWidth />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setShowCreateProperty(false)} startIcon={<Close />}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreateProperty}
              startIcon={propertyActionLoading ? <CircularProgress size={18} /> : <Save />}
              disabled={propertyActionLoading || !propertyForm.name || !propertyForm.type || !propertyForm.location || !propertyForm.area || !propertyForm.pricePerSqft || !propertyForm.totalUnits || !propertyForm.availableUnits || !propertyForm.configuration || !propertyForm.status || !propertyForm.builder}
            >
              {propertyActionLoading ? 'Creating...' : 'Create Property'}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )}

      {/* Applications Tab */}
      {tabValue === 4 && (
        <ApplicationManagement />
      )}

      {/* Reports Tab */}
      {tabValue === 5 && (
        <Card>
          <CardContent>
            <Box sx={{
              textAlign: 'center',
              py: 6,
              backgroundColor: 'background.paper',
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider'
            }}>
              <Assessment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Reports & Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comprehensive reporting features will be available in the next update.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Success/Error Notifications */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* View User Dialog */}
      <Dialog open={!!viewUser} onClose={() => setViewUser(null)} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {viewUser && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}><strong>Name:</strong> {viewUser.fullName || `${viewUser.firstName || ''} ${viewUser.lastName || ''}`.trim()}</Typography>
              <Typography variant="body2"><strong>Email:</strong> {viewUser.email}</Typography>
              <Typography variant="body2"><strong>Phone:</strong> {viewUser.phone}</Typography>
              <Typography variant="body2"><strong>Role:</strong> {viewUser.role}</Typography>
              <Typography variant="body2"><strong>Status:</strong> {viewUser.status}</Typography>
              <Typography variant="body2"><strong>Created:</strong> {viewUser.createdAt ? new Date(viewUser.createdAt).toLocaleDateString() : ''}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewUser(null)} startIcon={<Close />}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onClose={() => setEditUser(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {editUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="First Name"
                value={editUserData.firstName || ''}
                onChange={e => setEditUserData((u: any) => ({ ...u, firstName: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Last Name"
                value={editUserData.lastName || ''}
                onChange={e => setEditUserData((u: any) => ({ ...u, lastName: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Email"
                value={editUserData.email || ''}
                onChange={e => setEditUserData((u: any) => ({ ...u, email: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Phone"
                value={editUserData.phone || ''}
                onChange={e => setEditUserData((u: any) => ({ ...u, phone: e.target.value }))}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={editUserData.role || ''}
                  label="Role"
                  onChange={e => setEditUserData((u: any) => ({ ...u, role: e.target.value }))}
                >
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="broker">Broker</MenuItem>
                  <MenuItem value="builder">Builder</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editUserData.status || ''}
                  label="Status"
                  onChange={e => setEditUserData((u: any) => ({ ...u, status: e.target.value }))}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUser(null)} startIcon={<Close />}>Cancel</Button>
          <Button onClick={handleEditUserSave} variant="contained" startIcon={<Save />} disabled={actionLoading}>
            {actionLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resetUser} onClose={() => setResetUser(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            label="New Password"
            type="text"
            value={resetPassword}
            onChange={e => setResetPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="outlined" onClick={handleGeneratePassword} sx={{ minWidth: 'auto', px: 2 }}>
            Generate Password
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetUser(null)} startIcon={<Close />}>Cancel</Button>
          <Button onClick={handleResetPasswordSave} variant="contained" startIcon={<Save />} disabled={actionLoading || !resetPassword}>
            {actionLoading ? 'Saving...' : 'Reset'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={!!deleteUser} onClose={() => setDeleteUser(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
          {deleteUser && (
            <Typography sx={{ mt: 1 }} color="error"><strong>{deleteUser.fullName || deleteUser.email}</strong></Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUser(null)} startIcon={<Close />}>Cancel</Button>
          <Button onClick={handleDeleteUserConfirm} variant="contained" color="error" startIcon={<Delete />} disabled={actionLoading}>
            {actionLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lead Details Dialog */}
      <Dialog open={leadDialog} onClose={() => setLeadDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Lead Details</DialogTitle>
        <DialogContent>
          {selectedLead && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mt: 2 }}>
              <Box>
                <Typography variant="h6" gutterBottom>Contact Information</Typography>
                <Typography variant="body2"><strong>Name:</strong> {selectedLead.name}</Typography>
                <Typography variant="body2"><strong>Email:</strong> {selectedLead.email}</Typography>
                <Typography variant="body2"><strong>Phone:</strong> {selectedLead.contact}</Typography>
                <Typography variant="body2"><strong>Source:</strong> {selectedLead.source}</Typography>
              </Box>
              <Box>
                <Typography variant="h6" gutterBottom>Loan Requirements</Typography>
                <Typography variant="body2"><strong>Loan Amount:</strong> ₹{(selectedLead.loanAmount / 100000).toFixed(1)}L</Typography>
                <Typography variant="body2"><strong>Property Details:</strong> {selectedLead.propertyDetails}</Typography>

              </Box>
              <Box>
                <Typography variant="h6" gutterBottom>Status Information</Typography>
                <Typography variant="body2"><strong>Current Status:</strong> {selectedLead.status}</Typography>
                <Typography variant="body2"><strong>Assigned Broker:</strong> {
                  selectedLead.brokerId ? (
                    typeof selectedLead.brokerId === 'object' && selectedLead.brokerId !== null ?
                      `${selectedLead.brokerId.firstName || ''} ${selectedLead.brokerId.lastName || ''}`.trim() :
                      (() => {
                        const broker = brokers.find(b => b._id === selectedLead.brokerId);
                        return broker ? `${broker.firstName || ''} ${broker.lastName || ''}`.trim() : 'Unknown Broker';
                      })()
                  ) : 'Not Assigned'
                }</Typography>
                <Typography variant="body2"><strong>Created:</strong> {new Date(selectedLead.createdDate).toLocaleDateString()}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeadDialog(false)} startIcon={<Close />}>Close</Button>
          <Button variant="contained" startIcon={<Edit />} onClick={() => { setEditLeadDialog(true); setEditLeadData(selectedLead); }}>Edit Lead</Button>
        </DialogActions>
      </Dialog>

      {/* Assign Broker Dialog */}
      <Dialog open={assignBrokerDialog} onClose={() => setAssignBrokerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Broker to Lead</DialogTitle>
        <DialogContent>
          {selectedLead && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Lead:</strong> {selectedLead.name} - ₹{(selectedLead.loanAmount / 100000).toFixed(1)}L
              </Typography>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Select Broker</InputLabel>
                <Select
                  value={selectedBroker}
                  label="Select Broker"
                  onChange={(e) => setSelectedBroker(e.target.value)}
                >
                  <MenuItem value="">-- Unassign --</MenuItem>
                  {brokers.map((broker) => (
                    <MenuItem key={broker._id} value={broker._id}>
                      {broker.fullName || `${broker.firstName} ${broker.lastName}`} ({broker.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignBrokerDialog(false)} startIcon={<Close />}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<Work />}
            onClick={handleAssignBroker}
            disabled={actionLoading}
          >
            {actionLoading ? 'Assigning...' : 'Assign Broker'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog open={editLeadDialog} onClose={() => setEditLeadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Lead</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Name" value={editLeadData.name || ''} onChange={e => setEditLeadData((d: any) => ({ ...d, name: e.target.value }))} fullWidth />
            <TextField label="Email" value={editLeadData.email || ''} onChange={e => setEditLeadData((d: any) => ({ ...d, email: e.target.value }))} fullWidth />
            <TextField label="Contact" value={editLeadData.contact || ''} onChange={e => setEditLeadData((d: any) => ({ ...d, contact: e.target.value }))} fullWidth />
            <TextField label="Loan Amount" type="number" value={editLeadData.loanAmount || ''} onChange={e => setEditLeadData((d: any) => ({ ...d, loanAmount: Number(e.target.value) }))} fullWidth />
            <TextField label="Property Details" value={editLeadData.propertyDetails || ''} onChange={e => setEditLeadData((d: any) => ({ ...d, propertyDetails: e.target.value }))} fullWidth />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={editLeadData.status || ''} label="Status" onChange={e => setEditLeadData((d: any) => ({ ...d, status: e.target.value }))}>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="qualified">Qualified</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="converted">Converted</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Source" value={editLeadData.source || ''} onChange={e => setEditLeadData((d: any) => ({ ...d, source: e.target.value }))} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditLeadDialog(false)} startIcon={<Close />}>Cancel</Button>
          <Button onClick={handleEditLeadSave} variant="contained" startIcon={<Save />} disabled={leadActionLoading}>
            {leadActionLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Update Lead Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select value={newStatus} label="Status" onChange={e => setNewStatus(e.target.value)}>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="contacted">Contacted</MenuItem>
              <MenuItem value="qualified">Qualified</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="converted">Converted</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)} startIcon={<Close />}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained" startIcon={<Save />} disabled={leadActionLoading || !newStatus}>
            {leadActionLoading ? 'Saving...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Lead Dialog */}
      <Dialog open={deleteLeadDialog} onClose={() => setDeleteLeadDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Lead</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this lead?</Typography>
          {leadToDelete && (
            <Typography sx={{ mt: 1 }} color="error"><strong>{leadToDelete.name || leadToDelete.email}</strong></Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteLeadDialog(false)} startIcon={<Close />}>Cancel</Button>
          <Button onClick={handleDeleteLeadConfirm} variant="contained" color="error" startIcon={<Delete />} disabled={leadActionLoading}>
            {leadActionLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    {/* Messages Dialog - Rendered only once, outside the table */}
    <Dialog open={messagesDialogOpen} onClose={() => setMessagesDialogOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Broker Messages</DialogTitle>
      <DialogContent>
        {(!selectedLead || !selectedLead.messages || selectedLead.messages.length === 0) ? (
          <Typography>No messages found.</Typography>
        ) : (
          selectedLead.messages.map((msg: AdminMessage, idx: number) => (
            <Box key={msg.id || msg._id || idx} sx={{ mb: 2, p: 2, bgcolor: msg.read ? 'background.paper' : 'rgba(255, 152, 0, 0.12)', borderRadius: 1, boxShadow: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.primary' }}><strong>From:</strong> {msg.brokerName || msg.brokerEmail}</Typography>
              <Typography variant="body2" sx={{ color: 'text.primary' }}><strong>Lead:</strong> {msg.leadName || msg.leadId}</Typography>
              <Typography variant="body1" sx={{ mt: 1, color: 'text.primary' }}>{msg.message}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>{new Date(msg.createdAt).toLocaleString()}</Typography>
              {!msg.read && (typeof (msg.id || msg._id) === 'string') && (
                <Button size="small" color="primary" onClick={() => handleMarkAsRead((msg.id || msg._id) as string)} sx={{ mt: 1 }}>Mark as Read</Button>
              )}
            </Box>
          ))
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setMessagesDialogOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
    </Container>
  );
};

// Professional Application Management Component
const ApplicationManagement: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ApplicationFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });

  // Detail drawer state
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Create application state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [eligibleCustomers, setEligibleCustomers] = useState<Customer[]>([]);
  const [newApplication, setNewApplication] = useState({
    customerId: '',
    loanAmount: 0,
    interestRate: 8.5,
    tenure: 20,
    selectedBank: '',
    processingFee: 0
  });

  // Success/Error states
  const [success, setSuccess] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationApi.getAllApplications(filters);
      setApplications(response.applications);
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to fetch applications');
      console.error('Fetch applications error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch eligible customers for new application
  const fetchEligibleCustomers = useCallback(async () => {
    try {
      const customers = await applicationApi.getEligibleCustomers();
      setEligibleCustomers(customers);
    } catch (err) {
      console.error('Fetch eligible customers error:', err);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    if (createDialogOpen) {
      fetchEligibleCustomers();
    }
  }, [createDialogOpen, fetchEligibleCustomers]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<ApplicationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  // Handle status update
  const handleStatusUpdate = async (applicationId: string, status: Application['status'], notes?: string) => {
    setActionLoading(true);
    try {
      await applicationApi.updateApplicationStatus(applicationId, status, notes);
      setSuccess('Application status updated successfully');
      fetchApplications();
      if (selectedApplication) {
        const updated = await applicationApi.getApplicationById(applicationId);
        setSelectedApplication(updated);
      }
    } catch (err) {
      setError('Failed to update application status');
      console.error('Status update error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle create application
  const handleCreateApplication = async () => {
    setActionLoading(true);
    try {
      await applicationApi.createApplication(newApplication);
      setSuccess('Application created successfully');
      setCreateDialogOpen(false);
      setNewApplication({
        customerId: '',
        loanAmount: 0,
        interestRate: 8.5,
        tenure: 20,
        selectedBank: '',
        processingFee: 0
      });
      fetchApplications();
    } catch (err) {
      setError('Failed to create application');
      console.error('Create application error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Get status color and icon
  const getStatusConfig = (status: Application['status']) => {
    const configs = {
      submitted: { color: '#304FFE', label: 'Submitted', icon: '📝' },
      under_review: { color: '#304FFE', label: 'Under Review', icon: '👁️' },
      documents_pending: { color: '#FFA726', label: 'Documents Pending', icon: '📄' },
      documents_received: { color: '#00C8C8', label: 'Documents Received', icon: '✅' },
      submitted_to_bank: { color: '#9C27B0', label: 'Submitted to Bank', icon: '🏦' },
      under_bank_review: { color: '#673AB7', label: 'Under Bank Review', icon: '🔍' },
      approved_by_bank: { color: '#4CAF50', label: 'Approved by Bank', icon: '✅' },
      rejected_by_bank: { color: '#F44336', label: 'Rejected by Bank', icon: '❌' },
      sanctioned: { color: '#2E7D32', label: 'Sanctioned', icon: '🎉' },
      disbursed: { color: '#1B5E20', label: 'Disbursed', icon: '💰' },
      rejected: { color: '#D32F2F', label: 'Rejected', icon: '❌' }
    };
    return configs[status] || { color: '#757575', label: status, icon: '⏳' };
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="#2E2E2E">
          Application Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Assignment />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            bgcolor: '#304FFE',
            '&:hover': { bgcolor: '#1E40ED' }
          }}
        >
          Create Application
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3, border: '1px solid #E0E0E0' }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status || ''}
                label="Status"
                onChange={(e) => handleFilterChange({ status: e.target.value || undefined })}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="submitted">Submitted</MenuItem>
                <MenuItem value="under_review">Under Review</MenuItem>
                <MenuItem value="documents_pending">Documents Pending</MenuItem>
                <MenuItem value="documents_received">Documents Received</MenuItem>
                <MenuItem value="submitted_to_bank">Submitted to Bank</MenuItem>
                <MenuItem value="under_bank_review">Under Bank Review</MenuItem>
                <MenuItem value="approved_by_bank">Approved by Bank</MenuItem>
                <MenuItem value="rejected_by_bank">Rejected by Bank</MenuItem>
                <MenuItem value="sanctioned">Sanctioned</MenuItem>
                <MenuItem value="disbursed">Disbursed</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <TextField
              sx={{ minWidth: 200 }}
              size="small"
              label="Customer Name"
              value={filters.customerName || ''}
              onChange={(e) => handleFilterChange({ customerName: e.target.value || undefined })}
            />
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy || 'createdAt'}
                label="Sort By"
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              >
                <MenuItem value="createdAt">Date Created</MenuItem>
                <MenuItem value="updatedAt">Last Updated</MenuItem>
                <MenuItem value="loanAmount">Loan Amount</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={() => setFilters({
                page: 1,
                limit: 10,
                sortBy: 'createdAt',
                sortOrder: 'desc'
              })}
            >
              Clear Filters
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card sx={{ border: '1px solid #E0E0E0' }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>
          ) : applications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Assignment sx={{ fontSize: 64, color: '#E0E0E0', mb: 2 }} />
              <Typography variant="h6" color="#757575">No applications found</Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: '#F5F7FA' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', color: '#2E2E2E' }}>Application #</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#2E2E2E' }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#2E2E2E' }}>Loan Amount</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#2E2E2E' }}>Bank</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#2E2E2E' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#2E2E2E' }}>Last Updated</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#2E2E2E', textAlign: 'center' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications.map((application) => {
                      const statusConfig = getStatusConfig(application.status);
                      return (
                        <TableRow
                          key={application._id}
                          hover
                          sx={{
                            '&:hover': {
                              bgcolor: '#F8F9FA',
                              cursor: 'pointer'
                            }
                          }}
                          onClick={() => {
                            setSelectedApplication(application);
                            setDrawerOpen(true);
                          }}
                        >
                          <TableCell sx={{ fontWeight: 500, color: '#304FFE' }}>
                            {application.applicationNumber}
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {application.personalInfo.fullName}
                              </Typography>
                              <Typography variant="caption" color="#757575">
                                {application.personalInfo.email}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              ₹{application.loanDetails.requestedAmount.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {application.loanDetails.selectedBank}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={statusConfig.label}
                              size="small"
                              sx={{
                                bgcolor: statusConfig.color,
                                color: 'white',
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="#757575">
                              {new Date(application.updatedAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedApplication(application);
                                    setDrawerOpen(true);
                                  }}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Update Status">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle quick status update
                                  }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={(_, page) => handleFilterChange({ page })}
                  color="primary"
                />
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      {/* Application Details Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 600,
            maxWidth: '90vw'
          }
        }}
      >
        {selectedApplication && (
          <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold">
                Application Details
              </Typography>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <Close />
              </IconButton>
            </Box>

            {/* Application Info */}
            <Card sx={{ mb: 3, border: '1px solid #E0E0E0' }}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="#757575">Application #</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedApplication.applicationNumber}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="#757575">Status</Typography>
                    <Box mt={0.5}>
                      <Chip
                        label={getStatusConfig(selectedApplication.status).label}
                        size="small"
                        sx={{
                          bgcolor: getStatusConfig(selectedApplication.status).color,
                          color: 'white'
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card sx={{ mb: 3, border: '1px solid #E0E0E0' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>Customer Information</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="#757575">Full Name</Typography>
                    <Typography variant="body1">{selectedApplication.personalInfo.fullName}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="#757575">Email</Typography>
                      <Typography variant="body1">{selectedApplication.personalInfo.email}</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="#757575">Phone</Typography>
                      <Typography variant="body1">{selectedApplication.personalInfo.phone}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="#757575">Application Number</Typography>
                      <Typography variant="body1">{selectedApplication.applicationNumber}</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="#757575">Status</Typography>
                      <Typography variant="body1">{selectedApplication.status}</Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Loan Details */}
            <Card sx={{ mb: 3, border: '1px solid #E0E0E0' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>Loan Details</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="#757575">Requested Amount</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        ₹{selectedApplication.loanDetails.requestedAmount.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="#757575">Interest Rate</Typography>
                      <Typography variant="body1">{selectedApplication.loanDetails.interestRate}%</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="#757575">Tenure</Typography>
                      <Typography variant="body1">{selectedApplication.loanDetails.tenure} years</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="#757575">Monthly EMI</Typography>
                      <Typography variant="body1">₹{selectedApplication.loanDetails.monthlyEMI.toLocaleString()}</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="#757575">Selected Bank</Typography>
                    <Typography variant="body1">{selectedApplication.loanDetails.selectedBank}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Status Update */}
            <Card sx={{ mb: 3, border: '1px solid #E0E0E0' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>Update Status</Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>New Status</InputLabel>
                  <Select
                    value=""
                    label="New Status"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleStatusUpdate(selectedApplication._id, e.target.value as Application['status']);
                      }
                    }}
                  >
                    <MenuItem value="under_review">Under Review</MenuItem>
                    <MenuItem value="documents_pending">Documents Pending</MenuItem>
                    <MenuItem value="documents_received">Documents Received</MenuItem>
                    <MenuItem value="submitted_to_bank">Submitted to Bank</MenuItem>
                    <MenuItem value="under_bank_review">Under Bank Review</MenuItem>
                    <MenuItem value="approved_by_bank">Approved by Bank</MenuItem>
                    <MenuItem value="rejected_by_bank">Rejected by Bank</MenuItem>
                    <MenuItem value="sanctioned">Sanctioned</MenuItem>
                    <MenuItem value="disbursed">Disbursed</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card sx={{ border: '1px solid #E0E0E0' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>Timeline</Typography>
                <List>
                  {selectedApplication.timeline.map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText
                        primary={item.event}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="#757575">
                              {item.description}
                            </Typography>
                            <Typography variant="caption" color="#757575">
                              {new Date(item.date).toLocaleString()} • {item.performedBy}
                            </Typography>
                          </Box>
                        }
                        secondaryTypographyProps={{ component: 'div' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        )}
      </Drawer>

      {/* Create Application Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Application</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <Autocomplete
              options={eligibleCustomers}
              getOptionLabel={(option) => `${option.fullName} (${option.email})`}
              value={eligibleCustomers.find(c => c._id === newApplication.customerId) || null}
              onChange={(_, value) => setNewApplication(prev => ({ ...prev, customerId: value?._id || '' }))}
              renderInput={(params) => (
                <TextField {...params} label="Select Customer" required />
              )}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                sx={{ flex: 1 }}
                label="Loan Amount"
                type="number"
                value={newApplication.loanAmount}
                onChange={(e) => setNewApplication(prev => ({ ...prev, loanAmount: Number(e.target.value) }))}
                required
              />
              <TextField
                sx={{ flex: 1 }}
                label="Interest Rate (%)"
                type="number"
                value={newApplication.interestRate}
                onChange={(e) => setNewApplication(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
                required
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                sx={{ flex: 1 }}
                label="Tenure (Years)"
                type="number"
                value={newApplication.tenure}
                onChange={(e) => setNewApplication(prev => ({ ...prev, tenure: Number(e.target.value) }))}
                required
              />
              <TextField
                sx={{ flex: 1 }}
                label="Processing Fee"
                type="number"
                value={newApplication.processingFee}
                onChange={(e) => setNewApplication(prev => ({ ...prev, processingFee: Number(e.target.value) }))}
              />
            </Box>
            <TextField
              fullWidth
              label="Selected Bank"
              value={newApplication.selectedBank}
              onChange={(e) => setNewApplication(prev => ({ ...prev, selectedBank: e.target.value }))}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateApplication}
            variant="contained"
            disabled={actionLoading || !newApplication.customerId || !newApplication.loanAmount}
          >
            {actionLoading ? 'Creating...' : 'Create Application'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Notifications */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success">
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
