import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container, Alert } from '@mui/material';
import { Refresh, Home, BugReport } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring service
    console.error('Error Boundary caught an error:', error, errorInfo);

    // In production, send to error monitoring service like Sentry
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center' }}>
            <BugReport sx={{ fontSize: 80, color: '#f44336', mb: 2 }} />

            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
              Oops! Something went wrong
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              We&apos;re sorry for the inconvenience. An unexpected error occurred.
            </Typography>

            <Alert severity="error" sx={{ mb: 4, textAlign: 'left' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Error Details:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                {this.state.error?.message || 'Unknown error'}
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleRefresh}
                size="large"
              >
                Refresh Page
              </Button>

              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={this.handleGoHome}
                size="large"
              >
                Go Home
              </Button>
            </Box>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <Box sx={{ mt: 4, textAlign: 'left' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Development Details:
                </Typography>
                <Box sx={{
                  bgcolor: '#f5f5f5',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem'
                }}>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </Box>
              </Box>
            )}
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
