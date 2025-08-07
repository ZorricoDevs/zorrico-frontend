import React from 'react';
import { Box, Container, Typography, Link, Stack, Divider, keyframes } from '@mui/material';
import { LocationOn, LinkedIn, Twitter, TrendingUp, Security, Speed } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Footer: React.FC = () => {
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
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e9ecef',
        mt: 'auto',
        py: { xs: 4, sm: 6 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Simplified Background Elements */}
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
            background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05))',
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
            background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.05))',
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
              lg: '2fr 1fr 1fr 1fr 2fr',
            },
            gap: { xs: 3, sm: 4, md: 4, lg: 4 },
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
                gap: 2,
                justifyContent: { xs: 'center', sm: 'flex-start' },
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <img
                src={logo}
                alt='Home Loan Mittra Logo'
                style={{
                  height: '40px',
                  width: 'auto',
                  filter: 'brightness(1.1)',
                }}
              />
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography
                  variant='h5'
                  sx={{
                    fontWeight: 'bold',
                    color: '#1976d2',
                    fontFamily: 'Arial, sans-serif',
                    letterSpacing: '-0.02em',
                    mb: 0.5,
                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  }}
                >
                  Home Loan Mittra
                </Typography>
                <Typography
                  variant='caption'
                  sx={{
                    color: '#6c757d',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  }}
                >
                  Making Home Loans Effortless
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: '#6c757d',
                mt: 2,
                justifyContent: { xs: 'center', sm: 'flex-start' },
                '&:hover': {
                  color: '#1976d2',
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
                  backgroundColor: 'rgba(40, 167, 69, 0.1)',
                  padding: { xs: '4px 8px', sm: '6px 12px' },
                  borderRadius: '12px',
                  '&:hover': {
                    backgroundColor: 'rgba(40, 167, 69, 0.15)',
                    transition: 'background-color 0.3s ease',
                  },
                }}
              >
                <Security sx={{ fontSize: { xs: 14, sm: 16 }, color: '#28a745', mr: 0.5 }} />
                <Typography
                  variant='caption'
                  sx={{
                    color: '#28a745',
                    fontWeight: 600,
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  }}
                >
                  Bank Grade Security
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
                color: '#495057',
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
                    color: '#6c757d',
                    textDecoration: 'none',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: '#1976d2',
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
                color: '#495057',
                mb: 2,
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              Products
            </Typography>
            <Stack spacing={1} alignItems={{ xs: 'center', sm: 'flex-start' }}>
              {[
                { name: 'EMI Calculator', path: '/emi-calculator' },
                { name: 'Home Loans', path: '/homeloans' },
              ].map(item => (
                <Link
                  key={item.name}
                  href={item.path}
                  sx={{
                    color: '#6c757d',
                    textDecoration: 'none',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: '#28a745',
                    },
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Compliance */}
          <Box
            sx={{
              textAlign: { xs: 'center', sm: 'left' },
              gridColumn: { xs: '1', sm: '1', md: '1', lg: '4' },
            }}
          >
            <Typography
              variant='h6'
              sx={{
                fontWeight: 600,
                color: '#495057',
                mb: 2,
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              Compliance
            </Typography>
            <Stack spacing={1} alignItems={{ xs: 'center', sm: 'flex-start' }}>
              {[
                { name: 'Security Disclosure', path: '/securitydisclosure' },
                { name: 'RBI Compliance', path: '/rbicompliance' },
                { name: 'ISO 27001:2022', path: '/iso270012022' },
                { name: 'NBFC Guidelines', path: '/nbfcguidelines' },
              ].map(item => (
                <Link
                  key={item.name}
                  href={item.path}
                  sx={{
                    color: '#6c757d',
                    textDecoration: 'none',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: '#dc3545',
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
              gridColumn: { xs: '1', sm: '2', md: '2', lg: '5' },
            }}
          >
            <Typography
              variant='h6'
              sx={{
                fontWeight: 600,
                color: '#495057',
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
              ].map(item => (
                <Link
                  key={item.name}
                  href={item.path}
                  sx={{
                    color: '#6c757d',
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

            {/* Certification Badges */}
            <Box
              sx={{
                mt: 3,
                display: 'flex',
                gap: { xs: 1, sm: 2 },
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}
            >
              {[
                { label: 'SSL', color: '#1976d2' },
                { label: 'RBI', color: '#28a745' },
                { label: 'ISO', color: '#17a2b8' },
              ].map(badge => (
                <Box
                  key={badge.label}
                  sx={{
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    borderRadius: '50%',
                    backgroundColor: badge.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: { xs: '8px', sm: '10px' },
                    fontWeight: 'bold',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {badge.label}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: { xs: 2, sm: 3 }, borderColor: '#e9ecef' }} />

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
                color: '#6c757d',
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
              }}
            >
              © 2025 HLM Technologies All rights reserved.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 2, sm: 3 },
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {['Privacy Policy', 'Terms of Use'].map(item => (
                <Link
                  key={item}
                  component={RouterLink}
                  to={`/${item.toLowerCase().replace(' ', '')}`}
                  sx={{
                    color: '#6c757d',
                    textDecoration: 'none',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: '#1976d2',
                    },
                  }}
                >
                  {item}
                </Link>
              ))}
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
              { icon: <LinkedIn fontSize='small' />, href: 'https://linkedin.com' },
              { icon: <Twitter fontSize='small' />, href: 'https://twitter.com' },
            ].map(social => (
              <Link
                key={social.href}
                href={social.href}
                target='_blank'
                sx={{
                  color: '#6c757d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#1976d2',
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
