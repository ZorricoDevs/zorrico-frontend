import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Container,
  Paper,
  Stack
} from '@mui/material';
import { Refresh, Warning, Home } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

class ChunkErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Check if it's a chunk loading error
    const isChunkError = error.message.includes('Loading chunk') ||
                        error.message.includes('ChunkLoadError') ||
                        error.name === 'ChunkLoadError';

    return {
      hasError: true,
      error: isChunkError ? error : error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ChunkErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // Auto-retry for chunk loading errors
    if (this.isChunkLoadError(error) && this.state.retryCount < 3) {
      this.autoRetry();
    }
  }

  private isChunkLoadError = (error: Error): boolean => {
    return error.message.includes('Loading chunk') ||
           error.message.includes('ChunkLoadError') ||
           error.name === 'ChunkLoadError' ||
           error.message.includes('Loading CSS chunk') ||
           error.message.includes('Loading script chunk');
  };

  private autoRetry = () => {
    this.retryTimeoutId = window.setTimeout(() => {
      this.setState(prevState => ({
        retryCount: prevState.retryCount + 1
      }));

      this.handleRetry();
    }, 1000);
  };

  private handleRetry = () => {
    // Clear the error state to retry rendering
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    // Force a hard reload for chunk errors
    if (this.state.error && this.isChunkLoadError(this.state.error)) {
      window.location.reload();
    }
  };

  private handleHardRefresh = () => {
    // Clear cache and reload
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }

    // Force hard reload
    window.location.href = window.location.href;
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const isChunkError = this.isChunkLoadError(this.state.error);

      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{ mb: 3 }}>
              <Warning sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />

              <Typography variant="h4" gutterBottom color="error">
                {isChunkError ? 'Loading Error' : 'Application Error'}
              </Typography>

              <Typography variant="h6" color="text.secondary" gutterBottom>
                {isChunkError
                  ? 'There was an issue loading the application resources'
                  : 'Something went wrong with the application'
                }
              </Typography>
            </Box>

            {isChunkError ? (
              <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
                <AlertTitle>Chunk Loading Error</AlertTitle>
                This usually happens when the application is updated while you're using it.
                Try refreshing the page to load the latest version.
                <br /><br />
                <strong>Technical Details:</strong><br />
                {this.state.error.message}
              </Alert>
            ) : (
              <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                <AlertTitle>Application Error</AlertTitle>
                An unexpected error occurred. Please try refreshing the page.
                <br /><br />
                <strong>Error:</strong> {this.state.error.message}
              </Alert>
            )}

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleRetry}
                color="primary"
              >
                Retry
              </Button>

              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={this.handleHardRefresh}
                color="secondary"
              >
                Hard Refresh
              </Button>

              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={this.handleGoHome}
                color="inherit"
              >
                Go Home
              </Button>
            </Stack>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <Box sx={{ mt: 4, textAlign: 'left' }}>
                <Typography variant="h6" gutterBottom>
                  Error Stack (Development Only):
                </Typography>
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: 'grey.100',
                    overflow: 'auto',
                    maxHeight: 200
                  }}
                >
                  <Typography
                    component="pre"
                    variant="body2"
                    sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}
                  >
                    {this.state.error.stack}
                    {'\n\nComponent Stack:'}
                    {this.state.errorInfo.componentStack}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ChunkErrorBoundary;
