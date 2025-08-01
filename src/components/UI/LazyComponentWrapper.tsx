import React, { ComponentType, LazyExoticComponent, Suspense } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import FinanceLoader from './FinanceLoader';

interface LazyComponentWrapperProps {
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

interface LazyRetryState {
  hasError: boolean;
  retryCount: number;
}

// Higher-order component to wrap lazy-loaded components with retry logic
function withLazyRetry<P extends object>(
  LazyComponent: LazyExoticComponent<ComponentType<P>>,
  maxRetries = 3
) {
  return function LazyComponentWrapper(props: P & LazyComponentWrapperProps) {
    const [state, setState] = React.useState<LazyRetryState>({
      hasError: false,
      retryCount: 0
    });

    const handleRetry = React.useCallback(() => {
      if (state.retryCount < maxRetries) {
        setState(prev => ({
          hasError: false,
          retryCount: prev.retryCount + 1
        }));

        // Clear module cache and reload
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    }, [state.retryCount]);

    const LazyErrorFallback = React.useCallback(() => (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="300px"
        p={3}
      >
        <Alert severity="warning" sx={{ mb: 2, maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>
            Component Loading Failed
          </Typography>
          <Typography variant="body2" gutterBottom>
            Failed to load this section of the application. This might be due to a network issue
            or the app being updated.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Retry attempt: {state.retryCount + 1} of {maxRetries + 1}
          </Typography>
        </Alert>

        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={handleRetry}
          disabled={state.retryCount >= maxRetries}
        >
          {state.retryCount >= maxRetries ? 'Max Retries Reached' : 'Retry Loading'}
        </Button>

        {state.retryCount >= maxRetries && (
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
            sx={{ mt: 1 }}
          >
            Refresh Page
          </Button>
        )}
      </Box>
    ), [state.retryCount, handleRetry]);

    if (state.hasError) {
      return <LazyErrorFallback />;
    }

    return (
      <Suspense fallback={props.fallback || <FinanceLoader />}>
        <LazyComponent {...(props as P)} />
      </Suspense>
    );
  };
}

// Custom hook for handling dynamic imports with retry logic
export function useLazyImport<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  maxRetries = 3
): [LazyExoticComponent<T> | null, boolean, Error | null] {
  const [component, setComponent] = React.useState<LazyExoticComponent<T> | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  const loadComponent = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const LazyComponent = React.lazy(importFunc);
      setComponent(LazyComponent);
    } catch (err) {
      const error = err as Error;
      console.error('Failed to load component:', error);

      if (retryCount < maxRetries) {
        // Auto-retry after delay
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadComponent();
        }, 1000 * (retryCount + 1)); // Exponential backoff
      } else {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [importFunc, retryCount, maxRetries]);

  React.useEffect(() => {
    loadComponent();
  }, [loadComponent]);

  return [component, loading, error];
}

export default withLazyRetry;
