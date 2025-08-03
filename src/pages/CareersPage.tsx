import React from 'react';
import { Typography, Stack, Box, Paper, Button, useTheme } from '@mui/material';
import { Work, TrendingUp, Schedule } from '@mui/icons-material';
import GenericPage from '../components/UI/GenericPage';

const CareersPage: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const content = (
    <Stack spacing={4}>
      <Typography variant='h5' component='h2' sx={{ color: '#304FFE', fontWeight: 600 }}>
        Join the HomeLoanMittra Team
      </Typography>

      <Typography variant='body1' paragraph>
        Be part of India&apos;s fastest-growing fintech platform that&apos;s revolutionizing the
        home loan industry. We&apos;re looking for passionate individuals who want to make
        homeownership dreams accessible to millions.
      </Typography>

      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
            border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
          }}
        >
          <Work sx={{ color: '#304FFE', fontSize: 40, mb: 2 }} />
          <Typography
            variant='h6'
            sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#fff' : '#2E2E2E' }}
          >
            Innovation First
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
            Work with cutting-edge technology and contribute to products that impact millions of
            users.
          </Typography>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
            border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
          }}
        >
          <TrendingUp sx={{ color: '#00C8C8', fontSize: 40, mb: 2 }} />
          <Typography
            variant='h6'
            sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#fff' : '#2E2E2E' }}
          >
            Growth Opportunities
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
            Fast-track your career with learning opportunities, mentorship, and leadership roles.
          </Typography>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
            border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
          }}
        >
          <Schedule sx={{ color: '#FFA726', fontSize: 40, mb: 2 }} />
          <Typography
            variant='h6'
            sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#fff' : '#2E2E2E' }}
          >
            Work-Life Balance
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
            Flexible working hours, remote options, and a culture that values personal well-being.
          </Typography>
        </Paper>
      </Box>

      <Typography variant='h5' component='h2' sx={{ color: '#304FFE', fontWeight: 600 }}>
        Current Openings
      </Typography>

      <Paper
        elevation={2}
        sx={{
          p: 6,
          textAlign: 'center',
          backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
          border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
          borderRadius: 3,
        }}
      >
        <Work
          sx={{
            fontSize: 60,
            color: isDarkMode ? '#555' : '#ccc',
            mb: 3,
          }}
        />
        <Typography
          variant='h5'
          sx={{
            fontWeight: 600,
            mb: 2,
            color: isDarkMode ? '#fff' : '#2E2E2E',
          }}
        >
          We are not hiring currently
        </Typography>
        <Typography
          variant='body1'
          sx={{
            color: isDarkMode ? '#b0b0b0' : '#666',
            mb: 3,
            maxWidth: 500,
            mx: 'auto',
          }}
        >
          We appreciate your interest in joining our team. While we don&apos;t have any open
          positions at the moment, we encourage you to check back soon for future opportunities.
        </Typography>
        <Button
          variant='outlined'
          sx={{
            color: '#304FFE',
            borderColor: '#304FFE',
            '&:hover': {
              backgroundColor: '#304FFE',
              color: '#fff',
            },
          }}
          onClick={() => (window.location.href = 'mailto:careers@homeloanmittra.com')}
        >
          Send us your resume
        </Button>
      </Paper>

      <Typography variant='h5' component='h2' sx={{ color: '#1976d2', fontWeight: 600 }}>
        Why HomeLoanMittra?
      </Typography>

      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#1976d2',
              mt: 1,
              flexShrink: 0,
            }}
          />
          <Typography variant='body1'>
            <strong>Competitive Compensation:</strong> Market-leading salaries with performance
            bonuses and equity participation.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#1976d2',
              mt: 1,
              flexShrink: 0,
            }}
          />
          <Typography variant='body1'>
            <strong>Learning & Development:</strong> Regular training programs, conference
            attendance, and certification support.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#1976d2',
              mt: 1,
              flexShrink: 0,
            }}
          />
          <Typography variant='body1'>
            <strong>Health & Wellness:</strong> Comprehensive health insurance, wellness programs,
            and mental health support.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#1976d2',
              mt: 1,
              flexShrink: 0,
            }}
          />
          <Typography variant='body1'>
            <strong>Inclusive Culture:</strong> Diverse team, equal opportunities, and a supportive
            work environment.
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );

  return <GenericPage title='Careers' content={content} breadcrumb='Join Our Team' />;
};

export default CareersPage;
