import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Chip,
  Paper,
  Stack,
  Divider,
  Avatar,
  LinearProgress,
  Tooltip,
  IconButton,
  Badge,
  useTheme,
  alpha,
  Tabs,
  Tab,
} from '@mui/material';
import {
  AccountBalance,
  Assessment,
  TrendingUp,
  AttachMoney,
  Security,
  Calculate,
  Refresh,
  Shield,
  ManageAccounts,
  Dashboard,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AssessmentManager from '../components/Banker/AssessmentManager';

interface BankerStats {
  totalEligibilityChecks: number;
  todayChecks: number;
  avgLoanAmount: number;
  eligibilityRate: number;
  highValueApplications: number;
  employmentBreakdown: {
    salaried: number;
    'self-employed': number;
    business: number;
  };
}

const BankerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [stats, setStats] = useState<BankerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  // Redirect if not banker or admin
  useEffect(() => {
    if (!user || (user.role !== 'banker' && user.role !== 'admin' && user.userType !== 'banker')) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Fetch banker dashboard stats from localStorage
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(''); // Clear any previous errors

        // Get assessments from localStorage instead of API
        const assessments = JSON.parse(localStorage.getItem('bankerAssessments') || '[]');

        // Calculate stats from localStorage data
        const today = new Date().toDateString();
        const todayAssessments = assessments.filter(
          (assessment: any) => new Date(assessment.assessmentDate).toDateString() === today
        );

        const totalLoanAmounts = assessments.map((a: any) => a.results.maxLoanAmount || 0);
        const avgLoanAmount =
          totalLoanAmounts.length > 0
            ? totalLoanAmounts.reduce((sum: number, amount: number) => sum + amount, 0) /
              totalLoanAmounts.length
            : 0;

        const eligibleCount = assessments.filter((a: any) => a.results.riskLevel !== 'High').length;
        const eligibilityRate =
          assessments.length > 0 ? (eligibleCount / assessments.length) * 100 : 0;

        const highValueApplications = assessments.filter(
          (a: any) => (a.results.maxLoanAmount || 0) > 5000000 // 50 lakhs+
        ).length;

        const employmentBreakdown = {
          salaried: assessments.filter((a: any) => a.customerDetails.employmentType === 'salaried')
            .length,
          'self-employed': assessments.filter(
            (a: any) => a.customerDetails.employmentType === 'self-employed'
          ).length,
          business: assessments.filter((a: any) => a.customerDetails.employmentType === 'business')
            .length,
        };

        const calculatedStats: BankerStats = {
          totalEligibilityChecks: assessments.length,
          todayChecks: todayAssessments.length,
          avgLoanAmount: Math.round(avgLoanAmount),
          eligibilityRate: Math.round(eligibilityRate),
          highValueApplications,
          employmentBreakdown,
        };

        setStats(calculatedStats);
      } catch (err) {
        console.error('🏦 Error fetching stats from localStorage:', err);
        setError('Error loading dashboard data from local storage');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchStats();
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    // Re-trigger the fetch from localStorage
    const fetchStats = async () => {
      if (!user) return;
      try {
        setError('');

        // Get assessments from localStorage instead of API
        const assessments = JSON.parse(localStorage.getItem('bankerAssessments') || '[]');

        // Calculate stats from localStorage data
        const today = new Date().toDateString();
        const todayAssessments = assessments.filter(
          (assessment: any) => new Date(assessment.assessmentDate).toDateString() === today
        );

        const totalLoanAmounts = assessments.map((a: any) => a.results.maxLoanAmount || 0);
        const avgLoanAmount =
          totalLoanAmounts.length > 0
            ? totalLoanAmounts.reduce((sum: number, amount: number) => sum + amount, 0) /
              totalLoanAmounts.length
            : 0;

        const eligibleCount = assessments.filter((a: any) => a.results.riskLevel !== 'High').length;
        const eligibilityRate =
          assessments.length > 0 ? (eligibleCount / assessments.length) * 100 : 0;

        const highValueApplications = assessments.filter(
          (a: any) => (a.results.maxLoanAmount || 0) > 5000000 // 50 lakhs+
        ).length;

        const employmentBreakdown = {
          salaried: assessments.filter((a: any) => a.customerDetails.employmentType === 'salaried')
            .length,
          'self-employed': assessments.filter(
            (a: any) => a.customerDetails.employmentType === 'self-employed'
          ).length,
          business: assessments.filter((a: any) => a.customerDetails.employmentType === 'business')
            .length,
        };

        const calculatedStats: BankerStats = {
          totalEligibilityChecks: assessments.length,
          todayChecks: todayAssessments.length,
          avgLoanAmount: Math.round(avgLoanAmount),
          eligibilityRate: Math.round(eligibilityRate),
          highValueApplications,
          employmentBreakdown,
        };

        setStats(calculatedStats);
      } catch (err) {
        setError('Error refreshing dashboard data from local storage');
      } finally {
        setRefreshing(false);
      }
    };
    fetchStats();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Container maxWidth='xl' sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Avatar
            sx={{
              mx: 'auto',
              mb: 3,
              width: 80,
              height: 80,
              bgcolor: theme.palette.primary.main,
              fontSize: '2rem',
            }}
          >
            <AccountBalance />
          </Avatar>
          <Typography variant='h5' sx={{ mb: 2, color: 'text.primary' }}>
            Loading Banker Dashboard
          </Typography>
          <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
            Fetching your professional analytics and insights...
          </Typography>
          <LinearProgress
            sx={{
              width: 300,
              mx: 'auto',
              borderRadius: 2,
              height: 6,
            }}
          />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth='xl' sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Avatar
            sx={{
              mx: 'auto',
              mb: 3,
              width: 80,
              height: 80,
              bgcolor: theme.palette.error.main,
              fontSize: '2rem',
            }}
          >
            <Security />
          </Avatar>
          <Alert
            severity='error'
            sx={{
              mb: 3,
              maxWidth: 500,
              mx: 'auto',
              borderRadius: 2,
            }}
          >
            <Typography variant='h6' sx={{ mb: 1 }}>
              Dashboard Access Error
            </Typography>
            {error}
          </Alert>
          <Button
            variant='contained'
            onClick={handleRefresh}
            startIcon={<Refresh />}
            sx={{ borderRadius: 2 }}
          >
            Retry Loading
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth='xl' sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2 } }}>
      {/* Enhanced Header with Professional Design and Theme Adaptability */}
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          mb: { xs: 2, sm: 3, md: 4 },
          background:
            theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: theme.palette.mode === 'dark' ? theme.palette.common.white : 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          boxShadow:
            theme.palette.mode === 'dark'
              ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`
              : `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: { xs: 100, sm: 150, md: 200 },
            height: { xs: 100, sm: 150, md: 200 },
            opacity: theme.palette.mode === 'dark' ? 0.05 : 0.1,
            background: `radial-gradient(circle, ${theme.palette.mode === 'dark' ? theme.palette.common.white : 'white'} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            display: { xs: 'none', sm: 'block' },
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent='space-between'
            alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
            sx={{ mb: 2 }}
            spacing={{ xs: 2, sm: 0 }}
          >
            <Box>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={{ xs: 1, sm: 2 }}
                sx={{ mb: 2 }}
              >
                <Avatar
                  sx={{
                    width: { xs: 50, sm: 60 },
                    height: { xs: 50, sm: 60 },
                    bgcolor: alpha('#ffffff', 0.2),
                    border: '2px solid rgba(255,255,255,0.3)',
                  }}
                >
                  <AccountBalance sx={{ fontSize: { xs: 25, sm: 30 } }} />
                </Avatar>
                <Box>
                  <Typography
                    variant='h4'
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                      fontSize: { xs: '1.5rem', sm: '2.125rem' },
                      textAlign: { xs: 'left', sm: 'left' },
                    }}
                  >
                    Professional Banking Dashboard
                  </Typography>
                  <Typography
                    variant='h6'
                    sx={{
                      opacity: 0.9,
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                    }}
                  >
                    Welcome back, {user?.firstName || user?.email}
                  </Typography>
                </Box>
              </Stack>
              <Typography
                variant='body1'
                sx={{
                  opacity: 0.9,
                  maxWidth: { xs: '100%', sm: 600 },
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                }}
              >
                Access comprehensive loan assessment tools, customer analytics, and
                professional-grade eligibility calculators
              </Typography>
            </Box>

            <Stack
              direction={{ xs: 'row', sm: 'row' }}
              spacing={1}
              sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}
            >
              <Tooltip title='Refresh Dashboard'>
                <IconButton
                  onClick={handleRefresh}
                  disabled={refreshing}
                  sx={{
                    bgcolor: alpha('#ffffff', 0.1),
                    color: 'white',
                    '&:hover': { bgcolor: alpha('#ffffff', 0.2) },
                  }}
                >
                  <Refresh
                    sx={{
                      animation: refreshing ? 'spin 1s linear infinite' : 'none',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Chip
                icon={<Shield />}
                label='Verified Banker'
                sx={{
                  bgcolor: alpha('#ffffff', 0.2),
                  color: 'white',
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: 'white' },
                }}
              />
            </Stack>
          </Stack>
        </Box>
      </Paper>

      {/* Navigation Tabs */}
      <Card sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant='fullWidth'
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTabs-indicator': {
              height: 3,
            },
            '& .MuiTab-root': {
              minHeight: { xs: 56, sm: 64 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
            },
            '& .MuiTabs-flexContainer': {
              flexDirection: { xs: 'row', sm: 'row' },
            },
          }}
        >
          <Tab
            icon={<Dashboard sx={{ fontSize: { xs: 20, sm: 24 } }} />}
            label='Dashboard'
            iconPosition='start'
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 0.5, sm: 1 },
              '& .MuiTab-iconWrapper': {
                marginBottom: { xs: '4px', sm: 0 },
                marginRight: { xs: 0, sm: '8px' },
              },
            }}
          />
          <Tab
            icon={<ManageAccounts sx={{ fontSize: { xs: 20, sm: 24 } }} />}
            label='Manage Assessments'
            iconPosition='start'
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 0.5, sm: 1 },
              '& .MuiTab-iconWrapper': {
                marginBottom: { xs: '4px', sm: 0 },
                marginRight: { xs: 0, sm: '8px' },
              },
            }}
          />
        </Tabs>
      </Card>

      {/* Tab Content */}
      {currentTab === 0 && stats && (
        <>
          {/* Enhanced Main Stats Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 3,
              mb: 4,
            }}
          >
            <Card
              sx={{
                height: '100%',
                background:
                  theme.palette.mode === 'dark'
                    ? `linear-gradient(135deg, ${alpha('#4caf50', 0.8)} 0%, ${alpha('#45a049', 0.8)} 100%)`
                    : `linear-gradient(135deg, #4caf50 0%, #45a049 100%)`,
                color: 'white',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                border:
                  theme.palette.mode === 'dark' ? `1px solid ${alpha('#4caf50', 0.3)}` : 'none',
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 }, position: 'relative', zIndex: 1 }}>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='flex-start'
                  sx={{ mb: 2 }}
                >
                  <TrendingUp sx={{ fontSize: { xs: 32, sm: 40 }, opacity: 0.9 }} />
                  <Chip
                    label='Total'
                    size='small'
                    sx={{
                      bgcolor: alpha('#ffffff', 0.2),
                      color: 'white',
                      fontWeight: 600,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    }}
                  />
                </Stack>
                <Typography
                  variant='h3'
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    fontSize: { xs: '1.75rem', sm: '3rem' },
                  }}
                >
                  {stats.totalEligibilityChecks.toLocaleString()}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    opacity: 0.9,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    lineHeight: { xs: 1.3, sm: 1.4 },
                  }}
                >
                  Total Assessments Completed
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant='determinate'
                    value={85}
                    sx={{
                      bgcolor: alpha('#ffffff', 0.3),
                      '& .MuiLinearProgress-bar': { bgcolor: 'white' },
                      height: { xs: 4, sm: 6 },
                    }}
                  />
                </Box>
              </CardContent>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: alpha('#ffffff', 0.1),
                }}
              />
            </Card>

            <Card
              sx={{
                height: '100%',
                background:
                  theme.palette.mode === 'dark'
                    ? `linear-gradient(135deg, ${alpha('#2196f3', 0.8)} 0%, ${alpha('#1976d2', 0.8)} 100%)`
                    : `linear-gradient(135deg, #2196f3 0%, #1976d2 100%)`,
                color: 'white',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                border:
                  theme.palette.mode === 'dark' ? `1px solid ${alpha('#2196f3', 0.3)}` : 'none',
              }}
            >
              <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='flex-start'
                  sx={{ mb: 2 }}
                >
                  <Assessment sx={{ fontSize: 40, opacity: 0.9 }} />
                  <Badge badgeContent={stats.todayChecks > 0 ? 'New' : 0} color='warning'>
                    <Chip
                      label='Today'
                      size='small'
                      sx={{
                        bgcolor: alpha('#ffffff', 0.2),
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </Badge>
                </Stack>
                <Typography variant='h3' sx={{ fontWeight: 700, mb: 1 }}>
                  {stats.todayChecks}
                </Typography>
                <Typography variant='body2' sx={{ opacity: 0.9 }}>
                  Today&apos;s Assessments
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant='determinate'
                    value={stats.todayChecks > 0 ? 100 : 0}
                    sx={{
                      bgcolor: alpha('#ffffff', 0.3),
                      '& .MuiLinearProgress-bar': { bgcolor: 'white' },
                    }}
                  />
                </Box>
              </CardContent>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: alpha('#ffffff', 0.1),
                }}
              />
            </Card>

            <Card
              sx={{
                height: '100%',
                background:
                  theme.palette.mode === 'dark'
                    ? `linear-gradient(135deg, ${alpha('#ff9800', 0.8)} 0%, ${alpha('#f57c00', 0.8)} 100%)`
                    : `linear-gradient(135deg, #ff9800 0%, #f57c00 100%)`,
                color: 'white',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                border:
                  theme.palette.mode === 'dark' ? `1px solid ${alpha('#ff9800', 0.3)}` : 'none',
              }}
            >
              <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='flex-start'
                  sx={{ mb: 2 }}
                >
                  <AttachMoney sx={{ fontSize: 40, opacity: 0.9 }} />
                  <Chip
                    label='Avg'
                    size='small'
                    sx={{
                      bgcolor: alpha('#ffffff', 0.2),
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Stack>
                <Typography variant='h3' sx={{ fontWeight: 700, mb: 1, fontSize: '1.8rem' }}>
                  {formatCurrency(stats.avgLoanAmount)}
                </Typography>
                <Typography variant='body2' sx={{ opacity: 0.9 }}>
                  Average Loan Amount
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant='determinate'
                    value={75}
                    sx={{
                      bgcolor: alpha('#ffffff', 0.3),
                      '& .MuiLinearProgress-bar': { bgcolor: 'white' },
                    }}
                  />
                </Box>
              </CardContent>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: alpha('#ffffff', 0.1),
                }}
              />
            </Card>

            <Card
              sx={{
                height: '100%',
                background:
                  theme.palette.mode === 'dark'
                    ? `linear-gradient(135deg, ${alpha('#9c27b0', 0.8)} 0%, ${alpha('#7b1fa2', 0.8)} 100%)`
                    : `linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)`,
                color: 'white',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                border:
                  theme.palette.mode === 'dark' ? `1px solid ${alpha('#9c27b0', 0.3)}` : 'none',
              }}
            >
              <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='flex-start'
                  sx={{ mb: 2 }}
                >
                  <Security sx={{ fontSize: 40, opacity: 0.9 }} />
                  <Chip
                    label='Rate'
                    size='small'
                    sx={{
                      bgcolor: alpha('#ffffff', 0.2),
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Stack>
                <Typography variant='h3' sx={{ fontWeight: 700, mb: 1 }}>
                  {stats.eligibilityRate.toFixed(1)}%
                </Typography>
                <Typography variant='body2' sx={{ opacity: 0.9 }}>
                  Eligibility Success Rate
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant='determinate'
                    value={stats.eligibilityRate}
                    sx={{
                      bgcolor: alpha('#ffffff', 0.3),
                      '& .MuiLinearProgress-bar': { bgcolor: 'white' },
                    }}
                  />
                </Box>
              </CardContent>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: alpha('#ffffff', 0.1),
                }}
              />
            </Card>
          </Box>

          {/* Employment Breakdown and Quick Actions */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
              mb: 4,
            }}
          >
            {/* Employment Breakdown */}
            <Card
              sx={{
                height: '100%',
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.8)
                    : theme.palette.background.paper,
                border:
                  theme.palette.mode === 'dark'
                    ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                    : 'none',
              }}
            >
              <CardContent>
                <Typography variant='h6' sx={{ mb: 3 }}>
                  Employment Type Breakdown
                </Typography>
                <Stack spacing={2}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant='body2'>Salaried</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 100,
                          height: 8,
                          bgcolor: '#e0e0e0',
                          borderRadius: 1,
                          position: 'relative',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${(stats.employmentBreakdown.salaried / stats.totalEligibilityChecks) * 100}%`,
                            height: '100%',
                            bgcolor: '#4caf50',
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                      <Typography variant='body2' sx={{ minWidth: 40 }}>
                        {stats.employmentBreakdown.salaried}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant='body2'>Self-Employed</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 100,
                          height: 8,
                          bgcolor: '#e0e0e0',
                          borderRadius: 1,
                          position: 'relative',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${(stats.employmentBreakdown['self-employed'] / stats.totalEligibilityChecks) * 100}%`,
                            height: '100%',
                            bgcolor: '#ff9800',
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                      <Typography variant='body2' sx={{ minWidth: 40 }}>
                        {stats.employmentBreakdown['self-employed']}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant='body2'>Business</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 100,
                          height: 8,
                          bgcolor: '#e0e0e0',
                          borderRadius: 1,
                          position: 'relative',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${(stats.employmentBreakdown.business / stats.totalEligibilityChecks) * 100}%`,
                            height: '100%',
                            bgcolor: '#2196f3',
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                      <Typography variant='body2' sx={{ minWidth: 40 }}>
                        {stats.employmentBreakdown.business}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card
              sx={{
                height: '100%',
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.8)
                    : theme.palette.background.paper,
                border:
                  theme.palette.mode === 'dark'
                    ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                    : 'none',
              }}
            >
              <CardContent>
                <Typography variant='h6' sx={{ mb: 3 }}>
                  Quick Actions
                </Typography>
                <Stack spacing={2}>
                  <Button
                    variant='contained'
                    size='large'
                    startIcon={<Calculate />}
                    onClick={() => navigate('/banker-eligibility-checker')}
                    sx={{
                      background:
                        theme.palette.mode === 'dark'
                          ? `linear-gradient(45deg, ${alpha('#1976d2', 0.8)} 30%, ${alpha('#42a5f5', 0.8)} 90%)`
                          : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                      '&:hover': {
                        background:
                          theme.palette.mode === 'dark'
                            ? `linear-gradient(45deg, ${alpha('#1565c0', 0.9)} 30%, ${alpha('#1e88e5', 0.9)} 90%)`
                            : 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                      },
                      border:
                        theme.palette.mode === 'dark'
                          ? `1px solid ${alpha('#1976d2', 0.3)}`
                          : 'none',
                    }}
                  >
                    Launch Eligibility Assessment Tool
                  </Button>
                  <Divider />
                  <Alert
                    severity='info'
                    variant='outlined'
                    sx={{
                      bgcolor:
                        theme.palette.mode === 'dark'
                          ? alpha(theme.palette.info.main, 0.1)
                          : undefined,
                      borderColor:
                        theme.palette.mode === 'dark'
                          ? alpha(theme.palette.info.main, 0.3)
                          : undefined,
                    }}
                  >
                    Use the Eligibility Assessment Tool to evaluate customers with custom FOIR
                    settings according to your bank&apos;s lending policies.
                  </Alert>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </>
      )}

      {/* Assessment Manager Tab */}
      {currentTab === 1 && <AssessmentManager />}
    </Container>
  );
};

export default BankerDashboardPage;
