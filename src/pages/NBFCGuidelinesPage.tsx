import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const NBFCGuidelinesPage: React.FC = () => (
  <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 6 }}>
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          NBFC Guidelines
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Home Loan Mittra partners only with RBI-registered NBFCs and follows all NBFC guidelines to ensure safe and transparent lending practices for our customers.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          For more information about NBFC compliance, please contact our compliance team.
        </Typography>
      </Paper>
    </Container>
  </Box>
);

export default NBFCGuidelinesPage; 