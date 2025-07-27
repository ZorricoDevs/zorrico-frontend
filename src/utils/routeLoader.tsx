import React, { ComponentType, LazyExoticComponent } from 'react';
import FinanceLoader from '../components/UI/FinanceLoader';
import { measureAsync } from '../utils/performanceMonitor';

interface RouteLoaderOptions {
  fallback?: React.ComponentType;
  preload?: boolean;
  timeout?: number;
  retryCount?: number;
}

interface PreloadableComponent<T = {}> extends LazyExoticComponent<ComponentType<T>> {
  preload?: () => Promise<{ default: ComponentType<T> }>;
}

/**
 * Enhanced route loader with performance monitoring and preloading
 */
export const createRouteLoader = <T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  routeName: string,
  options: RouteLoaderOptions = {}
): PreloadableComponent<T> => {
  const {
    fallback: CustomFallback,
    preload = false,
    timeout = 10000,
    retryCount = 3,
  } = options;

  // Default fallback component
  const DefaultFallback = () => (
    <FinanceLoader />
  );

  const Fallback = CustomFallback || DefaultFallback;

  // Enhanced import function with performance tracking and retry logic
  const enhancedImportFn = async (): Promise<{ default: ComponentType<T> }> => {
    return measureAsync(`route-load-${routeName}`, async () => {
      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= retryCount; attempt++) {
        try {
          // Add timeout to the import
          const importPromise = importFn();
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(new Error(`Route loading timeout: ${routeName}`));
            }, timeout);
          });

          const result = await Promise.race([importPromise, timeoutPromise]);

          // Track successful load
          if (window.gtag) {
            window.gtag('event', 'route_loaded', {
              route_name: routeName,
              attempt_number: attempt,
            });
          }

          return result;
        } catch (error) {
          lastError = error as Error;

          // Track failed attempt
          if (window.gtag) {
            window.gtag('event', 'route_load_failed', {
              route_name: routeName,
              attempt_number: attempt,
              error_message: error instanceof Error ? error.message : 'Unknown error',
            });
          }

          // If this is not the last attempt, wait before retrying
          if (attempt < retryCount) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }

      // All attempts failed
      throw new Error(
        `Failed to load route ${routeName} after ${retryCount} attempts. Last error: ${lastError?.message}`
      );
    });
  };

  const LazyComponent = React.lazy(enhancedImportFn) as PreloadableComponent<T>;

  // Add preload method
  LazyComponent.preload = enhancedImportFn;

  // Preload immediately if requested
  if (preload) {
    LazyComponent.preload().catch(() => {
      // Silently fail preload - component will load normally when accessed
    });
  }

  return LazyComponent;
};

/**
 * Hook for preloading routes on user interaction
 */
export const useRoutePreloader = () => {
  const preloadRoute = React.useCallback((component: PreloadableComponent) => {
    if (component.preload) {
      component.preload().catch(() => {
        // Silently fail - route will load normally when navigated to
      });
    }
  }, []);

  return { preloadRoute };
};

/**
 * HOC for route-based code splitting with enhanced loading
 */
export const withRouteLoader = <P extends object>(
  component: PreloadableComponent<P>,
  routeName: string
) => {
  return React.memo((props: P) => {
    return (
      <React.Suspense
        fallback={<FinanceLoader />}
      >
        {React.createElement(component, props)}
      </React.Suspense>
    );
  });
};

/**
 * Route preloader based on link hover/focus
 */
export const RoutePreloaderLink: React.FC<{
  to: string;
  component: PreloadableComponent;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}> = ({ to, component, children, ...props }) => {
  const { preloadRoute } = useRoutePreloader();
  const [hasPreloaded, setHasPreloaded] = React.useState(false);

  const handleMouseEnter = React.useCallback(() => {
    if (!hasPreloaded) {
      preloadRoute(component);
      setHasPreloaded(true);
    }
  }, [component, hasPreloaded, preloadRoute]);

  const handleFocus = React.useCallback(() => {
    if (!hasPreloaded) {
      preloadRoute(component);
      setHasPreloaded(true);
    }
  }, [component, hasPreloaded, preloadRoute]);

  return (
    <a
      href={to}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      {...props}
    >
      {children}
    </a>
  );
};

// Specific route loaders with optimized configurations
export const ApplicationsLoader = createRouteLoader(
  () => import('../pages/ApplicationsPage'),
  'applications',
  { preload: false, timeout: 8000 }
);

export const ProfileLoader = createRouteLoader(
  () => import('../pages/Profile'),
  'profile',
  { preload: false, timeout: 8000 }
);

export const SettingsLoader = createRouteLoader(
  () => import('../pages/Settings'),
  'settings',
  { preload: false, timeout: 8000 }
);

export const CalculatorLoader = createRouteLoader(
  () => import('../components/Calculators/EMICalculator'),
  'calculator',
  { preload: true, timeout: 5000 } // Preload since it's commonly used
);

export const EligibilityLoader = createRouteLoader(
  () => import('../components/Calculators/EligibilityChecker'),
  'eligibility',
  { preload: true, timeout: 5000 } // Preload since it's commonly used
);
