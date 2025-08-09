import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Drawer,
  Stack,
  Divider,
  Avatar,
  useTheme,
  Paper,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Visibility,
  Close,
  Refresh,
  TrendingUp,
  AccountBalance as AccountBalanceIcon,
  History,
  Schedule,
  Update,
} from '@mui/icons-material';
import applicationApi, { Application } from '../../services/applicationApi';
import { useAuth } from '../../hooks/useAuth';
import { formatUserRole, getRoleColor } from '../../utils/roleUtils';

// Utility function to parse timeline descriptions that might be JSON strings
const parseTimelineDescription = (description: string | any): string => {
  if (typeof description === 'string') {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(description);

      // Extract meaningful information from JSON
      if (parsed.action === 'Status Update') {
        const oldStatus = parsed.oldStatus || 'Unknown';
        const newStatus = parsed.newStatus || 'Unknown';
        const comment = parsed.comment || '';

        // Convert status codes to user-friendly text
        const statusMap: Record<string, string> = {
          submitted: 'Application Submitted',
          under_review: 'Under Review',
          documents_pending: 'Documents Required',
          documents_received: 'Documents Received',
          submitted_to_bank: 'Submitted to Bank',
          under_bank_review: 'Under Bank Review',
          approved_by_bank: 'Approved by Bank',
          rejected_by_bank: 'Rejected by Bank',
          sanctioned: 'Loan Sanctioned',
          disbursed: 'Amount Disbursed',
          rejected: 'Application Rejected',
        };

        const friendlyOldStatus = statusMap[oldStatus] || oldStatus;
        const friendlyNewStatus = statusMap[newStatus] || newStatus;

        let result = `Status updated from "${friendlyOldStatus}" to "${friendlyNewStatus}"`;
        if (comment) {
          result += `. ${comment}`;
        }
        return result;
      }

      // If it's some other JSON structure, try to extract meaningful text
      if (parsed.message) {
        return parsed.message;
      }

      if (parsed.description) {
        return parsed.description;
      }

      // If we can't parse meaningfully, return a generic message
      return 'Application status updated';
    } catch (e) {
      // If it's not valid JSON, return as-is
      return description;
    }
  }

  // If it's already an object or other type, convert to string
  if (typeof description === 'object' && description !== null) {
    if (description.action === 'Status Update') {
      const oldStatus = description.oldStatus || 'Unknown';
      const newStatus = description.newStatus || 'Unknown';
      const comment = description.comment || '';

      const statusMap: Record<string, string> = {
        submitted: 'Application Submitted',
        under_review: 'Under Review',
        documents_pending: 'Documents Required',
        documents_received: 'Documents Received',
        submitted_to_bank: 'Submitted to Bank',
        under_bank_review: 'Under Bank Review',
        approved_by_bank: 'Approved by Bank',
        rejected_by_bank: 'Rejected by Bank',
        sanctioned: 'Loan Sanctioned',
        disbursed: 'Amount Disbursed',
        rejected: 'Application Rejected',
      };

      const friendlyOldStatus = statusMap[oldStatus] || oldStatus;
      const friendlyNewStatus = statusMap[newStatus] || newStatus;

      let result = `Status updated from "${friendlyOldStatus}" to "${friendlyNewStatus}"`;
      if (comment) {
        result += `. ${comment}`;
      }
      return result;
    }

    return description.message || description.description || 'Application updated';
  }

  return String(description);
};

// Utility function to get user-friendly event names
const formatEventName = (event: string): string => {
  const eventMap: Record<string, string> = {
    'Status Update': 'Status Updated',
    'Document Upload': 'Documents Uploaded',
    'Document Request': 'Documents Requested',
    'Application Submitted': 'Application Submitted',
    'Bank Review': 'Bank Review Started',
    Approval: 'Application Approved',
    Rejection: 'Application Rejected',
    Disbursement: 'Loan Disbursed',
  };

  return eventMap[event] || event;
};

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date().toISOString());

  // Request tracking to prevent multiple simultaneous calls
  const fetchingRef = useRef(false);

  // Fetch customer applications
  const fetchApplications = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (fetchingRef.current) {
      console.log('⚠️ CustomerDashboard - Skipping fetch - request already in progress');
      return;
    }

    fetchingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const data = await applicationApi.getMyApplications();
      setApplications(data);
      setLastUpdateTime(new Date().toISOString());
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  // Real-time polling for updates (memoized to prevent recreation)
  const pollForUpdates = useCallback(async () => {
    try {
      const updates = await applicationApi.pollApplicationUpdates(lastUpdateTime);
      if (updates.length > 0) {
        // Delay to avoid rate limiting
        setTimeout(() => {
          fetchApplications();
        }, 500);
      }
    } catch (err) {
      console.error('Failed to poll for updates:', err);
    }
  }, [lastUpdateTime, fetchApplications]);

  // Initialize data and polling
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Set up real-time polling every 30 seconds
  useEffect(() => {
    const interval = setInterval(pollForUpdates, 30000);
    return () => clearInterval(interval);
  }, [pollForUpdates]);

  // Get status configuration
  const getStatusConfig = (status: Application['status']) => {
    const configs = {
      submitted: { color: '#304FFE', label: 'Submitted', icon: '', progress: 15 },
      under_review: { color: '#304FFE', label: 'Under Review', icon: '', progress: 25 },
      documents_pending: { color: '#FFA726', label: 'Documents Pending', icon: '', progress: 35 },
      documents_received: { color: '#00C8C8', label: 'Documents Received', icon: '', progress: 50 },
      submitted_to_bank: { color: '#9C27B0', label: 'Submitted to Bank', icon: '', progress: 65 },
      under_bank_review: { color: '#673AB7', label: 'Under Bank Review', icon: '', progress: 75 },
      approved_by_bank: { color: '#4CAF50', label: 'Approved by Bank', icon: '', progress: 85 },
      rejected_by_bank: { color: '#F44336', label: 'Rejected by Bank', icon: '', progress: 100 },
      sanctioned: { color: '#2E7D32', label: 'Sanctioned', icon: '', progress: 95 },
      disbursed: { color: '#1B5E20', label: 'Disbursed', icon: '', progress: 100 },
      rejected: { color: '#D32F2F', label: 'Rejected', icon: '', progress: 100 },
    };
    return configs[status] || { color: '#757575', label: status, icon: '', progress: 0 };
  };

  // Get application statistics
  const getApplicationStats = () => {
    const totalApplications = applications.length;
    const activeApplications = applications.filter(
      app => !['rejected', 'rejected_by_bank', 'disbursed'].includes(app.status)
    ).length;
    const totalLoanAmount = applications
      .filter(app => ['approved_by_bank', 'sanctioned', 'disbursed'].includes(app.status))
      .reduce((sum, app) => sum + app.loanDetails.requestedAmount, 0);

    return {
      totalApplications,
      activeApplications,
      totalLoanAmount,
      completedApplications: applications.filter(app =>
        ['approved_by_bank', 'sanctioned', 'disbursed'].includes(app.status)
      ).length,
    };
  };

  const stats = getApplicationStats();

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Container maxWidth='xl' sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          mb: { xs: 3, md: 4 },
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3 },
          borderRadius: 3,
          background: isDark
            ? 'linear-gradient(90deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(90deg, #e3f0ff 0%, #f9fbfd 100%)',
          boxShadow: isDark
            ? '0 2px 12px 0 rgba(30,41,59,0.30)'
            : '0 2px 12px 0 rgba(30,41,59,0.08)',
        }}
      >
        <Box display='flex' alignItems='center' gap={2}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: isDark ? theme.palette.primary.dark : theme.palette.primary.main,
            }}
          >
            <AccountBalanceIcon sx={{ fontSize: 32, color: '#fff' }} />
          </Avatar>
          <Box>
            <Typography
              variant='h5'
              fontWeight='bold'
              color={isDark ? '#fff' : theme.palette.primary.main}
              sx={{ mb: 0.5 }}
            >
              Welcome Back{user?.firstName ? `, ${user.firstName}` : ''}!
            </Typography>
            {user?.role && (
              <Box sx={{ mb: 1 }}>
                <Chip
                  label={formatUserRole(user.role)}
                  color={getRoleColor(user.role)}
                  size='small'
                  sx={{
                    fontSize: '0.625rem',
                    height: 20,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    color: isDark ? '#fff' : 'inherit',
                  }}
                />
              </Box>
            )}
            <Typography
              variant='subtitle1'
              color={isDark ? theme.palette.grey[300] : theme.palette.text.secondary}
            >
              Here&apos;s a summary of your loan journey
            </Typography>
          </Box>
        </Box>
        <Button
          variant='outlined'
          startIcon={<Refresh />}
          onClick={fetchApplications}
          disabled={loading}
          sx={{
            color: isDark ? theme.palette.primary.light : theme.palette.primary.main,
            borderColor: isDark ? theme.palette.primary.light : theme.palette.primary.main,
            fontWeight: 600,
            px: 3,
            py: 1.2,
            borderRadius: 2,
            boxShadow: isDark
              ? '0 2px 12px 0 rgba(30,41,59,0.20)'
              : '0 2px 12px 0 rgba(30,41,59,0.05)',
            '&:hover': {
              background: isDark ? theme.palette.primary.dark : theme.palette.primary.light,
              color: '#fff',
              borderColor: isDark ? theme.palette.primary.dark : theme.palette.primary.light,
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box display='flex' flexWrap='wrap' gap={3} mb={4}>
        <Box sx={{ flex: '1 1 100%', maxWidth: { xs: '100%', sm: '50%', md: '25%' } }}>
          <Card
            sx={{
              height: '100%',
              background: isDark
                ? 'linear-gradient(135deg, #304FFE 0%, #222B45 100%)'
                : 'linear-gradient(135deg, #304FFE 0%, #5C6FFF 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: isDark ? 6 : 2,
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: isDark ? 12 : 6 },
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center' gap={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.14)', width: 48, height: 48 }}>
                  <AssignmentIcon sx={{ fontSize: 28, color: '#fff' }} />
                </Avatar>
                <Box>
                  <Typography variant='h4' fontWeight='bold' color='white'>
                    {stats.totalApplications}
                  </Typography>
                  <Typography color='rgba(255,255,255,0.8)'>Total Applications</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 100%', maxWidth: { xs: '100%', sm: '50%', md: '25%' } }}>
          <Card
            sx={{
              height: '100%',
              background: isDark
                ? 'linear-gradient(135deg, #00C8C8 0%, #1e293b 100%)'
                : 'linear-gradient(135deg, #00C8C8 0%, #4DD0E1 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: isDark ? 6 : 2,
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: isDark ? 12 : 6 },
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center' gap={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.14)', width: 48, height: 48 }}>
                  <PendingIcon sx={{ fontSize: 28, color: '#fff' }} />
                </Avatar>
                <Box>
                  <Typography variant='h4' fontWeight='bold' color='white'>
                    {stats.activeApplications}
                  </Typography>
                  <Typography color='rgba(255,255,255,0.8)'>Active Applications</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 100%', maxWidth: { xs: '100%', sm: '50%', md: '25%' } }}>
          <Card
            sx={{
              height: '100%',
              background: isDark
                ? 'linear-gradient(135deg, #4CAF50 0%, #1B5E20 100%)'
                : 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: isDark ? 6 : 2,
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: isDark ? 12 : 6 },
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center' gap={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.14)', width: 48, height: 48 }}>
                  <CheckCircleIcon sx={{ fontSize: 28, color: '#fff' }} />
                </Avatar>
                <Box>
                  <Typography variant='h4' fontWeight='bold' color='white'>
                    {stats.completedApplications}
                  </Typography>
                  <Typography color='rgba(255,255,255,0.8)'>Completed</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 100%', maxWidth: { xs: '100%', sm: '50%', md: '25%' } }}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #FFA726 0%, #FFB74D 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center'>
                <TrendingUp sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant='h4' fontWeight='bold' color='white'>
                    ₹{(stats.totalLoanAmount / 100000).toFixed(1)}L
                  </Typography>
                  <Typography color='rgba(255,255,255,0.8)'>Total Sanctioned</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant='scrollable'
          scrollButtons='auto'
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-scrollButtons': {
              '&.Mui-disabled': { opacity: 0.3 },
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              minWidth: { xs: 140, sm: 180 },
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
            },
          }}
        >
          <Tab label='My Applications' icon={<AssignmentIcon />} />
          <Tab label='Application History' icon={<TimelineIcon />} />
        </Tabs>
      </Box>

      {/* Applications Tab */}
      {tabValue === 0 && (
        <Card sx={{ border: '1px solid #E0E0E0' }}>
          <CardContent sx={{ p: 0 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity='error' sx={{ m: 3 }}>
                {error}
              </Alert>
            ) : applications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <AssignmentIcon sx={{ fontSize: 64, color: '#E0E0E0', mb: 2 }} />
                <Typography variant='h6' color='#757575' gutterBottom>
                  No applications found
                </Typography>
                <Typography variant='body2' color='#757575' mb={3}>
                  You haven&lsquo;t submitted any loan applications yet.
                </Typography>
                <Button
                  variant='contained'
                  sx={{
                    bgcolor: isDark ? theme.palette.primary.dark : '#304FFE',
                    '&:hover': {
                      bgcolor: isDark ? theme.palette.primary.main : '#1C3AA9',
                    },
                  }}
                >
                  Apply for Loan
                </Button>
              </Box>
            ) : (
              <TableContainer
                component={Paper}
                sx={{
                  bgcolor: isDark ? theme.palette.background.paper : 'white',
                  boxShadow: isDark ? 3 : 1,
                }}
              >
                <Table>
                  <TableHead
                    sx={{
                      bgcolor: isDark ? theme.palette.grey[800] : '#F5F7FA',
                    }}
                  >
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 'bold',
                          color: isDark ? theme.palette.text.primary : '#2E2E2E',
                        }}
                      >
                        Application #
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 'bold',
                          color: isDark ? theme.palette.text.primary : '#2E2E2E',
                        }}
                      >
                        Loan Amount
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 'bold',
                          color: isDark ? theme.palette.text.primary : '#2E2E2E',
                        }}
                      >
                        Bank
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 'bold',
                          color: isDark ? theme.palette.text.primary : '#2E2E2E',
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 'bold',
                          color: isDark ? theme.palette.text.primary : '#2E2E2E',
                        }}
                      >
                        Progress
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 'bold',
                          color: isDark ? theme.palette.text.primary : '#2E2E2E',
                        }}
                      >
                        Last Updated
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 'bold',
                          color: isDark ? theme.palette.text.primary : '#2E2E2E',
                          textAlign: 'center',
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications.map(application => {
                      const statusConfig = getStatusConfig(application.status);
                      return (
                        <TableRow
                          key={application._id}
                          hover
                          sx={{
                            '&:hover': {
                              bgcolor: isDark ? theme.palette.action.hover : '#F8F9FA',
                              cursor: 'pointer',
                            },
                            bgcolor: isDark ? theme.palette.background.paper : 'white',
                          }}
                        >
                          <TableCell
                            sx={{
                              fontWeight: 500,
                              color: isDark ? theme.palette.primary.light : '#304FFE',
                            }}
                          >
                            {application.applicationNumber}
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant='body2'
                              fontWeight={500}
                              color={
                                isDark ? theme.palette.text.primary : theme.palette.text.primary
                              }
                            >
                              ₹{application.loanDetails.requestedAmount.toLocaleString()}
                            </Typography>
                            <Typography
                              variant='caption'
                              color={isDark ? theme.palette.text.secondary : '#757575'}
                            >
                              {application.loanDetails.tenure} years •{' '}
                              {application.loanDetails.interestRate}% p.a.
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant='body2'
                              color={
                                isDark ? theme.palette.text.primary : theme.palette.text.primary
                              }
                            >
                              {application.loanDetails.selectedBank}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={statusConfig.label}
                              size='small'
                              sx={{
                                bgcolor: statusConfig.color,
                                color: 'white',
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ width: 100 }}>
                              <LinearProgress
                                variant='determinate'
                                value={statusConfig.progress}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: '#E0E0E0',
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: statusConfig.color,
                                    borderRadius: 3,
                                  },
                                }}
                              />
                              <Typography variant='caption' color='#757575' sx={{ mt: 0.5 }}>
                                {statusConfig.progress}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant='body2' color='#757575'>
                              {new Date(application.updatedAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell align='center'>
                            <IconButton
                              size='small'
                              onClick={() => {
                                setSelectedApplication(application);
                                setDrawerOpen(true);
                              }}
                              sx={{ color: '#304FFE' }}
                            >
                              <Visibility fontSize='small' />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Application History Tab */}
      {tabValue === 1 && (
        <Card sx={{ border: '1px solid #E0E0E0' }}>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Application Timeline
            </Typography>
            {applications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <TimelineIcon sx={{ fontSize: 48, color: '#E0E0E0', mb: 2 }} />
                <Typography color='#757575'>No application history available</Typography>
              </Box>
            ) : (
              <Box>
                {applications.map(application => (
                  <Card key={application._id} sx={{ mb: 2, border: '1px solid #E0E0E0' }}>
                    <CardContent>
                      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
                        <Typography variant='subtitle1' fontWeight='bold'>
                          {application.applicationNumber}
                        </Typography>
                        <Chip
                          label={getStatusConfig(application.status).label}
                          size='small'
                          sx={{
                            bgcolor: getStatusConfig(application.status).color,
                            color: 'white',
                          }}
                        />
                      </Box>
                      <Stepper orientation='vertical'>
                        {application.timeline.map((item, index) => (
                          <Step key={index} completed={true}>
                            <StepLabel>
                              <Typography
                                variant='body2'
                                fontWeight={500}
                                color={
                                  isDark ? theme.palette.primary.light : theme.palette.primary.main
                                }
                              >
                                {formatEventName(item.event)}
                              </Typography>
                            </StepLabel>
                            <StepContent>
                              <Typography
                                variant='body2'
                                color={
                                  isDark ? theme.palette.grey[300] : theme.palette.text.secondary
                                }
                                sx={{ mb: 1 }}
                              >
                                {parseTimelineDescription(item.description)}
                              </Typography>
                              <Typography
                                variant='caption'
                                color={
                                  isDark ? theme.palette.grey[400] : theme.palette.text.disabled
                                }
                                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                              >
                                <Schedule fontSize='small' />
                                {new Date(item.date).toLocaleString()} • {item.performedBy}
                              </Typography>
                            </StepContent>
                          </Step>
                        ))}
                      </Stepper>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Application Details Drawer */}
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 500,
            maxWidth: '90vw',
            bgcolor: isDark ? theme.palette.background.default : 'white',
            color: isDark ? theme.palette.text.primary : theme.palette.text.primary,
          },
        }}
      >
        {selectedApplication && (
          <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              mb={3}
              sx={{
                borderBottom: `1px solid ${isDark ? theme.palette.divider : '#e0e0e0'}`,
                pb: 2,
              }}
            >
              <Typography
                variant='h6'
                fontWeight='bold'
                color={isDark ? theme.palette.primary.light : theme.palette.primary.main}
              >
                Application Details
              </Typography>
              <IconButton
                onClick={() => setDrawerOpen(false)}
                sx={{
                  color: isDark ? theme.palette.text.secondary : theme.palette.text.secondary,
                }}
              >
                <Close />
              </IconButton>
            </Box>

            {/* Application Info */}
            <Card
              sx={{
                mb: 3,
                border: `1px solid ${isDark ? theme.palette.divider : '#E0E0E0'}`,
                bgcolor: isDark ? theme.palette.background.paper : 'white',
              }}
            >
              <CardContent>
                <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
                  <Typography
                    variant='subtitle1'
                    fontWeight='bold'
                    color={isDark ? theme.palette.text.primary : theme.palette.text.primary}
                  >
                    {selectedApplication.applicationNumber}
                  </Typography>
                  <Chip
                    label={getStatusConfig(selectedApplication.status).label}
                    size='small'
                    sx={{
                      bgcolor: getStatusConfig(selectedApplication.status).color,
                      color: 'white',
                    }}
                  />
                </Box>
                <LinearProgress
                  variant='determinate'
                  value={getStatusConfig(selectedApplication.status).progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#E0E0E0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getStatusConfig(selectedApplication.status).color,
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography variant='body2' color='#757575' sx={{ mt: 1 }}>
                  {getStatusConfig(selectedApplication.status).progress}% Complete
                </Typography>
              </CardContent>
            </Card>

            {/* Loan Details */}
            <Card sx={{ mb: 3, border: '1px solid #E0E0E0' }}>
              <CardContent>
                <Typography variant='subtitle1' fontWeight='bold' mb={2}>
                  Loan Details
                </Typography>
                <Stack spacing={1}>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='body2' color='#757575'>
                      Loan Amount:
                    </Typography>
                    <Typography variant='body2' fontWeight={500}>
                      ₹{selectedApplication.loanDetails.requestedAmount.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='body2' color='#757575'>
                      Interest Rate:
                    </Typography>
                    <Typography variant='body2'>
                      {selectedApplication.loanDetails.interestRate}% p.a.
                    </Typography>
                  </Box>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='body2' color='#757575'>
                      Tenure:
                    </Typography>
                    <Typography variant='body2'>
                      {selectedApplication.loanDetails.tenure} years
                    </Typography>
                  </Box>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='body2' color='#757575'>
                      Monthly EMI:
                    </Typography>
                    <Typography variant='body2' fontWeight={500}>
                      ₹{selectedApplication.loanDetails.monthlyEMI.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='body2' color='#757575'>
                      Bank:
                    </Typography>
                    <Typography variant='body2'>
                      {selectedApplication.loanDetails.selectedBank}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Documents Status */}
            <Card sx={{ mb: 3, border: '1px solid #E0E0E0' }}>
              <CardContent>
                <Typography variant='subtitle1' fontWeight='bold' mb={2}>
                  Documents
                </Typography>
                <Box>
                  <Typography
                    variant='body2'
                    color={isDark ? theme.palette.text.secondary : '#757575'}
                    mb={1}
                  >
                    Submitted:
                  </Typography>
                  {selectedApplication.documents.submitted.length === 0 ? (
                    <Typography
                      variant='body2'
                      color={isDark ? theme.palette.text.disabled : '#999'}
                    >
                      No documents submitted
                    </Typography>
                  ) : (
                    selectedApplication.documents.submitted.map((doc: string, index: number) => (
                      <Chip
                        key={index}
                        label={doc}
                        size='small'
                        sx={{
                          mr: 1,
                          mb: 1,
                          bgcolor: isDark ? theme.palette.success.dark : '#E8F5E8',
                          color: isDark
                            ? theme.palette.success.contrastText
                            : theme.palette.success.dark,
                        }}
                      />
                    ))
                  )}
                </Box>
                <Divider sx={{ my: 2, borderColor: isDark ? theme.palette.divider : '#e0e0e0' }} />
                <Box>
                  <Typography
                    variant='body2'
                    color={isDark ? theme.palette.text.secondary : '#757575'}
                    mb={1}
                  >
                    Pending:
                  </Typography>
                  {selectedApplication.documents.pending.length === 0 ? (
                    <Typography
                      variant='body2'
                      color={isDark ? theme.palette.text.disabled : '#999'}
                    >
                      No pending documents
                    </Typography>
                  ) : (
                    selectedApplication.documents.pending.map((doc: string, index: number) => (
                      <Chip
                        key={index}
                        label={doc}
                        size='small'
                        sx={{
                          mr: 1,
                          mb: 1,
                          bgcolor: isDark ? theme.palette.warning.dark : '#FFF3E0',
                          color: isDark
                            ? theme.palette.warning.contrastText
                            : theme.palette.warning.dark,
                        }}
                      />
                    ))
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card
              sx={{
                border: `1px solid ${isDark ? theme.palette.divider : '#E0E0E0'}`,
                bgcolor: isDark ? theme.palette.background.paper : 'white',
              }}
            >
              <CardContent>
                <Typography
                  variant='subtitle1'
                  fontWeight='bold'
                  mb={2}
                  color={isDark ? theme.palette.primary.light : theme.palette.primary.main}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <History />
                  Recent Updates
                </Typography>
                <List dense>
                  {selectedApplication.timeline.slice(0, 5).map((item, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        px: 0,
                        py: 1.5,
                        borderBottom:
                          index < 4
                            ? `1px solid ${isDark ? theme.palette.divider : '#f0f0f0'}`
                            : 'none',
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant='body2'
                            fontWeight={500}
                            color={isDark ? theme.palette.text.primary : theme.palette.text.primary}
                          >
                            {formatEventName(item.event)}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography
                              variant='body2'
                              color={
                                isDark ? theme.palette.grey[300] : theme.palette.text.secondary
                              }
                              sx={{ mb: 0.5 }}
                            >
                              {parseTimelineDescription(item.description)}
                            </Typography>
                            <Typography
                              variant='caption'
                              color={isDark ? theme.palette.grey[400] : theme.palette.text.disabled}
                              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                            >
                              <Update fontSize='small' />
                              {new Date(item.date).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        )}
      </Drawer>
    </Container>
  );
};

export default CustomerDashboard;
