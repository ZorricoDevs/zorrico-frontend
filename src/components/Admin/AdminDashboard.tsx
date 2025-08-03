import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  useTheme,
  useMediaQuery,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Backdrop,
  Select,
  MenuItem,
  Snackbar,
  CircularProgress,
  Divider,
  List,
  ListItem,
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
  Search,
  MonetizationOn,
  TrendingUp,
  TrendingDown,
  PieChart,
  Group,
  LockReset,
  RestoreFromTrash,
} from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import {
  getDashboardStats,
  getAllUsers,
  getAnalyticsData,
  getAllLeads,
  getUsersWithFilters,
  updateUser,
  deleteUser,
  resetUserPassword,
  createUser,
  updateLead,
  deleteLead,
  assignBrokerToLead,
  assignBuilderToLead,
  restoreLead,
} from '../../services/adminApi';
import applicationApi, {
  Application,
  ApplicationFilters,
  Customer,
} from '../../services/applicationApi';
import { getAllProperties, createProperty, updateProperty } from '../../services/propertyApi';

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // Mobile navigation state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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
    licenseNumber: '',
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
  const [resetPasswordUser, setResetPasswordUser] = useState<any | null>(null);
  const [deleteUserConfirm, setDeleteUserConfirm] = useState<any | null>(null);
  const [userActionLoading, setUserActionLoading] = useState(false);

  // Lead Management State
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const [leadSearchQuery, setLeadSearchQuery] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');
  const [leadBrokerFilter, setLeadBrokerFilter] = useState('all');
  const [brokers, setBrokers] = useState<any[]>([]);

  // Lead Statistics
  const [leadStats, setLeadStats] = useState({
    totalCount: 0,
    activeCount: 0,
    deletedCount: 0,
  });

  // Lead Dialog States
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [leadDialog, setLeadDialog] = useState(false);
  const [assignBrokerDialog, setAssignBrokerDialog] = useState(false);
  const [statusLead, setStatusLead] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusDialog, setStatusDialog] = useState(false);
  const [deleteLeadDialog, setDeleteLeadDialog] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<any | null>(null);
  const [viewProperty, setViewProperty] = useState<any | null>(null);
  const [pagination, setPagination] = useState({ page: 0, rowsPerPage: 10 });

  // Request tracking to prevent excessive API calls
  const [dataFetched, setDataFetched] = useState({
    users: false,
    analytics: false,
    leads: false,
    properties: false,
  });

  // Request timing tracking to prevent rapid successive calls
  const lastRequestTime = useRef({
    users: 0,
    analytics: 0,
    leads: 0,
    properties: 0,
  });

  const REQUEST_DEBOUNCE_MS = 2000; // 2 seconds minimum between requests

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
    completionDate: '',
  });
  const [propertyActionLoading, setPropertyActionLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);
  const [editProperty, setEditProperty] = useState<any | null>(null);
  const [editPropertyForm, setEditPropertyForm] = useState<any | null>(null);

  // Fetch approved customers for dropdown
  useEffect(() => {
    if (addUserDialog && newUserRole === 'customer') {
      const fetchCustomers = async () => {
        try {
          const data = await getUsersWithFilters('customer', 'active');
          const customers = data?.users || [];
          const formattedCustomers = customers.map((customer: any) => ({
            id: customer._id,
            customerId: customer.customerId || `CUST-${customer._id?.slice(-6).toUpperCase()}`,
            name:
              customer.fullName || `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
            email: customer.email,
            phone: customer.phone || customer.profile?.phone || 'N/A',
          }));
          setApprovedCustomers(formattedCustomers);
        } catch (error) {
          console.error('Error fetching customers:', error);
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
    setManualUser(u => ({ ...u, password }));
  };

  // Handle user creation
  const handleCreateUser = async () => {
    setCreatingUser(true);
    setError(null);
    try {
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
        ...(newUserRole === 'broker' || newUserRole === 'builder'
          ? {
              companyName: manualUser.companyName,
              licenseNumber: manualUser.licenseNumber,
            }
          : {}),
      };

      await createUser(userData);

      setCreatingUser(false);
      setAddUserDialog(false);
      setManualUser({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        companyName: '',
        licenseNumber: '',
      });
      setAutoPassword('');
      setSelectedApprovedCustomer('');
      fetchUsers();
      fetchDashboardStats();
      setSuccess(
        `${newUserRole.charAt(0).toUpperCase() + newUserRole.slice(1)} created successfully!${customerId ? ` Customer ID: ${customerId}` : ''}`
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user. Please try again.');
      setCreatingUser(false);
    }
  };

  // Fetch various data sets
  const fetchAnalyticsData = useCallback(async () => {
    if (analyticsLoading) {
      console.log('AdminDashboard - Analytics fetch already in progress, skipping...');
      return;
    }

    setAnalyticsLoading(true);
    try {
      console.log('AdminDashboard - Starting analytics fetch...');
      const data = await getAnalyticsData();
      setAnalyticsData(data);
      setDataFetched(prev => ({ ...prev, analytics: true }));
      console.log('AdminDashboard - Analytics fetch completed successfully');
    } catch (err) {
      console.error('AdminDashboard - Analytics fetch failed:', err);
      setError('Failed to fetch analytics data');
    } finally {
      setAnalyticsLoading(false);
    }
  }, [analyticsLoading]);

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    try {
      const statsData = await getDashboardStats();
      console.log('Dashboard Stats Received:', statsData);
      console.log('Total Builders:', statsData.totalBuilders);
      console.log('Total Lenders:', statsData.totalLenders);

      // Debug lead statistics
      console.log('📊 Lead Statistics Debug:');
      console.log('  Total Leads:', statsData.totalLeads);
      console.log('  Unassigned Leads:', statsData.unassignedLeads);
      console.log('  Converted Leads:', statsData.convertedLeads);
      console.log('  Lead Conversion Rate:', statsData.leadConversionRate);

      // Handle backward compatibility - if totalBuilders is undefined, use totalLenders
      if (statsData.totalBuilders === undefined && statsData.totalLenders !== undefined) {
        statsData.totalBuilders = statsData.totalLenders;
        console.log('Using totalLenders as totalBuilders:', statsData.totalBuilders);
      }

      setStats(statsData);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    if (usersLoading) {
      console.log('AdminDashboard - Users fetch already in progress, skipping...');
      return;
    }

    setUsersLoading(true);
    setUsersError(null);
    try {
      console.log('AdminDashboard - Starting users fetch...');
      const usersData = await getAllUsers();
      setUsers(usersData);
      setDataFetched(prev => ({ ...prev, users: true }));
      console.log('AdminDashboard - Users fetch completed successfully');
    } catch (err) {
      console.error('AdminDashboard - Users fetch failed:', err);
      setUsersError('Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  }, [usersLoading]);

  const fetchLeads = useCallback(async () => {
    if (leadsLoading) {
      console.log('AdminDashboard - Leads fetch already in progress, skipping...');
      return;
    }

    setLeadsLoading(true);
    setLeadsError(null);
    try {
      console.log('AdminDashboard - Starting leads fetch...');
      const leadsResponse = await getAllLeads();
      console.log('Admin Dashboard - Leads response:', leadsResponse);

      // Handle new response format
      const leadsData = leadsResponse.leads || leadsResponse; // Backward compatibility
      setLeads(leadsData);

      // Set lead statistics if available
      if (leadsResponse.totalCount !== undefined) {
        setLeadStats({
          totalCount: leadsResponse.totalCount,
          activeCount: leadsResponse.activeCount,
          deletedCount: leadsResponse.deletedCount,
        });
      } else {
        // Fallback calculation for backward compatibility
        const totalCount = leadsData.length;
        const activeCount = leadsData.filter(
          (lead: any) =>
            !lead.isDeleted &&
            !lead.deletedByAdmin &&
            !lead.deletedByBroker &&
            !lead.deletionStatus?.isDeleted &&
            !lead.deletionStatus?.deletedByAdmin &&
            !lead.deletionStatus?.deletedByBroker
        ).length;
        setLeadStats({
          totalCount,
          activeCount,
          deletedCount: totalCount - activeCount,
        });
      }

      setDataFetched(prev => ({ ...prev, leads: true }));
      console.log('AdminDashboard - Leads fetch completed successfully');

      const brokersData = await getAllUsers();
      setBrokers(brokersData.filter((user: any) => user.role === 'broker'));
    } catch (err) {
      console.error('Admin Dashboard - Failed to fetch leads:', err);
      setLeadsError('Failed to fetch leads');
    } finally {
      setLeadsLoading(false);
    }
  }, [leadsLoading]);
  const fetchProperties = useCallback(async () => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime.current.properties;

    if (timeSinceLastRequest < REQUEST_DEBOUNCE_MS) {
      console.log('AdminDashboard - Properties fetch debounced, too soon since last request');
      return;
    }

    if (propertiesLoading) {
      console.log('AdminDashboard - Properties fetch already in progress, skipping...');
      return;
    }

    lastRequestTime.current.properties = now;
    setPropertiesLoading(true);
    setPropertiesError(null);
    try {
      console.log('AdminDashboard - Starting properties fetch...');
      const data = await getAllProperties();
      setProperties(data);
      setDataFetched(prev => ({ ...prev, properties: true }));
      console.log('AdminDashboard - Properties fetch completed successfully');
    } catch (err) {
      console.error('AdminDashboard - Properties fetch failed:', err);
      setPropertiesError('Failed to fetch properties');
    } finally {
      setPropertiesLoading(false);
    }
  }, [propertiesLoading]);

  // Filtered lists
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

  const filteredLeads = leads.filter(lead => {
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
    if (leadStatusFilter !== 'all' && lead.status !== leadStatusFilter) return false;
    if (leadBrokerFilter !== 'all') {
      if (leadBrokerFilter === 'unassigned') {
        if (lead.brokerId) return false;
      } else {
        const brokerMatch =
          typeof lead.brokerId === 'object'
            ? lead.brokerId?.email === leadBrokerFilter
            : brokers.find(b => b._id === lead.brokerId)?.email === leadBrokerFilter;
        if (!brokerMatch) return false;
      }
    }
    return true;
  });

  // Load initial data on mount
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Tab-specific data loading with prevention of excessive requests
  useEffect(() => {
    console.log('AdminDashboard - Tab changed to:', tabValue);
    console.log('AdminDashboard - DataFetched state:', dataFetched);

    // Only fetch data when tab changes and data hasn't been fetched yet
    switch (tabValue) {
      case 0:
        if (!dataFetched.users && !usersLoading) {
          console.log('AdminDashboard - Fetching users for tab 0');
          fetchUsers();
        }
        break;
      case 1:
        if (!dataFetched.analytics && !analyticsLoading) {
          console.log('AdminDashboard - Fetching analytics for tab 1');
          fetchAnalyticsData();
        }
        break;
      case 2:
        if (!dataFetched.leads && !leadsLoading) {
          console.log('AdminDashboard - Fetching leads for tab 2');
          fetchLeads();
        }
        break;
      case 3:
        if (!dataFetched.properties && !propertiesLoading) {
          console.log('AdminDashboard - Fetching properties for tab 3');
          fetchProperties();
        }
        break;
      default:
        break;
    }
  }, [tabValue]); // Minimal dependencies to prevent excessive re-runs

  // Property actions
  const handleCreateProperty = async () => {
    setPropertyActionLoading(true);
    try {
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
        completionDate: '',
      });
      fetchProperties();
      setSuccess('Property created successfully!');
      // Reset the fetch flag to allow future refreshes
      setDataFetched(prev => ({ ...prev, properties: false }));
    } catch (err) {
      setError('Failed to create property');
    } finally {
      setPropertyActionLoading(false);
    }
  };

  const handleEditProperty = (property: any) => {
    setEditProperty(property);
    setEditPropertyForm({
      ...property,
      amenities: Array.isArray(property.amenities)
        ? property.amenities.join(', ')
        : property.amenities,
    });
  };

  const handleEditPropertySave = async () => {
    if (!editPropertyForm) return;
    setPropertyActionLoading(true);
    try {
      await updateProperty(editPropertyForm._id, {
        ...editPropertyForm,
        amenities:
          typeof editPropertyForm.amenities === 'string'
            ? editPropertyForm.amenities.split(',').map((a: string) => a.trim())
            : editPropertyForm.amenities,
      });
      setEditProperty(null);
      setEditPropertyForm(null);
      fetchProperties();
      setSuccess('Property updated successfully!');
      // Reset the fetch flag to allow future refreshes
      setDataFetched(prev => ({ ...prev, properties: false }));
    } catch (err) {
      setError('Failed to update property');
    } finally {
      setPropertyActionLoading(false);
    }
  };

  function handleViewLeads(property: any): void {
    const propertyLeads = leads.filter(
      lead =>
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

  // User Management Functions
  const handleEditUser = async (updatedUser: any) => {
    setUserActionLoading(true);
    try {
      await updateUser(editUser._id, updatedUser);
      setEditUser(null);
      fetchUsers();
      setSuccess('User updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setUserActionLoading(false);
    }
  };

  const handleResetPassword = async (newPassword: string) => {
    setUserActionLoading(true);
    try {
      await resetUserPassword(resetPasswordUser._id, newPassword, true);
      setResetPasswordUser(null);
      setSuccess('Password reset successfully! Notification sent to user.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setUserActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setUserActionLoading(true);
    try {
      await deleteUser(deleteUserConfirm._id);
      setDeleteUserConfirm(null);
      fetchUsers();
      setSuccess('User deleted successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setUserActionLoading(false);
    }
  };

  // Lead Management Handler Functions
  const handleAssignBroker = async (brokerId: string) => {
    if (!selectedLead) return;
    setUserActionLoading(true);
    try {
      await assignBrokerToLead(selectedLead._id, brokerId);
      setAssignBrokerDialog(false);
      setSelectedLead(null);
      fetchLeads();
      setSuccess('Broker assigned successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to assign broker');
    } finally {
      setUserActionLoading(false);
    }
  };

  const handleUpdateLeadStatus = async () => {
    if (!statusLead) return;
    setUserActionLoading(true);
    try {
      await updateLead(statusLead._id, { status: newStatus });
      setStatusDialog(false);
      setStatusLead(null);
      setNewStatus('');
      fetchLeads();
      setSuccess('Lead status updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update lead status');
    } finally {
      setUserActionLoading(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!leadToDelete) return;
    setUserActionLoading(true);
    try {
      await deleteLead(leadToDelete._id);
      setDeleteLeadDialog(false);
      setLeadToDelete(null);
      fetchLeads();
      setSuccess('Lead deleted successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete lead');
    } finally {
      setUserActionLoading(false);
    }
  };

  const handleRestoreLead = async (leadId: string) => {
    setUserActionLoading(true);
    try {
      await restoreLead(leadId);
      fetchLeads();
      setSuccess('Lead restored successfully! It will now be visible to the broker again.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to restore lead');
    } finally {
      setUserActionLoading(false);
    }
  };

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      {/* Header */}
      <Box
        display='flex'
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent='space-between'
        alignItems={{ xs: 'stretch', sm: 'center' }}
        mb={4}
        gap={{ xs: 2, sm: 0 }}
      >
        <Typography
          variant='h4'
          component='h1'
          fontWeight='bold'
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          <AdminPanelSettings
            sx={{ mr: 1, verticalAlign: 'middle', fontSize: { xs: '1.5rem', md: '2rem' } }}
          />
          Admin Dashboard
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          <Button
            variant='outlined'
            startIcon={<Refresh />}
            onClick={() => {
              fetchDashboardStats();
            }}
            disabled={loading}
            fullWidth={isMobile}
            size={isMobile ? 'large' : 'medium'}
          >
            Refresh
          </Button>
          <Button
            variant='outlined'
            startIcon={<TrendingUp />}
            onClick={() => setTabValue(2)}
            sx={{
              color: 'warning.main',
              borderColor: 'warning.main',
              width: { xs: '100%', sm: 'auto' },
            }}
            size={isMobile ? 'large' : 'medium'}
          >
            Manage Leads
          </Button>
          <Button
            variant='contained'
            startIcon={<PersonAdd />}
            fullWidth={isMobile}
            size={isMobile ? 'large' : 'medium'}
            onClick={() => {
              setAddUserDialog(true);
              setManualUser({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: '',
                companyName: '',
                licenseNumber: '',
              });
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
      <Dialog open={addUserDialog} onClose={() => setAddUserDialog(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>User Role</InputLabel>
              <Select
                value={newUserRole}
                label='User Role'
                onChange={e => setNewUserRole(e.target.value)}
              >
                <MenuItem value='customer'>Customer</MenuItem>
                <MenuItem value='broker'>Broker</MenuItem>
                <MenuItem value='builder'>Builder</MenuItem>
                <MenuItem value='admin'>Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {newUserRole === 'customer' && (
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Approved Customer (optional)</InputLabel>
                <Select
                  value={selectedApprovedCustomer}
                  label='Approved Customer (optional)'
                  onChange={e => {
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
                        licenseNumber: '',
                      });
                    }
                  }}
                >
                  <MenuItem value=''>-- Manual Entry --</MenuItem>
                  {approvedCustomers.map((c: any) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.customerId ? `[${c.customerId}] ` : ''}
                      {c.name} ({c.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              fullWidth
              label='First Name'
              value={manualUser.firstName}
              onChange={e => setManualUser(u => ({ ...u, firstName: e.target.value }))}
              required
            />
            <TextField
              fullWidth
              label='Last Name'
              value={manualUser.lastName}
              onChange={e => setManualUser((u: any) => ({ ...u, lastName: e.target.value }))}
              required
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <TextField
              fullWidth
              label='Email'
              value={manualUser.email}
              onChange={e => setManualUser((u: any) => ({ ...u, email: e.target.value }))}
              required
            />
            <TextField
              fullWidth
              label='Phone'
              value={manualUser.phone}
              onChange={e => setManualUser((u: any) => ({ ...u, phone: e.target.value }))}
              required
            />
          </Box>
          {(newUserRole === 'broker' || newUserRole === 'builder') && (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
              <TextField
                fullWidth
                label='Company Name'
                value={manualUser.companyName}
                onChange={e => setManualUser((u: any) => ({ ...u, companyName: e.target.value }))}
                required
              />
              <TextField
                fullWidth
                label='License Number (optional)'
                value={manualUser.licenseNumber}
                onChange={e => setManualUser((u: any) => ({ ...u, licenseNumber: e.target.value }))}
              />
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <TextField
              fullWidth
              label='Password'
              type='text'
              value={manualUser.password || autoPassword}
              onChange={e => setManualUser((u: any) => ({ ...u, password: e.target.value }))}
              required
            />
            <Button variant='outlined' onClick={generatePassword} sx={{ minWidth: 'auto', px: 2 }}>
              Generate Password
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddUserDialog(false)} startIcon={<Close />}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleCreateUser}
            disabled={
              creatingUser ||
              !manualUser.firstName ||
              !manualUser.lastName ||
              !manualUser.email ||
              !manualUser.phone ||
              !(manualUser.password || autoPassword)
            }
            startIcon={creatingUser ? <Refresh /> : <Save />}
          >
            {creatingUser ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Alert */}
      {error && (
        <Alert severity='error' sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #304FFE 0%, #5C6FFF 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center'>
                <People sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant='h4' fontWeight='bold' color='white'>
                    {stats.totalUsers}
                  </Typography>
                  <Typography color='rgba(255,255,255,0.8)'>Total Users</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #00C853 0%, #4CAF50 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center'>
                <ManageAccounts sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant='h4' fontWeight='bold' color='white'>
                    {stats.totalCustomers}
                  </Typography>
                  <Typography color='rgba(255,255,255,0.8)'>Customers</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center'>
                <Work sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant='h4' fontWeight='bold' color='white'>
                    {stats.totalBrokers}
                  </Typography>
                  <Typography color='rgba(255,255,255,0.8)'>Brokers</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center'>
                <AccountBalance sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant='h4' fontWeight='bold' color='white'>
                    {stats.totalBuilders}
                  </Typography>
                  <Typography color='rgba(255,255,255,0.8)'>Builders</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center'>
                <AdminPanelSettings sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant='h4' fontWeight='bold' color='white'>
                    {stats.totalAdmins}
                  </Typography>
                  <Typography color='rgba(255,255,255,0.8)'>Admins</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Additional Stats Row */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center'>
                <MonetizationOn sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant='h4' fontWeight='bold' color='white'>
                    ₹{stats.totalSanctionedLoans?.toLocaleString() || '0'}
                  </Typography>
                  <Typography color='rgba(255,255,255,0.8)'>Total Sanctioned Loans</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center'>
                <TrendingUp sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant='h4' fontWeight='bold' color='white'>
                    {stats.totalLeads || '0'}
                  </Typography>
                  <Typography color='rgba(255,255,255,0.8)'>Total Leads</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #D32F2F 0%, #F44336 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center'>
                <Assignment sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant='h4' fontWeight='bold' color='white'>
                    {stats.unassignedLeads || '0'}
                  </Typography>
                  <Typography color='rgba(255,255,255,0.8)'>Unassigned Leads</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center'>
                <Assessment sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant='h4' fontWeight='bold' color='white'>
                    {stats.leadConversionRate?.toFixed(1) || '0'}%
                  </Typography>
                  <Typography color='rgba(255,255,255,0.8)'>Lead Conversion</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Main Content */}
      <Card sx={{ mb: 3, overflow: 'visible' }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: { xs: 2, md: 3 },
            borderRadius: '12px 12px 0 0',
          }}
        >
          <Typography
            variant='h5'
            fontWeight='bold'
            sx={{ mb: 2, fontSize: { xs: '1.25rem', md: '1.5rem' } }}
          >
            Dashboard Navigation
          </Typography>

          {/* Desktop/Tablet Tabs */}
          {!isMobile && (
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              variant='scrollable'
              scrollButtons='auto'
              allowScrollButtonsMobile
              sx={{
                '& .MuiTabs-scrollButtons': {
                  color: 'rgba(255,255,255,0.7)',
                  '&.Mui-disabled': { opacity: 0.3 },
                  '&:hover': { color: 'white' },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'white',
                  height: 3,
                  borderRadius: '2px',
                },
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 600,
                  fontSize: { md: '0.875rem', lg: '1rem' },
                  textTransform: 'none',
                  minHeight: 60,
                  minWidth: { md: 140, lg: 180 },
                  px: { md: 2, lg: 3 },
                  '&.Mui-selected': { color: 'white' },
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 2,
                  },
                },
              }}
            >
              <Tab
                label='Users'
                icon={<People sx={{ fontSize: 24 }} />}
                iconPosition='start'
                sx={{ flexDirection: 'row', gap: 1, '& .MuiTab-iconWrapper': { mb: 0 } }}
              />
              <Tab
                label='Analytics'
                icon={<Analytics sx={{ fontSize: 24 }} />}
                iconPosition='start'
                sx={{ flexDirection: 'row', gap: 1, '& .MuiTab-iconWrapper': { mb: 0 } }}
              />
              <Tab
                label='Lead Management'
                icon={<TrendingUp sx={{ fontSize: 24 }} />}
                iconPosition='start'
                sx={{ flexDirection: 'row', gap: 1, '& .MuiTab-iconWrapper': { mb: 0 } }}
              />
              <Tab
                label='Property Management'
                icon={<Business sx={{ fontSize: 24 }} />}
                iconPosition='start'
                sx={{ flexDirection: 'row', gap: 1, '& .MuiTab-iconWrapper': { mb: 0 } }}
              />
              <Tab
                label='Applications'
                icon={<Assignment sx={{ fontSize: 24 }} />}
                iconPosition='start'
                sx={{ flexDirection: 'row', gap: 1, '& .MuiTab-iconWrapper': { mb: 0 } }}
              />
              <Tab
                label='Reports'
                icon={<Assessment sx={{ fontSize: 24 }} />}
                iconPosition='start'
                sx={{ flexDirection: 'row', gap: 1, '& .MuiTab-iconWrapper': { mb: 0 } }}
              />
            </Tabs>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <Box>
              <Typography variant='body2' sx={{ mb: 2, opacity: 0.9 }}>
                Current Section:{' '}
                {tabValue === 0
                  ? 'Users'
                  : tabValue === 1
                    ? 'Analytics'
                    : tabValue === 2
                      ? 'Lead Management'
                      : tabValue === 3
                        ? 'Property Management'
                        : tabValue === 4
                          ? 'Applications'
                          : 'Reports'}
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 1,
                  mt: 2,
                }}
              >
                {[
                  { icon: <People />, label: 'Users', value: 0 },
                  { icon: <Analytics />, label: 'Analytics', value: 1 },
                  { icon: <TrendingUp />, label: 'Leads', value: 2 },
                  { icon: <Business />, label: 'Properties', value: 3 },
                  { icon: <Assignment />, label: 'Applications', value: 4 },
                  { icon: <Assessment />, label: 'Reports', value: 5 },
                ].map(tab => (
                  <Button
                    key={tab.value}
                    variant={tabValue === tab.value ? 'contained' : 'outlined'}
                    onClick={() => setTabValue(tab.value)}
                    startIcon={tab.icon}
                    sx={{
                      bgcolor: tabValue === tab.value ? 'rgba(255,255,255,0.2)' : 'transparent',
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.3)',
                      py: 1,
                      px: 1,
                      fontSize: '0.75rem',
                      minWidth: 'auto',
                      flexDirection: 'column',
                      gap: 0.5,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '& .MuiButton-startIcon': {
                        margin: 0,
                        fontSize: '1rem',
                      },
                    }}
                  >
                    {tab.label}
                  </Button>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Card>

      {/* Users Tab */}
      {tabValue === 0 && (
        <Card>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: { xs: 40, sm: 56 },
                    height: { xs: 40, sm: 56 },
                  }}
                >
                  <People />
                </Avatar>
                <Box>
                  <Typography
                    variant='h6'
                    sx={{ fontWeight: 600, fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
                  >
                    User Management
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {filteredUsers.length} of {users.length} users
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  display: 'flex',
                  gap: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <TextField
                  size='small'
                  placeholder='Search users...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  sx={{ minWidth: { xs: '100%', sm: 250 } }}
                  InputProps={{
                    startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                    endAdornment: searchQuery && (
                      <IconButton size='small' onClick={() => setSearchQuery('')} sx={{ p: 0.5 }}>
                        <Close fontSize='small' />
                      </IconButton>
                    ),
                  }}
                />
                <Button
                  variant='contained'
                  startIcon={<PersonAdd />}
                  onClick={() => {
                    setAddUserDialog(true);
                    setManualUser({
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      password: '',
                      companyName: '',
                      licenseNumber: '',
                    });
                    setAutoPassword('');
                    setSelectedApprovedCustomer('');
                    setNewUserRole('customer');
                  }}
                  size={isMobile ? 'large' : 'medium'}
                  fullWidth={isMobile}
                >
                  Add User
                </Button>
              </Box>
            </Box>
            {usersLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 300,
                }}
              >
                <CircularProgress />
              </Box>
            ) : usersError ? (
              <Alert severity='error'>{usersError}</Alert>
            ) : filteredUsers.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 6,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  border: '2px dashed',
                  borderColor: 'divider',
                }}
              >
                <Search sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant='h6' color='text.secondary' gutterBottom>
                  No users found
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Try adjusting your search terms
                </Typography>
                <Button variant='outlined' onClick={() => setSearchQuery('')} sx={{ mt: 2 }}>
                  Clear Search
                </Button>
              </Box>
            ) : (
              <Box>
                {/* Desktop List View */}
                {!isMobile && (
                  <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                    {filteredUsers.map((user, index) => (
                      <React.Fragment key={user._id}>
                        <ListItem sx={{ py: 2, px: 3, '&:hover': { bgcolor: 'action.hover' } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 3 }}>
                            <Avatar
                              sx={{
                                width: 56,
                                height: 56,
                                bgcolor:
                                  user.role === 'admin'
                                    ? 'error.main'
                                    : user.role === 'builder'
                                      ? 'warning.main'
                                      : 'success.main',
                                fontSize: '1.25rem',
                                fontWeight: 600,
                              }}
                            >
                              {(user.fullName || user.firstName || user.email)
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                                  {user.fullName ||
                                    `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                                    'Unknown User'}
                                </Typography>
                                <Chip
                                  label={user.role}
                                  size='small'
                                  color={
                                    user.role === 'admin'
                                      ? 'error'
                                      : user.role === 'builder'
                                        ? 'warning'
                                        : 'success'
                                  }
                                  sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                                />
                                <Chip
                                  label={user.status}
                                  size='small'
                                  variant='outlined'
                                  color={user.status === 'active' ? 'success' : 'default'}
                                  sx={{ textTransform: 'capitalize' }}
                                />
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 3,
                                  flexWrap: 'wrap',
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant='body2' color='text.secondary'>
                                    {user.email}
                                  </Typography>
                                </Box>
                                {user.phone && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant='body2' color='text.secondary'>
                                      {user.phone}
                                    </Typography>
                                  </Box>
                                )}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Badge sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant='body2' color='text.secondary'>
                                    Joined{' '}
                                    {user.createdAt
                                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric',
                                        })
                                      : 'Unknown'}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            <Stack direction='row' spacing={1}>
                              <Tooltip title='View Details'>
                                <IconButton size='small' onClick={() => setViewUser(user)}>
                                  <Visibility fontSize='small' />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title='Edit User'>
                                <IconButton size='small' onClick={() => setEditUser(user)}>
                                  <Edit fontSize='small' />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title='Reset Password'>
                                <IconButton size='small' onClick={() => setResetPasswordUser(user)}>
                                  <LockReset fontSize='small' />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title='Delete User'>
                                <IconButton
                                  size='small'
                                  onClick={() => setDeleteUserConfirm(user)}
                                  sx={{
                                    color: 'error.main',
                                    '&:hover': { bgcolor: 'error.light', color: 'white' },
                                  }}
                                >
                                  <Delete fontSize='small' />
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

                {/* Mobile Card View */}
                {isMobile && (
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
                    {filteredUsers.map(user => (
                      <Card
                        key={user._id}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:hover': {
                            boxShadow: 2,
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                bgcolor:
                                  user.role === 'admin'
                                    ? 'error.main'
                                    : user.role === 'builder'
                                      ? 'warning.main'
                                      : 'success.main',
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                flexShrink: 0,
                              }}
                            >
                              {(user.fullName || user.firstName || user.email)
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  mb: 1,
                                  flexWrap: 'wrap',
                                }}
                              >
                                <Typography variant='h6' sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                  {user.fullName ||
                                    `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                                    'Unknown User'}
                                </Typography>
                                <Chip
                                  label={user.role}
                                  size='small'
                                  color={
                                    user.role === 'admin'
                                      ? 'error'
                                      : user.role === 'builder'
                                        ? 'warning'
                                        : 'success'
                                  }
                                  sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: 500,
                                    fontSize: '0.6875rem',
                                  }}
                                />
                              </Box>
                              <Box sx={{ mb: 1 }}>
                                <Box
                                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}
                                >
                                  <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                                  <Typography
                                    variant='body2'
                                    color='text.secondary'
                                    sx={{ fontSize: '0.75rem' }}
                                  >
                                    {user.email}
                                  </Typography>
                                </Box>
                                {user.phone && (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                      mb: 0.5,
                                    }}
                                  >
                                    <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                                    <Typography
                                      variant='body2'
                                      color='text.secondary'
                                      sx={{ fontSize: '0.75rem' }}
                                    >
                                      {user.phone}
                                    </Typography>
                                  </Box>
                                )}
                                <Box
                                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}
                                >
                                  <Badge sx={{ fontSize: 14, color: 'text.secondary' }} />
                                  <Typography
                                    variant='body2'
                                    color='text.secondary'
                                    sx={{ fontSize: '0.75rem' }}
                                  >
                                    Joined{' '}
                                    {user.createdAt
                                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric',
                                        })
                                      : 'Unknown'}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={user.status}
                                  size='small'
                                  variant='outlined'
                                  color={user.status === 'active' ? 'success' : 'default'}
                                  sx={{ textTransform: 'capitalize', fontSize: '0.6875rem' }}
                                />
                              </Box>

                              {/* Mobile Action Buttons */}
                              <Box
                                sx={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(2, 1fr)',
                                  gap: 1,
                                  mt: 2,
                                }}
                              >
                                <Button
                                  size='small'
                                  variant='outlined'
                                  startIcon={<Visibility />}
                                  onClick={() => setViewUser(user)}
                                  sx={{ fontSize: '0.75rem', py: 0.5 }}
                                >
                                  View
                                </Button>
                                <Button
                                  size='small'
                                  variant='outlined'
                                  startIcon={<Edit />}
                                  onClick={() => setEditUser(user)}
                                  sx={{ fontSize: '0.75rem', py: 0.5 }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size='small'
                                  variant='outlined'
                                  color='warning'
                                  startIcon={<LockReset />}
                                  onClick={() => setResetPasswordUser(user)}
                                  sx={{ fontSize: '0.75rem', py: 0.5 }}
                                >
                                  Reset
                                </Button>
                                <Button
                                  size='small'
                                  variant='outlined'
                                  color='error'
                                  startIcon={<Delete />}
                                  onClick={() => setDeleteUserConfirm(user)}
                                  sx={{ fontSize: '0.75rem', py: 0.5 }}
                                >
                                  Delete
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analytics Tab */}
      {tabValue === 1 && (
        <Box>
          {analyticsLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 400,
              }}
            >
              <CircularProgress size={60} />
            </Box>
          ) : analyticsData ? (
            <>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <Card
                    sx={{
                      height: '100%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <CardContent>
                      <Box display='flex' alignItems='center' justifyContent='space-between'>
                        <Box>
                          <Typography variant='h4' fontWeight='bold' color='white'>
                            {analyticsData.userAnalytics.newUsersThisMonth}
                          </Typography>
                          <Typography color='rgba(255,255,255,0.8)' variant='body2'>
                            New Users This Month
                          </Typography>
                          <Box display='flex' alignItems='center' mt={1}>
                            {analyticsData.userAnalytics.userGrowthRate >= 0 ? (
                              <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                            ) : (
                              <TrendingDown sx={{ fontSize: 16, mr: 0.5 }} />
                            )}
                            <Typography variant='caption' color='rgba(255,255,255,0.9)'>
                              {Math.abs(analyticsData.userAnalytics.userGrowthRate).toFixed(1)}% vs
                              last month
                            </Typography>
                          </Box>
                        </Box>
                        <Group sx={{ fontSize: 40, opacity: 0.7 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
                {/* Other analytics cards... */}
              </Box>
              {/* Charts and Detailed Analytics */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                {/* Application Status Distribution */}
                <Box sx={{ flex: '1 1 500px', minWidth: '500px' }}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography
                        variant='h6'
                        gutterBottom
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <PieChart color='primary' />
                        Application Status Distribution
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {analyticsData.applicationAnalytics.statusDistribution.map(
                          (status: any) => {
                            const percentage =
                              (status.count /
                                analyticsData.applicationAnalytics.totalApplications) *
                              100;
                            const getStatusColor = (statusName: string) => {
                              switch (statusName) {
                                case 'sanctioned':
                                case 'disbursed':
                                  return 'success';
                                case 'rejected':
                                  return 'error';
                                case 'submitted':
                                case 'under_review':
                                  return 'info';
                                default:
                                  return 'warning';
                              }
                            };
                            return (
                              <Box key={status._id} sx={{ mb: 2 }}>
                                <Box
                                  display='flex'
                                  justifyContent='space-between'
                                  alignItems='center'
                                  sx={{ mb: 1 }}
                                >
                                  <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                                    {status._id.replace('_', ' ')}
                                  </Typography>
                                  <Typography variant='body2' fontWeight='bold'>
                                    {status.count} ({percentage.toFixed(1)}%)
                                  </Typography>
                                </Box>
                                <LinearProgress
                                  variant='determinate'
                                  value={percentage}
                                  color={getStatusColor(status._id)}
                                  sx={{ height: 8, borderRadius: 4 }}
                                />
                              </Box>
                            );
                          }
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
                {/* User Role Distribution */}
                <Box sx={{ flex: '1 1 500px', minWidth: '500px' }}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography
                        variant='h6'
                        gutterBottom
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Group color='primary' />
                        User Role Distribution
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {analyticsData.userAnalytics.roleDistribution &&
                        analyticsData.userAnalytics.roleDistribution.length > 0 ? (
                          analyticsData.userAnalytics.roleDistribution.map((role: any) => {
                            const percentage =
                              (role.count / analyticsData.userAnalytics.totalUsers) * 100;
                            const getRoleColor = (roleName: string) => {
                              switch (roleName) {
                                case 'admin':
                                  return 'secondary';
                                case 'broker':
                                  return 'primary';
                                case 'lender':
                                  return 'info';
                                case 'customer':
                                  return 'success';
                                default:
                                  return 'warning';
                              }
                            };
                            return (
                              <Box key={role._id} sx={{ mb: 2 }}>
                                <Box
                                  display='flex'
                                  justifyContent='space-between'
                                  alignItems='center'
                                  sx={{ mb: 1 }}
                                >
                                  <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                                    {role._id.replace('_', ' ')}
                                  </Typography>
                                  <Typography variant='body2' fontWeight='bold'>
                                    {role.count} ({percentage.toFixed(1)}%)
                                  </Typography>
                                </Box>
                                <LinearProgress
                                  variant='determinate'
                                  value={percentage}
                                  color={getRoleColor(role._id)}
                                  sx={{ height: 8, borderRadius: 4 }}
                                />
                              </Box>
                            );
                          })
                        ) : (
                          <Box textAlign='center'>
                            <Typography variant='h6' color='text.secondary' gutterBottom>
                              No Analytics Data Available
                            </Typography>
                            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                              Analytics data will appear here once there is sufficient application
                              activity.
                            </Typography>
                            <Button
                              variant='outlined'
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
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 400,
              }}
            >
              <CircularProgress size={60} />
            </Box>
          )}
        </Box>
      )}

      {/* Lead Management Tab */}
      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant='h6' sx={{ fontWeight: 600 }}>
                    Lead Management
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {filteredLeads.length} of {leads.length} leads
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  size='small'
                  placeholder='Search leads...'
                  value={leadSearchQuery}
                  onChange={e => setLeadSearchQuery(e.target.value)}
                  sx={{ minWidth: 200 }}
                  InputProps={{
                    startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                  }}
                />
                <FormControl size='small' sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={leadStatusFilter}
                    label='Status'
                    onChange={e => setLeadStatusFilter(e.target.value)}
                  >
                    <MenuItem value='all'>All Status</MenuItem>
                    <MenuItem value='new'>New</MenuItem>
                    <MenuItem value='contacted'>Contacted</MenuItem>
                    <MenuItem value='qualified'>Qualified</MenuItem>
                    <MenuItem value='processing'>Processing</MenuItem>
                    <MenuItem value='converted'>Converted</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size='small' sx={{ minWidth: 140 }}>
                  <InputLabel>Broker</InputLabel>
                  <Select
                    value={leadBrokerFilter}
                    label='Broker'
                    onChange={e => setLeadBrokerFilter(e.target.value)}
                  >
                    <MenuItem value='all'>All Brokers</MenuItem>
                    <MenuItem value='unassigned'>Unassigned</MenuItem>
                    {brokers.map(broker => (
                      <MenuItem key={broker._id} value={broker.email}>
                        {broker.fullName || `${broker.firstName} ${broker.lastName}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            {leadsLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 300,
                }}
              >
                <CircularProgress />
              </Box>
            ) : leadsError ? (
              <Alert severity='error'>{leadsError}</Alert>
            ) : filteredLeads.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 6,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  border: '2px dashed',
                  borderColor: 'divider',
                }}
              >
                <Search sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant='h6' color='text.secondary' gutterBottom>
                  No leads found
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Try adjusting your search terms or filters
                </Typography>
                <Button
                  variant='outlined'
                  onClick={() => {
                    setLeadSearchQuery('');
                    setLeadStatusFilter('all');
                    setLeadBrokerFilter('all');
                  }}
                  sx={{ mt: 2 }}
                >
                  Clear Filters
                </Button>
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
                      <TableCell>Assigned Broker</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell align='center'>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLeads.map(lead => (
                      <TableRow
                        key={lead._id}
                        sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
                              {lead.name}
                            </Typography>
                            <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                              ID: {lead._id}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant='body2'>{lead.email}</Typography>
                            <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                              {lead.contact}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                            ₹{(lead.loanAmount / 100000).toFixed(1)}L
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant='body2'>{lead.propertyDetails}</Typography>
                            <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                              {lead.source}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Stack direction='column' spacing={0.5}>
                            <Chip
                              label={lead.status.toUpperCase()}
                              color={
                                lead.status === 'converted'
                                  ? 'success'
                                  : lead.status === 'qualified'
                                    ? 'info'
                                    : lead.status === 'processing'
                                      ? 'warning'
                                      : lead.status === 'contacted'
                                        ? 'secondary'
                                        : 'default'
                              }
                              size='small'
                            />
                            {lead.deletedByBroker && (
                              <Chip
                                label='DELETED BY BROKER'
                                color='error'
                                variant='outlined'
                                size='small'
                                sx={{ fontSize: '0.7rem' }}
                              />
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {lead.brokerId ? (
                            <Typography variant='body2'>
                              {typeof lead.brokerId === 'object' && lead.brokerId !== null
                                ? `${lead.brokerId.firstName || ''} ${lead.brokerId.lastName || ''}`.trim()
                                : (() => {
                                    const broker = brokers.find(b => b._id === lead.brokerId);
                                    return broker
                                      ? `${broker.firstName || ''} ${broker.lastName || ''}`.trim()
                                      : 'Unknown Broker';
                                  })()}
                            </Typography>
                          ) : (
                            <Chip label='Unassigned' size='small' variant='outlined' />
                          )}
                        </TableCell>
                        <TableCell>{lead.source}</TableCell>
                        <TableCell align='center'>
                          <Stack direction='row' spacing={1} justifyContent='center'>
                            <Tooltip title='View Details'>
                              <IconButton
                                size='small'
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setLeadDialog(true);
                                }}
                              >
                                <Visibility fontSize='small' />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title='Assign Broker'>
                              <IconButton
                                size='small'
                                color='primary'
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setAssignBrokerDialog(true);
                                }}
                              >
                                <Work fontSize='small' />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title='Update Status'>
                              <IconButton
                                size='small'
                                color='warning'
                                onClick={() => {
                                  setStatusLead(lead);
                                  setNewStatus(lead.status);
                                  setStatusDialog(true);
                                }}
                              >
                                <Edit fontSize='small' />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title='Delete Lead'>
                              <IconButton
                                size='small'
                                color='error'
                                onClick={() => {
                                  setDeleteLeadDialog(true);
                                  setLeadToDelete(lead);
                                }}
                              >
                                <Delete fontSize='small' />
                              </IconButton>
                            </Tooltip>
                            {lead.deletedByBroker && (
                              <Tooltip title='Restore Lead (Make visible to broker again)'>
                                <IconButton
                                  size='small'
                                  color='success'
                                  onClick={() => handleRestoreLead(lead._id)}
                                >
                                  <RestoreFromTrash fontSize='small' />
                                </IconButton>
                              </Tooltip>
                            )}
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
            <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
              <Typography variant='h6' fontWeight={600}>
                Property Management
              </Typography>
              <Button
                variant='contained'
                color='primary'
                startIcon={<Business />}
                onClick={() => setShowCreateProperty(true)}
                sx={{ borderRadius: 2, fontWeight: 600 }}
              >
                Add Property
              </Button>
            </Box>
            {propertiesLoading ? (
              <Box display='flex' justifyContent='center' alignItems='center' minHeight={200}>
                <CircularProgress />
              </Box>
            ) : propertiesError ? (
              <Alert severity='error'>{propertiesError}</Alert>
            ) : properties.length === 0 ? (
              <Box
                textAlign='center'
                py={6}
                borderRadius={2}
                bgcolor='background.default'
                border='2px dashed'
                borderColor='divider'
              >
                <Typography variant='h6' color='text.secondary' gutterBottom>
                  No properties found
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Properties will appear here once they are added.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size='small'>
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
                      <TableCell align='right'>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {properties.map(property => (
                      <TableRow key={property._id} sx={{ opacity: property.isDeleted ? 0.5 : 1 }}>
                        <TableCell>
                          <Box>
                            <Typography
                              variant='subtitle1'
                              fontWeight={700}
                              sx={{ mb: 0, lineHeight: 1.2 }}
                            >
                              {property.name}
                            </Typography>
                            {property.configuration && (
                              <Typography
                                variant='body2'
                                color='text.secondary'
                                sx={{ fontSize: 13, mt: 0.2, ml: 0.5 }}
                              >
                                • {property.configuration}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={property.type?.toUpperCase()}
                            size='small'
                            color='primary'
                            variant='outlined'
                            sx={{ fontWeight: 600, letterSpacing: 0.5 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant='body1'>{property.location}</Typography>
                            {property.area && (
                              <Typography
                                variant='body2'
                                color='text.secondary'
                                sx={{ fontSize: 13 }}
                              >
                                {property.area}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant='body1'
                            sx={{ color: 'success.main', fontWeight: 600 }}
                          >
                            ₹{property.pricePerSqft}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant='body2' sx={{ fontWeight: 500 }}>
                              Available: {property.availableUnits}
                            </Typography>
                            <Typography
                              variant='body2'
                              color='text.secondary'
                              sx={{ fontSize: 13 }}
                            >
                              Total: {property.totalUnits}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={property.status?.toUpperCase()}
                            size='small'
                            sx={{
                              backgroundColor:
                                property.status === 'UNDER CONSTRUCTION' ? '#FFA726' : '#E0E0E0',
                              color: property.status === 'UNDER CONSTRUCTION' ? '#fff' : '#333',
                              fontWeight: 600,
                              borderRadius: 2,
                              px: 2,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' color='text.secondary'>
                            {property.builderName || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant='body1'
                            sx={{ color: '#1976d2', fontWeight: 600, cursor: 'pointer' }}
                            onClick={() => handleViewLeads(property)}
                          >
                            {property.leadRequests || 0}
                          </Typography>
                        </TableCell>
                        <TableCell align='right'>
                          <Stack direction='row' spacing={1} justifyContent='flex-end'>
                            <Tooltip title='View'>
                              <span>
                                <IconButton
                                  onClick={() => setViewProperty(property)}
                                  sx={{ color: '#90caf9' }}
                                >
                                  <Visibility />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title='Edit'>
                              <span>
                                <IconButton
                                  onClick={() => handleEditProperty(property)}
                                  disabled={propertyActionLoading}
                                  sx={{ color: '#f48fb1' }}
                                >
                                  <Edit />
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

            <Dialog
              open={!!editProperty}
              onClose={() => {
                setEditProperty(null);
                setEditPropertyForm(null);
              }}
              maxWidth='md'
              fullWidth
            >
              <DialogTitle>Edit Property</DialogTitle>
              <DialogContent>
                {editPropertyForm && (
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label='Property Name'
                      value={editPropertyForm.name}
                      onChange={e =>
                        setEditPropertyForm((f: any) => ({ ...f, name: e.target.value }))
                      }
                      required
                    />
                    <TextField
                      fullWidth
                      label='Type'
                      value={editPropertyForm.type}
                      onChange={e =>
                        setEditPropertyForm((f: any) => ({ ...f, type: e.target.value }))
                      }
                      required
                    />
                    <TextField
                      fullWidth
                      label='Location'
                      value={editPropertyForm.location}
                      onChange={e =>
                        setEditPropertyForm((f: any) => ({ ...f, location: e.target.value }))
                      }
                      required
                    />
                    <TextField
                      fullWidth
                      label='Area (sqft)'
                      value={editPropertyForm.area}
                      onChange={e =>
                        setEditPropertyForm((f: any) => ({ ...f, area: e.target.value }))
                      }
                      required
                    />
                    <TextField
                      fullWidth
                      label='Price Per Sqft'
                      type='number'
                      value={editPropertyForm.pricePerSqft}
                      onChange={e =>
                        setEditPropertyForm((f: any) => ({ ...f, pricePerSqft: e.target.value }))
                      }
                      required
                    />
                    <TextField
                      fullWidth
                      label='Total Units'
                      type='number'
                      value={editPropertyForm.totalUnits}
                      onChange={e =>
                        setEditPropertyForm((f: any) => ({ ...f, totalUnits: e.target.value }))
                      }
                      required
                    />
                    <TextField
                      fullWidth
                      label='Available Units'
                      type='number'
                      value={editPropertyForm.availableUnits}
                      onChange={e =>
                        setEditPropertyForm((f: any) => ({ ...f, availableUnits: e.target.value }))
                      }
                      required
                    />
                    <TextField
                      fullWidth
                      label='Configuration'
                      value={editPropertyForm.configuration}
                      onChange={e =>
                        setEditPropertyForm((f: any) => ({ ...f, configuration: e.target.value }))
                      }
                      required
                    />
                    <TextField
                      fullWidth
                      label='Amenities (comma separated)'
                      value={editPropertyForm.amenities}
                      onChange={e =>
                        setEditPropertyForm((f: any) => ({ ...f, amenities: e.target.value }))
                      }
                    />
                    <TextField
                      fullWidth
                      label='Status'
                      value={editPropertyForm.status}
                      onChange={e =>
                        setEditPropertyForm((f: any) => ({ ...f, status: e.target.value }))
                      }
                      required
                    />
                    <TextField
                      fullWidth
                      label='Builder'
                      value={editPropertyForm.builderName || editPropertyForm.builder || ''}
                      disabled
                    />
                    <TextField
                      fullWidth
                      label='Description'
                      value={editPropertyForm.description}
                      onChange={e =>
                        setEditPropertyForm((f: any) => ({ ...f, description: e.target.value }))
                      }
                      multiline
                      minRows={2}
                    />
                  </Stack>
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setEditProperty(null);
                    setEditPropertyForm(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  onClick={handleEditPropertySave}
                  disabled={propertyActionLoading || !editPropertyForm}
                >
                  {propertyActionLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={showCreateProperty}
              onClose={() => setShowCreateProperty(false)}
              maxWidth='sm'
              fullWidth
            >
              <DialogTitle sx={{ fontWeight: 700, fontSize: 22, pb: 0 }}>
                Create Property
              </DialogTitle>
              <DialogContent>
                <Box
                  component='form'
                  sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  <TextField
                    label='Property Name'
                    value={propertyForm.name}
                    onChange={e => setPropertyForm(f => ({ ...f, name: e.target.value }))}
                    required
                    fullWidth
                  />
                  <TextField
                    label='Builder'
                    value={propertyForm.builder}
                    onChange={e => setPropertyForm(f => ({ ...f, builder: e.target.value }))}
                    required
                    fullWidth
                  />
                  {/* Other fields... */}
                </Box>
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={() => setShowCreateProperty(false)} startIcon={<Close />}>
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  onClick={handleCreateProperty}
                  startIcon={propertyActionLoading ? <CircularProgress size={18} /> : <Save />}
                  disabled={propertyActionLoading || !propertyForm.name || !propertyForm.builder}
                >
                  {propertyActionLoading ? 'Creating...' : 'Create Property'}
                </Button>
              </DialogActions>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* Applications Tab */}
      {tabValue === 4 && <ApplicationManagement />}

      {/* Reports Tab */}
      {tabValue === 5 && (
        <Card>
          <CardContent>
            <Box
              sx={{
                textAlign: 'center',
                py: 6,
                backgroundColor: 'background.paper',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider',
              }}
            >
              <Assessment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant='h6' color='text.secondary' gutterBottom>
                Reports & Analytics
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Comprehensive reporting features will be available in a future update.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity='success' sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity='error' sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* View User Dialog */}
      <Dialog open={!!viewUser} onClose={() => setViewUser(null)} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor:
                  viewUser?.role === 'admin'
                    ? 'error.main'
                    : viewUser?.role === 'builder'
                      ? 'warning.main'
                      : 'success.main',
                width: 40,
                height: 40,
              }}
            >
              {(viewUser?.fullName || viewUser?.firstName || viewUser?.email)
                ?.charAt(0)
                ?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant='h6' sx={{ fontWeight: 600 }}>
                User Details
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {viewUser?.role} Account Information
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {viewUser && (
            <Box sx={{ pt: 1 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}
                  >
                    Full Name
                  </Typography>
                  <Typography variant='body1' sx={{ mt: 0.5, fontWeight: 500 }}>
                    {viewUser.fullName ||
                      `${viewUser.firstName || ''} ${viewUser.lastName || ''}`.trim() ||
                      'Not provided'}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}
                  >
                    Role
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={viewUser.role}
                      size='small'
                      color={
                        viewUser.role === 'admin'
                          ? 'error'
                          : viewUser.role === 'builder'
                            ? 'warning'
                            : 'success'
                      }
                      sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}
                  >
                    Email Address
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{ mt: 0.5, fontWeight: 500, wordBreak: 'break-word' }}
                  >
                    {viewUser.email}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}
                  >
                    Phone Number
                  </Typography>
                  <Typography variant='body1' sx={{ mt: 0.5, fontWeight: 500 }}>
                    {viewUser.phone || 'Not provided'}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}
                  >
                    Account Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={viewUser.status}
                      size='small'
                      variant='outlined'
                      color={viewUser.status === 'active' ? 'success' : 'default'}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}
                  >
                    Member Since
                  </Typography>
                  <Typography variant='body1' sx={{ mt: 0.5, fontWeight: 500 }}>
                    {viewUser.createdAt
                      ? new Date(viewUser.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Unknown'}
                  </Typography>
                </Box>
              </Box>

              {/* Additional User Info for specific roles */}
              {(viewUser.companyName || viewUser.licenseNumber) && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant='subtitle2' sx={{ mb: 2, fontWeight: 600 }}>
                    Professional Information
                  </Typography>
                  {viewUser.companyName && (
                    <Box sx={{ mb: 1 }}>
                      <Typography
                        variant='caption'
                        color='text.secondary'
                        sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}
                      >
                        Company Name
                      </Typography>
                      <Typography variant='body2' sx={{ mt: 0.5 }}>
                        {viewUser.companyName}
                      </Typography>
                    </Box>
                  )}
                  {viewUser.licenseNumber && (
                    <Box>
                      <Typography
                        variant='caption'
                        color='text.secondary'
                        sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}
                      >
                        License Number
                      </Typography>
                      <Typography variant='body2' sx={{ mt: 0.5 }}>
                        {viewUser.licenseNumber}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setViewUser(null)}
            startIcon={<Close />}
            variant='outlined'
            fullWidth={isMobile}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              setViewUser(null);
              setEditUser(viewUser);
            }}
            startIcon={<Edit />}
            variant='contained'
            fullWidth={isMobile}
          >
            Edit User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onClose={() => setEditUser(null)} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Edit sx={{ color: 'primary.main' }} />
            <Box>
              <Typography variant='h6' sx={{ fontWeight: 600 }}>
                Edit User
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Update user information and settings
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {editUser && (
            <Box sx={{ pt: 1 }}>
              <Box
                sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}
              >
                <TextField
                  fullWidth
                  label='First Name'
                  value={editUser.firstName || ''}
                  onChange={e => setEditUser({ ...editUser, firstName: e.target.value })}
                  variant='outlined'
                  size={isMobile ? 'medium' : 'small'}
                />
                <TextField
                  fullWidth
                  label='Last Name'
                  value={editUser.lastName || ''}
                  onChange={e => setEditUser({ ...editUser, lastName: e.target.value })}
                  variant='outlined'
                  size={isMobile ? 'medium' : 'small'}
                />
              </Box>
              <TextField
                fullWidth
                label='Email Address'
                value={editUser.email || ''}
                onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                margin='normal'
                variant='outlined'
                size={isMobile ? 'medium' : 'small'}
                type='email'
              />
              <TextField
                fullWidth
                label='Phone Number'
                value={editUser.phone || ''}
                onChange={e => setEditUser({ ...editUser, phone: e.target.value })}
                margin='normal'
                variant='outlined'
                size={isMobile ? 'medium' : 'small'}
                type='tel'
              />
              <FormControl fullWidth margin='normal' size={isMobile ? 'medium' : 'small'}>
                <InputLabel>Account Status</InputLabel>
                <Select
                  value={editUser.status || 'active'}
                  onChange={e => setEditUser({ ...editUser, status: e.target.value })}
                  label='Account Status'
                >
                  <MenuItem value='active'>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }}
                      />
                      Active
                    </Box>
                  </MenuItem>
                  <MenuItem value='inactive'>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'grey.500' }} />
                      Inactive
                    </Box>
                  </MenuItem>
                  <MenuItem value='suspended'>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main' }}
                      />
                      Suspended
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Role Information (Read-only) */}
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}
                >
                  User Role
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={editUser.role}
                    size='small'
                    color={
                      editUser.role === 'admin'
                        ? 'error'
                        : editUser.role === 'builder'
                          ? 'warning'
                          : 'success'
                    }
                    sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                  />
                  <Typography variant='caption' color='text.secondary' sx={{ ml: 1 }}>
                    (Cannot be changed)
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            onClick={() => setEditUser(null)}
            variant='outlined'
            fullWidth={isMobile}
            size={isMobile ? 'large' : 'medium'}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleEditUser(editUser)}
            variant='contained'
            disabled={userActionLoading}
            startIcon={userActionLoading ? <CircularProgress size={20} /> : <Save />}
            fullWidth={isMobile}
            size={isMobile ? 'large' : 'medium'}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog
        open={!!resetPasswordUser}
        onClose={() => setResetPasswordUser(null)}
        maxWidth='xs'
        fullWidth
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LockReset sx={{ color: 'warning.main' }} />
            <Box>
              <Typography variant='h6' sx={{ fontWeight: 600 }}>
                Reset Password
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Set a new password for this user
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {resetPasswordUser && (
            <Box sx={{ pt: 1 }}>
              <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1, mb: 3 }}>
                <Typography
                  variant='subtitle2'
                  sx={{ fontWeight: 600, color: 'warning.contrastText' }}
                >
                  {resetPasswordUser.fullName || resetPasswordUser.email}
                </Typography>
                <Typography variant='caption' sx={{ color: 'warning.contrastText', opacity: 0.9 }}>
                  {resetPasswordUser.email}
                </Typography>
              </Box>

              <TextField
                fullWidth
                label='New Password'
                type='password'
                placeholder='Enter new password or leave blank for auto-generated'
                variant='outlined'
                size={isMobile ? 'medium' : 'small'}
                onChange={e =>
                  setResetPasswordUser({ ...resetPasswordUser, newPassword: e.target.value })
                }
                sx={{ mb: 2 }}
              />

              <Alert severity='info' sx={{ mb: 2 }}>
                <Typography variant='body2'>
                  If left blank, a secure password will be auto-generated and sent to the user via
                  email.
                </Typography>
              </Alert>

              <Alert severity='warning'>
                <Typography variant='body2'>
                  The user will need to use the new password for their next login.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            onClick={() => setResetPasswordUser(null)}
            variant='outlined'
            fullWidth={isMobile}
            size={isMobile ? 'large' : 'medium'}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleResetPassword(resetPasswordUser.newPassword || generatePassword())}
            variant='contained'
            color='warning'
            disabled={userActionLoading}
            startIcon={userActionLoading ? <CircularProgress size={20} /> : <LockReset />}
            fullWidth={isMobile}
            size={isMobile ? 'large' : 'medium'}
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog
        open={!!deleteUserConfirm}
        onClose={() => setDeleteUserConfirm(null)}
        maxWidth='xs'
        fullWidth
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Delete sx={{ color: 'error.main' }} />
            <Box>
              <Typography variant='h6' sx={{ fontWeight: 600, color: 'error.main' }}>
                Delete User
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                This action cannot be undone
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {deleteUserConfirm && (
            <Box sx={{ pt: 1 }}>
              <Typography variant='body1' sx={{ mb: 3, fontWeight: 500 }}>
                Are you sure you want to delete this user account?
              </Typography>

              <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'error.main',
                      fontSize: '0.875rem',
                    }}
                  >
                    {(
                      deleteUserConfirm.fullName ||
                      deleteUserConfirm.firstName ||
                      deleteUserConfirm.email
                    )
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography
                      variant='subtitle2'
                      sx={{ fontWeight: 600, color: 'error.contrastText' }}
                    >
                      {deleteUserConfirm.fullName ||
                        `${deleteUserConfirm.firstName || ''} ${deleteUserConfirm.lastName || ''}`.trim() ||
                        'Unknown User'}
                    </Typography>
                    <Typography
                      variant='caption'
                      sx={{ color: 'error.contrastText', opacity: 0.9 }}
                    >
                      {deleteUserConfirm.email}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={deleteUserConfirm.role}
                  size='small'
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'error.contrastText',
                    textTransform: 'capitalize',
                    fontWeight: 500,
                  }}
                />
              </Box>

              <Alert severity='warning' sx={{ mb: 2 }}>
                <Typography variant='body2'>
                  This action will soft-delete the user account. The user will not be able to log
                  in, but their data will be preserved for audit purposes.
                </Typography>
              </Alert>

              <Alert severity='error'>
                <Typography variant='body2' sx={{ fontWeight: 500 }}>
                  All associated data and permissions will be revoked immediately.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            onClick={() => setDeleteUserConfirm(null)}
            variant='outlined'
            fullWidth={isMobile}
            size={isMobile ? 'large' : 'medium'}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            variant='contained'
            color='error'
            disabled={userActionLoading}
            startIcon={userActionLoading ? <CircularProgress size={20} /> : <Delete />}
            fullWidth={isMobile}
            size={isMobile ? 'large' : 'medium'}
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lead Details Dialog */}
      <Dialog open={leadDialog} onClose={() => setLeadDialog(false)} maxWidth='md' fullWidth>
        <DialogTitle>Lead Details</DialogTitle>
        <DialogContent>
          {selectedLead && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                <TextField
                  label='Name'
                  value={selectedLead.name || ''}
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label='Email'
                  value={selectedLead.email || ''}
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label='Contact'
                  value={selectedLead.contact || ''}
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label='Loan Amount'
                  value={`₹${(selectedLead.loanAmount / 100000).toFixed(1)}L`}
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label='Property Details'
                  value={selectedLead.propertyDetails || ''}
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label='Status'
                  value={selectedLead.status?.toUpperCase() || ''}
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label='Source'
                  value={selectedLead.source || ''}
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label='Created Date'
                  value={
                    selectedLead.createdAt
                      ? new Date(selectedLead.createdAt).toLocaleDateString()
                      : ''
                  }
                  InputProps={{ readOnly: true }}
                />
              </Box>
              {selectedLead.notes && (
                <TextField
                  fullWidth
                  label='Notes'
                  multiline
                  rows={3}
                  value={selectedLead.notes}
                  InputProps={{ readOnly: true }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeadDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Assign Broker Dialog */}
      <Dialog
        open={assignBrokerDialog}
        onClose={() => setAssignBrokerDialog(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Assign Broker to Lead</DialogTitle>
        <DialogContent>
          {selectedLead && (
            <Box sx={{ pt: 2 }}>
              <Typography variant='body2' sx={{ mb: 2 }}>
                Assign broker to lead: <strong>{selectedLead.name}</strong>
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Select Broker</InputLabel>
                <Select
                  value={selectedLead.brokerId || ''}
                  onChange={e => setSelectedLead({ ...selectedLead, brokerId: e.target.value })}
                  label='Select Broker'
                >
                  <MenuItem value=''>
                    <em>Unassigned</em>
                  </MenuItem>
                  {brokers.map(broker => (
                    <MenuItem key={broker._id} value={broker._id}>
                      {broker.fullName || `${broker.firstName} ${broker.lastName}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignBrokerDialog(false)}>Cancel</Button>
          <Button
            onClick={() => handleAssignBroker(selectedLead?.brokerId)}
            variant='contained'
            disabled={userActionLoading || !selectedLead?.brokerId}
            startIcon={userActionLoading ? <CircularProgress size={20} /> : <Work />}
          >
            Assign Broker
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Lead Status Dialog */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Update Lead Status</DialogTitle>
        <DialogContent>
          {statusLead && (
            <Box sx={{ pt: 2 }}>
              <Typography variant='body2' sx={{ mb: 2 }}>
                Update status for lead: <strong>{statusLead.name}</strong>
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  label='Status'
                >
                  <MenuItem value='new'>New</MenuItem>
                  <MenuItem value='contacted'>Contacted</MenuItem>
                  <MenuItem value='qualified'>Qualified</MenuItem>
                  <MenuItem value='processing'>Processing</MenuItem>
                  <MenuItem value='converted'>Converted</MenuItem>
                  <MenuItem value='rejected'>Rejected</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateLeadStatus}
            variant='contained'
            disabled={userActionLoading || !newStatus}
            startIcon={userActionLoading ? <CircularProgress size={20} /> : <Edit />}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Lead Confirmation Dialog */}
      <Dialog
        open={deleteLeadDialog}
        onClose={() => setDeleteLeadDialog(false)}
        maxWidth='xs'
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main' }}>Delete Lead</DialogTitle>
        <DialogContent>
          {leadToDelete && (
            <Box sx={{ pt: 2 }}>
              <Typography variant='body1' sx={{ mb: 2 }}>
                Are you sure you want to delete this lead?
              </Typography>
              <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1, mb: 2 }}>
                <Typography variant='subtitle2' color='error.contrastText'>
                  <strong>{leadToDelete.name}</strong>
                </Typography>
                <Typography variant='body2' color='error.contrastText'>
                  {leadToDelete.email} - ₹{(leadToDelete.loanAmount / 100000).toFixed(1)}L
                </Typography>
              </Box>
              <Alert severity='warning' sx={{ mb: 2 }}>
                This action cannot be undone. The lead will be permanently deleted.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteLeadDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteLead}
            variant='contained'
            color='error'
            disabled={userActionLoading}
            startIcon={userActionLoading ? <CircularProgress size={20} /> : <Delete />}
          >
            Delete Lead
          </Button>
        </DialogActions>
      </Dialog>

      {/* Other dialogs like Edit, Delete, Lead Details etc. would follow a similar pattern */}
    </Container>
  );
};

const ApplicationManagement: React.FC = () => {
  // Application Management State
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filters and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Dialogs and Actions
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Create Application State
  const [eligibleCustomers, setEligibleCustomers] = useState<Customer[]>([]);
  const [newApplication, setNewApplication] = useState({
    customerId: '',
    loanAmount: '',
    interestRate: '',
    tenure: '',
    selectedBank: '',
    processingFee: '',
  });

  // Filters for applications
  const filters: ApplicationFilters = {
    status: statusFilter !== 'all' ? statusFilter : undefined,
    customerName: searchQuery || undefined,
    dateFrom: dateFromFilter || undefined,
    dateTo: dateToFilter || undefined,
    page: pagination.currentPage,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  };

  // Fetch Applications
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationApi.getAllApplications(filters);
      setApplications(response.applications);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch Eligible Customers for Create Dialog
  const fetchEligibleCustomers = useCallback(async () => {
    try {
      const customers = await applicationApi.getEligibleCustomers();
      setEligibleCustomers(customers);
    } catch (err) {
      console.error('Failed to fetch eligible customers:', err);
    }
  }, []);

  // Filter applications based on search
  useEffect(() => {
    if (!searchQuery) {
      setFilteredApplications(applications);
    } else {
      const filtered = applications.filter(
        app =>
          app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.personalInfo.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredApplications(filtered);
    }
  }, [applications, searchQuery]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    if (createDialog) {
      fetchEligibleCustomers();
    }
  }, [createDialog, fetchEligibleCustomers]);

  // Handle Status Update
  const handleStatusUpdate = async () => {
    if (!selectedApplication || !newStatus) return;

    setActionLoading(true);
    try {
      await applicationApi.updateApplicationStatus(
        selectedApplication._id,
        newStatus as Application['status'],
        statusNotes
      );
      setStatusDialog(false);
      setSelectedApplication(null);
      setNewStatus('');
      setStatusNotes('');
      fetchApplications();
      setSuccess('Application status updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update application status');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete Application
  const handleDeleteApplication = async () => {
    if (!selectedApplication) return;

    setActionLoading(true);
    try {
      await applicationApi.deleteApplication(selectedApplication._id);
      setDeleteDialog(false);
      setSelectedApplication(null);
      fetchApplications();
      setSuccess('Application deleted successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete application');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Create Application
  const handleCreateApplication = async () => {
    setActionLoading(true);
    try {
      const applicationData = {
        customerId: newApplication.customerId,
        loanAmount: Number(newApplication.loanAmount),
        interestRate: Number(newApplication.interestRate),
        tenure: Number(newApplication.tenure),
        selectedBank: newApplication.selectedBank,
        processingFee: newApplication.processingFee
          ? Number(newApplication.processingFee)
          : undefined,
      };

      await applicationApi.createApplication(applicationData);
      setCreateDialog(false);
      setNewApplication({
        customerId: '',
        loanAmount: '',
        interestRate: '',
        tenure: '',
        selectedBank: '',
        processingFee: '',
      });
      fetchApplications();
      setSuccess('Application created successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create application');
    } finally {
      setActionLoading(false);
    }
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'info';
      case 'under_review':
        return 'warning';
      case 'documents_pending':
        return 'error';
      case 'documents_received':
        return 'info';
      case 'submitted_to_bank':
        return 'primary';
      case 'under_bank_review':
        return 'warning';
      case 'approved_by_bank':
        return 'success';
      case 'sanctioned':
        return 'success';
      case 'disbursed':
        return 'success';
      case 'rejected':
        return 'error';
      case 'rejected_by_bank':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading && applications.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Assignment />
            </Avatar>
            <Box>
              <Typography variant='h6' sx={{ fontWeight: 600 }}>
                Application Management
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {pagination.totalCount} total applications
              </Typography>
            </Box>
          </Box>
          <Button
            variant='contained'
            startIcon={<PersonAdd />}
            onClick={() => setCreateDialog(true)}
            sx={{ borderRadius: 2 }}
          >
            Create Application
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size='small'
            placeholder='Search applications...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
              endAdornment: searchQuery && (
                <IconButton size='small' onClick={() => setSearchQuery('')}>
                  <Close fontSize='small' />
                </IconButton>
              ),
            }}
          />
          <FormControl size='small' sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              label='Status'
            >
              <MenuItem value='all'>All Status</MenuItem>
              <MenuItem value='submitted'>Submitted</MenuItem>
              <MenuItem value='under_review'>Under Review</MenuItem>
              <MenuItem value='documents_pending'>Documents Pending</MenuItem>
              <MenuItem value='documents_received'>Documents Received</MenuItem>
              <MenuItem value='submitted_to_bank'>Submitted to Bank</MenuItem>
              <MenuItem value='under_bank_review'>Under Bank Review</MenuItem>
              <MenuItem value='approved_by_bank'>Approved by Bank</MenuItem>
              <MenuItem value='sanctioned'>Sanctioned</MenuItem>
              <MenuItem value='disbursed'>Disbursed</MenuItem>
              <MenuItem value='rejected'>Rejected</MenuItem>
              <MenuItem value='rejected_by_bank'>Rejected by Bank</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size='small'
            label='From Date'
            type='date'
            value={dateFromFilter}
            onChange={e => setDateFromFilter(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            size='small'
            label='To Date'
            type='date'
            value={dateToFilter}
            onChange={e => setDateToFilter(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            variant='outlined'
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setDateFromFilter('');
              setDateToFilter('');
            }}
            startIcon={<Refresh />}
          >
            Clear Filters
          </Button>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Applications Table */}
        {filteredApplications.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              borderRadius: 2,
              bgcolor: 'background.default',
              border: '2px dashed',
              borderColor: 'divider',
            }}
          >
            <Assignment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant='h6' color='text.secondary' gutterBottom>
              No applications found
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {searchQuery || statusFilter !== 'all' || dateFromFilter || dateToFilter
                ? 'Try adjusting your search criteria'
                : 'Create your first loan application'}
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Application #</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Loan Amount</TableCell>
                  <TableCell>Bank</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell align='center'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications.map(app => (
                  <TableRow key={app._id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                    <TableCell>
                      <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                        {app.applicationNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant='body2' sx={{ fontWeight: 500 }}>
                          {app.personalInfo.fullName}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {app.personalInfo.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 600, color: 'success.main' }}>
                        ₹{app.loanDetails.requestedAmount.toLocaleString()}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {app.loanDetails.tenure} years @ {app.loanDetails.interestRate}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>{app.loanDetails.selectedBank}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={app.status.replace(/_/g, ' ').toUpperCase()}
                        size='small'
                        color={getStatusColor(app.status) as any}
                        sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align='center'>
                      <Stack direction='row' spacing={1} justifyContent='center'>
                        <Tooltip title='View Details'>
                          <IconButton
                            size='small'
                            onClick={() => {
                              setSelectedApplication(app);
                              setViewDialog(true);
                            }}
                          >
                            <Visibility fontSize='small' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Update Status'>
                          <IconButton
                            size='small'
                            color='warning'
                            onClick={() => {
                              setSelectedApplication(app);
                              setNewStatus(app.status);
                              setStatusDialog(true);
                            }}
                          >
                            <Edit fontSize='small' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Delete Application'>
                          <IconButton
                            size='small'
                            color='error'
                            onClick={() => {
                              setSelectedApplication(app);
                              setDeleteDialog(true);
                            }}
                          >
                            <Delete fontSize='small' />
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

        {/* Success/Error Snackbars */}
        <Snackbar
          open={!!success}
          autoHideDuration={4000}
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setSuccess(null)} severity='success'>
            {success}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setError(null)} severity='error'>
            {error}
          </Alert>
        </Snackbar>

        {/* View Application Dialog */}
        <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth='md' fullWidth>
          <DialogTitle>Application Details</DialogTitle>
          <DialogContent>
            {selectedApplication && (
              <Box sx={{ pt: 2 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
                  <TextField
                    label='Application Number'
                    value={selectedApplication.applicationNumber}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label='Current Status'
                    value={selectedApplication.status.replace(/_/g, ' ').toUpperCase()}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label='Customer Name'
                    value={selectedApplication.personalInfo.fullName}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label='Customer Email'
                    value={selectedApplication.personalInfo.email}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label='Customer Phone'
                    value={selectedApplication.personalInfo.phone}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label='Loan Amount'
                    value={`₹${selectedApplication.loanDetails.requestedAmount.toLocaleString()}`}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label='Interest Rate'
                    value={`${selectedApplication.loanDetails.interestRate}%`}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label='Tenure'
                    value={`${selectedApplication.loanDetails.tenure} years`}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label='Monthly EMI'
                    value={`₹${selectedApplication.loanDetails.monthlyEMI.toLocaleString()}`}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label='Selected Bank'
                    value={selectedApplication.loanDetails.selectedBank}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label='Created Date'
                    value={new Date(selectedApplication.createdAt).toLocaleDateString()}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label='Last Updated'
                    value={new Date(selectedApplication.updatedAt).toLocaleDateString()}
                    InputProps={{ readOnly: true }}
                  />
                </Box>

                {/* Documents Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant='h6' sx={{ mb: 2 }}>
                    Documents
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography variant='subtitle2' color='success.main' sx={{ mb: 1 }}>
                        Submitted ({selectedApplication.documents.submitted.length})
                      </Typography>
                      {selectedApplication.documents.submitted.map((doc, index) => (
                        <Chip
                          key={index}
                          label={doc}
                          size='small'
                          color='success'
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                    <Box>
                      <Typography variant='subtitle2' color='warning.main' sx={{ mb: 1 }}>
                        Pending ({selectedApplication.documents.pending.length})
                      </Typography>
                      {selectedApplication.documents.pending.map((doc, index) => (
                        <Chip
                          key={index}
                          label={doc}
                          size='small'
                          color='warning'
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>

                {/* Timeline Section */}
                {selectedApplication.timeline && selectedApplication.timeline.length > 0 && (
                  <Box>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                      Timeline
                    </Typography>
                    <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                      {selectedApplication.timeline.map((event, index) => (
                        <Box
                          key={index}
                          sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}
                        >
                          <Typography variant='subtitle2'>{event.event}</Typography>
                          <Typography variant='body2' color='text.secondary'>
                            {event.description}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {new Date(event.date).toLocaleDateString()} - {event.performedBy}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Update Status Dialog */}
        <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth='sm' fullWidth>
          <DialogTitle>Update Application Status</DialogTitle>
          <DialogContent>
            {selectedApplication && (
              <Box sx={{ pt: 2 }}>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  Update status for application:{' '}
                  <strong>{selectedApplication.applicationNumber}</strong>
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value)}
                    label='Status'
                  >
                    <MenuItem value='submitted'>Submitted</MenuItem>
                    <MenuItem value='under_review'>Under Review</MenuItem>
                    <MenuItem value='documents_pending'>Documents Pending</MenuItem>
                    <MenuItem value='documents_received'>Documents Received</MenuItem>
                    <MenuItem value='submitted_to_bank'>Submitted to Bank</MenuItem>
                    <MenuItem value='under_bank_review'>Under Bank Review</MenuItem>
                    <MenuItem value='approved_by_bank'>Approved by Bank</MenuItem>
                    <MenuItem value='sanctioned'>Sanctioned</MenuItem>
                    <MenuItem value='disbursed'>Disbursed</MenuItem>
                    <MenuItem value='rejected'>Rejected</MenuItem>
                    <MenuItem value='rejected_by_bank'>Rejected by Bank</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label='Notes (Optional)'
                  multiline
                  rows={3}
                  value={statusNotes}
                  onChange={e => setStatusNotes(e.target.value)}
                  placeholder='Add any notes about this status change...'
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
            <Button
              onClick={handleStatusUpdate}
              variant='contained'
              disabled={actionLoading || !newStatus}
              startIcon={actionLoading ? <CircularProgress size={20} /> : <Edit />}
            >
              Update Status
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Application Dialog */}
        <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth='md' fullWidth>
          <DialogTitle>Create New Application</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Select Customer</InputLabel>
                <Select
                  value={newApplication.customerId}
                  onChange={e =>
                    setNewApplication({ ...newApplication, customerId: e.target.value })
                  }
                  label='Select Customer'
                >
                  {eligibleCustomers.map(customer => (
                    <MenuItem key={customer._id} value={customer._id}>
                      {customer.fullName} ({customer.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label='Loan Amount (₹)'
                type='number'
                value={newApplication.loanAmount}
                onChange={e => setNewApplication({ ...newApplication, loanAmount: e.target.value })}
              />
              <TextField
                fullWidth
                label='Interest Rate (%)'
                type='number'
                value={newApplication.interestRate}
                onChange={e =>
                  setNewApplication({ ...newApplication, interestRate: e.target.value })
                }
                inputProps={{ step: '0.01' }}
              />
              <TextField
                fullWidth
                label='Tenure (Years)'
                type='number'
                value={newApplication.tenure}
                onChange={e => setNewApplication({ ...newApplication, tenure: e.target.value })}
              />
              <TextField
                fullWidth
                label='Selected Bank'
                value={newApplication.selectedBank}
                onChange={e =>
                  setNewApplication({ ...newApplication, selectedBank: e.target.value })
                }
              />
              <TextField
                fullWidth
                label='Processing Fee (₹) - Optional'
                type='number'
                value={newApplication.processingFee}
                onChange={e =>
                  setNewApplication({ ...newApplication, processingFee: e.target.value })
                }
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
            <Button
              onClick={handleCreateApplication}
              variant='contained'
              disabled={
                actionLoading ||
                !newApplication.customerId ||
                !newApplication.loanAmount ||
                !newApplication.interestRate ||
                !newApplication.tenure ||
                !newApplication.selectedBank
              }
              startIcon={actionLoading ? <CircularProgress size={20} /> : <PersonAdd />}
            >
              Create Application
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth='xs' fullWidth>
          <DialogTitle sx={{ color: 'error.main' }}>Delete Application</DialogTitle>
          <DialogContent>
            {selectedApplication && (
              <Box sx={{ pt: 2 }}>
                <Typography variant='body1' sx={{ mb: 2 }}>
                  Are you sure you want to delete this application?
                </Typography>
                <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1, mb: 2 }}>
                  <Typography variant='subtitle2' color='error.contrastText'>
                    <strong>{selectedApplication.applicationNumber}</strong>
                  </Typography>
                  <Typography variant='body2' color='error.contrastText'>
                    {selectedApplication.personalInfo.fullName} - ₹
                    {selectedApplication.loanDetails.requestedAmount.toLocaleString()}
                  </Typography>
                </Box>
                <Alert severity='warning' sx={{ mb: 2 }}>
                  This action cannot be undone. All application data will be permanently deleted.
                </Alert>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteApplication}
              variant='contained'
              color='error'
              disabled={actionLoading}
              startIcon={actionLoading ? <CircularProgress size={20} /> : <Delete />}
            >
              Delete Application
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
