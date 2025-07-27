// Service Worker for HomeLoanMittra with Chunk Loading Error Recovery
const CACHE_NAME = 'home-loan-mittra-v2';
const CHUNK_CACHE_NAME = 'home-loan-mittra-chunks-v2';
const STATIC_CACHE_URLS = [
  '/',
  '/manifest.json',
  '/favicon.png',
  '/logo.png'
];

const DYNAMIC_CACHE_URLS = [
  '/dashboard',
  '/admin/dashboard',
  '/broker-dashboard',
  '/lender-dashboard',
  '/emi-calculator',
  '/eligibility-check',
  '/compare-loans'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      }),
      caches.open(CHUNK_CACHE_NAME).then((cache) => {
        console.log('Chunk cache initialized');
        return Promise.resolve();
      })
    ])
    .then(() => {
      console.log('Service Worker installed successfully');
      return self.skipWaiting();
    })
    .catch((error) => {
      console.error('Service Worker installation failed:', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== CHUNK_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return Promise.resolve();
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // API requests - Network first, then cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline fallback for API requests
              return new Response(
                JSON.stringify({
                  error: 'Offline',
                  message: 'This feature is not available offline'
                }),
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              );
            });
        })
    );
    return;
  }

  // Static assets and pages - Cache first, then network
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseClone = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Cache dynamic routes
                if (DYNAMIC_CACHE_URLS.some(route => url.pathname.startsWith(route))) {
                  cache.put(request, responseClone);
                }
              });

            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/');
            }
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Perform background tasks like sending cached form data
      handleBackgroundSync()
    );
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/logo.png',
    badge: '/favicon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/logo.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Home Loan Mittra', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// Background sync handler
async function handleBackgroundSync() {
  try {
    // Get cached form submissions
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();

    // Process cached POST requests
    for (const request of requests) {
      if (request.method === 'POST') {
        try {
          const response = await fetch(request);
          if (response.ok) {
            await cache.delete(request);
          }
        } catch (error) {
          console.log('Background sync failed for request:', request.url);
        }
      }
    }
  } catch (error) {
    console.error('Background sync error:', error);
  }
}
