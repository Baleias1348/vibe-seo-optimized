/**
 * Utilidad para generar sitemap.xml dinámico
 * Este archivo se puede ejecutar durante el build o como una ruta de API
 */

// Función segura para obtener la URL base
function getBaseUrl(customBaseUrl) {
  // Si se proporciona una URL base personalizada, usarla
  if (customBaseUrl) {
    return customBaseUrl.endsWith('/') ? customBaseUrl.slice(0, -1) : customBaseUrl;
  }
  
  try {
    // 1. Primero intentamos con Netlify (si está disponible)
    if (typeof process !== 'undefined' && process.env) {
      if (process.env.NETLIFY && process.env.URL) {
        const url = process.env.URL.startsWith('http') 
          ? process.env.URL 
          : `https://${process.env.URL}`;
        return url.endsWith('/') ? url.slice(0, -1) : url;
      }
      
      // 2. Luego con Node.js process.env (para Netlify y otros entornos)
      if (process.env.VITE_BASE_URL) {
        const url = process.env.VITE_BASE_URL;
        return url.endsWith('/') ? url.slice(0, -1) : url;
      }
      
      // 3. Verificar en process.env (para compatibilidad)
      if (process.env.BASE_URL) {
        const url = process.env.BASE_URL;
        return url.endsWith('/') ? url.slice(0, -1) : url;
      }
    }
    
    // 4. Luego intentamos con Vite (en el navegador o SSR)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      if (import.meta.env.VITE_BASE_URL) {
        const url = import.meta.env.VITE_BASE_URL;
        return url.endsWith('/') ? url.slice(0, -1) : url;
      }
      if (import.meta.env.BASE_URL) {
        const url = import.meta.env.BASE_URL;
        return url.endsWith('/') ? url.slice(0, -1) : url;
      }
    }
    
    // 5. Valor por defecto seguro
    return 'https://chileaovivo.com';
  } catch (error) {
    console.warn('No se pudo determinar la URL base, usando valor por defecto');
    return 'https://chileaovivo.com';
  }
}

// Obtenemos la URL base de manera segura
let BASE_URL = getBaseUrl();

// Limpieza de la URL base
BASE_URL = BASE_URL
  .replace(/\/+$/, '') // Eliminar barras al final
  .replace(/^(https?:\/\/|\/\/)/, 'https://') // Asegurar protocolo https
  .replace(/\s+/g, ''); // Eliminar espacios en blanco

// Función para depuración
console.log('Sitemap - URL base configurada como:', BASE_URL);

// Datos de ejemplo - reemplazar con datos reales de tu aplicación
const staticRoutes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/tours', changefreq: 'daily', priority: 0.9 },
  { url: '/restaurantes', changefreq: 'weekly', priority: 0.9 },
  { url: '/centros-esqui', changefreq: 'weekly', priority: 0.8 },
  { url: '/clima', changefreq: 'hourly', priority: 0.7 },
  { url: '/clima/detallado', changefreq: 'hourly', priority: 0.6 },
  { url: '/conversor/moneda', changefreq: 'monthly', priority: 0.5 },
  { url: '/emergencias', changefreq: 'monthly', priority: 0.5 },
  { url: '/inversion', changefreq: 'monthly', priority: 0.5 },
  { url: '/blog', changefreq: 'weekly', priority: 0.7 },
  { url: '/blog/mariscos-chilenos', changefreq: 'monthly', priority: 0.6, lastmod: '2025-06-14' },
  { url: '/contacto', changefreq: 'monthly', priority: 0.4 },
];

// Función para generar una URL válida de manera segura
const createValidUrl = (path, baseUrl) => {
  try {
    // Asegurarse de que el path comience con /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    // Crear la URL de manera segura
    return new URL(cleanPath, baseUrl).toString();
  } catch (error) {
    console.error(`Error al crear URL para ${path}:`, error);
    // Devolver una URL por defecto en caso de error
    return new URL('/', baseUrl).toString();
  }
};

// Función para generar el XML del sitemap
export const generateSitemap = (routes = staticRoutes, baseUrl) => {
  // Obtener la URL base, usando el parámetro si se proporciona
  const siteUrl = baseUrl || getBaseUrl();
  
  // Asegurarse de que siteUrl es una URL válida
  if (!siteUrl || typeof siteUrl !== 'string') {
    console.error('URL base inválida para el sitemap:', siteUrl);
    return '';
  }
  
  const urlElements = routes.map(route => {
    // Validar que route.url sea una cadena
    if (typeof route.url !== 'string') {
      console.warn('Ruta inválida en sitemap:', route);
      return '';
    }
    
    const url = createValidUrl(route.url, siteUrl);
    return `
    <url>
      <loc>${url}</loc>
      ${route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : ''}
      <changefreq>${route.changefreq || 'weekly'}</changefreq>
      <priority>${route.priority || '0.5'}</priority>
    </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${urlElements}
</urlset>`;
};

// Para uso en Node.js (ejecución durante el build)
if (typeof module !== 'undefined' && module.exports) {
  const fs = require('fs');
  const path = require('path');
  
  // Obtener la URL base de las variables de entorno o usar un valor por defecto
  const baseUrl = process.env.VITE_BASE_URL || 'https://chileaovivo.com';
  
  try {
    // Generar sitemap durante el build con la URL base
    const sitemap = generateSitemap(staticRoutes, baseUrl);
    const publicDir = path.join(process.cwd(), 'public');
    const distDir = path.join(process.cwd(), 'dist');
    
    // Asegurarse de que exista el directorio de salida
    [publicDir, distDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Escribir el sitemap en ambos directorios para mayor compatibilidad
      fs.writeFileSync(path.join(dir, 'sitemap.xml'), sitemap);
      console.log(`Sitemap generado en: ${path.join(dir, 'sitemap.xml')}`);
    });
    
  } catch (error) {
    console.error('Error al generar el sitemap:', error);
    process.exit(1);
  }
}
