import React from 'react';
import { Box, Button, Container, Typography, Alert, Collapse } from '@mui/material';
import { ErrorOutline, Refresh, BugReport } from '@mui/icons-material';
import { performanceMonitor } from '../../utils/performanceMonitor';

interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorInfo?: React.ErrorInfo;
}

interface AdvancedErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  showDetails: boolean;
  retryCount: number;
}

interface AdvancedErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  resetOnPropsChange?: boolean;
  isolate?: boolean;
}

class AdvancedErrorBoundary extends React.Component<
  AdvancedErrorBoundaryProps,
  AdvancedErrorBoundaryState
> {
  private retryTimeoutId: number | null = null;

  constructor(props: AdvancedErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      showDetails: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<AdvancedErrorBoundaryState> {
    // Generate unique error ID
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const enhancedErrorInfo: ErrorInfo = {
      componentStack: errorInfo.componentStack || '',
      errorBoundary: this.constructor.name,
      errorInfo,
    };

    this.setState({ errorInfo: enhancedErrorInfo });

    // Track error in performance monitor
    performanceMonitor['onMetric']({
      name: 'react-error',
      value: 1,
      rating: 'poor',
    });

    // Log to external service
    this.logErrorToService(error, enhancedErrorInfo);

    // Call custom error handler
    this.props.onError?.(error, enhancedErrorInfo);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 React Error Boundary');
      console.error('Error:', error);
      console.error('Error Info:', enhancedErrorInfo);
      console.groupEnd();
    }
  }

  componentDidUpdate(prevProps: AdvancedErrorBoundaryProps) {
    const { resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    // Reset error state when props change (if enabled)
    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null,
        showDetails: false,
        retryCount: 0,
      });
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private logErrorToService = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      const errorReport = {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        userId: this.getUserId(),
        sessionId: this.getSessionId(),
        buildVersion: process.env.REACT_APP_VERSION || 'unknown',
        performance: performanceMonitor.getMetrics().slice(-10), // Last 10 metrics
      };

      // Send to error reporting service
      if (process.env.NODE_ENV === 'production') {
        await fetch('/api/errors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(errorReport),
        });
      }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private getUserId = (): string | null => {
    // Get user ID from your auth system
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id || null;
    } catch {
      return null;
    }
  };

  private getSessionId = (): string => {
    // Get or create session ID
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  };

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      this.handleReload();
      return;
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      showDetails: false,
      retryCount: prevState.retryCount + 1,
    }));

    // Track retry attempt
    performanceMonitor['onMetric']({
      name: 'error-retry',
      value: retryCount + 1,
      rating: 'needs-improvement',
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleToggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  };

  private handleReportBug = () => {
    const { error, errorInfo, errorId } = this.state;
    const subject = `Bug Report: ${error?.message || 'Unknown Error'}`;
    const body = `
Error ID: ${errorId}
Error: ${error?.message}
Stack: ${error?.stack}
Component Stack: ${errorInfo?.componentStack}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Timestamp: ${new Date().toISOString()}
    `.trim();

    const mailtoUrl = `mailto:support@homeloanmittra.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.open(mailtoUrl);
  };

  render() {
    const { hasError, error, errorInfo, showDetails, retryCount } = this.state;
    const { children, fallback: CustomFallback, maxRetries = 3, isolate } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (CustomFallback) {
        return <CustomFallback error={error} retry={this.handleRetry} />;
      }

      // Default error UI
      return (
        <Container
          maxWidth="md"
          sx={{
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />

          <Typography variant="h4" gutterBottom>
            Oops! Something went wrong
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            We encountered an unexpected error. Our team has been notified and is working on a fix.
          </Typography>

          <Alert severity="error" sx={{ mb: 3, textAlign: 'left', width: '100%' }}>
            <strong>Error:</strong> {error.message}
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={this.handleRetry}
              disabled={retryCount >= maxRetries}
            >
              {retryCount >= maxRetries ? 'Max Retries Reached' : `Try Again (${retryCount}/${maxRetries})`}
            </Button>

            <Button
              variant="outlined"
              startIcon={<BugReport />}
              onClick={this.handleReportBug}
            >
              Report Bug
            </Button>

            <Button
              variant="outlined"
              onClick={this.handleReload}
            >
              Reload Page
            </Button>
          </Box>

          <Button
            variant="text"
            size="small"
            onClick={this.handleToggleDetails}
            sx={{ mb: 2 }}
          >
            {showDetails ? 'Hide' : 'Show'} Technical Details
          </Button>

          <Collapse in={showDetails} sx={{ width: '100%' }}>
            <Box
              sx={{
                p: 2,
                backgroundColor: 'grey.100',
                borderRadius: 1,
                textAlign: 'left',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                overflow: 'auto',
                maxHeight: 300,
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Stack Trace:
              </Typography>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {error.stack}
              </pre>

              {errorInfo?.componentStack && (
                <>
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                    Component Stack:
                  </Typography>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {errorInfo.componentStack}
                  </pre>
                </>
              )}
            </Box>
          </Collapse>

          {isolate && (
            <Alert severity="info" sx={{ mt: 2, width: '100%' }}>
              This error is isolated to this component. Other parts of the application should continue to work normally.
            </Alert>
          )}
        </Container>
      );
    }

    return children;
  }
}

export default AdvancedErrorBoundary;
