import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './theme.css';
import App from './App';

// Global error handlers for chunk loading failures
const safeReload = (): void => {
  try {
    window.location.reload();
  } catch (error) {
    // Fallback: redirect to current page
    window.location.href = window.location.href;
  }
};

window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason;

  // Check if it's a chunk loading error
  if (error && (
    error.message?.includes('Loading chunk') ||
    error.message?.includes('ChunkLoadError') ||
    error.name === 'ChunkLoadError' ||
    error.message?.includes('Loading CSS chunk') ||
    error.message?.includes('Loading script chunk')
  )) {
    console.warn('Chunk loading error detected:', error);

    // Prevent the error from being logged to console
    event.preventDefault();

    // Check if we've already tried to refresh
    const hasRefreshed = sessionStorage.getItem('chunk-error-refresh');

    if (!hasRefreshed) {
      console.log('Attempting to recover from chunk loading error...');
      sessionStorage.setItem('chunk-error-refresh', 'true');

      // Clear any cached chunks and reload
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        }).finally(() => {
          safeReload();
        });
      } else {
        safeReload();
      }
    } else {
      // If refresh already attempted, remove flag and let error boundary handle it
      sessionStorage.removeItem('chunk-error-refresh');
    }
  }
});

// Clear the refresh flag on successful load
window.addEventListener('load', () => {
  sessionStorage.removeItem('chunk-error-refresh');
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for offline capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
         
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
         
        console.log('SW registration failed: ', registrationError);
      });
  });
}
