import React, { useState, useEffect, useCallback } from 'react';
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
    Snackbar,
    CircularProgress,
    Divider,
    List,
    ListItem
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
    Group
} from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import { getDashboardStats, getAllUsers, getAnalyticsData, getAllLeads } from '../../services/adminApi';
import applicationApi, { Application, ApplicationFilters } from '../../services/applicationApi';
import { getAllProperties, createProperty, updateProperty } from '../../services/propertyApi';


const AdminDashboard: React.FC = () => {
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

    // Lead Management State
    const [leads, setLeads] = useState<any[]>([]);
    const [leadsLoading, setLeadsLoading] = useState(false);
    const [leadsError, setLeadsError] = useState<string | null>(null);
    const [leadSearchQuery, setLeadSearchQuery] = useState('');
    const [leadStatusFilter, setLeadStatusFilter] = useState('all');
    const [leadBrokerFilter, setLeadBrokerFilter] = useState('all');
    const [brokers, setBrokers] = useState<any[]>([]);

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
    const [editProperty, setEditProperty] = useState<any | null>(null);
    const [editPropertyForm, setEditPropertyForm] = useState<any | null>(null);

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
                        setApprovedCustomers([]);
                    }
                } catch (error) {
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
                setCreatingUser(false);
                setAddUserDialog(false);
                setManualUser({ firstName: '', lastName: '', email: '', phone: '', password: '', companyName: '', licenseNumber: '' });
                setAutoPassword('');
                setSelectedApprovedCustomer('');
                fetchUsers();
                fetchDashboardStats();
                setSuccess(`${newUserRole.charAt(0).toUpperCase() + newUserRole.slice(1)} created successfully!${customerId ? ` Customer ID: ${customerId}` : ''}`);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to create user');
                setCreatingUser(false);
            }
        } catch (error) {
            setError('Failed to create user. Please try again.');
            setCreatingUser(false);
        }
    };

    // Fetch various data sets
    const fetchAnalyticsData = useCallback(async () => {
        setAnalyticsLoading(true);
        try {
            const data = await getAnalyticsData();
            setAnalyticsData(data);
        } catch (err) {
            setError('Failed to fetch analytics data');
        } finally {
            setAnalyticsLoading(false);
        }
    }, []);

    const fetchDashboardStats = useCallback(async () => {
        setLoading(true);
        try {
            const statsData = await getDashboardStats();
            setStats(statsData);
        } catch (err) {
            setError('Failed to fetch dashboard statistics');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        setUsersLoading(true);
        setUsersError(null);
        try {
            const usersData = await getAllUsers();
            setUsers(usersData);
        } catch (err) {
            setUsersError('Failed to fetch users');
        } finally {
            setUsersLoading(false);
        }
    }, []);

    const fetchLeads = useCallback(async () => {
        setLeadsLoading(true);
        setLeadsError(null);
        try {
            const leadsData = await getAllLeads();
            setLeads(leadsData);
            const brokersData = await getAllUsers();
            setBrokers(brokersData.filter((user: any) => user.role === 'broker'));
        } catch (err) {
            setLeadsError('Failed to fetch leads');
        } finally {
            setLeadsLoading(false);
        }
    }, []);

    const fetchProperties = useCallback(async () => {
        setPropertiesLoading(true);
        setPropertiesError(null);
        try {
            const data = await getAllProperties();
            setProperties(data);
        } catch (err) {
            setPropertiesError('Failed to fetch properties');
        } finally {
            setPropertiesLoading(false);
        }
    }, []);

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
                const brokerMatch = typeof lead.brokerId === 'object' ?
                    lead.brokerId?.email === leadBrokerFilter :
                    brokers.find(b => b._id === lead.brokerId)?.email === leadBrokerFilter;
                if (!brokerMatch) return false;
            }
        }
        return true;
    });

    // Load initial and tab-specific data
    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    useEffect(() => {
        if (tabValue === 0) fetchUsers();
        if (tabValue === 1) fetchAnalyticsData();
        if (tabValue === 2) fetchLeads();
        if (tabValue === 3) fetchProperties();
    }, [tabValue, fetchUsers, fetchAnalyticsData, fetchLeads, fetchProperties]);

    // Property actions
    const handleCreateProperty = async () => {
        setPropertyActionLoading(true);
        try {
            await createProperty({ ...propertyForm, isDeleted: false });
            setShowCreateProperty(false);
            setPropertyForm({ name: '', location: '', type: '', builder: '', price: '', description: '', area: '', pricePerSqft: '', totalUnits: '', availableUnits: '', configuration: '', amenities: '', status: '', leadRequests: '', soldUnits: '', completionDate: '' });
            fetchProperties();
            setSuccess('Property created successfully!');
        } catch (err) {
            setError('Failed to create property');
        } finally {
            setPropertyActionLoading(false);
        }
    };

    const handleEditProperty = (property: any) => {
        setEditProperty(property);
        setEditPropertyForm({ ...property, amenities: Array.isArray(property.amenities) ? property.amenities.join(', ') : property.amenities });
    };

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

    function handleViewLeads(property: any): void {
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
                        onClick={() => { fetchDashboardStats(); }}
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
                            '& .MuiTabs-indicator': { backgroundColor: 'white', height: 3, borderRadius: '2px' },
                            '& .MuiTab-root': {
                                color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '1rem', textTransform: 'none', minHeight: 60, px: 3,
                                '&.Mui-selected': { color: 'white', },
                                '&:hover': { color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 }
                            }
                        }}
                    >
                        <Tab label="Users" icon={<People sx={{ fontSize: 24 }} />} iconPosition="start" sx={{ flexDirection: 'row', gap: 1, '& .MuiTab-iconWrapper': { mb: 0 } }} />
                        <Tab label="Analytics" icon={<Analytics sx={{ fontSize: 24 }} />} iconPosition="start" sx={{ flexDirection: 'row', gap: 1, '& .MuiTab-iconWrapper': { mb: 0 } }} />
                        <Tab label="Lead Management" icon={<TrendingUp sx={{ fontSize: 24 }} />} iconPosition="start" sx={{ flexDirection: 'row', gap: 1, '& .MuiTab-iconWrapper': { mb: 0 } }} />
                        <Tab label="Property Management" icon={<Business sx={{ fontSize: 24 }} />} iconPosition="start" sx={{ flexDirection: 'row', gap: 1, '& .MuiTab-iconWrapper': { mb: 0 } }} />
                        <Tab label="Applications" icon={<Assignment sx={{ fontSize: 24 }} />} iconPosition="start" sx={{ flexDirection: 'row', gap: 1, '& .MuiTab-iconWrapper': { mb: 0 } }} />
                        <Tab label="Reports" icon={<Assessment sx={{ fontSize: 24 }} />} iconPosition="start" sx={{ flexDirection: 'row', gap: 1, '& .MuiTab-iconWrapper': { mb: 0 } }} />
                    </Tabs>
                </Box>
            </Card>

            {/* Users Tab */}
            {tabValue === 0 && (
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main' }}><People /></Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>User Management</Typography>
                                    <Typography variant="body2" color="text.secondary">{filteredUsers.length} of {users.length} users</Typography>
                                </Box>
                            </Box>
                            <TextField
                                size="small"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{ minWidth: 250 }}
                                InputProps={{
                                    startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                                    endAdornment: searchQuery && (<IconButton size="small" onClick={() => setSearchQuery('')} sx={{ p: 0.5 }}><Close fontSize="small" /></IconButton>)
                                }}
                            />
                        </Box>
                        {usersLoading ? (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}><CircularProgress /></Box>
                        ) : usersError ? (<Alert severity="error">{usersError}</Alert>
                        ) : filteredUsers.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 6, borderRadius: 2, bgcolor: 'background.default', border: '2px dashed', borderColor: 'divider' }}>
                                <Search sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>No users found</Typography>
                                <Typography variant="body2" color="text.secondary">Try adjusting your search terms</Typography>
                                <Button variant="outlined" onClick={() => setSearchQuery('')} sx={{ mt: 2 }}>Clear Search</Button>
                            </Box>
                        ) : (
                            <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                                {filteredUsers.map((user, index) => (
                                    <React.Fragment key={user._id}>
                                        <ListItem sx={{ py: 2, px: 3, '&:hover': { bgcolor: 'action.hover' } }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 3 }}>
                                                <Avatar sx={{ width: 56, height: 56, bgcolor: user.role === 'admin' ? 'error.main' : user.role === 'builder' ? 'warning.main' : 'success.main', fontSize: '1.25rem', fontWeight: 600 }}>
                                                    {(user.fullName || user.firstName || user.email)?.charAt(0)?.toUpperCase()}
                                                </Avatar>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User'}</Typography>
                                                        <Chip label={user.role} size="small" color={user.role === 'admin' ? 'error' : user.role === 'builder' ? 'warning' : 'success'} sx={{ textTransform: 'capitalize', fontWeight: 500 }} />
                                                        <Chip label={user.status} size="small" variant="outlined" color={user.status === 'active' ? 'success' : 'default'} sx={{ textTransform: 'capitalize' }} />
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Email sx={{ fontSize: 16, color: 'text.secondary' }} /><Typography variant="body2" color="text.secondary">{user.email}</Typography></Box>
                                                        {user.phone && (<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Phone sx={{ fontSize: 16, color: 'text.secondary' }} /><Typography variant="body2" color="text.secondary">{user.phone}</Typography></Box>)}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Badge sx={{ fontSize: 16, color: 'text.secondary' }} /><Typography variant="body2" color="text.secondary">Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}</Typography></Box>
                                                    </Box>
                                                </Box>
                                                <Stack direction="row" spacing={1}>
                                                    <Tooltip title="View Details"><IconButton size="small" onClick={() => setViewUser(user)}><Visibility fontSize="small" /></IconButton></Tooltip>
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
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}><CircularProgress size={60} /></Box>
                    ) : analyticsData ? (
                        <>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                                    <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
                                        <CardContent>
                                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                                <Box><Typography variant="h4" fontWeight="bold" color="white">{analyticsData.userAnalytics.newUsersThisMonth}</Typography><Typography color="rgba(255,255,255,0.8)" variant="body2">New Users This Month</Typography><Box display="flex" alignItems="center" mt={1}>{analyticsData.userAnalytics.userGrowthRate >= 0 ? (<TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />) : (<TrendingDown sx={{ fontSize: 16, mr: 0.5 }} />)}<Typography variant="caption" color="rgba(255,255,255,0.9)">{Math.abs(analyticsData.userAnalytics.userGrowthRate).toFixed(1)}% vs last month</Typography></Box></Box>
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
                                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><PieChart color="primary" />Application Status Distribution</Typography>
                                            <Box sx={{ mt: 2 }}>{analyticsData.applicationAnalytics.statusDistribution.map((status: any) => {const percentage = (status.count / analyticsData.applicationAnalytics.totalApplications) * 100;const getStatusColor = (statusName: string) => {switch (statusName) { case 'sanctioned': case 'disbursed': return 'success'; case 'rejected': return 'error'; case 'submitted': case 'under_review': return 'info'; default: return 'warning'; }};return (<Box key={status._id} sx={{ mb: 2 }}><Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}><Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{status._id.replace('_', ' ')}</Typography><Typography variant="body2" fontWeight="bold">{status.count} ({percentage.toFixed(1)}%)</Typography></Box><LinearProgress variant="determinate" value={percentage} color={getStatusColor(status._id)} sx={{ height: 8, borderRadius: 4 }} /></Box>);})}</Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                                {/* User Role Distribution */}
                                <Box sx={{ flex: '1 1 500px', minWidth: '500px' }}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Group color="primary" />User Role Distribution</Typography>
                                            <Box sx={{ mt: 2 }}>{analyticsData.userAnalytics.roleDistribution && analyticsData.userAnalytics.roleDistribution.length > 0 ? (analyticsData.userAnalytics.roleDistribution.map((role: any) => {const percentage = (role.count / analyticsData.userAnalytics.totalUsers) * 100;const getRoleColor = (roleName: string) => {switch (roleName) { case 'admin': return 'secondary'; case 'broker': return 'primary'; case 'lender': return 'info'; case 'customer': return 'success'; default: return 'warning'; }};return (<Box key={role._id} sx={{ mb: 2 }}><Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}><Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{role._id.replace('_', ' ')}</Typography><Typography variant="body2" fontWeight="bold">{role.count} ({percentage.toFixed(1)}%)</Typography></Box><LinearProgress variant="determinate" value={percentage} color={getRoleColor(role._id)} sx={{ height: 8, borderRadius: 4 }} /></Box>);})) : (<Box textAlign="center"><Typography variant="h6" color="text.secondary" gutterBottom>No Analytics Data Available</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Analytics data will appear here once there is sufficient application activity.</Typography><Button variant="outlined" onClick={fetchAnalyticsData} startIcon={<Refresh />}>Refresh Analytics</Button></Box>)}</Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </Box>
                        </>
                    ) : (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}><CircularProgress size={60} /></Box>
                    )}
                </Box>
            )}

            {/* Lead Management Tab */}
            {tabValue === 2 && (
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'warning.main' }}><TrendingUp /></Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Lead Management</Typography>
                                    <Typography variant="body2" color="text.secondary">{filteredLeads.length} of {leads.length} leads</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                <TextField size="small" placeholder="Search leads..." value={leadSearchQuery} onChange={(e) => setLeadSearchQuery(e.target.value)} sx={{ minWidth: 200 }} InputProps={{ startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} /> }} />
                                <FormControl size="small" sx={{ minWidth: 120 }}><InputLabel>Status</InputLabel><Select value={leadStatusFilter} label="Status" onChange={(e) => setLeadStatusFilter(e.target.value)}><MenuItem value="all">All Status</MenuItem><MenuItem value="new">New</MenuItem><MenuItem value="contacted">Contacted</MenuItem><MenuItem value="qualified">Qualified</MenuItem><MenuItem value="processing">Processing</MenuItem><MenuItem value="converted">Converted</MenuItem></Select></FormControl>
                                <FormControl size="small" sx={{ minWidth: 140 }}><InputLabel>Broker</InputLabel><Select value={leadBrokerFilter} label="Broker" onChange={(e) => setLeadBrokerFilter(e.target.value)}><MenuItem value="all">All Brokers</MenuItem><MenuItem value="unassigned">Unassigned</MenuItem>{brokers.map((broker) => (<MenuItem key={broker._id} value={broker.email}>{broker.fullName || `${broker.firstName} ${broker.lastName}`}</MenuItem>))}</Select></FormControl>
                            </Box>
                        </Box>
                        {leadsLoading ? (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}><CircularProgress /></Box>
                        ) : leadsError ? (<Alert severity="error">{leadsError}</Alert>
                        ) : filteredLeads.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 6, borderRadius: 2, bgcolor: 'background.default', border: '2px dashed', borderColor: 'divider' }}>
                                <Search sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>No leads found</Typography>
                                <Typography variant="body2" color="text.secondary">Try adjusting your search terms or filters</Typography>
                                <Button variant="outlined" onClick={() => { setLeadSearchQuery(''); setLeadStatusFilter('all'); setLeadBrokerFilter('all'); }} sx={{ mt: 2 }}>Clear Filters</Button>
                            </Box>
                        ) : (
                            <TableContainer><Table><TableHead><TableRow><TableCell>Lead Details</TableCell><TableCell>Contact</TableCell><TableCell>Loan Amount</TableCell><TableCell>Property</TableCell><TableCell>Status</TableCell><TableCell>Assigned Broker</TableCell><TableCell>Source</TableCell><TableCell align="center">Actions</TableCell></TableRow></TableHead><TableBody>{filteredLeads.map((lead) => (<TableRow key={lead._id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}><TableCell><Box><Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{lead.name}</Typography><Typography variant="caption" sx={{ color: 'text.secondary' }}>ID: {lead._id}</Typography></Box></TableCell><TableCell><Box><Typography variant="body2">{lead.email}</Typography><Typography variant="caption" sx={{ color: 'text.secondary' }}>{lead.contact}</Typography></Box></TableCell><TableCell><Typography variant="body2" sx={{ fontWeight: 'bold' }}>₹{(lead.loanAmount / 100000).toFixed(1)}L</Typography></TableCell><TableCell><Box><Typography variant="body2">{lead.propertyDetails}</Typography><Typography variant="caption" sx={{ color: 'text.secondary' }}>{lead.source}</Typography></Box></TableCell><TableCell><Chip label={lead.status.toUpperCase()} color={lead.status === 'converted' ? 'success' : lead.status === 'qualified' ? 'info' : lead.status === 'processing' ? 'warning' : lead.status === 'contacted' ? 'secondary' : 'default'} size="small" /></TableCell><TableCell>{lead.brokerId ? (<Typography variant="body2">{typeof lead.brokerId === 'object' && lead.brokerId !== null ? `${lead.brokerId.firstName || ''} ${lead.brokerId.lastName || ''}`.trim() : (() => { const broker = brokers.find(b => b._id === lead.brokerId); return broker ? `${broker.firstName || ''} ${broker.lastName || ''}`.trim() : 'Unknown Broker'; })()}</Typography>) : (<Chip label="Unassigned" size="small" variant="outlined" />)}</TableCell><TableCell>{lead.source}</TableCell><TableCell align="center"><Stack direction="row" spacing={1} justifyContent="center"><Tooltip title="View Details"><IconButton size="small" onClick={() => { setSelectedLead(lead); setLeadDialog(true); }}><Visibility fontSize="small" /></IconButton></Tooltip><Tooltip title="Assign Broker"><IconButton size="small" color="primary" onClick={() => { setSelectedLead(lead); setAssignBrokerDialog(true); }}><Work fontSize="small" /></IconButton></Tooltip><Tooltip title="Update Status"><IconButton size="small" color="warning" onClick={() => { setStatusLead(lead); setNewStatus(lead.status); setStatusDialog(true); }}><Edit fontSize="small" /></IconButton></Tooltip><Tooltip title="Delete Lead"><IconButton size="small" color="error" onClick={() => { setDeleteLeadDialog(true); setLeadToDelete(lead); }}><Delete fontSize="small" /></IconButton></Tooltip></Stack></TableCell></TableRow>))}</TableBody></Table></TableContainer>
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
                            <Button variant="contained" color="primary" startIcon={<Business />} onClick={() => setShowCreateProperty(true)} sx={{ borderRadius: 2, fontWeight: 600 }}>Add Property</Button>
                        </Box>
                        {propertiesLoading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}><CircularProgress /></Box>
                        ) : propertiesError ? (
                            <Alert severity="error">{propertiesError}</Alert>
                        ) : properties.length === 0 ? (
                            <Box textAlign="center" py={6} borderRadius={2} bgcolor="background.default" border="2px dashed" borderColor="divider">
                                <Typography variant="h6" color="text.secondary" gutterBottom>No properties found</Typography>
                                <Typography variant="body2" color="text.secondary">Properties will appear here once they are added.</Typography>
                            </Box>
                        ) : (
                            <TableContainer><Table size="small"><TableHead><TableRow><TableCell>Property</TableCell><TableCell>Type</TableCell><TableCell>Location</TableCell><TableCell>Price/Sq.Ft</TableCell><TableCell>Units</TableCell><TableCell>Status</TableCell><TableCell>Builder</TableCell><TableCell>Lead Requests</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead><TableBody>{properties.map((property) => (<TableRow key={property._id} sx={{ opacity: property.isDeleted ? 0.5 : 1 }}><TableCell><Box><Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0, lineHeight: 1.2 }}>{property.name}</Typography>{property.configuration && (<Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mt: 0.2, ml: 0.5 }}>• {property.configuration}</Typography>)}</Box></TableCell><TableCell><Chip label={property.type?.toUpperCase()} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600, letterSpacing: 0.5 }} /></TableCell><TableCell><Box><Typography variant="body1">{property.location}</Typography>{property.area && (<Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>{property.area}</Typography>)}</Box></TableCell><TableCell><Typography variant="body1" sx={{ color: 'success.main', fontWeight: 600 }}>₹{property.pricePerSqft}</Typography></TableCell><TableCell><Box><Typography variant="body2" sx={{ fontWeight: 500 }}>Available: {property.availableUnits}</Typography><Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>Total: {property.totalUnits}</Typography></Box></TableCell><TableCell><Chip label={property.status?.toUpperCase()} size="small" sx={{ backgroundColor: property.status === 'UNDER CONSTRUCTION' ? '#FFA726' : '#E0E0E0', color: property.status === 'UNDER CONSTRUCTION' ? '#fff' : '#333', fontWeight: 600, borderRadius: 2, px: 2 }} /></TableCell><TableCell><Typography variant="body2" color="text.secondary">{property.builderName || '-'}</Typography></TableCell><TableCell><Typography variant="body1" sx={{ color: '#1976d2', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleViewLeads(property)}>{property.leadRequests || 0}</Typography></TableCell><TableCell align="right"><Stack direction="row" spacing={1} justifyContent="flex-end"><Tooltip title="View"><span><IconButton onClick={() => setViewProperty(property)} sx={{ color: '#90caf9' }}><Visibility /></IconButton></span></Tooltip><Tooltip title="Edit"><span><IconButton onClick={() => handleEditProperty(property)} disabled={propertyActionLoading} sx={{ color: '#f48fb1' }}><Edit /></IconButton></span></Tooltip></Stack></TableCell></TableRow>))}</TableBody></Table></TableContainer>
                        )}

                        <Dialog open={!!editProperty} onClose={() => { setEditProperty(null); setEditPropertyForm(null); }} maxWidth="md" fullWidth>
                            <DialogTitle>Edit Property</DialogTitle>
                            <DialogContent>
                                {editPropertyForm && (
                                    <Stack spacing={2} sx={{ mt: 2 }}>
                                        <TextField fullWidth label="Property Name" value={editPropertyForm.name} onChange={e => setEditPropertyForm((f: any) => ({ ...f, name: e.target.value }))} required />
                                        <TextField fullWidth label="Type" value={editPropertyForm.type} onChange={e => setEditPropertyForm((f: any) => ({ ...f, type: e.target.value }))} required />
                                        <TextField fullWidth label="Location" value={editPropertyForm.location} onChange={e => setEditPropertyForm((f: any) => ({ ...f, location: e.target.value }))} required />
                                        <TextField fullWidth label="Area (sqft)" value={editPropertyForm.area} onChange={e => setEditPropertyForm((f: any) => ({ ...f, area: e.target.value }))} required />
                                        <TextField fullWidth label="Price Per Sqft" type="number" value={editPropertyForm.pricePerSqft} onChange={e => setEditPropertyForm((f: any) => ({ ...f, pricePerSqft: e.target.value }))} required />
                                        <TextField fullWidth label="Total Units" type="number" value={editPropertyForm.totalUnits} onChange={e => setEditPropertyForm((f: any) => ({ ...f, totalUnits: e.target.value }))} required />
                                        <TextField fullWidth label="Available Units" type="number" value={editPropertyForm.availableUnits} onChange={e => setEditPropertyForm((f: any) => ({ ...f, availableUnits: e.target.value }))} required />
                                        <TextField fullWidth label="Configuration" value={editPropertyForm.configuration} onChange={e => setEditPropertyForm((f: any) => ({ ...f, configuration: e.target.value }))} required />
                                        <TextField fullWidth label="Amenities (comma separated)" value={editPropertyForm.amenities} onChange={e => setEditPropertyForm((f: any) => ({ ...f, amenities: e.target.value }))} />
                                        <TextField fullWidth label="Status" value={editPropertyForm.status} onChange={e => setEditPropertyForm((f: any) => ({ ...f, status: e.target.value }))} required />
                                        <TextField fullWidth label="Builder" value={editPropertyForm.builderName || editPropertyForm.builder || ''} disabled />
                                        <TextField fullWidth label="Description" value={editPropertyForm.description} onChange={e => setEditPropertyForm((f: any) => ({ ...f, description: e.target.value }))} multiline minRows={2} />
                                    </Stack>
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => { setEditProperty(null); setEditPropertyForm(null); }}>Cancel</Button>
                                <Button variant="contained" onClick={handleEditPropertySave} disabled={propertyActionLoading || !editPropertyForm}>
                                    {propertyActionLoading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog open={showCreateProperty} onClose={() => setShowCreateProperty(false)} maxWidth="sm" fullWidth>
                            <DialogTitle sx={{ fontWeight: 700, fontSize: 22, pb: 0 }}>Create Property</DialogTitle>
                            <DialogContent>
                                <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField label="Property Name" value={propertyForm.name} onChange={e => setPropertyForm(f => ({ ...f, name: e.target.value }))} required fullWidth />
                                    <TextField label="Builder" value={propertyForm.builder} onChange={e => setPropertyForm(f => ({ ...f, builder: e.target.value }))} required fullWidth />
                                    {/* Other fields... */}
                                </Box>
                            </DialogContent>
                            <DialogActions sx={{ px: 3, pb: 2 }}>
                                <Button onClick={() => setShowCreateProperty(false)} startIcon={<Close />}>Cancel</Button>
                                <Button variant="contained" onClick={handleCreateProperty} startIcon={propertyActionLoading ? <CircularProgress size={18} /> : <Save />} disabled={propertyActionLoading || !propertyForm.name || !propertyForm.builder}>
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
                <Card><CardContent><Box sx={{ textAlign: 'center', py: 6, backgroundColor: 'background.paper', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}><Assessment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} /><Typography variant="h6" color="text.secondary" gutterBottom>Reports & Analytics</Typography><Typography variant="body2" color="text.secondary">Comprehensive reporting features will be available in a future update.</Typography></Box></CardContent></Card>
            )}

            {/* Dialogs */}
            <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>{success}</Alert></Snackbar>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}><Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>{error}</Alert></Snackbar>

            {/* View User Dialog */}
            <Dialog open={!!viewUser} onClose={() => setViewUser(null)} maxWidth="sm" fullWidth><DialogTitle>User Details</DialogTitle><DialogContent>{viewUser && (<Box><Typography variant="subtitle1" sx={{ mb: 1 }}><strong>Name:</strong> {viewUser.fullName || `${viewUser.firstName || ''} ${viewUser.lastName || ''}`.trim()}</Typography><Typography variant="body2"><strong>Email:</strong> {viewUser.email}</Typography><Typography variant="body2"><strong>Phone:</strong> {viewUser.phone}</Typography><Typography variant="body2"><strong>Role:</strong> {viewUser.role}</Typography><Typography variant="body2"><strong>Status:</strong> {viewUser.status}</Typography><Typography variant="body2"><strong>Created:</strong> {viewUser.createdAt ? new Date(viewUser.createdAt).toLocaleDateString() : ''}</Typography></Box>)}</DialogContent><DialogActions><Button onClick={() => setViewUser(null)} startIcon={<Close />}>Close</Button></DialogActions></Dialog>
            {/* Other dialogs like Edit, Delete, Lead Details etc. would follow a similar pattern */}
        </Container>
    );
};

const ApplicationManagement: React.FC = () => {
    // ... Implementation for Application Management ...
    const [applications, setApplications] = useState<Application[]>([]);
    const [filters] = useState<ApplicationFilters>({ page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<any>(null);
    // ... more state and logic

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await applicationApi.getAllApplications(filters);
            setApplications(response.applications);
            setPagination(response.pagination);
        } catch (err) {
            setError('Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Typography variant="h5" fontWeight="bold">Application Management</Typography>
            {/* Table and Drawer for applications */}
             <TableContainer component={Card}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Application #</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Last Updated</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {applications.map(app => (
                            <TableRow key={app._id} hover>
                                <TableCell>{app.applicationNumber}</TableCell>
                                <TableCell>{app.personalInfo.fullName}</TableCell>
                                <TableCell>₹{app.loanDetails.requestedAmount.toLocaleString()}</TableCell>
                                <TableCell><Chip label={app.status} size="small" /></TableCell>
                                <TableCell>{new Date(app.updatedAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* Drawer and other components */}
        </Box>
    );
};


export default AdminDashboard;