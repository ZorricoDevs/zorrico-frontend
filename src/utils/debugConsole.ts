// Production console utility
// Disables debug logs in production while keeping errors and warnings

const isDevelopment = process.env.NODE_ENV === 'development';

export const debugLog = (...args: any[]) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

export const debugWarn = (...args: any[]) => {
  if (isDevelopment) {
    console.warn(...args);
  }
};

export const debugError = (...args: any[]) => {
  // Always show errors, even in production
  console.error(...args);
};

// Replace console methods in production
if (!isDevelopment) {
  // Override console.log for any remaining debug statements
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    // Only show logs that don't contain 'Debug'
    const message = args.join(' ');
    if (!message.includes('Debug')) {
      originalLog(...args);
    }
  };
}

export default {
  log: debugLog,
  warn: debugWarn,
  error: debugError,
};
