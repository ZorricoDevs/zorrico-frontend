import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Stack,
  Divider
} from '@mui/material';
import {
  Person,
  Email,
  Visibility,
  VisibilityOff,
  Login,
  Home,
  CheckCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import FinanceLoader from '../components/UI/FinanceLoader';
import { authAPI } from '../services/authApi';

const CustomerLoginPage: React.FC = () => {
  const navigate = useNavigate();

  // Always call hooks first - React hooks rules
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Always call useAuth hook - handle errors in the hook implementation or with error boundaries
  const { setUser, isLoading: authLoading } = useAuth();

  // Handle authentication errors after hooks are called
  useEffect(() => {
    // Any auth initialization errors would be handled here if needed
  }, []);

  // Show loading while auth context initializes
  if (authLoading) {
    return <FinanceLoader />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call the actual authentication API
      const response = await authAPI.login({
        email: credentials.email,
        password: credentials.password
      });

      // Store the token
      localStorage.setItem('token', response.token);

      // Create user object for context - map customer role
      const userRole = response.user.role === 'customer' ? 'user' : response.user.role;
      const customerUser = {
        id: response.user.id,
        name: `${response.user.firstName} ${response.user.lastName}`,
        email: response.user.email,
        role: userRole as 'user',
        userType: 'customer' as const,
        status: 'approved' as const,
        avatar: ''
      };

      // Set user in context
      setUser(customerUser);

      // Navigate to customer dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Invalid customer credentials. Please check your email and password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card elevation={10} sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2,
              p: 2,
              backgroundColor: '#1976d2',
              borderRadius: '50%',
              width: 80,
              height: 80,
              margin: '0 auto'
            }}>
              <Person sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
              Customer Login
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Access your loan applications and account
            </Typography>
          </Box>

          <Stack spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#28a745' }}>
              <Home fontSize="small" />
              <Typography variant="caption">
                Track your home loan applications
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
              <CheckCircle fontSize="small" />
              <Typography variant="caption">
                View application status and documents
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                required
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#1976d2' }} />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={<Login />}
                sx={{
                  py: 2,
                  backgroundColor: '#1976d2',
                  '&:hover': { backgroundColor: '#1565c0' }
                }}
              >
                {isLoading ? 'Authenticating...' : 'Login'}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Don&apos;t have an account? Contact your loan officer
            </Typography>
            <br />
            <Typography variant="caption" sx={{ color: '#666' }}>
              All registrations are processed by our admin team
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CustomerLoginPage;
