// Environment configuration utility
export const config = {
  // API Configuration
  apiUrl: process.env.REACT_APP_API_URL || 'https://homeloanmittra-backend.onrender.com/api',
  frontendUrl: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000',

  // Environment
  env: process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development',
  isDevelopment:
    process.env.REACT_APP_ENV === 'development' || process.env.NODE_ENV === 'development',
  isProduction: process.env.REACT_APP_ENV === 'production' || process.env.NODE_ENV === 'production',

  // Feature Flags
  debug: process.env.REACT_APP_DEBUG === 'true',
  enableDevTools: process.env.REACT_APP_ENABLE_DEV_TOOLS === 'true',
  enableLogging: process.env.REACT_APP_ENABLE_LOGGING === 'true',
  mockPayments: process.env.REACT_APP_MOCK_PAYMENTS === 'true',

  // Helper methods
  isLocalBackend: () => config.apiUrl.includes('localhost'),
  isLiveBackend: () => !config.isLocalBackend(),

  // Environment info
  getEnvironmentInfo: () => ({
    environment: config.env,
    apiUrl: config.apiUrl,
    frontendUrl: config.frontendUrl,
    backendType: config.isLocalBackend() ? 'LOCAL' : 'LIVE',
    debug: config.debug,
    features: {
      devTools: config.enableDevTools,
      logging: config.enableLogging,
      mockPayments: config.mockPayments,
    },
  }),
};

// Log environment info only in development mode (not production)
if (config.isDevelopment && process.env.NODE_ENV === 'development') {
  console.log('🔧 Environment Configuration:', config.getEnvironmentInfo());
}

export default config;
