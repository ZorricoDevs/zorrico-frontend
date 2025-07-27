import React from 'react';
import { Typography, Stack, Box, Paper, Button, Chip, useTheme } from '@mui/material';
import { Work, LocationOn, Schedule, TrendingUp } from '@mui/icons-material';
import GenericPage from '../components/UI/GenericPage';

const CareersPage: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const jobOpenings = [
    {
      title: 'Senior Full Stack Developer',
      location: 'Noida, India',
      type: 'Full-time',
      experience: '3-5 years',
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB']
    },
    {
      title: 'Product Manager',
      location: 'Mumbai, India / Remote',
      type: 'Full-time',
      experience: '4-6 years',
      skills: ['Product Strategy', 'Analytics', 'Agile', 'Fintech']
    },
    {
      title: 'Business Development Executive',
      location: 'Bangalore, India',
      type: 'Full-time',
      experience: '2-4 years',
      skills: ['Sales', 'Client Relations', 'Financial Services', 'Communication']
    },
    {
      title: 'UI/UX Designer',
      location: 'Delhi NCR, India',
      type: 'Full-time',
      experience: '2-3 years',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems']
    }
  ];

  const content = (
    <Stack spacing={4}>
      <Typography variant="h5" component="h2" sx={{ color: '#304FFE', fontWeight: 600 }}>
        Join the HomeLoanMittra Team
      </Typography>

      <Typography variant="body1" paragraph>
        Be part of India's fastest-growing fintech platform that's revolutionizing the home loan industry.
        We're looking for passionate individuals who want to make homeownership dreams accessible to millions.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        <Paper
          elevation={1}
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
            border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0'
          }}
        >
          <Work sx={{ color: '#304FFE', fontSize: 40, mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#fff' : '#2E2E2E' }}>
            Innovation First
          </Typography>
          <Typography variant="body2" sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
            Work with cutting-edge technology and contribute to products that impact millions of users.
          </Typography>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
            border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0'
          }}
        >
          <TrendingUp sx={{ color: '#00C8C8', fontSize: 40, mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#fff' : '#2E2E2E' }}>
            Growth Opportunities
          </Typography>
          <Typography variant="body2" sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
            Fast-track your career with learning opportunities, mentorship, and leadership roles.
          </Typography>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
            border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0'
          }}
        >
          <Schedule sx={{ color: '#FFA726', fontSize: 40, mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#fff' : '#2E2E2E' }}>
            Work-Life Balance
          </Typography>
          <Typography variant="body2" sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
            Flexible working hours, remote options, and a culture that values personal well-being.
          </Typography>
        </Paper>
      </Box>

      <Typography variant="h5" component="h2" sx={{ color: '#304FFE', fontWeight: 600 }}>
        Current Openings
      </Typography>

      <Stack spacing={3}>
        {jobOpenings.map((job, index) => (
          <Paper
            key={index}
            elevation={2}
            sx={{
              p: 3,
              backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
              border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#304FFE', mb: 1 }}>
                  {job.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOn sx={{ fontSize: 16, color: isDarkMode ? '#b0b0b0' : '#666' }} />
                    <Typography variant="body2" sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
                      {job.location}
                    </Typography>
                  </Box>
                  <Chip
                    label={job.type}
                    size="small"
                    sx={{
                      backgroundColor: '#304FFE',
                      color: '#fff',
                      border: 'none'
                    }}
                    variant="filled"
                  />
                  <Typography variant="body2" sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
                    {job.experience}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: '#FFA726',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#FF9800'
                  }
                }}
                onClick={() => window.open('mailto:careers@homeloanmittra.com?subject=Application for ' + job.title, '_blank')}
              >
                Apply Now
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {job.skills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  size="small"
                  variant="outlined"
                  sx={{
                    backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                    color: isDarkMode ? '#b0b0b0' : '#666',
                    borderColor: isDarkMode ? '#444' : '#e0e0e0'
                  }}
                />
              ))}
            </Box>
          </Paper>
        ))}
      </Stack>

      <Paper
        elevation={1}
        sx={{
          p: 4,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
          textAlign: 'center',
          border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0'
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: isDarkMode ? '#fff' : '#2E2E2E' }}>
          Don't see the right role?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: isDarkMode ? '#b0b0b0' : '#666' }}>
          We're always looking for talented individuals. Send us your resume and let us know how you'd like to contribute.
        </Typography>
        <Button
          variant="outlined"
          size="large"
          sx={{
            borderColor: '#304FFE',
            color: '#304FFE',
            '&:hover': {
              borderColor: '#304FFE',
              backgroundColor: isDarkMode ? 'rgba(48, 79, 254, 0.1)' : 'rgba(48, 79, 254, 0.05)'
            }
          }}
          onClick={() => window.open('mailto:careers@homeloanmittra.com?subject=General Application', '_blank')}
        >
          Send Resume
        </Button>
      </Paper>

      <Typography variant="h5" component="h2" sx={{ color: '#1976d2', fontWeight: 600 }}>
        Why HomeLoanMittra?
      </Typography>

      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#1976d2',
            mt: 1,
            flexShrink: 0
          }} />
          <Typography variant="body1">
            <strong>Competitive Compensation:</strong> Market-leading salaries with performance bonuses and equity participation.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#1976d2',
            mt: 1,
            flexShrink: 0
          }} />
          <Typography variant="body1">
            <strong>Learning & Development:</strong> Regular training programs, conference attendance, and certification support.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#1976d2',
            mt: 1,
            flexShrink: 0
          }} />
          <Typography variant="body1">
            <strong>Health & Wellness:</strong> Comprehensive health insurance, wellness programs, and mental health support.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#1976d2',
            mt: 1,
            flexShrink: 0
          }} />
          <Typography variant="body1">
            <strong>Inclusive Culture:</strong> Diverse team, equal opportunities, and a supportive work environment.
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );

  return (
    <GenericPage
      title="Careers"
      content={content}
      breadcrumb="Join Our Team"
    />
  );
};

export default CareersPage;
