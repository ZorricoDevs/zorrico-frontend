import React from 'react';
import { Box, Chip, Typography, Paper } from '@mui/material';
import config from '../../config/environment';

interface EnvironmentInfoProps {
  show?: boolean;
}

const EnvironmentInfo: React.FC<EnvironmentInfoProps> = ({ show = true }) => {
  if (!show || config.isProduction) {
    return null;
  }

  const envInfo = config.getEnvironmentInfo();

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        p: 2,
        zIndex: 9999,
        opacity: 0.9,
        maxWidth: 300,
      }}
      elevation={3}
    >
      <Typography variant='subtitle2' gutterBottom>
        🔧 Development Mode
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Chip
          label={`Backend: ${envInfo.backendType}`}
          color={envInfo.backendType === 'LOCAL' ? 'success' : 'primary'}
          size='small'
        />

        <Typography variant='caption' sx={{ wordBreak: 'break-all' }}>
          API: {envInfo.apiUrl}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {envInfo.debug && <Chip label='Debug' size='small' variant='outlined' />}
          {envInfo.features.logging && <Chip label='Logging' size='small' variant='outlined' />}
        </Box>
      </Box>
    </Paper>
  );
};

export default EnvironmentInfo;
