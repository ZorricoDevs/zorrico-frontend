import React from 'react';
import { Typography, Stack, Box, Paper, Alert } from '@mui/material';
import { Security, VerifiedUser, Lock, Shield } from '@mui/icons-material';
import GenericPage from '../components/UI/GenericPage';

const SecurityDisclosurePage: React.FC = () => {
  const content = (
    <Stack spacing={4}>
      <Typography variant='h5' component='h2' sx={{ color: '#304FFE', fontWeight: 600 }}>
        Security Disclosure & Data Protection
      </Typography>

      <Alert severity='info' sx={{ mb: 3 }}>
        <Typography variant='body2'>
          <strong>Last Updated:</strong> July 2025 | <strong>Security Framework:</strong> ISO
          27001:2022 Certified
        </Typography>
      </Alert>

      <Typography variant='body1' paragraph>
        Zorrico takes security seriously. We employ bank-grade security measures to protect your
        sensitive financial information and maintain the highest standards of data protection as
        required by Indian regulations.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3,
          mb: 4,
        }}
      >
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center', border: '2px solid #e3f2fd' }}>
          <Security sx={{ color: '#1976d2', fontSize: 48, mb: 2 }} />
          <Typography variant='h6' sx={{ fontWeight: 600, mb: 1 }}>
            ISO 27001:2022
          </Typography>
          <Typography variant='body2' sx={{ color: '#666' }}>
            Certified Information Security Management System
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, textAlign: 'center', border: '2px solid #e8f5e8' }}>
          <VerifiedUser sx={{ color: '#28a745', fontSize: 48, mb: 2 }} />
          <Typography variant='h6' sx={{ fontWeight: 600, mb: 1 }}>
            Indian regulations
          </Typography>
          <Typography variant='body2' sx={{ color: '#666' }}>
            Fully compliant with Indian regulations
          </Typography>
        </Paper>
      </Box>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          Security Framework Overview
        </Typography>

        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Lock sx={{ color: '#1976d2', mt: 0.5 }} />
            <Box>
              <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
                Data Encryption
              </Typography>
              <Typography variant='body2' sx={{ color: '#666' }}>
                All data transmission uses 256-bit SSL/TLS encryption. Data at rest is encrypted
                using AES-256 encryption standards, ensuring your information remains secure
                throughout its lifecycle.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Shield sx={{ color: '#28a745', mt: 0.5 }} />
            <Box>
              <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
                Multi-Layer Security
              </Typography>
              <Typography variant='body2' sx={{ color: '#666' }}>
                Our infrastructure employs multiple security layers including firewalls, intrusion
                detection systems, DDoS protection, and regular security audits by certified
                third-party experts.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <VerifiedUser sx={{ color: '#ff9800', mt: 0.5 }} />
            <Box>
              <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
                Access Controls
              </Typography>
              <Typography variant='body2' sx={{ color: '#666' }}>
                Strict role-based access controls ensure only authorized personnel can access
                systems. Multi-factor authentication is mandatory for all administrative access.
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          Data Protection Measures
        </Typography>

        <Box
          sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}
        >
          <Box>
            <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2, color: '#28a745' }}>
              Technical Safeguards
            </Typography>
            <Stack spacing={1}>
              <Typography variant='body2'>• Advanced threat detection and monitoring</Typography>
              <Typography variant='body2'>• Regular security updates and patches</Typography>
              <Typography variant='body2'>• Automated backup and disaster recovery</Typography>
              <Typography variant='body2'>
                • Network segregation and isolated environments
              </Typography>
              <Typography variant='body2'>
                • Vulnerability scanning and penetration testing
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2, color: '#dc3545' }}>
              Operational Safeguards
            </Typography>
            <Stack spacing={1}>
              <Typography variant='body2'>• Employee background verification</Typography>
              <Typography variant='body2'>• Regular security awareness training</Typography>
              <Typography variant='body2'>• Incident response and management procedures</Typography>
              <Typography variant='body2'>• Secure development lifecycle practices</Typography>
              <Typography variant='body2'>• Third-party vendor security assessments</Typography>
            </Stack>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography
          variant='h6'
          sx={{ color: '#1976d2', fontWeight: 600, mb: 3, textAlign: 'center' }}
        >
          Compliance & Certifications
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
            alignItems: 'center',
          }}
        >
          <Paper elevation={1} sx={{ p: 2, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
            <Typography variant='subtitle2' sx={{ fontWeight: 600, color: '#1976d2' }}>
              ISO 27001:2022
            </Typography>
            <Typography variant='caption' sx={{ color: '#666' }}>
              Information Security
            </Typography>
          </Paper>

          <Paper elevation={1} sx={{ p: 2, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
            <Typography variant='subtitle2' sx={{ fontWeight: 600, color: '#ff9800' }}>
              Data Protection
            </Typography>
            <Typography variant='caption' sx={{ color: '#666' }}>
              PCI DSS Level 1
            </Typography>
          </Paper>

          <Paper elevation={1} sx={{ p: 2, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
            <Typography variant='subtitle2' sx={{ fontWeight: 600, color: '#dc3545' }}>
              SOC 2 Type II
            </Typography>
            <Typography variant='caption' sx={{ color: '#666' }}>
              Security Controls
            </Typography>
          </Paper>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          Incident Response
        </Typography>

        <Typography variant='body2' paragraph sx={{ color: '#666' }}>
          We maintain a comprehensive incident response plan to address any security concerns:
        </Typography>

        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: '#1976d2',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              1
            </Box>
            <Typography variant='body2'>
              <strong>Detection:</strong> 24/7 monitoring systems for immediate threat
              identification
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: '#28a745',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              2
            </Box>
            <Typography variant='body2'>
              <strong>Response:</strong> Immediate containment and mitigation procedures
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: '#ff9800',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              3
            </Box>
            <Typography variant='body2'>
              <strong>Communication:</strong> Transparent notification to affected users and
              authorities
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: '#dc3545',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              4
            </Box>
            <Typography variant='body2'>
              <strong>Recovery:</strong> System restoration and preventive measure implementation
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          User Security Best Practices
        </Typography>

        <Typography variant='body2' paragraph sx={{ color: '#666' }}>
          Help us keep your account secure by following these recommendations:
        </Typography>

        <Box
          sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}
        >
          <Stack spacing={1}>
            <Typography variant='body2'>• Use strong, unique passwords</Typography>
            <Typography variant='body2'>
              • Enable two-factor authentication when available
            </Typography>
            <Typography variant='body2'>• Regularly monitor your account activity</Typography>
            <Typography variant='body2'>• Log out from shared or public devices</Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant='body2'>
              • Verify website URLs before entering credentials
            </Typography>
            <Typography variant='body2'>• Report suspicious activities immediately</Typography>
            <Typography variant='body2'>• Keep your devices and browsers updated</Typography>
            <Typography variant='body2'>• Be cautious of phishing emails and calls</Typography>
          </Stack>
        </Box>
      </Paper>

      <Alert severity='warning' sx={{ mb: 3 }}>
        <Typography variant='body2'>
          <strong>Security Incident Reporting:</strong> If you suspect any security incident or
          unauthorized access to your account, please contact our security team immediately at
          security@Zorrico.com or call our 24/7 helpline.
        </Typography>
      </Alert>

      <Paper elevation={2} sx={{ p: 4, backgroundColor: '#f8f9fa' }}>
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          Contact Security Team
        </Typography>

        <Stack spacing={2}>
          <Typography variant='body2'>
            <strong>Security Email:</strong> service@zorrico.com
          </Typography>
          <Typography variant='body2'>
            <strong>Emergency Hotline:</strong> +91 84228 89910 (24/7)
          </Typography>
          <Typography variant='body2'>
            <strong>Response Time:</strong> Critical incidents within 1 hour, non-critical within 24
            hours
          </Typography>
          <Typography variant='body2'>
            <strong>Security Officer:</strong> Chief Information Security Officer (CISO)
          </Typography>
        </Stack>
      </Paper>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant='body2' sx={{ color: '#666', fontStyle: 'italic' }}>
          Our security measures are regularly audited and updated to meet evolving threats and
          regulatory requirements.
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <GenericPage
      title='Security Disclosure'
      content={content}
      breadcrumb='Data Security & Protection'
    />
  );
};

export default SecurityDisclosurePage;
