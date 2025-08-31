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
  Divider,
} from '@mui/material';
import {
  AccountBalance,
  Email,
  Visibility,
  VisibilityOff,
  Login,
  Security,
  Assessment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/authApi';

const BankerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
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
        password: credentials.password,
      });

      // Check if user has banker role
      if (response.user.role !== 'banker') {
        setError('Access denied. Banker account required.');
        setIsLoading(false);
        return;
      }

      // Store the token
      localStorage.setItem('token', response.token);

      // Create user object for context
      const bankerUser = {
        id: response.user.id,
        name: `${response.user.firstName} ${response.user.lastName}`,
        email: response.user.email,
        role: 'user' as const,
        userType: 'banker' as const,
        status: 'approved' as const,
        avatar: '',
      };

      // Set user in context
      setUser(bankerUser);

      // Navigate to banker dashboard
      navigate('/banker-dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Invalid banker credentials. Please check your email and password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth='sm' sx={{ py: 8 }}>
      <Card elevation={10} sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2,
                p: 2,
                backgroundColor: '#1976d2',
                borderRadius: '50%',
                width: 80,
                height: 80,
                margin: '0 auto',
              }}
            >
              <AccountBalance sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
              Banker Login
            </Typography>
            <Typography variant='body1' sx={{ color: '#666' }}>
              Access Professional Lending Tools
            </Typography>
          </Box>

          {error && (
            <Alert severity='error' sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component='form' onSubmit={handleLogin}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label='Banker Email'
                type='email'
                value={credentials.email}
                onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                required
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Email sx={{ color: '#1976d2' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label='Password'
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                required
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                size='large'
                disabled={isLoading}
                startIcon={<Login />}
                sx={{
                  py: 2,
                  backgroundColor: '#1976d2',
                  '&:hover': { backgroundColor: '#1565c0' },
                }}
              >
                {isLoading ? 'Authenticating...' : 'Login as Banker'}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant='h6' sx={{ color: '#1976d2', mb: 2 }}>
              Banker Portal Features
            </Typography>
            <Stack direction='row' spacing={2} justifyContent='center' flexWrap='wrap'>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Security sx={{ color: '#4caf50', mr: 1, fontSize: 20 }} />
                <Typography variant='body2'>Custom FOIR Settings</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Assessment sx={{ color: '#4caf50', mr: 1, fontSize: 20 }} />
                <Typography variant='body2'>Risk Assessment</Typography>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant='caption' sx={{ color: '#666' }}>
              Authorized Personnel Only
            </Typography>
            <br />
            <Typography variant='caption' sx={{ color: '#666' }}>
              All sessions are monitored and logged
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BankerLoginPage;
