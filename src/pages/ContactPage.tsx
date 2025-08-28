import React from 'react';
import { Typography, Stack, Box, Paper, Button, useTheme } from '@mui/material';
import { Phone, Email, LocationOn, Schedule } from '@mui/icons-material';
import GenericPage from '../components/UI/GenericPage';

const ContactPage: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const content = (
    <Stack spacing={4}>
      <Typography
        variant='h5'
        component='h2'
        sx={{
          color: '#304FFE',
          fontWeight: 600,
        }}
      >
        Get in Touch with Zorrico
      </Typography>

      <Typography
        variant='body1'
        paragraph
        sx={{
          color: isDarkMode ? theme.palette.text.primary : '#2E2E2E',
        }}
      >
        Have questions about home loans? Need assistance with your application? Our expert team is
        here to help you every step of the way. Reach out to us through any of the channels below.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Paper
          elevation={isDarkMode ? 3 : 2}
          sx={{
            p: 3,
            backgroundColor: isDarkMode ? theme.palette.background.paper : '#FFFFFF',
            border: isDarkMode ? '1px solid rgba(48, 79, 254, 0.12)' : 'none',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Phone sx={{ color: '#304FFE', mr: 2, fontSize: 28 }} />
            <Typography
              variant='h6'
              sx={{
                fontWeight: 600,
                color: isDarkMode ? theme.palette.text.primary : '#2E2E2E',
              }}
            >
              Call Us
            </Typography>
          </Box>
          <Typography
            variant='body1'
            sx={{
              mb: 1,
              color: isDarkMode ? theme.palette.text.primary : '#2E2E2E',
            }}
          >
            <strong style={{ color: '#304FFE' }}>Customer Support:</strong> +91 84228 89910
          </Typography>
          <Typography
            variant='body1'
            sx={{
              mb: 1,
              color: isDarkMode ? theme.palette.text.primary : '#2E2E2E',
            }}
          >
            <strong style={{ color: '#304FFE' }}>Loan Assistance:</strong> +91 84228 89910
          </Typography>
          <Typography
            variant='body2'
            sx={{
              color: isDarkMode ? theme.palette.text.secondary : '#666',
            }}
          >
            Toll-free | Available 24/7
          </Typography>
        </Paper>

        <Paper
          elevation={isDarkMode ? 3 : 2}
          sx={{
            p: 3,
            backgroundColor: isDarkMode ? theme.palette.background.paper : '#FFFFFF',
            border: isDarkMode ? '1px solid rgba(0, 200, 200, 0.12)' : 'none',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Email sx={{ color: '#00C8C8', mr: 2, fontSize: 28 }} />
            <Typography
              variant='h6'
              sx={{
                fontWeight: 600,
                color: isDarkMode ? theme.palette.text.primary : '#2E2E2E',
              }}
            >
              Email Us
            </Typography>
          </Box>
          <Typography variant='body1' sx={{ mb: 1 }}>
            <strong>General Queries:</strong> support@zorrico.com
          </Typography>
          <Typography variant='body1' sx={{ mb: 1 }}>
            <strong>Loan Applications:</strong> sales@zorrico.com
          </Typography>
          <Typography variant='body2' sx={{ color: '#666' }}>
            Response within 24 hours
          </Typography>
        </Paper>
      </Box>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOn sx={{ color: '#ff9800', mr: 2, fontSize: 28 }} />
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            Visit Our Office
          </Typography>
        </Box>
        <Typography variant='body1' sx={{ mb: 2 }}>
          <strong>Head Office:</strong>
          <br />
          Zorrico Technologies Pvt. Ltd.
          <br />
          123, Business District,
          <br />
          Sector 62, Noida - 201301
          <br />
          Uttar Pradesh, India
        </Typography>
        <Button
          variant='outlined'
          sx={{ mt: 1 }}
          onClick={() => window.open('https://maps.google.com', '_blank')}
        >
          Get Directions
        </Button>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Schedule sx={{ color: '#dc3545', mr: 2, fontSize: 28 }} />
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            Business Hours
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Box>
            <Typography variant='body1' sx={{ mb: 1 }}>
              <strong>Phone Support:</strong>
            </Typography>
            <Typography variant='body2' sx={{ color: '#666' }}>
              24/7 Customer Service
            </Typography>
          </Box>
          <Box>
            <Typography variant='body1' sx={{ mb: 1 }}>
              <strong>Office Hours:</strong>
            </Typography>
            <Typography variant='body2' sx={{ color: '#666' }}>
              Monday - Saturday: 9:00 AM - 7:00 PM
              <br />
              Sunday: 10:00 AM - 5:00 PM
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Typography variant='h5' component='h2' sx={{ color: '#1976d2', fontWeight: 600 }}>
        Frequently Asked Questions
      </Typography>

      <Stack spacing={2}>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
            How long does the loan approval process take?
          </Typography>
          <Typography variant='body2' sx={{ color: '#666' }}>
            Our digital process typically takes 24-48 hours for pre-approval. Final approval depends
            on documentation and bank processing, usually 7-15 business days.
          </Typography>
        </Paper>

        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
            What documents do I need for a home loan application?
          </Typography>
          <Typography variant='body2' sx={{ color: '#666' }}>
            Basic documents include identity proof, address proof, income proof (salary slips/ITR),
            bank statements, and property documents. Our team will provide a detailed checklist.
          </Typography>
        </Paper>

        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
            Is there any processing fee for using Zorrico services?
          </Typography>
          <Typography variant='body2' sx={{ color: '#666' }}>
            Our comparison and application services are completely free for customers. You only pay
            the processing fees to the lender as per their terms.
          </Typography>
        </Paper>
      </Stack>
    </Stack>
  );

  return <GenericPage title='Contact Us' content={content} breadcrumb='Get in Touch' />;
};

export default ContactPage;
