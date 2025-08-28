import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { userApi, UpdateProfileData, UserProfile } from '../services/userApi';

const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'customer',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
    },
    occupation: '',
    monthlyIncome: 0,
    employmentType: '',
    companyName: '',
    workExperience: '',
    panNumber: '',
    aadharNumber: '',
    isVerified: false,
    createdAt: '',
    updatedAt: '',
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

  // Load profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const profile = await userApi.getProfile();
        setProfileData(profile);
      } catch (error) {
        console.error('Failed to load profile:', error);
        showSnackbar('Failed to load profile data', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const updateData: UpdateProfileData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        dateOfBirth: profileData.dateOfBirth,
        address: profileData.address,
        occupation: profileData.occupation,
        monthlyIncome: profileData.monthlyIncome,
        employmentType: profileData.employmentType,
        companyName: profileData.companyName,
        workExperience: profileData.workExperience,
        panNumber: profileData.panNumber,
        aadharNumber: profileData.aadharNumber,
      };

      const updatedProfile = await userApi.updateProfile(updateData);
      setProfileData(updatedProfile);
      setIsEditing(false);

      // Update auth context with new user data
      if (setUser) {
        setUser({
          ...user!,
          firstName: updatedProfile.firstName,
          lastName: updatedProfile.lastName,
          phone: updatedProfile.phone,
        });
      }

      showSnackbar('Profile updated successfully!', 'success');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      showSnackbar(error?.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle profile picture upload
      // This would typically involve uploading to a service and getting a URL
      const reader = new FileReader();
      reader.onload = e => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading && !profileData._id) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          My Profile
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Manage your personal information and account settings
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Profile Picture and Basic Info */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar sx={{ width: 120, height: 120 }}>
                  {profileData.firstName?.[0]}
                  {profileData.lastName?.[0]}
                </Avatar>
                {isEditing && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'primary.main',
                      '&:hover': { backgroundColor: 'primary.dark' },
                    }}
                    component='label'
                  >
                    <PhotoCameraIcon sx={{ color: 'white' }} />
                    <input
                      type='file'
                      hidden
                      accept='image/*'
                      onChange={handleProfilePictureChange}
                    />
                  </IconButton>
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant='h5'>
                    {profileData.firstName} {profileData.lastName}
                  </Typography>
                  {profileData.isVerified && (
                    <VerifiedIcon sx={{ color: 'success.main', fontSize: 24 }} />
                  )}
                </Box>
                <Typography variant='body1' color='text.secondary' gutterBottom>
                  {profileData.email}
                </Typography>
                <Chip
                  label={profileData.isVerified ? 'Verified Account' : 'Unverified Account'}
                  color={profileData.isVerified ? 'success' : 'warning'}
                  size='small'
                />
              </Box>
              <Box>
                {isEditing ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant='contained'
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={loading}
                    >
                      Save
                    </Button>
                    <Button variant='outlined' startIcon={<CancelIcon />} onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant='outlined'
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant='h6' sx={{ mb: 3 }}>
              Personal Information
            </Typography>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}
            >
              <TextField
                fullWidth
                label='First Name'
                value={profileData.firstName}
                onChange={e => handleInputChange('firstName', e.target.value)}
                disabled={!isEditing}
                required
              />
              <TextField
                fullWidth
                label='Last Name'
                value={profileData.lastName}
                onChange={e => handleInputChange('lastName', e.target.value)}
                disabled={!isEditing}
                required
              />
              <TextField
                fullWidth
                label='Phone Number'
                value={profileData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
              />
              <TextField
                fullWidth
                label='Date of Birth'
                type='date'
                value={profileData.dateOfBirth}
                onChange={e => handleInputChange('dateOfBirth', e.target.value)}
                disabled={!isEditing}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant='h6' sx={{ mb: 3 }}>
              Address Information
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
              <TextField
                fullWidth
                label='Street Address'
                value={profileData.address?.street || ''}
                onChange={e => handleInputChange('address.street', e.target.value)}
                disabled={!isEditing}
              />
              <Box
                sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}
              >
                <TextField
                  fullWidth
                  label='City'
                  value={profileData.address?.city || ''}
                  onChange={e => handleInputChange('address.city', e.target.value)}
                  disabled={!isEditing}
                />
                <TextField
                  fullWidth
                  label='State'
                  value={profileData.address?.state || ''}
                  onChange={e => handleInputChange('address.state', e.target.value)}
                  disabled={!isEditing}
                />
                <TextField
                  fullWidth
                  label='ZIP Code'
                  value={profileData.address?.zipCode || ''}
                  onChange={e => handleInputChange('address.zipCode', e.target.value)}
                  disabled={!isEditing}
                />
                <TextField
                  fullWidth
                  label='Country'
                  value={profileData.address?.country || 'India'}
                  onChange={e => handleInputChange('address.country', e.target.value)}
                  disabled={!isEditing}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant='h6' sx={{ mb: 3 }}>
              Employment Information
            </Typography>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}
            >
              <TextField
                fullWidth
                label='Occupation'
                value={profileData.occupation}
                onChange={e => handleInputChange('occupation', e.target.value)}
                disabled={!isEditing}
              />
              <TextField
                fullWidth
                label='Company Name'
                value={profileData.companyName}
                onChange={e => handleInputChange('companyName', e.target.value)}
                disabled={!isEditing}
              />
              <TextField
                fullWidth
                label='Monthly Income (₹)'
                type='number'
                value={profileData.monthlyIncome}
                onChange={e => handleInputChange('monthlyIncome', Number(e.target.value))}
                disabled={!isEditing}
              />
              <TextField
                fullWidth
                label='Work Experience (years)'
                value={profileData.workExperience}
                onChange={e => handleInputChange('workExperience', e.target.value)}
                disabled={!isEditing}
              />
              <FormControl fullWidth disabled={!isEditing}>
                <InputLabel>Employment Type</InputLabel>
                <Select
                  value={profileData.employmentType}
                  onChange={e => handleInputChange('employmentType', e.target.value)}
                  label='Employment Type'
                >
                  <MenuItem value=''>Select Employment Type</MenuItem>
                  <MenuItem value='salaried'>Salaried</MenuItem>
                  <MenuItem value='self-employed'>Self-employed</MenuItem>
                  <MenuItem value='business'>Business</MenuItem>
                  <MenuItem value='unemployed'>Unemployed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Document Information */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant='h6' sx={{ mb: 3 }}>
              Document Information
            </Typography>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}
            >
              <TextField
                fullWidth
                label='PAN Number'
                value={profileData.panNumber}
                onChange={e => handleInputChange('panNumber', e.target.value.toUpperCase())}
                disabled={!isEditing}
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
              <TextField
                fullWidth
                label='Aadhar Number'
                value={profileData.aadharNumber}
                onChange={e => handleInputChange('aadharNumber', e.target.value)}
                disabled={!isEditing}
                inputProps={{ maxLength: 12 }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

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

export default ProfilePage;
