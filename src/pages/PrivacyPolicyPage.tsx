import React from 'react';
import { Typography, Stack, Box, Paper, useTheme } from '@mui/material';
import { Security, VerifiedUser } from '@mui/icons-material';
import GenericPage from '../components/UI/GenericPage';

const PrivacyPolicyPage: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const content = (
    <Stack spacing={4}>
      <Typography variant='h5' component='h2' sx={{ color: '#304FFE', fontWeight: 600 }}>
        Privacy Policy
      </Typography>

      <Typography
        variant='body2'
        sx={{ color: isDarkMode ? '#b0b0b0' : '#666', fontStyle: 'italic' }}
      >
        Last updated: July 2025
      </Typography>

      <Typography variant='body1' paragraph sx={{ color: isDarkMode ? '#e0e0e0' : '#333' }}>
        At Zorrico, we are committed to protecting your privacy and ensuring the security of your
        personal information. This Privacy Policy explains how we collect, use, share, and protect
        your information when you use our services.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3,
          mb: 4,
        }}
      >
        <Paper
          elevation={isDarkMode ? 0 : 1}
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
            border: isDarkMode ? '1px solid #333' : 'none',
          }}
        >
          <Security sx={{ color: '#1976d2', fontSize: 40, mb: 2 }} />
          <Typography
            variant='h6'
            sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#fff' : '#333' }}
          >
            Bank-Grade Security
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
            256-bit SSL encryption and secure data storage
          </Typography>
        </Paper>

        <Paper
          elevation={isDarkMode ? 0 : 1}
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
            border: isDarkMode ? '1px solid #333' : 'none',
          }}
        >
          <VerifiedUser sx={{ color: '#28a745', fontSize: 40, mb: 2 }} />
          <Typography
            variant='h6'
            sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#fff' : '#333' }}
          >
            RBI Compliant
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
            Fully compliant with RBI guidelines and regulations
          </Typography>
        </Paper>
      </Box>

      <Paper
        elevation={isDarkMode ? 0 : 2}
        sx={{
          p: 4,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
          border: isDarkMode ? '1px solid #333' : 'none',
        }}
      >
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          1. Information We Collect
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography
              variant='subtitle1'
              sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#fff' : '#333' }}
            >
              Personal Information:
            </Typography>
            <Typography variant='body2' paragraph sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
              • Name, email address, phone number, and date of birth
              <br />
              • PAN number, Aadhaar number, and other government IDs
              <br />
              • Employment details, income information, and financial data
              <br />• Property details and loan requirements
            </Typography>
          </Box>

          <Box>
            <Typography
              variant='subtitle1'
              sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#fff' : '#333' }}
            >
              Technical Information:
            </Typography>
            <Typography variant='body2' paragraph sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
              • IP address, browser type, and device information
              <br />
              • Usage patterns, clicks, and navigation data
              <br />• Cookies and similar tracking technologies
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper
        elevation={isDarkMode ? 0 : 2}
        sx={{
          p: 4,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
          border: isDarkMode ? '1px solid #333' : 'none',
        }}
      >
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          2. How We Use Your Information
        </Typography>

        <Stack spacing={2}>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Loan Processing:</strong> To assess eligibility and process your loan
            applications
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Service Delivery:</strong> To provide personalized loan recommendations and
            support
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Communication:</strong> To send updates, notifications, and marketing
            communications
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Compliance:</strong> To meet legal and regulatory requirements
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Improvement:</strong> To enhance our services and user experience
          </Typography>
        </Stack>
      </Paper>

      <Paper
        elevation={isDarkMode ? 0 : 2}
        sx={{
          p: 4,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
          border: isDarkMode ? '1px solid #333' : 'none',
        }}
      >
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          3. Information Sharing
        </Typography>

        <Typography variant='body2' paragraph sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
          We may share your information with:
        </Typography>

        <Stack spacing={2}>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Partner Banks and NBFCs:</strong> To process your loan applications
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Credit Bureaus:</strong> To check and report credit information
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Service Providers:</strong> Third-party vendors who assist in our operations
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Legal Authorities:</strong> When required by law or court orders
          </Typography>
        </Stack>
      </Paper>

      <Paper
        elevation={isDarkMode ? 0 : 2}
        sx={{
          p: 4,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
          border: isDarkMode ? '1px solid #333' : 'none',
        }}
      >
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          4. Data Security
        </Typography>

        <Stack spacing={2}>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Encryption:</strong> All data transmission uses 256-bit SSL encryption
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Storage:</strong> Secure cloud infrastructure with regular backups
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Access Control:</strong> Strict access controls and authentication protocols
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Monitoring:</strong> 24/7 security monitoring and threat detection
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Compliance:</strong> ISO 27001:2022 certified security management
          </Typography>
        </Stack>
      </Paper>

      <Paper
        elevation={isDarkMode ? 0 : 2}
        sx={{
          p: 4,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
          border: isDarkMode ? '1px solid #333' : 'none',
        }}
      >
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          5. Your Rights
        </Typography>

        <Typography variant='body2' paragraph sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
          You have the right to:
        </Typography>

        <Stack spacing={2}>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Access:</strong> Request a copy of your personal data
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Correction:</strong> Update or correct inaccurate information
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Deletion:</strong> Request deletion of your data (subject to legal
            requirements)
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Portability:</strong> Receive your data in a structured format
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Opt-out:</strong> Unsubscribe from marketing communications
          </Typography>
        </Stack>
      </Paper>

      <Paper
        elevation={isDarkMode ? 0 : 2}
        sx={{
          p: 4,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
          border: isDarkMode ? '1px solid #333' : 'none',
        }}
      >
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          6. Cookies and Tracking
        </Typography>

        <Typography variant='body2' paragraph sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
          We use cookies and similar technologies to:
        </Typography>

        <Stack spacing={1}>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • Improve website functionality and user experience
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • Analyze usage patterns and website performance
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • Personalize content and recommendations
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • Deliver targeted advertisements
          </Typography>
        </Stack>

        <Typography variant='body2' sx={{ mt: 2, color: isDarkMode ? '#e0e0e0' : '#555' }}>
          You can control cookie settings through your browser preferences.
        </Typography>
      </Paper>

      <Paper
        elevation={isDarkMode ? 0 : 2}
        sx={{
          p: 4,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
          border: isDarkMode ? '1px solid #333' : 'none',
        }}
      >
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          7. Data Retention
        </Typography>

        <Typography variant='body2' paragraph sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
          We retain your information for as long as necessary to:
        </Typography>

        <Stack spacing={1}>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • Provide our services and support
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • Comply with legal and regulatory requirements
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • Resolve disputes and enforce our agreements
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • Improve our services and prevent fraud
          </Typography>
        </Stack>
      </Paper>

      <Paper
        elevation={isDarkMode ? 0 : 2}
        sx={{
          p: 4,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
          border: isDarkMode ? '1px solid #333' : 'none',
        }}
      >
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          Contact Us
        </Typography>

        <Typography variant='body2' paragraph sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
          For any privacy-related questions or concerns, please contact us:
        </Typography>

        <Stack spacing={1}>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            <strong>Email:</strong> privacy@Zorrico.com
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            <strong>Phone:</strong> 1800-200-3344
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            <strong>Address:</strong> Zorrico Technologies Pvt. Ltd., 123 Business District, Sector
            62, Noida - 201301
          </Typography>
        </Stack>
      </Paper>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant='body2' sx={{ color: '#666' }}>
          This Privacy Policy may be updated from time to time. We will notify you of any
          significant changes.
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <GenericPage title='Privacy Policy' content={content} breadcrumb='Privacy & Data Protection' />
  );
};

export default PrivacyPolicyPage;
