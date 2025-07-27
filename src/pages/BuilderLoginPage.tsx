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
  AccountBalance,
  Email,
  Visibility,
  VisibilityOff,
  Login,
  Business,
  Analytics
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/authApi';

const BuilderLoginPage: React.FC = () => {
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

      // Check if user has builder role
      if (response.user.role !== 'builder') {
        setError('Access denied. Builder account required.');
        setIsLoading(false);
        return;
      }

      // Store the token
      localStorage.setItem('token', response.token);

      // Create user object for context
      const builderUser = {
        id: response.user.id,
        name: `${response.user.firstName} ${response.user.lastName}`,
        email: response.user.email,
        role: 'user' as const,
        userType: 'builder' as const,
        status: 'approved' as const,
        avatar: ''
      };

      // Set user in context
      setUser(builderUser);

      // Navigate to builder dashboard
      navigate('/builder-dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Invalid builder credentials. Please check your email and password.');
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
              backgroundColor: '#28a745',
              borderRadius: '50%',
              width: 80,
              height: 80,
              margin: '0 auto'
            }}>
              <AccountBalance sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#28a745', mb: 1 }}>
              Builder Login
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Access your builder portal and manage projects
            </Typography>
          </Box>

          <Stack spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1976d2' }}>
              <Business fontSize="small" />
              <Typography variant="caption">
                Manage project applications and approvals
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ff9800' }}>
              <Analytics fontSize="small" />
              <Typography variant="caption">
                View project portfolio and analytics
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
                label="Builder Email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                required
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#28a745' }} />
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
                  backgroundColor: '#28a745',
                  '&:hover': { backgroundColor: '#218838' }
                }}
              >
                {isLoading ? 'Authenticating...' : 'Login as Builder'}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Institutional builder? Contact our partnership team
            </Typography>
            <br />
            <Typography variant="caption" sx={{ color: '#666' }}>
              All builder accounts require verification and approval
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BuilderLoginPage;
