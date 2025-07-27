import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Box, Typography, Container, Button } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireApproval?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  requireApproval = true
}) => {
  const { isAuthenticated, isAdmin, isApproved, user } = useAuth();

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Box sx={{ backgroundColor: 'var(--bg-secondary)', p: 6, borderRadius: 3 }}>
          <Typography variant="h4" sx={{ color: 'var(--text-primary)', mb: 2 }}>
            Access Denied
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--text-secondary)', mb: 4 }}>
            You don&apos;t have permission to access this page. Admin access required.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  // If approval is required but user is not approved
  if (requireApproval && isAuthenticated && !isApproved) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Box sx={{ backgroundColor: 'var(--bg-secondary)', p: 6, borderRadius: 3 }}>
          <Typography variant="h4" sx={{ color: 'var(--text-primary)', mb: 2 }}>
            Account Pending Approval
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--text-secondary)', mb: 4 }}>
            Your account is currently pending approval. Please wait for an admin to approve your account.
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 4 }}>
            Status: <strong>{user?.status}</strong>
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.href = '/'}
          >
            Return to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
