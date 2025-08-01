import React, { Component, ReactNode } from 'react';
import { Container, Card, CardContent, Typography, Button, Alert } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
     
    console.error('Auth Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{
          py: { xs: 4, sm: 8 },
          minHeight: { xs: 'calc(100vh - 64px)', sm: '100vh' },
          display: 'flex',
          alignItems: 'center'
        }}>
          <Card elevation={10} sx={{ borderRadius: 4, width: '100%' }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Alert severity="error" sx={{ mb: 3 }}>
                Authentication System Error
              </Alert>
              <Typography variant="h6" sx={{ mb: 2 }}>
                There was an issue with the authentication system
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                {this.state.error?.message || 'Unknown authentication error occurred'}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  this.setState({ hasError: false, error: undefined });
                  window.location.reload();
                }}
                sx={{ mb: 2 }}
              >
                Reload Application
              </Button>
              <Button
                variant="text"
                fullWidth
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
              >
                Clear Data & Go Home
              </Button>
            </CardContent>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
