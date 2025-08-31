import { Theme } from '@mui/material/styles';

// Utility function to display user roles properly
export const formatUserRole = (role: string): string => {
  if (role === 'user') return 'Customer';
  return role.charAt(0).toUpperCase() + role.slice(1);
};

// Utility function to get role color for Chips
export const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'error';
    case 'builder':
      return 'warning';
    case 'broker':
      return 'info';
    case 'banker':
      return 'primary';
    case 'user':
      return 'success';
    default:
      return 'default';
  }
};

// Utility function to get avatar background color
export const getAvatarColor = (role: string, theme: Theme) => {
  switch (role) {
    case 'admin':
      return theme.palette.error.main;
    case 'builder':
      return theme.palette.warning.main;
    case 'broker':
      return theme.palette.info.main;
    case 'banker':
      return theme.palette.primary.main;
    case 'user':
      return theme.palette.success.main;
    default:
      return theme.palette.primary.main;
  }
};

// Utility function to get role icon
export const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin':
      return '👑';
    case 'builder':
      return '🏗️';
    case 'broker':
      return '💼';
    case 'banker':
      return '🏦';
    case 'user':
      return '👤';
    default:
      return '👤';
  }
};

// Utility function to get role description
export const getRoleDescription = (role: string): string => {
  switch (role) {
    case 'admin':
      return 'System Administrator';
    case 'builder':
      return 'Property Builder';
    case 'broker':
      return 'Loan Broker';
    case 'banker':
      return 'Bank Officer';
    case 'user':
      return 'Customer';
    default:
      return 'User';
  }
};
