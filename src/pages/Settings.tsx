import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Switch,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Alert,
  Snackbar
} from '@mui/material';
import { useTheme } from '../hooks/useTheme';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false
  });
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('INR');
  const [showAlert, setShowAlert] = useState(false);

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSaveSettings = () => {
    // Save settings logic here
    setShowAlert(true);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Settings
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, flexWrap: 'wrap' }}>
          {/* Appearance Settings */}
          <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '48%' }, mb: { xs: 3, md: 0 } }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Appearance
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={theme === 'dark'}
                      onChange={toggleTheme}
                      color="primary"
                    />
                  }
                  label="Dark Mode"
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    label="Language"
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="hi">हिंदी</MenuItem>
                    <MenuItem value="mr">मराठी</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    label="Currency"
                  >
                    <MenuItem value="INR">Indian Rupee (₹)</MenuItem>
                    <MenuItem value="USD">US Dollar ($)</MenuItem>
                    <MenuItem value="EUR">Euro (€)</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Box>

          {/* Notification Settings */}
          <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '48%' }, mb: { xs: 3, md: 0 } }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Notifications
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.email}
                      onChange={() => handleNotificationChange('email')}
                      color="primary"
                    />
                  }
                  label="Email Notifications"
                  sx={{ mb: 2, display: 'block' }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.sms}
                      onChange={() => handleNotificationChange('sms')}
                      color="primary"
                    />
                  }
                  label="SMS Notifications"
                  sx={{ mb: 2, display: 'block' }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.push}
                      onChange={() => handleNotificationChange('push')}
                      color="primary"
                    />
                  }
                  label="Push Notifications"
                  sx={{ mb: 2, display: 'block' }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.marketing}
                      onChange={() => handleNotificationChange('marketing')}
                      color="primary"
                    />
                  }
                  label="Marketing Communications"
                  sx={{ display: 'block' }}
                />
              </CardContent>
            </Card>
          </Box>

          {/* Security Settings */}
          <Box sx={{ width: '100%', mb: 3 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Security
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '48%' } }}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '48%' } }}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '48%' } }}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button variant="outlined" color="primary">
                    Change Password
                  </Button>
                  <Button variant="outlined" color="secondary">
                    Enable Two-Factor Authentication
                  </Button>
                  <Button variant="outlined" color="warning">
                    Download Account Data
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Save Settings */}
          <Box sx={{ width: '100%', mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" color="secondary">
                Reset to Defaults
              </Button>
              <Button variant="contained" color="primary" onClick={handleSaveSettings}>
                Save All Settings
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Success Alert */}
        <Snackbar
          open={showAlert}
          autoHideDuration={3000}
          onClose={() => setShowAlert(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setShowAlert(false)}
            severity="success"
            sx={{ width: '100%' }}
          >
            Settings saved successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Settings;