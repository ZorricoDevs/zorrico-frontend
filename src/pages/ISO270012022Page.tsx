import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const ISO270012022Page: React.FC = () => (
  <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 6 }}>
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          ISO 27001:2022
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Home Loan Mittra is committed to information security and is compliant with ISO 27001:2022 standards. We ensure your data is handled with the utmost care and security.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          For more information about our ISO certification, please contact our support team.
        </Typography>
      </Paper>
    </Container>
  </Box>
);

export default ISO270012022Page; 