// Service Worker para PWA
const CACHE_NAME = 'maquirent-v1.0.0';
const STATIC_CACHE_NAME = 'maquirent-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'maquirent-dynamic-v1.0.0';

// Archivos estáticos para cachear
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// URLs de la API que queremos cachear
const API_CACHE_PATTERNS = [
  /\/api\/machinery/,
  /\/api\/vehicles/,
  /\/api\/warehouses/,
  /\/api\/tools/,
  /\/api\/spareparts/,
  /\/api\/alerts/
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Interceptar peticiones de red
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo manejar peticiones HTTP/HTTPS
  if (!request.url.startsWith('http')) {
    return;
  }

  // Estrategia Cache First para archivos estáticos
  if (STATIC_FILES.some(file => request.url.includes(file)) || 
      request.destination === 'image' || 
      request.destination === 'style' || 
      request.destination === 'script') {
    
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return response;
            });
        })
        .catch(() => {
          // Fallback para imágenes
          if (request.destination === 'image') {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#9ca3af">Sin imagen</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          }
        })
    );
    return;
  }

  // Estrategia Network First para API calls
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // Respuesta offline para APIs
              return new Response(
                JSON.stringify({
                  error: 'Sin conexión',
                  message: 'Esta información no está disponible sin conexión a internet',
                  offline: true
                }),
                {
                  status: 503,
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        })
    );
    return;
  }

  // Estrategia Network First para el resto
  event.respondWith(
    fetch(request)
      .catch(() => {
        return caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Página offline de fallback
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Sincronización en segundo plano
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Aquí puedes implementar lógica para sincronizar datos
      // cuando se recupere la conexión
      syncOfflineData()
    );
  }
});

// Función para sincronizar datos offline
async function syncOfflineData() {
  try {
    // Obtener datos pendientes del IndexedDB
    const pendingData = await getPendingOfflineData();
    
    for (const data of pendingData) {
      try {
        await fetch(data.url, {
          method: data.method,
          headers: data.headers,
          body: data.body
        });
        
        // Eliminar datos sincronizados
        await removePendingData(data.id);
      } catch (error) {
        console.error('Error syncing data:', error);
      }
    }
  } catch (error) {
    console.error('Error in background sync:', error);
  }
}

// Funciones auxiliares para IndexedDB (implementar según necesidades)
async function getPendingOfflineData() {
  // Implementar lógica para obtener datos pendientes
  return [];
}

async function removePendingData(id) {
  // Implementar lógica para eliminar datos sincronizados
}