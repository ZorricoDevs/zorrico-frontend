// Simple performance monitor stub for error boundary usage
export const performanceMonitor = {
  onMetric: (metric: { name: string; value: number; rating?: string }) => {
    // You can extend this to send metrics to an analytics service
    if (process.env.NODE_ENV === 'production') {
       
      console.log('[PerformanceMetric]', metric);
    }
  },
  getMetrics: () => [] as any[], // Return empty array or implement as needed
};
