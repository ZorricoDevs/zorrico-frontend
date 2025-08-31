import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Stack,
  Divider,
  keyframes,
  useTheme,
} from '@mui/material';
import {
  LocationOn,
  LinkedIn,
  Facebook,
  Instagram,
  YouTube,
  TrendingUp,
  Speed,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import logoDark from '../../assets/logo-dark.svg'; // Dark theme logo

const Footer: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Animation keyframes
  const float = keyframes`
    0% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-10px) rotate(120deg); }
    66% { transform: translateY(5px) rotate(240deg); }
    100% { transform: translateY(0px) rotate(360deg); }
  `;

  return (
    <Box
      component='footer'
      sx={{
        backgroundColor: isDark ? '#1e293b' : '#f8f9fa',
        borderTop: `1px solid ${isDark ? '#334155' : '#e9ecef'}`,
        mt: 'auto',
        py: { xs: 4, sm: 6 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Theme-aware Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '80px',
            height: '80px',
            background: isDark
              ? 'linear-gradient(45deg, rgba(96, 165, 250, 0.2), rgba(96, 165, 250, 0.1))'
              : 'linear-gradient(45deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05))',
            borderRadius: '50%',
            animation: `${float} 8s ease-in-out infinite`,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '30%',
            right: '15%',
            width: '60px',
            height: '60px',
            background: isDark
              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))'
              : 'linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.05))',
            borderRadius: '50%',
            animation: `${float} 10s ease-in-out infinite reverse`,
          },
        }}
      />

      <Container maxWidth='xl' sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Main Footer Content */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: '2fr 1fr 1fr 1fr',
            },
            gap: { xs: 3, sm: 4, md: 6, lg: 8 },
            mb: { xs: 3, sm: 4 },
          }}
        >
          {/* Logo and Location */}
          <Box
            sx={{
              gridColumn: { xs: '1', lg: '1' },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Box
              sx={{
                mb: { xs: 2, sm: 3 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}
            >
              <img
                src={isDark ? logoDark : logo}
                alt='Zorrico Logo'
                style={{
                  height: '100px',
                  width: 'auto',
                  maxWidth: '250px',
                }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: isDark ? '#94a3b8' : '#6c757d',
                mt: 2,
                justifyContent: { xs: 'center', sm: 'flex-start' },
                '&:hover': {
                  color: isDark ? '#60a5fa' : '#1976d2',
                  transition: 'color 0.3s ease',
                },
              }}
            >
              <LocationOn sx={{ fontSize: 16, mr: 1 }} />
              <Typography variant='body2'>Mumbai, India</Typography>
            </Box>

            {/* Simplified Stats */}
            <Box
              sx={{
                mt: 3,
                display: 'flex',
                gap: { xs: 1, sm: 2 },
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  padding: { xs: '4px 8px', sm: '6px 12px' },
                  borderRadius: '12px',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.15)',
                    transition: 'background-color 0.3s ease',
                  },
                }}
              >
                <TrendingUp sx={{ fontSize: { xs: 14, sm: 16 }, color: '#1976d2', mr: 0.5 }} />
                <Typography
                  variant='caption'
                  sx={{
                    color: '#1976d2',
                    fontWeight: 600,
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  }}
                >
                  15K+ Loans
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 193, 7, 0.1)',
                  padding: { xs: '4px 8px', sm: '6px 12px' },
                  borderRadius: '12px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 193, 7, 0.15)',
                    transition: 'background-color 0.3s ease',
                  },
                }}
              >
                <Speed sx={{ fontSize: { xs: 14, sm: 16 }, color: '#ffc107', mr: 0.5 }} />
                <Typography
                  variant='caption'
                  sx={{
                    color: '#e6a300',
                    fontWeight: 600,
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  }}
                >
                  24hr Approval
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Company Links */}
          <Box
            sx={{
              textAlign: { xs: 'center', sm: 'left' },
              gridColumn: { xs: '1', sm: '1', md: '2', lg: '2' },
            }}
          >
            <Typography
              variant='h6'
              sx={{
                fontWeight: 600,
                color: isDark ? '#f8fafc' : '#495057',
                mb: 2,
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              Company
            </Typography>
            <Stack spacing={1} alignItems={{ xs: 'center', sm: 'flex-start' }}>
              {['About Us', 'Careers', 'Contact', 'Newsroom'].map(item => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(' ', '')}`}
                  sx={{
                    color: isDark ? '#94a3b8' : '#6c757d',
                    textDecoration: 'none',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: isDark ? '#60a5fa' : '#1976d2',
                    },
                  }}
                >
                  {item}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Products */}
          <Box
            sx={{
              textAlign: { xs: 'center', sm: 'left' },
              gridColumn: { xs: '1', sm: '2', md: '3', lg: '3' },
            }}
          >
            <Typography
              variant='h6'
              sx={{
                fontWeight: 600,
                color: isDark ? '#f8fafc' : '#495057',
                mb: 2,
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              Products
            </Typography>
            <Stack spacing={1} alignItems={{ xs: 'center', sm: 'flex-start' }}>
              {[
                { name: 'EMI Calculator', path: '/emi-calculator' },
                { name: 'Home Loan Eligibility Checker', path: '/eligibility-checker' },
              ].map(item => (
                <Link
                  key={item.name}
                  href={item.path}
                  sx={{
                    color: isDark ? '#94a3b8' : '#6c757d',
                    textDecoration: 'none',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: isDark ? '#22c55e' : '#28a745',
                    },
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Login Portal */}
          <Box
            sx={{
              textAlign: { xs: 'center', sm: 'left' },
              gridColumn: { xs: '1', sm: '2', md: '1', lg: '4' },
            }}
          >
            <Typography
              variant='h6'
              sx={{
                fontWeight: 600,
                color: isDark ? '#f8fafc' : '#495057',
                mb: 2,
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              Login Portal
            </Typography>
            <Stack spacing={1} alignItems={{ xs: 'center', sm: 'flex-start' }}>
              {[
                { name: 'Admin Login', path: '/admin-login', color: '#dc3545' },
                { name: 'Customer Login', path: '/customer-login', color: '#1976d2' },
                { name: 'Broker Login', path: '/broker-login', color: '#ff9800' },
                { name: 'Builder Login', path: '/builder-login', color: '#28a745' },
                { name: 'Banker Login', path: '/banker-login', color: '#6f42c1' },
              ].map(item => (
                <Link
                  key={item.name}
                  href={item.path}
                  sx={{
                    color: isDark ? '#94a3b8' : '#6c757d',
                    textDecoration: 'none',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    '&:hover': {
                      color: item.color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 6, sm: 8 },
                      height: { xs: 6, sm: 8 },
                      borderRadius: '50%',
                      backgroundColor: item.color,
                      mr: 1,
                    }}
                  />
                  {item.name}
                </Link>
              ))}
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: isDark ? '#374151' : '#e9ecef' }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center', sm: 'space-between' },
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 2 },
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 2, sm: 3 },
              alignItems: 'center',
              flexWrap: 'wrap',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
            }}
          >
            <Typography
              variant='body2'
              sx={{
                color: isDark ? '#94a3b8' : '#6c757d',
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
              }}
            >
              © 2025 Zorrico Finance LLP All rights reserved.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 2, sm: 3 },
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {['Privacy Policy', 'Terms of Use'].map(item => {
                const route = item === 'Privacy Policy' ? '/privacypolicy' : '/termsofuse';
                return (
                  <Link
                    key={item}
                    component={RouterLink}
                    to={route}
                    sx={{
                      color: isDark ? '#94a3b8' : '#6c757d',
                      textDecoration: 'none',
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: isDark ? '#60a5fa' : '#1976d2',
                      },
                    }}
                  >
                    {item}
                  </Link>
                );
              })}
            </Box>
          </Box>

          {/* Social Media Icons */}
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 1, sm: 1 },
              justifyContent: 'center',
              mt: { xs: 1, sm: 0 },
            }}
          >
            {[
              {
                icon: <Facebook fontSize='small' />,
                href: 'https://www.facebook.com/profile.php?id=61579629820945',
                color: '#1877f2',
              },
              {
                icon: <Instagram fontSize='small' />,
                href: 'https://www.instagram.com/zorrico_official',
                color: '#e4405f',
              },
              {
                icon: <LinkedIn fontSize='small' />,
                href: 'https://www.linkedin.com/company/zorrico',
                color: '#0a66c2',
              },
              {
                icon: <YouTube fontSize='small' />,
                href: 'https://www.youtube.com/@zorrico',
                color: '#ff0000',
              },
            ].map(social => (
              <Link
                key={social.href}
                href={social.href}
                target='_blank'
                sx={{
                  color: isDark ? '#94a3b8' : '#6c757d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: social.color,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {social.icon}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
