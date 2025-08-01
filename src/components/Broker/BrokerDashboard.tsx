import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Container, Grow, Box, Typography, Chip, Button, CircularProgress, Snackbar, Alert, Skeleton, Fade, Slide, Card, CardContent, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Stack, Tooltip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, LinearProgress
} from '@mui/material';
import { People, Assignment, AttachMoney, TrendingUp, AccountBalance, Assessment, Add, Refresh, ArrowUpward, ArrowDownward, Work, BarChart, Search, Visibility, Phone, PieChart } from '@mui/icons-material';
import { brokerApi, Lead, BrokerApplication, BrokerStats, BrokerAnalytics } from '../../services/brokerApi';

const BrokerDashboard: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [applications, setApplications] = useState<BrokerApplication[]>([]);
  const [stats, setStats] = useState<BrokerStats>({
    totalLeads: 0,
    qualifiedLeads: 0,
    convertedLeads: 0,
    totalApplications: 0,
    approvedApplications: 0,
    totalCommission: 0,
    monthlyCommission: 0,
    conversionRate: 0,
    avgLoanAmount: 0,
    activeClients: 0
  });
  const [analytics, setAnalytics] = useState<BrokerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openAddLeadDialog, setOpenAddLeadDialog] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    contact: '',
    email: '',
    loanAmount: 0,
    propertyDetails: '',
    source: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Lead>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [viewLeadDialog, setViewLeadDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editLeadDialog, setEditLeadDialog] = useState(false);
  const [editLeadData, setEditLeadData] = useState<Partial<Lead>>({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = useCallback(async (showLoading = true) => {
    if (showLoading) { setLoading(true); }
    setError(null);

    try {
      const [statsData, leadsData, applicationsData, analyticsData] = await Promise.all([
        brokerApi.getBrokerStats(),
        brokerApi.getLeads(),
        brokerApi.getApplications(),
        brokerApi.getBrokerAnalytics()
      ]);

      setStats(statsData);
      setLeads(leadsData);
      setApplications(applicationsData);
      setAnalytics(analyticsData);
      setRetryCount(0);

      if (!showLoading) {
        setSnackbarMessage('Dashboard data refreshed successfully');
        setSnackbarOpen(true);
      }
    } catch (error) {
      const errorMessage = retryCount < 3
        ? `Failed to load dashboard data. Retrying... (${retryCount + 1}/3)`
        : 'Failed to load dashboard data. Please check your connection and try again.';

      setError(errorMessage);
      setRetryCount(prev => prev + 1);

      // Auto-retry logic
      if (retryCount < 3) {
        setTimeout(() => loadDashboardData(false), 2000 * (retryCount + 1));
      }
    } finally {
      if (showLoading) { setLoading(false); }
    }
  }, [retryCount]);

  const handleAddLead = async () => {
    try {
      const newLeadData = await brokerApi.createLead(newLead);
      setLeads([...leads, newLeadData]);
      setOpenAddLeadDialog(false);
      setNewLead({
        name: '',
        contact: '',
        email: '',
        loanAmount: 0,
        propertyDetails: '',
        source: '',
        priority: 'medium'
      });

      // Refresh stats after adding lead
      const updatedStats = await brokerApi.getBrokerStats();
      setStats(updatedStats);
      setSnackbarMessage('Lead added successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to add lead:', error);
      setError('Failed to add lead. Please try again.');
    }
  };

  // Enhanced sorting function
  const handleSort = (field: keyof Lead) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  // Memoized filtered and sorted leads
  const filteredAndSortedLeads = useMemo(() => {
    const filtered = leads.filter(lead => {
      if (lead.deletedByBroker) { return false; }
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.contact.includes(searchQuery) ||
        lead.source.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      return 0;
    });
  }, [leads, searchQuery, statusFilter, priorityFilter, sortField, sortDirection]);

  function formatCurrency(amount: number | undefined) {
    if (typeof amount !== 'number') { return '-'; }
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'Approved': return 'success.main';
      case 'Rejected': return 'error.main';
      case 'Pending': return 'warning.main';
      default: return 'text.primary';
    }
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'High': return 'error.main';
      case 'Medium': return 'warning.main';
      case 'Low': return 'success.main';
      default: return 'text.primary';
    }
  }

  const handleDeleteLead = useCallback(async (leadId: string) => {
    try {
      await brokerApi.deleteLead(leadId);
      // Optionally update local state to remove/soft-delete the lead from the UI
      // e.g., setLeads(leads => leads.filter(l => l._id !== leadId));
    } catch (error) {
      // Handle error (show snackbar, etc.)
    }
  }, []);

  const handleEditLead = useCallback(async () => {
    if (!editLeadData || !editLeadData._id) { return; }
    try {
      await brokerApi.updateLead(editLeadData._id, editLeadData);
      setEditLeadDialog(false);
      // Optionally update local state with the edited lead
    } catch (error) {
      // Handle error (show snackbar, etc.)
    }
  }, [editLeadData]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Enhanced Header with Real-time Status */}
      <Grow in={true} timeout={1000}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
            : 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          borderRadius: 2,
          p: 3,
          color: 'white',
          boxShadow: theme.shadows[4],
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animated background effect */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
            transform: 'translateX(-100%)',
            animation: loading ? 'shimmer 2s infinite' : 'none',
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' }
            }
          }} />

          <Box sx={{ display: 'flex', alignItems: 'center', zIndex: 1 }}>
            <Work sx={{ mr: 2, fontSize: 40 }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Broker Dashboard
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Welcome back, {user?.firstName || 'Broker'}!
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', zIndex: 1 }}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <Refresh />}
              onClick={() => loadDashboardData(true)}
              disabled={loading}
              sx={{
                backgroundColor: alpha(theme.palette.common.white, 0.2),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.3)
                },
                '&:disabled': {
                  backgroundColor: alpha(theme.palette.common.white, 0.1)
                }
              }}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAddLeadDialog(true)}
              sx={{
                backgroundColor: alpha(theme.palette.common.white, 0.2),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.3)
                }
              }}
            >
              Add Lead
            </Button>
          </Box>
        </Box>
      </Grow>

      {/* Enhanced Loading State */}
      {loading && (
        <Fade in={loading}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ mb: 3, color: '#ff9800' }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Loading dashboard data...</Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {retryCount > 0 ? `Retry attempt ${retryCount}/3` : 'Please wait while we fetch your latest data'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              {[0, 1, 2].map((i: number) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  width={200}
                  height={100}
                  sx={{ borderRadius: 1 }}
                  animation="wave"
                />
              ))}
            </Box>
          </Box>
        </Fade>
      )}

      {/* Enhanced Error State */}
      {error && (
        <Slide direction="down" in={!!error}>
          <Alert
            severity={retryCount >= 3 ? "error" : "warning"}
            sx={{ mb: 3 }}
            onClose={() => setError(null)}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => loadDashboardData(true)}
                disabled={loading}
              >
                Retry
              </Button>
            }
          >
            <Box>
              <Typography variant="subtitle2">{error}</Typography>
              {retryCount >= 3 && (
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                  Please check your internet connection or contact support if the problem persists.
                </Typography>
              )}
            </Box>
          </Alert>
        </Slide>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {!loading && (
        <>
          {/* Enhanced Stats Overview with Animations */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
            gap: 3,
            mb: 4
          }}>
            {[
              {
                value: stats.totalLeads,
                label: 'Total Leads',
                icon: People,
                gradient: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                trend: stats.totalLeads > 0 ? '+12%' : null
              },
              {
                value: stats.totalApplications,
                label: 'Applications',
                icon: Assignment,
                gradient: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                trend: stats.totalApplications > 0 ? '+8%' : null
              },
              {
                value: formatCurrency(stats.totalCommission),
                label: 'Total Commission',
                icon: AttachMoney,
                gradient: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                trend: stats.totalCommission > 0 ? '+15%' : null
              },
              {
                value: `${stats.conversionRate.toFixed(1)}%`,
                label: 'Conversion Rate',
                icon: TrendingUp,
                gradient: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                trend: stats.conversionRate > 0 ? (stats.conversionRate >= 10 ? '+5%' : '-2%') : null
              }
            ].map((stat, index: number) => (
              <Grow key={index} in={!loading} timeout={1000 + (index * 200)}>
                <Card elevation={3} sx={{
                  background: stat.gradient,
                  transition: 'all 0.3s ease-in-out',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: theme.shadows[12]
                  }
                }}>
                  {/* Animated background pattern */}
                  <Box sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                    animation: 'float 3s ease-in-out infinite',
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-10px)' }
                    }
                  }} />

                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ zIndex: 1 }}>
                        <Typography variant="h4" sx={{
                          color: 'white',
                          fontWeight: 'bold',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{
                          color: alpha(theme.palette.common.white, 0.9),
                          mb: 0.5
                        }}>
                          {stat.label}
                        </Typography>
                        {stat.trend && (
                          <Chip
                            label={stat.trend}
                            size="small"
                            icon={stat.trend.startsWith('+') ? <ArrowUpward /> : <ArrowDownward />}
                            sx={{
                              backgroundColor: alpha(theme.palette.common.white, 0.2),
                              color: 'white',
                              fontSize: '0.7rem',
                              '& .MuiChip-icon': { color: 'white', fontSize: '0.8rem' }
                            }}
                          />
                        )}
                      </Box>
                      <stat.icon sx={{
                        fontSize: 40,
                        color: alpha(theme.palette.common.white, 0.8),
                        zIndex: 1
                      }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            ))}
          </Box>

      {/* Performance Breakdown */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
        gap: 3,
        mb: 4
      }}>
        <Card elevation={2} sx={{
          backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : theme.palette.background.paper,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4]
          }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5" sx={{ color: '#28a745', fontWeight: 'bold' }}>
                  {stats.qualifiedLeads}
                </Typography>
                <Typography variant="body2" sx={{
                  color: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.7) : '#666'
                }}>
                  Qualified Leads
                </Typography>
              </Box>
              <Assessment sx={{ fontSize: 30, color: '#28a745' }} />
            </Box>
          </CardContent>
        </Card>
        <Card elevation={2} sx={{
          backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : theme.palette.background.paper,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4]
          }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                  {stats.approvedApplications}
                </Typography>
                <Typography variant="body2" sx={{
                  color: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.7) : '#666'
                }}>
                  Approved
                </Typography>
              </Box>
              <AccountBalance sx={{ fontSize: 30, color: '#1976d2' }} />
            </Box>
          </CardContent>
        </Card>
        <Card elevation={2} sx={{
          backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : theme.palette.background.paper,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4]
          }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                  {formatCurrency(stats.monthlyCommission)}
                </Typography>
                <Typography variant="body2" sx={{
                  color: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.7) : '#666'
                }}>
                  Monthly Commission
                </Typography>
              </Box>
              <TrendingUp sx={{ fontSize: 30, color: '#ff9800' }} />
            </Box>
          </CardContent>
        </Card>
        <Card elevation={2} sx={{
          backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : theme.palette.background.paper,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4]
          }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5" sx={{ color: '#dc3545', fontWeight: 'bold' }}>
                  {stats.activeClients}
                </Typography>
                <Typography variant="body2" sx={{
                  color: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.7) : '#666'
                }}>
                  Active Clients
                </Typography>
              </Box>
              <People sx={{ fontSize: 30, color: '#dc3545' }} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Actions */}
      <Card elevation={3} sx={{
        mb: 4,
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha(theme.palette.common.white, 0.05)} 0%, ${alpha(theme.palette.common.white, 0.02)} 100%)`
          : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        border: theme.palette.mode === 'dark' ? `1px solid ${alpha(theme.palette.common.white, 0.1)}` : 'none'
      }}>
        <CardContent>
          <Typography variant="h6" sx={{
            mb: 3,
            fontWeight: 'bold',
            color: theme.palette.mode === 'dark' ? theme.palette.common.white : '#495057'
          }}>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<Add />}
              onClick={() => setOpenAddLeadDialog(true)}
              sx={{
                backgroundColor: '#ff9800',
                boxShadow: theme.shadows[3],
                '&:hover': {
                  backgroundColor: '#f57c00',
                  boxShadow: theme.shadows[6]
                }
              }}
            >
              Add New Lead
            </Button>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<Assignment />}
              onClick={() => setTabValue(1)}
              sx={{
                backgroundColor: '#1976d2',
                boxShadow: theme.shadows[3],
                '&:hover': {
                  backgroundColor: '#1565c0',
                  boxShadow: theme.shadows[6]
                }
              }}
            >
              View Applications
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Enhanced Tabs */}
      <Box sx={{
        borderBottom: 1,
        borderColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.1) : 'divider',
        mb: 3,
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha(theme.palette.common.white, 0.05)} 0%, ${alpha(theme.palette.common.white, 0.02)} 100%)`
          : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderRadius: 2,
        p: 1,
        border: theme.palette.mode === 'dark' ? `1px solid ${alpha(theme.palette.common.white, 0.1)}` : 'none'
      }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold',
              minHeight: 60,
              color: theme.palette.mode === 'dark' ? theme.palette.common.white : 'inherit',
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                color: 'white',
                borderRadius: 1,
                margin: 0.5,
                boxShadow: theme.shadows[2]
              },
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.08)
                  : alpha('#ff9800', 0.1),
                borderRadius: 1
              }
            }
          }}
        >
          <Tab
            label="Leads Management"
            icon={<People />}
            iconPosition="start"
          />
          <Tab
            label="Applications"
            icon={<Assignment />}
            iconPosition="start"
          />
          <Tab
            label="Analytics"
            icon={<BarChart />}
            iconPosition="start"
          />
          <Tab
            label="Performance"
            icon={<Assessment />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Enhanced Leads Tab */}
      {tabValue === 0 && (
        <Fade in={true} timeout={500}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <People sx={{ mr: 1 }} />
                  Lead Management
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    size="small"
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: '#666' }} />
                    }}
                    sx={{ minWidth: 250 }}
                  />
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e: any) => setStatusFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="new">New</MenuItem>
                      <MenuItem value="contacted">Contacted</MenuItem>
                      <MenuItem value="qualified">Qualified</MenuItem>
                      <MenuItem value="converted">Converted</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={priorityFilter}
                      label="Priority"
                      onChange={(e: any) => setPriorityFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Priority</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Total: {filteredAndSortedLeads.length} leads
                  </Typography>
                </Box>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TableSortLabel
                          active={sortField === 'name'}
                          direction={sortField === 'name' ? sortDirection : 'asc'}
                          onClick={() => handleSort('name')}
                        >
                          Lead
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortField === 'loanAmount'}
                          direction={sortField === 'loanAmount' ? sortDirection : 'asc'}
                          onClick={() => handleSort('loanAmount')}
                        >
                          Loan Amount
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Property</TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortField === 'status'}
                          direction={sortField === 'status' ? sortDirection : 'asc'}
                          onClick={() => handleSort('status')}
                        >
                          Status
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortField === 'priority'}
                          direction={sortField === 'priority' ? sortDirection : 'asc'}
                          onClick={() => handleSort('priority')}
                        >
                          Priority
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortField === 'source'}
                          direction={sortField === 'source' ? sortDirection : 'asc'}
                          onClick={() => handleSort('source')}
                        >
                          Source
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAndSortedLeads.length > 0 ? (
                      filteredAndSortedLeads.map((lead: Lead, index: number) => (
                        <Slide
                          key={lead._id}
                          direction="up"
                          in={true}
                          timeout={300 + (index * 50)}
                          style={{ transitionDelay: `${index * 50}ms` }}
                        >
                          <TableRow sx={{
                            '&:hover': {
                              backgroundColor: theme.palette.mode === 'dark'
                                ? alpha(theme.palette.common.white, 0.05)
                                : alpha('#ff9800', 0.05),
                              transform: 'scale(1.001)',
                              transition: 'all 0.2s ease-in-out'
                            }
                          }}>
                            <TableCell>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                  {lead.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#666' }}>
                                  {lead._id}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="caption" sx={{ display: 'block' }}>
                                  {lead.contact}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#666' }}>
                                  {lead.email}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{formatCurrency(lead.loanAmount)}</TableCell>
                            <TableCell>
                              <Typography variant="caption">
                                {lead.propertyDetails}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={lead.status.replace('_', ' ').toUpperCase()}
                                color={getStatusColor(lead.status) as any}
                                size="small"
                                sx={{
                                  animation: lead.status === 'new' ? 'pulse 2s infinite' : 'none',
                                  '@keyframes pulse': {
                                    '0%': { opacity: 1 },
                                    '50%': { opacity: 0.7 },
                                    '100%': { opacity: 1 }
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={lead.priority.toUpperCase()}
                                size="small"
                                sx={{
                                  backgroundColor: getPriorityColor(lead.priority),
                                  color: 'white',
                                  fontSize: '0.7rem'
                                }}
                              />
                            </TableCell>
                            <TableCell>{lead.source}</TableCell>
                            <TableCell align="center">
                              <Stack direction="row" spacing={1} justifyContent="center">
                                <Tooltip title="View Details">
                                  <IconButton size="small" color="primary" onClick={() => { setSelectedLead(lead); setViewLeadDialog(true); }}>
                                    <Visibility />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Lead">
                                  <IconButton size="small" color="info" onClick={() => { setSelectedLead(lead); setEditLeadData(lead); setEditLeadDialog(true); }}>
                                    <Assignment />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Lead">
                                  <IconButton size="small" color="error" onClick={() => handleDeleteLead(lead._id)}>
                                    <People />
                                  </IconButton>
                                </Tooltip>
                                {/* Edit Lead Dialog */}
                                <Dialog open={editLeadDialog} onClose={() => setEditLeadDialog(false)} maxWidth="sm" fullWidth>
                                  <DialogTitle>Edit Lead</DialogTitle>
                                  <DialogContent>
                                    {selectedLead && (
                                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <TextField label="Name" value={editLeadData.name ?? selectedLead.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLeadData({ ...editLeadData, name: e.target.value })} fullWidth />
                                        <TextField label="Email" value={editLeadData.email ?? selectedLead.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLeadData({ ...editLeadData, email: e.target.value })} fullWidth />
                                        <TextField label="Contact" value={editLeadData.contact ?? selectedLead.contact} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLeadData({ ...editLeadData, contact: e.target.value })} fullWidth />
                                        <TextField label="Loan Amount" type="number" value={editLeadData.loanAmount ?? selectedLead.loanAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLeadData({ ...editLeadData, loanAmount: Number(e.target.value) })} fullWidth />
                                        <TextField label="Property Details" value={editLeadData.propertyDetails ?? selectedLead.propertyDetails} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLeadData({ ...editLeadData, propertyDetails: e.target.value })} fullWidth />
                                        <TextField label="Source" value={editLeadData.source ?? selectedLead.source} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLeadData({ ...editLeadData, source: e.target.value })} fullWidth />
                                        <FormControl fullWidth>
                                          <InputLabel>Priority</InputLabel>
                                          <Select value={editLeadData.priority ?? selectedLead.priority} label="Priority" onChange={(e: any) => setEditLeadData({ ...editLeadData, priority: e.target.value as any })}>
                                            <MenuItem value="high">High</MenuItem>
                                            <MenuItem value="medium">Medium</MenuItem>
                                            <MenuItem value="low">Low</MenuItem>
                                          </Select>
                                        </FormControl>
                                      </Box>
                                    )}
                                  </DialogContent>
                                  <DialogActions>
                                    <Button onClick={() => setEditLeadDialog(false)}>Cancel</Button>
                                    <Button onClick={handleEditLead} variant="contained">Save</Button>
                                  </DialogActions>
                                </Dialog>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        </Slide>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                            No leads found
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#999' }}>
                            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                              ? 'Try adjusting your filters or search terms'
                              : 'Get started by adding your first lead'
                            }
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Fade>
      )}

      {/* Applications Tab */}
      {tabValue === 1 && (
        <Card elevation={3}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Loan Applications</Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Total: {applications.length} applications
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Application</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Loan Amount</TableCell>
                    <TableCell>Bank</TableCell>
                    <TableCell>Interest Rate</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Commission</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((app: any) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {app.id}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {new Date(app.applicationDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">
                            {app.customerName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {app.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{formatCurrency(app.loanAmount)}</TableCell>
                      <TableCell>{app.bankName}</TableCell>
                      <TableCell>
                        {app.interestRate ? `${app.interestRate}%` : 'Pending'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={app.status.replace('_', ' ').toUpperCase()}
                          color={getStatusColor(app.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{
                          color: app.commission ? '#28a745' : '#666',
                          fontWeight: 'bold'
                        }}>
                          {app.commission ? formatCurrency(app.commission) : 'Pending'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton size="small" color="primary">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Contact Customer">
                            <IconButton size="small" color="success">
                              <Phone />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Analytics Tab */}
      {tabValue === 2 && analytics && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Monthly Trends */}
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <BarChart sx={{ mr: 1 }} />
                Monthly Performance Trends
              </Typography>
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: 'space-between'
              }}>
                {analytics.monthlyTrends.map((month: any, index: number) => (
                  <Card
                    key={index}
                    sx={{
                      flex: '1 1 150px',
                      minWidth: '150px',
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        {month.month}
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#ff9800' }}>
                        {month.leads}
                      </Typography>
                      <Typography variant="caption">Leads</Typography>
                      <Typography variant="h6" sx={{ color: '#28a745' }}>
                        {month.applications}
                      </Typography>
                      <Typography variant="caption">Apps</Typography>
                      <Typography variant="h6" sx={{ color: '#1976d2' }}>
                        {formatCurrency(month.commission)}
                      </Typography>
                      <Typography variant="caption">Commission</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Lead Sources and Status Distribution */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Card elevation={3} sx={{ flex: '1 1 500px', minWidth: '500px' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <PieChart sx={{ mr: 1 }} />
                  Lead Sources
                </Typography>
                <Stack spacing={2}>
                  {analytics.leadSources.map((source: any, index: number) => (
                    <Box key={index} sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : '#f8f9fa',
                      borderRadius: 1,
                      border: theme.palette.mode === 'dark' ? `1px solid ${alpha(theme.palette.common.white, 0.1)}` : 'none'
                    }}>
                      <Typography variant="body2">{source.source}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {source.count}
                        </Typography>
                        <Typography variant="caption" sx={{
                          color: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.7) : '#666'
                        }}>
                          ({source.percentage}%)
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Card elevation={3} sx={{ flex: '1 1 500px', minWidth: '500px' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Assessment sx={{ mr: 1 }} />
                  Status Distribution
                </Typography>
                <Stack spacing={2}>
                  {analytics.statusDistribution.map((status: any, index: number) => (
                    <Box key={index} sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : '#f8f9fa',
                      borderRadius: 1,
                      border: theme.palette.mode === 'dark' ? `1px solid ${alpha(theme.palette.common.white, 0.1)}` : 'none'
                    }}>
                      <Typography variant="body2">{status.status}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {status.count}
                        </Typography>
                        <Typography variant="caption" sx={{
                          color: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.7) : '#666'
                        }}>
                          ({status.percentage}%)
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Top Performing Banks */}
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <AccountBalance sx={{ mr: 1 }} />
                Top Performing Banks
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Bank Name</TableCell>
                      <TableCell align="center">Applications</TableCell>
                      <TableCell align="center">Approval Rate</TableCell>
                      <TableCell align="center">Avg Commission</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analytics.topPerformingBanks.map((bank: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {bank.bankName}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {bank.applications}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{
                            color: bank.approvalRate >= 80 ? '#28a745' : '#ff9800',
                            fontWeight: 'bold'
                          }}>
                            {bank.approvalRate}%
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{
                            color: '#1976d2',
                            fontWeight: 'bold'
                          }}>
                            {formatCurrency(bank.avgCommission)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Performance Tab */}
      {tabValue === 3 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Performance Metrics</Typography>
              <Stack spacing={3}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Conversion Rate</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {stats.conversionRate.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stats.conversionRate}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Approval Rate</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {stats.totalApplications > 0 ? ((stats.approvedApplications / stats.totalApplications) * 100).toFixed(1) : 0}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stats.totalApplications > 0 ? (stats.approvedApplications / stats.totalApplications) * 100 : 0}
                    sx={{ height: 8, borderRadius: 4 }}
                    color="success"
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Lead Quality</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {stats.totalLeads > 0 ? ((stats.qualifiedLeads / stats.totalLeads) * 100).toFixed(1) : 0}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stats.totalLeads > 0 ? (stats.qualifiedLeads / stats.totalLeads) * 100 : 0}
                    sx={{ height: 8, borderRadius: 4 }}
                    color="warning"
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Key Statistics</Typography>
              <Stack spacing={2}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                  borderRadius: 1,
                  border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}>
                  <Typography variant="body2" sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}>Average Loan Amount</Typography>
                  <Typography variant="body2" sx={{
                    fontWeight: 'bold',
                    color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : 'inherit'
                  }}>
                    {formatCurrency(stats.avgLoanAmount)}
                  </Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                  borderRadius: 1,
                  border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}>
                  <Typography variant="body2" sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}>Monthly Commission</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#28a745' }}>
                    {formatCurrency(stats.monthlyCommission)}
                  </Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                  borderRadius: 1,
                  border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}>
                  <Typography variant="body2" sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}>Total Commission</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {formatCurrency(stats.totalCommission)}
                  </Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                  borderRadius: 1,
                  border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}>
                  <Typography variant="body2" sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}>Active Clients</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#dc3545' }}>
                    {stats.activeClients}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Add Lead Dialog */}
      <Dialog open={openAddLeadDialog} onClose={() => setOpenAddLeadDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Lead</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={newLead.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLead({ ...newLead, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Contact Number"
              value={newLead.contact}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLead({ ...newLead, contact: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={newLead.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLead({ ...newLead, email: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Loan Amount"
              type="number"
              value={newLead.loanAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLead({ ...newLead, loanAmount: Number(e.target.value) })}
              required
            />
            <TextField
              fullWidth
              label="Property Details"
              multiline
              rows={3}
              value={newLead.propertyDetails}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLead({ ...newLead, propertyDetails: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Lead Source"
              value={newLead.source}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLead({ ...newLead, source: e.target.value })}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddLeadDialog(false)}>Cancel</Button>
          <Button onClick={handleAddLead} variant="contained">
            Add Lead
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Lead Dialog */}
      <Dialog open={viewLeadDialog} onClose={() => setViewLeadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Lead Details</DialogTitle>
        <DialogContent>
          {selectedLead && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle1"><strong>Name:</strong> {selectedLead.name}</Typography>
              <Typography variant="body2"><strong>Email:</strong> {selectedLead.email}</Typography>
              <Typography variant="body2"><strong>Contact:</strong> {selectedLead.contact}</Typography>
              <Typography variant="body2"><strong>Loan Amount:</strong> ₹{selectedLead.loanAmount.toLocaleString()}</Typography>
              <Typography variant="body2"><strong>Property Details:</strong> {selectedLead.propertyDetails}</Typography>
              <Typography variant="body2"><strong>Status:</strong> {selectedLead.status}</Typography>
              <Typography variant="body2"><strong>Priority:</strong> {selectedLead.priority}</Typography>
              <Typography variant="body2"><strong>Source:</strong> {selectedLead.source}</Typography>
              <Typography variant="body2"><strong>Created:</strong> {new Date(selectedLead.createdDate).toLocaleDateString()}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewLeadDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

        </>
      )}
    </Container>
  );
};

export default BrokerDashboard;
