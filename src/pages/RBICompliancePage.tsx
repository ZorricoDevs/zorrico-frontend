import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const RBICompliancePage: React.FC = () => (
  <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 6 }}>
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          RBI Compliance
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Home Loan Mittra strictly adheres to all Reserve Bank of India (RBI) guidelines and regulations for digital lending platforms. Your data and transactions are protected under the highest standards of compliance and security.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          For more information, visit the official RBI website or contact our compliance team.
        </Typography>
      </Paper>
    </Container>
  </Box>
);

export default RBICompliancePage; 