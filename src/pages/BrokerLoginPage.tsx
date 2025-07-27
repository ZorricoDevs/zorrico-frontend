import React, { useState } from 'react';
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
  Work,
  Email,
  Visibility,
  VisibilityOff,
  Login,
  TrendingUp,
  Assignment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/authApi';

const BrokerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

      // Check if user has broker role
      if (response.user.role !== 'broker') {
        setError('Access denied. Broker account required.');
        setIsLoading(false);
        return;
      }

      // Store the token
      localStorage.setItem('token', response.token);

      // Create user object for context
      const brokerUser = {
        id: response.user.id,
        name: `${response.user.firstName} ${response.user.lastName}`,
        email: response.user.email,
        role: 'user' as const,
        userType: 'broker' as const,
        status: 'approved' as const,
        avatar: ''
      };

      // Set user in context
      setUser(brokerUser);

      // Navigate to broker dashboard
      navigate('/broker-dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Invalid broker credentials. Please check your email and password.');
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
              backgroundColor: '#ff9800',
              borderRadius: '50%',
              width: 80,
              height: 80,
              margin: '0 auto'
            }}>
              <Work sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800', mb: 1 }}>
              Broker Login
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Access your broker portal and manage clients
            </Typography>
          </Box>

          <Stack spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#28a745' }}>
              <Assignment fontSize="small" />
              <Typography variant="caption">
                Manage client applications and commissions
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
              <TrendingUp fontSize="small" />
              <Typography variant="caption">
                Track performance and earnings
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
                label="Broker Email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                required
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#ff9800' }} />
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
                  backgroundColor: '#ff9800',
                  '&:hover': { backgroundColor: '#f57c00' }
                }}
              >
                {isLoading ? 'Authenticating...' : 'Login as Broker'}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Need broker registration? Contact our admin team
            </Typography>
            <br />
            <Typography variant="caption" sx={{ color: '#666' }}>
              All broker accounts are verified and approved
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BrokerLoginPage;
