import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import {
  Warning,
  Info,
  CheckCircle,
  Error as ErrorIcon,
  Close
} from '@mui/icons-material';

export type ConfirmationVariant = 'warning' | 'danger' | 'info' | 'success';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  variant?: ConfirmationVariant;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  message,
  variant = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  maxWidth = 'xs'
}) => {
  const getIconAndColor = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <ErrorIcon sx={{ fontSize: 48 }} />,
          color: '#f44336',
          confirmColor: 'error' as const
        };
      case 'warning':
        return {
          icon: <Warning sx={{ fontSize: 48 }} />,
          color: '#ff9800',
          confirmColor: 'warning' as const
        };
      case 'info':
        return {
          icon: <Info sx={{ fontSize: 48 }} />,
          color: '#2196f3',
          confirmColor: 'primary' as const
        };
      case 'success':
        return {
          icon: <CheckCircle sx={{ fontSize: 48 }} />,
          color: '#4caf50',
          confirmColor: 'success' as const
        };
      default:
        return {
          icon: <Warning sx={{ fontSize: 48 }} />,
          color: '#ff9800',
          confirmColor: 'warning' as const
        };
    }
  };

  const { icon, color, confirmColor } = getIconAndColor();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <IconButton
            onClick={onCancel}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 2
        }}>
          <Box sx={{ color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </Box>

          <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
            {message}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          color="inherit"
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          {cancelText}
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
