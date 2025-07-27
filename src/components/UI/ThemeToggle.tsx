import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.3,
        position: 'relative',
        backgroundColor: theme === 'dark'
          ? 'rgba(30, 41, 59, 0.3)'
          : 'rgba(248, 250, 252, 0.5)',
        borderRadius: '12px',
        padding: '3px',
        border: theme === 'dark'
          ? '1px solid rgba(71, 85, 105, 0.3)'
          : '1px solid rgba(226, 232, 240, 0.3)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Light Mode Icon */}
      <Tooltip title="Light Mode" placement="left">
        <IconButton
          onClick={() => theme === 'dark' && toggleTheme()}
          sx={{
            width: 24,
            height: 24,
            borderRadius: '6px',
            transition: 'all 0.3s ease',
            backgroundColor: theme === 'light' ? 'rgba(48, 79, 254, 0.2)' : 'transparent',
            color: theme === 'light' ? '#304FFE' : (theme === 'dark' ? '#CBD5E1' : '#64748B'),
            '&:hover': {
              backgroundColor: theme === 'light' ? 'rgba(48, 79, 254, 0.3)' : 'rgba(203, 213, 225, 0.1)',
              transform: 'scale(1.1)'
            }
          }}
        >
          <LightMode sx={{ fontSize: '14px' }} />
        </IconButton>
      </Tooltip>

      {/* Animated Separator */}
      <Box
        sx={{
          width: '1.5px',
          height: '6px',
          backgroundColor: theme === 'dark' ? 'rgba(203, 213, 225, 0.3)' : 'rgba(100, 116, 139, 0.3)',
          borderRadius: '1px',
          transition: 'all 0.3s ease'
        }}
      />

      {/* Dark Mode Icon */}
      <Tooltip title="Dark Mode" placement="left">
        <IconButton
          onClick={() => theme === 'light' && toggleTheme()}
          sx={{
            width: 24,
            height: 24,
            borderRadius: '6px',
            transition: 'all 0.3s ease',
            backgroundColor: theme === 'dark' ? 'rgba(48, 79, 254, 0.2)' : 'transparent',
            color: theme === 'dark' ? '#304FFE' : '#64748B',
            '&:hover': {
              backgroundColor: theme === 'dark' ? 'rgba(48, 79, 254, 0.3)' : 'rgba(100, 116, 139, 0.1)',
              transform: 'scale(1.1)'
            }
          }}
        >
          <DarkMode sx={{ fontSize: '14px' }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ThemeToggle;
