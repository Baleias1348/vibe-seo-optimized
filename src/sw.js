// Este es un service worker básico que se registrará automáticamente
// gracias a la configuración de Vite PWA

const CACHE_NAME = 'vibe-chile-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/vite.svg',
  // Añade aquí otros recursos estáticos que quieras cachear
];

self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  
  // Realiza la instalación del service worker
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devuelve la respuesta en caché si está disponible
        if (response) {
          return response;
        }
        
        // Si no está en caché, realiza la petición a la red
        return fetch(event.request).then((response) => {
          // Verifica si la respuesta es válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clona la respuesta para almacenarla en caché
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activado');
  
  // Elimina caches antiguos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName !== CACHE_NAME;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});
