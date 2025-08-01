import React from 'react';
import { Box, Container, Typography, TextField, Button, Card, CardContent, Avatar, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();


  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Profile Settings
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Profile Information */}
          <Box sx={{ flex: 2, minWidth: 0, mb: { xs: 3, md: 0 } }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Personal Information
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '48%' } }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={user?.firstName || user?.name?.split(' ')[0] || ''}
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '48%' } }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={user?.lastName || user?.name?.split(' ')[1] || ''}
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 100%', minWidth: '100%' }}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={user?.email || ''}
                      variant="outlined"
                      disabled
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 100%', minWidth: '100%' }}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={user?.phone || ''}
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" color="primary">
                    Save Changes
                  </Button>
                  <Button variant="outlined" color="secondary">
                    Cancel
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Profile Picture */}
          <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 320 } }}>
            <Card>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Profile Picture
                </Typography>

                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    backgroundColor: '#1976d2',
                    fontSize: '2rem'
                  }}
                >
                  {(user?.firstName || user?.name) ? (user?.firstName || user?.name || '').charAt(0).toUpperCase() : 'U'}
                </Avatar>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {user?.firstName || (user?.name ? user.name.split(' ')[0] : '') || ''} {user?.lastName || (user?.name ? user.name.split(' ')[1] : '') || ''}
                </Typography>

                <Button variant="outlined" size="small">
                  Change Picture
                </Button>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card sx={{ mt: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Account Information
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Role:</strong> {user?.role || 'Customer'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Status:</strong> Active
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Member since:</strong> {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePage;
