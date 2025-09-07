import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Switch,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Card,
  CardContent,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  AccountBox as AccountBoxIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { userApi } from '../services/userApi';

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  loanUpdates: boolean;
  securityAlerts: boolean;
}

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    loanUpdates: true,
    securityAlerts: true,
  });
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Load notification settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load user settings from API if available
        const settings = await userApi.getNotificationSettings();
        setNotifications(settings);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    if (user) {
      loadSettings();
    }
  }, [user]);

  const handleNotificationChange = async (setting: keyof NotificationSettings, value: boolean) => {
    try {
      const updatedSettings = { ...notifications, [setting]: value };
      setNotifications(updatedSettings);

      await userApi.updateNotificationSettings(updatedSettings);
      showSnackbar('Notification preferences updated', 'success');
    } catch (error) {
      console.error('Failed to update notifications:', error);
      showSnackbar('Failed to update notification preferences', 'error');
      // Revert the change
      setNotifications(notifications);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showSnackbar('New passwords do not match', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showSnackbar('Password must be at least 6 characters long', 'error');
      return;
    }

    try {
      setLoading(true);
      await userApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      setPasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showSnackbar('Password changed successfully', 'success');
    } catch (error: any) {
      console.error('Failed to change password:', error);
      showSnackbar(error?.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await userApi.deleteAccount();
      setDeleteDialog(false);
      showSnackbar('Account deletion request submitted', 'success');
      // Logout user after account deletion request
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      showSnackbar(error?.response?.data?.message || 'Failed to delete account', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Settings
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Manage your application preferences and account settings
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Appearance Settings */}
        <Card>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PaletteIcon sx={{ mr: 1 }} />
                <Typography variant='h6'>Appearance</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControlLabel
                  control={<Switch checked={theme === 'dark'} onChange={toggleTheme} />}
                  label='Dark Mode'
                />
                <Typography variant='body2' color='text.secondary'>
                  Toggle between light and dark theme
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Card>

        {/* Notification Settings */}
        <Card>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <NotificationsIcon sx={{ mr: 1 }} />
                <Typography variant='h6'>Notifications</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.emailNotifications}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleNotificationChange('emailNotifications', e.target.checked)
                      }
                    />
                  }
                  label='Email Notifications'
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.smsNotifications}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleNotificationChange('smsNotifications', e.target.checked)
                      }
                    />
                  }
                  label='SMS Notifications'
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.pushNotifications}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleNotificationChange('pushNotifications', e.target.checked)
                      }
                    />
                  }
                  label='Push Notifications'
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.marketingEmails}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleNotificationChange('marketingEmails', e.target.checked)
                      }
                    />
                  }
                  label='Marketing Emails'
                />
                <Typography variant='body2' color='text.secondary'>
                  Control how you receive notifications about your applications and account updates
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Card>

        {/* Security Settings */}
        <Card>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography variant='h6'>Security</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}
              >
                <Box>
                  <Typography variant='subtitle1' sx={{ mb: 2 }}>
                    Password & Authentication
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant='outlined'
                      startIcon={<LockIcon />}
                      onClick={() => setPasswordDialog(true)}
                      fullWidth
                    >
                      Change Password
                    </Button>
                    <Typography variant='body2' color='text.secondary'>
                      Update your account password to keep your account secure
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant='subtitle1' sx={{ mb: 2 }}>
                    Account Management
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant='outlined'
                      color='error'
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteDialog(true)}
                      fullWidth
                    >
                      Delete Account
                    </Button>
                    <Typography variant='body2' color='text.secondary'>
                      Permanently delete your account and all associated data
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Card>

        {/* Account Overview */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccountBoxIcon sx={{ mr: 1 }} />
              <Typography variant='h6'>Account Overview</Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant='body2' color='text.secondary'>
                  Account Type
                </Typography>
                <Chip label={user?.role || 'Customer'} color='primary' size='small' />
              </Box>
              <Box>
                <Typography variant='body2' color='text.secondary'>
                  Status
                </Typography>
                <Chip label={user?.status || 'Active'} color='success' size='small' />
              </Box>
              <Box>
                <Typography variant='body2' color='text.secondary'>
                  Member Since
                </Typography>
                <Typography variant='body1'>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant='body2' color='text.secondary'>
                  Last Login
                </Typography>
                <Typography variant='body1'>{new Date().toLocaleDateString()}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Password Change Dialog */}
      <Dialog
        open={passwordDialog}
        onClose={() => setPasswordDialog(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label='Current Password'
              type='password'
              value={passwordData.currentPassword}
              onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            />
            <TextField
              fullWidth
              label='New Password'
              type='password'
              value={passwordData.newPassword}
              onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            />
            <TextField
              fullWidth
              label='Confirm New Password'
              type='password'
              value={passwordData.confirmPassword}
              onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button
            onClick={handlePasswordChange}
            variant='contained'
            disabled={
              loading ||
              !passwordData.currentPassword ||
              !passwordData.newPassword ||
              !passwordData.confirmPassword
            }
          >
            {loading ? <CircularProgress size={20} /> : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth='sm' fullWidth>
        <DialogTitle color='error'>Delete Account</DialogTitle>
        <DialogContent>
          <Typography variant='body1' gutterBottom>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            All your data, applications, and settings will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteAccount}
            color='error'
            variant='contained'
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
};

export default Settings;
