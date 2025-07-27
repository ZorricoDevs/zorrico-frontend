import React from 'react';
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initWebVitals();
    this.initResourceObserver();
    this.initNavigationObserver();
  }

  private initWebVitals() {
    // Core Web Vitals
    getCLS(this.onMetric.bind(this));
    getFCP(this.onMetric.bind(this));
    getFID(this.onMetric.bind(this));
    getLCP(this.onMetric.bind(this));
    getTTFB(this.onMetric.bind(this));
  }

  private onMetric(metric: any) {
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      timestamp: Date.now(),
    };

    this.metrics.push(performanceMetric);
    this.sendToAnalytics(performanceMetric);
  }

  private initResourceObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.trackResourceTiming(entry as PerformanceResourceTiming);
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    }
  }

  private initNavigationObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.trackNavigationTiming(entry as PerformanceNavigationTiming);
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    }
  }

  private trackResourceTiming(entry: PerformanceResourceTiming) {
    // Track slow resources (>1s)
    if (entry.duration > 1000) {
      const metric: PerformanceMetric = {
        name: `slow-resource-${entry.name.split('/').pop()}`,
        value: entry.duration,
        rating: 'poor',
        timestamp: Date.now(),
      };

      this.metrics.push(metric);
      this.sendToAnalytics(metric);
    }
  }

  private trackNavigationTiming(entry: PerformanceNavigationTiming) {
    const metrics = [
      {
        name: 'dns-lookup',
        value: entry.domainLookupEnd - entry.domainLookupStart,
      },
      {
        name: 'tcp-connect',
        value: entry.connectEnd - entry.connectStart,
      },
      {
        name: 'ssl-negotiation',
        value: entry.connectEnd - entry.secureConnectionStart,
      },
      {
        name: 'ttfb',
        value: entry.responseStart - entry.requestStart,
      },
      {
        name: 'download',
        value: entry.responseEnd - entry.responseStart,
      },
      {
        name: 'dom-processing',
        value: entry.domComplete - entry.domContentLoadedEventStart,
      },
    ];

    metrics.forEach(({ name, value }) => {
      if (value > 0) {
        const metric: PerformanceMetric = {
          name,
          value,
          rating: this.getRating(name, value),
          timestamp: Date.now(),
        };

        this.metrics.push(metric);
      }
    });
  }

  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, { good: number; poor: number }> = {
      'dns-lookup': { good: 100, poor: 300 },
      'tcp-connect': { good: 100, poor: 300 },
      'ssl-negotiation': { good: 100, poor: 300 },
      'ttfb': { good: 200, poor: 500 },
      'download': { good: 100, poor: 500 },
      'dom-processing': { good: 1000, poor: 3000 },
    };

    const threshold = thresholds[name];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private sendToAnalytics(metric: PerformanceMetric) {
    // Send to your analytics service
    if (process.env.NODE_ENV === 'production') {
      // Example: Google Analytics 4
      if (window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.value),
          custom_parameter_1: metric.rating,
        });
      }

      // Example: Custom analytics endpoint
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      }).catch(() => {
        // Silently fail - don't break the app for analytics
      });
    } else {
      console.log('Performance Metric:', metric);
    }
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.name === name);
  }

  public getAverageMetric(name: string): number {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return 0;

    return metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length;
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Performance measurement utilities
export const measureAsync = async <T>(
  name: string,
  asyncFn: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await asyncFn();
    const duration = performance.now() - start;

    performanceMonitor['onMetric']({
      name: `async-${name}`,
      value: duration,
      rating: duration < 100 ? 'good' : duration < 500 ? 'needs-improvement' : 'poor',
    });

    return result;
  } catch (error) {
    const duration = performance.now() - start;
    performanceMonitor['onMetric']({
      name: `async-${name}-error`,
      value: duration,
      rating: 'poor',
    });
    throw error;
  }
};

export const measureSync = <T>(name: string, syncFn: () => T): T => {
  const start = performance.now();
  try {
    const result = syncFn();
    const duration = performance.now() - start;

    performanceMonitor['onMetric']({
      name: `sync-${name}`,
      value: duration,
      rating: duration < 16 ? 'good' : duration < 50 ? 'needs-improvement' : 'poor',
    });

    return result;
  } catch (error) {
    const duration = performance.now() - start;
    performanceMonitor['onMetric']({
      name: `sync-${name}-error`,
      value: duration,
      rating: 'poor',
    });
    throw error;
  }
};

// React component performance HOC
export const withPerformanceTracking = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  return React.memo((props: P) => {
    React.useEffect(() => {
      const start = performance.now();
      return () => {
        const duration = performance.now() - start;
        performanceMonitor['onMetric']({
          name: `component-${componentName}`,
          value: duration,
          rating: duration < 16 ? 'good' : duration < 50 ? 'needs-improvement' : 'poor',
        });
      };
    }, []);

    return React.createElement(WrappedComponent, props);
  });
};

// Hook for component performance tracking
export const usePerformanceTracking = (componentName: string) => {
  React.useEffect(() => {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      performanceMonitor['onMetric']({
        name: `hook-${componentName}`,
        value: duration,
        rating: duration < 16 ? 'good' : duration < 50 ? 'needs-improvement' : 'poor',
      });
    };
  }, [componentName]);
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
