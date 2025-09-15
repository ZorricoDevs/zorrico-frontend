import React from 'react';
import { Typography, Stack, Box, Paper, useTheme } from '@mui/material';
import { Gavel, Shield } from '@mui/icons-material';
import GenericPage from '../components/UI/GenericPage';
import SEOHead from '../components/SEO/SEOHead';

const TermsOfUsePage: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const content = (
    <Stack spacing={4}>
      <Typography variant='h5' component='h2' sx={{ color: '#304FFE', fontWeight: 600 }}>
        Terms of Use
      </Typography>

      <Typography
        variant='body2'
        sx={{ color: isDarkMode ? '#b0b0b0' : '#666', fontStyle: 'italic' }}
      >
        Last updated: July 2025
      </Typography>

      <Typography variant='body1' paragraph sx={{ color: isDarkMode ? '#e0e0e0' : '#333' }}>
        Welcome to Zorrico. These Terms of Use (&quot;Terms&quot;) govern your use of our website,
        mobile application, and services. By accessing or using our platform, you agree to be bound
        by these Terms.
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
          <Gavel sx={{ color: '#1976d2', fontSize: 40, mb: 2 }} />
          <Typography
            variant='h6'
            sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#fff' : '#333' }}
          >
            Legal Compliance
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
            Fully compliant with Indian laws and regulations
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
          <Shield sx={{ color: '#28a745', fontSize: 40, mb: 2 }} />
          <Typography
            variant='h6'
            sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#fff' : '#333' }}
          >
            User Protection
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
            Clear terms protecting both users and platform
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
          1. Acceptance of Terms
        </Typography>

        <Typography variant='body2' paragraph sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
          By using Zorrico&apos;s services, you acknowledge that you have read, understood, and
          agree to be bound by these Terms. If you do not agree to these Terms, please do not use
          our services.
        </Typography>

        <Typography variant='body2' paragraph sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
          We reserve the right to modify these Terms at any time. Changes will be effective
          immediately upon posting. Your continued use of our services constitutes acceptance of the
          modified Terms.
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
          2. Service Description
        </Typography>

        <Typography variant='body2' paragraph sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
          Zorrico is a digital platform that facilitates home loan applications by:
        </Typography>

        <Stack spacing={2}>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
            • <strong>Loan Comparison:</strong> Comparing offers from multiple banks and NBFCs
          </Typography>
          <Typography variant='body2'>
            • <strong>Application Processing:</strong> Facilitating loan applications and
            documentation
          </Typography>
          <Typography variant='body2'>
            • <strong>Advisory Services:</strong> Providing loan-related guidance and support
          </Typography>
          <Typography variant='body2'>
            • <strong>Tools & Calculators:</strong> Offering EMI calculators and eligibility
            checkers
          </Typography>
        </Stack>

        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: '#fff3cd',
            borderRadius: 1,
            border: '1px solid #ffeaa7',
          }}
        >
          <Typography variant='body2' sx={{ fontWeight: 600 }}>
            Important: Zorrico is a loan aggregator and technology platform. We do not lend money
            directly.
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          3. User Eligibility and Account
        </Typography>

        <Stack spacing={2}>
          <Typography variant='body2'>
            • You must be at least 18 years old and legally capable of entering into contracts
          </Typography>
          <Typography variant='body2'>• You must be a resident of India</Typography>
          <Typography variant='body2'>
            • You agree to provide accurate and complete information
          </Typography>
          <Typography variant='body2'>
            • You are responsible for maintaining the confidentiality of your account credentials
          </Typography>
          <Typography variant='body2'>• One person may maintain only one active account</Typography>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          4. Permitted Use
        </Typography>

        <Typography variant='body2' paragraph>
          You may use our services for legitimate home loan requirements. You agree not to:
        </Typography>

        <Stack spacing={2}>
          <Typography variant='body2'>
            • Provide false, misleading, or incomplete information
          </Typography>
          <Typography variant='body2'>
            • Use the platform for any illegal or unauthorized purpose
          </Typography>
          <Typography variant='body2'>
            • Attempt to gain unauthorized access to our systems
          </Typography>
          <Typography variant='body2'>
            • Interfere with or disrupt the operation of our services
          </Typography>
          <Typography variant='body2'>
            • Use automated systems to access our platform without permission
          </Typography>
          <Typography variant='body2'>
            • Copy, reproduce, or distribute our content without authorization
          </Typography>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          5. Loan Processing and Approval
        </Typography>

        <Stack spacing={2}>
          <Typography variant='body2'>
            • <strong>No Guarantee:</strong> We do not guarantee loan approval or specific terms
          </Typography>
          <Typography variant='body2'>
            • <strong>Lender Discretion:</strong> Final loan decisions rest with the respective
            lenders
          </Typography>
          <Typography variant='body2'>
            • <strong>Documentation:</strong> You must provide accurate documents as requested
          </Typography>
          <Typography variant='body2'>
            • <strong>Credit Checks:</strong> Lenders may perform credit checks that may affect your
            credit score
          </Typography>
          <Typography variant='body2'>
            • <strong>Processing Time:</strong> Loan processing times depend on lender policies and
            documentation
          </Typography>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          6. Fees and Charges
        </Typography>

        <Stack spacing={2}>
          <Typography variant='body2'>
            • <strong>Platform Services:</strong> Our comparison and application services are free
            for customers
          </Typography>
          <Typography variant='body2'>
            • <strong>Lender Charges:</strong> Processing fees, legal charges, and other costs are
            as per lender terms
          </Typography>
          <Typography variant='body2'>
            • <strong>Third-party Services:</strong> Additional services may have separate charges
          </Typography>
          <Typography variant='body2'>
            • <strong>Transparency:</strong> All applicable charges will be clearly disclosed
          </Typography>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          7. Limitation of Liability
        </Typography>

        <Typography variant='body2' paragraph>
          Zorrico shall not be liable for:
        </Typography>

        <Stack spacing={2}>
          <Typography variant='body2'>
            • Loan rejection, delays, or changes in terms by lenders
          </Typography>
          <Typography variant='body2'>
            • Any direct, indirect, incidental, or consequential damages
          </Typography>
          <Typography variant='body2'>
            • Errors or omissions in information provided by third parties
          </Typography>
          <Typography variant='body2'>• Technical issues, system downtime, or data loss</Typography>
          <Typography variant='body2'>
            • Actions or decisions made by partner banks and financial institutions
          </Typography>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          8. Intellectual Property
        </Typography>

        <Stack spacing={2}>
          <Typography variant='body2'>
            • All content, logos, and trademarks belong to Zorrico or its licensors
          </Typography>
          <Typography variant='body2'>
            • You may not use our intellectual property without written permission
          </Typography>
          <Typography variant='body2'>
            • User-generated content remains your property but grants us usage rights
          </Typography>
          <Typography variant='body2'>
            • We respect intellectual property rights and expect users to do the same
          </Typography>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          9. Termination
        </Typography>

        <Typography variant='body2' paragraph>
          We may terminate or suspend your account at any time for:
        </Typography>

        <Stack spacing={2}>
          <Typography variant='body2'>• Violation of these Terms of Use</Typography>
          <Typography variant='body2'>• Fraudulent or suspicious activity</Typography>
          <Typography variant='body2'>• Misuse of our platform or services</Typography>
          <Typography variant='body2'>• Legal or regulatory requirements</Typography>
        </Stack>

        <Typography variant='body2' sx={{ mt: 2 }}>
          You may also close your account at any time by contacting our support team.
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          10. Governing Law and Disputes
        </Typography>

        <Stack spacing={2}>
          <Typography variant='body2'>• These Terms are governed by the laws of India</Typography>
          <Typography variant='body2'>
            • Courts in Delhi/NCR shall have exclusive jurisdiction for any disputes
          </Typography>
          <Typography variant='body2'>
            • We encourage resolving disputes through mutual discussion first
          </Typography>
          <Typography variant='body2'>
            • Alternative dispute resolution methods may be used before litigation
          </Typography>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 4, backgroundColor: '#f8f9fa' }}>
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          Contact Information
        </Typography>

        <Typography variant='body2' paragraph>
          For questions about these Terms of Use, please contact us:
        </Typography>

        <Stack spacing={1}>
          <Typography variant='body2'>
            <strong>Email:</strong> legal@Zorrico.com
          </Typography>
          <Typography variant='body2'>
            <strong>Phone:</strong> 1800-200-3344
          </Typography>
          <Typography variant='body2'>
            <strong>Address:</strong> Zorrico Technologies Pvt. Ltd., 123 Business District, Sector
            62, Noida - 201301
          </Typography>
        </Stack>
      </Paper>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant='body2' sx={{ color: '#666' }}>
          By using our services, you acknowledge that you have read and understood these Terms of
          Use.
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <>
      <SEOHead page='termsOfUse' />
      <GenericPage
        title='Terms of Use - Zorrico'
        content={content}
        breadcrumb='Legal Terms & Conditions'
      />
    </>
  );
};

export default TermsOfUsePage;
