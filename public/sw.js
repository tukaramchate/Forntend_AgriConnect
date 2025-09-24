// Service Worker for AgriConnect - Caching and Offline Functionality

const CACHE_NAME = 'agriconnect-v1';
const STATIC_CACHE = 'agriconnect-static-v1';
const DYNAMIC_CACHE = 'agriconnect-dynamic-v1';
const IMAGE_CACHE = 'agriconnect-images-v1';

// URLs to cache on install
const STATIC_URLS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  '/assets/logo.png',
  '/assets/agriconnect_embedded.svg',
  // Add other critical assets
];

// API endpoints to cache with different strategies
const API_CACHE_STRATEGIES = {
  '/api/products': { strategy: 'networkFirst', maxAge: 5 * 60 * 1000 }, // 5 minutes
  '/api/categories': { strategy: 'staleWhileRevalidate', maxAge: 30 * 60 * 1000 }, // 30 minutes
  '/api/auth': { strategy: 'networkOnly' }, // Never cache auth requests
  '/api/orders': { strategy: 'networkOnly' }, // Never cache order requests
  '/api/user': { strategy: 'networkFirst', maxAge: 10 * 60 * 1000 }, // 10 minutes
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_URLS);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - handle requests with different caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticRequest(request));
  } else {
    event.respondWith(handleNavigationRequest(request));
  }
});

// Handle API requests with different strategies
async function handleApiRequest(request) {
  const url = new URL(request.url);
  const endpoint = url.pathname;
  
  // Find matching cache strategy
  const strategy = Object.entries(API_CACHE_STRATEGIES).find(([pattern]) => 
    endpoint.startsWith(pattern)
  )?.[1] || { strategy: 'networkFirst', maxAge: 5 * 60 * 1000 };

  switch (strategy.strategy) {
    case 'networkFirst':
      return networkFirst(request, DYNAMIC_CACHE, strategy.maxAge);
    case 'cacheFirst':
      return cacheFirst(request, DYNAMIC_CACHE, strategy.maxAge);
    case 'staleWhileRevalidate':
      return staleWhileRevalidate(request, DYNAMIC_CACHE, strategy.maxAge);
    case 'networkOnly':
      return fetch(request);
    default:
      return networkFirst(request, DYNAMIC_CACHE, strategy.maxAge);
  }
}

// Handle image requests
async function handleImageRequest(request) {
  return cacheFirst(request, IMAGE_CACHE, 24 * 60 * 60 * 1000); // 24 hours
}

// Handle static asset requests
async function handleStaticRequest(request) {
  return cacheFirst(request, STATIC_CACHE);
}

// Handle navigation requests (HTML pages)
async function handleNavigationRequest(request) {
  return networkFirst(request, DYNAMIC_CACHE, 5 * 60 * 1000, '/index.html');
}

// Caching strategies

// Network First - try network, fall back to cache
async function networkFirst(request, cacheName, maxAge, fallback) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      const responseToCache = networkResponse.clone();
      
      // Add timestamp for expiration
      if (maxAge) {
        const headers = new Headers(responseToCache.headers);
        headers.set('sw-cache-timestamp', Date.now().toString());
        const modifiedResponse = new Response(responseToCache.body, {
          status: responseToCache.status,
          statusText: responseToCache.statusText,
          headers
        });
        cache.put(request, modifiedResponse);
      } else {
        cache.put(request, responseToCache);
      }
    }
    
    return networkResponse;
  } catch (networkError) {
    console.log('Network failed, trying cache:', request.url, networkError.message);
    
    const cachedResponse = await getCachedResponse(request, cacheName, maxAge);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return fallback if available
    if (fallback) {
      const fallbackResponse = await caches.match(fallback);
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }
    
    // Return offline page or error
    return new Response(
      JSON.stringify({ error: 'Network unavailable and no cached version found' }),
      { 
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Cache First - try cache, fall back to network
async function cacheFirst(request, cacheName, maxAge) {
  const cachedResponse = await getCachedResponse(request, cacheName, maxAge);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      const responseToCache = networkResponse.clone();
      
      // Add timestamp for expiration
      if (maxAge) {
        const headers = new Headers(responseToCache.headers);
        headers.set('sw-cache-timestamp', Date.now().toString());
        const modifiedResponse = new Response(responseToCache.body, {
          status: responseToCache.status,
          statusText: responseToCache.statusText,
          headers
        });
        cache.put(request, modifiedResponse);
      } else {
        cache.put(request, responseToCache);
      }
    }
    
    return networkResponse;
  } catch (networkError) {
    console.error('Network and cache failed:', networkError);
    return new Response(
      JSON.stringify({ error: 'Network and cache unavailable' }),
      { 
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Stale While Revalidate - return cache immediately, update in background
async function staleWhileRevalidate(request, cacheName, maxAge) {
  const cachedResponse = await getCachedResponse(request, cacheName, maxAge);
  
  // Start network request in background
  const networkRequest = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      const responseToCache = networkResponse.clone();
      
      // Add timestamp for expiration
      if (maxAge) {
        const headers = new Headers(responseToCache.headers);
        headers.set('sw-cache-timestamp', Date.now().toString());
        const modifiedResponse = new Response(responseToCache.body, {
          status: responseToCache.status,
          statusText: responseToCache.statusText,
          headers
        });
        cache.put(request, modifiedResponse);
      } else {
        cache.put(request, responseToCache);
      }
    }
    return networkResponse;
  }).catch((networkError) => {
    // Ignore network errors in background update
    console.warn('Background network update failed:', networkError);
  });

  // Return cached response immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Wait for network if no cache available
  return networkRequest;
}

// Get cached response with expiration check
async function getCachedResponse(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (!cachedResponse) {
    return null;
  }
  
  // Check expiration if maxAge is specified
  if (maxAge) {
    const timestamp = cachedResponse.headers.get('sw-cache-timestamp');
    if (timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      if (age > maxAge) {
        // Remove expired cache
        cache.delete(request);
        return null;
      }
    }
  }
  
  return cachedResponse;
}

// Utility functions

function isImageRequest(request) {
  return request.destination === 'image' || 
         request.url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i);
}

function isStaticAsset(request) {
  return request.url.match(/\.(css|js|woff|woff2|ttf|eot)$/i) ||
         request.url.includes('/assets/');
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-orders') {
    event.waitUntil(syncOrders());
  } else if (event.tag === 'background-sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

// Sync offline orders when online
async function syncOrders() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    
    const offlineOrders = requests.filter(request => 
      request.url.includes('/api/orders') && request.method === 'POST'
    );
    
    for (const request of offlineOrders) {
      try {
        await fetch(request.clone());
        await cache.delete(request);
        console.log('Synced offline order:', request.url);
      } catch (error) {
        console.error('Failed to sync order:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Sync offline favorites when online
async function syncFavorites() {
  try {
    // Implementation for syncing favorite products
    console.log('Syncing favorites...');
  } catch (error) {
    console.error('Failed to sync favorites:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from AgriConnect',
    icon: '/assets/logo.png',
    badge: '/assets/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Products',
        icon: '/assets/icons/grid.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/x.svg'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('AgriConnect', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/products')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      cacheUrls(event.data.urls)
    );
  } else if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      clearAllCaches()
    );
  }
});

// Cache specific URLs
async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  return cache.addAll(urls);
}

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

// Periodic cache cleanup
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupExpiredCache());
  }
});

// Clean up expired cache entries
async function cleanupExpiredCache() {
  const cacheNames = [DYNAMIC_CACHE, IMAGE_CACHE];
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      const timestamp = response.headers.get('sw-cache-timestamp');
      
      if (timestamp) {
        const age = Date.now() - parseInt(timestamp, 10);
        // Remove entries older than 24 hours
        if (age > 24 * 60 * 60 * 1000) {
          await cache.delete(request);
          console.log('Cleaned up expired cache entry:', request.url);
        }
      }
    }
  }
}