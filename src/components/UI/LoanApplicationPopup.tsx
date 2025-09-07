import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
  Link,
  useTheme,
} from '@mui/material';
import { Close, Email, Phone, Person, Work } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { loanAPI } from '../../services/api';
import { MetaPixelTracker } from '../../utils/metaPixel';

interface LoanApplicationPopupProps {
  open: boolean;
  onClose: () => void;
  showEligibilitySummary?: boolean;
  eligibilityData?: {
    maxLoanAmount: number;
    emi: number;
  } | null;
  selectedBank?: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  panNumber: string;
  occupation: string;
  companyName: string;
  workExperience: string;
  currentAddress: string;
  propertyLocation: string;
  bankName: string;
  acceptedTerms: boolean;
}

const LoanApplicationPopup: React.FC<LoanApplicationPopupProps> = ({
  open,
  onClose,
  showEligibilitySummary = false,
  eligibilityData = null,
  selectedBank = '',
}) => {
  const theme = useTheme();

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    panNumber: '',
    occupation: '',
    companyName: '',
    workExperience: '',
    currentAddress: '',
    propertyLocation: '',
    bankName: selectedBank,
    acceptedTerms: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleFormSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (!formData.fullName || !formData.email || !formData.phone) {
        setSnackbar({
          open: true,
          message: 'Please fill in all required fields',
          severity: 'error',
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setSnackbar({
          open: true,
          message: 'Please enter a valid email address',
          severity: 'error',
        });
        return;
      }

      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        setSnackbar({
          open: true,
          message: 'Please enter a valid 10-digit phone number',
          severity: 'error',
        });
        return;
      }

      if (!formData.acceptedTerms) {
        setSnackbar({
          open: true,
          message: 'Please accept the Terms & Conditions to proceed',
          severity: 'error',
        });
        return;
      }

      const applicationData = {
        ...formData,
        source: showEligibilitySummary ? 'eligibility-checker' : 'homepage',
        timestamp: new Date().toISOString(),
        eligibilityDetails:
          showEligibilitySummary && eligibilityData
            ? {
                eligibleAmount: formatCurrency(eligibilityData.maxLoanAmount),
                monthlyEMI: formatCurrency(eligibilityData.emi),
              }
            : null,
      };

      // Show immediate feedback
      setSnackbar({
        open: true,
        message: 'Submitting...',
        severity: 'info',
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const result = await Promise.race([
        loanAPI.submitEligibilityForm(applicationData),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 5000)),
      ]);

      clearTimeout(timeoutId);

      if (result.success) {
        // Reset form data immediately
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          panNumber: '',
          occupation: '',
          companyName: '',
          workExperience: '',
          currentAddress: '',
          propertyLocation: '',
          bankName: selectedBank,
          acceptedTerms: false,
        });

        // Show success message and close dialog quickly
        setSnackbar({
          open: true,
          message: 'Application submitted successfully! Our team will contact you within 24 hours.',
          severity: 'success',
        });

        // Track Lead event with Meta Pixel
        MetaPixelTracker.trackLead({
          email: formData.email,
          phone: formData.phone,
          first_name: formData.fullName.split(' ')[0],
          last_name: formData.fullName.split(' ').slice(1).join(' '),
        });

        // Close dialog immediately for better UX
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        throw new Error(result.message || 'Failed to submit application');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);

      let errorMessage = 'Failed to submit application. Please try again.';
      if (error?.message === 'Request timeout') {
        errorMessage =
          'Request is taking longer than expected. Your application may still be processed.';
      } else if (error?.response?.status === 500) {
        errorMessage = 'Server error. Please try again in a few moments.';
      } else if (error?.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth='md'
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            maxHeight: '90vh',
            background: theme => (theme.palette.mode === 'dark' ? '#23272f' : '#fff'),
            color: theme => (theme.palette.mode === 'dark' ? '#fff' : '#23272f'),
            boxShadow: 24,
            p: 0,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme => (theme.palette.mode === 'dark' ? '#1976d2' : '#e3f2fd'),
            color: theme => (theme.palette.mode === 'dark' ? '#fff' : '#1976d2'),
            py: 2.5,
            px: 3,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            Apply for Home Loan
            <Typography variant='body2' sx={{ opacity: 0.9, mt: 0.5 }}>
              Get competitive offers from our partner banks
            </Typography>
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ color: theme => (theme.palette.mode === 'dark' ? '#fff' : '#1976d2') }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, sm: 3 }, background: 'none' }}>
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant='h6'
                sx={{
                  mb: 2,
                  color: theme => (theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2'),
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 700,
                }}
              >
                <Person sx={{ mr: 1 }} />
                Personal Information
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2.5,
                mb: 3,
              }}
            >
              <TextField
                label='Full Name *'
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                fullWidth
                size='small'
                variant='outlined'
                sx={{ mb: { xs: 2, md: 0 } }}
              />

              <TextField
                label='Email Address *'
                type='email'
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                size='small'
                variant='outlined'
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: '#666' }} />,
                }}
                sx={{ mb: { xs: 2, md: 0 } }}
              />

              <TextField
                label='Phone Number *'
                value={formData.phone}
                onChange={e =>
                  setFormData({
                    ...formData,
                    phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                  })
                }
                fullWidth
                size='small'
                variant='outlined'
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: '#666' }} />,
                }}
                sx={{ mb: { xs: 2, md: 0 } }}
              />

              <TextField
                label='PAN Number (Optional)'
                value={formData.panNumber}
                onChange={e =>
                  setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })
                }
                fullWidth
                size='small'
                variant='outlined'
                inputProps={{ maxLength: 10 }}
                sx={{ mb: { xs: 2, md: 0 } }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant='h6'
                sx={{
                  mb: 2,
                  color: theme => (theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2'),
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 700,
                }}
              >
                <Work sx={{ mr: 1 }} />
                Professional Information
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2.5,
                mb: 3,
              }}
            >
              <TextField
                label='Occupation'
                value={formData.occupation}
                onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                fullWidth
                size='small'
                variant='outlined'
                sx={{ mb: { xs: 2, md: 0 } }}
              />

              <TextField
                label='Company Name'
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                fullWidth
                size='small'
                variant='outlined'
                sx={{ mb: { xs: 2, md: 0 } }}
              />

              <TextField
                label='Work Experience (Years)'
                value={formData.workExperience}
                onChange={e => setFormData({ ...formData, workExperience: e.target.value })}
                fullWidth
                size='small'
                variant='outlined'
                sx={{ mb: { xs: 2, md: 0 } }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                label='Current Address'
                value={formData.currentAddress}
                onChange={e => setFormData({ ...formData, currentAddress: e.target.value })}
                fullWidth
                size='small'
                variant='outlined'
                multiline
                rows={2}
                sx={{ mb: 2 }}
              />

              <TextField
                label='Property Location'
                value={formData.propertyLocation}
                onChange={e => setFormData({ ...formData, propertyLocation: e.target.value })}
                fullWidth
                size='small'
                variant='outlined'
                multiline
                rows={2}
              />
            </Box>

            {showEligibilitySummary && eligibilityData && (
              <Paper
                sx={{
                  p: 2.5,
                  backgroundColor: theme => (theme.palette.mode === 'dark' ? '#23272f' : '#f5f5f5'),
                  borderRadius: 2,
                  mt: 3,
                }}
              >
                <Typography
                  variant='h6'
                  sx={{
                    mb: 1.5,
                    color: theme => (theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2'),
                    fontWeight: 700,
                  }}
                >
                  Your Eligibility Summary
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography
                      variant='body2'
                      sx={{
                        color: theme => (theme.palette.mode === 'dark' ? '#bbb' : 'textSecondary'),
                      }}
                    >
                      Eligible Amount:
                    </Typography>
                    <Typography
                      variant='h6'
                      sx={{
                        color: theme =>
                          theme.palette.mode === 'dark' ? '#90caf9' : 'primary.main',
                        fontWeight: 700,
                      }}
                    >
                      {formatCurrency(eligibilityData.maxLoanAmount)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant='body2'
                      sx={{
                        color: theme => (theme.palette.mode === 'dark' ? '#bbb' : 'textSecondary'),
                      }}
                    >
                      Monthly EMI:
                    </Typography>
                    <Typography
                      variant='h6'
                      sx={{
                        color: theme =>
                          theme.palette.mode === 'dark' ? '#90caf9' : 'primary.main',
                        fontWeight: 700,
                      }}
                    >
                      {formatCurrency(eligibilityData.emi)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}

            <Box sx={{ mt: 3, mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.acceptedTerms}
                    onChange={e => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                    color='primary'
                    sx={{ py: 0 }}
                  />
                }
                label={
                  <Typography variant='body2' sx={{ color: '#666', lineHeight: 1.5 }}>
                    I accept the{' '}
                    <Link
                      component={RouterLink}
                      to='/termsofuse'
                      target='_blank'
                      rel='noopener noreferrer'
                      sx={{
                        color: '#1976d2',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link
                      component={RouterLink}
                      to='/privacypolicy'
                      target='_blank'
                      rel='noopener noreferrer'
                      sx={{
                        color: '#1976d2',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Privacy Policy
                    </Link>
                  </Typography>
                }
                sx={{
                  alignItems: 'flex-start',
                  margin: 0,
                  '& .MuiFormControlLabel-label': {
                    paddingTop: '9px',
                  },
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            backgroundColor: theme => (theme.palette.mode === 'dark' ? '#23272f' : '#fafafa'),
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        >
          <Button onClick={onClose} variant='outlined' sx={{ px: 3 }} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            variant='contained'
            sx={{ px: 4, ml: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoanApplicationPopup;
