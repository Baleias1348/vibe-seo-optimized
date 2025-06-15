/**
 * Utilidad para generar sitemap.xml dinámico
 * Este archivo se puede ejecutar durante el build o como una ruta de API
 * 
 * Convertido a CommonJS para compatibilidad con el proceso de construcción
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
    
    // 4. Valor por defecto seguro
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

// Función para validar y limpiar la URL base
const cleanBaseUrl = (url) => {
  if (!url) return 'https://chileaovivo.com';
  
  // Asegurarse de que la URL tenga protocolo
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url.replace(/^\/+/, '');
  }
  
  // Eliminar barras al final
  url = url.replace(/\/+$/, '');
  
  return url;
};

// Función para generar una URL válida de manera segura
const createValidUrl = (path, baseUrl) => {
  try {
    // Limpiar la URL base
    const cleanBase = cleanBaseUrl(baseUrl);
    
    // Validar que la URL base sea válida
    if (!cleanBase) {
      console.error('URL base inválida:', baseUrl);
      return 'https://chileaovivo.com/';
    }
    
    // Asegurarse de que el path sea una cadena y no esté vacío
    const cleanPath = path && typeof path === 'string' 
      ? path.startsWith('/') 
        ? path 
        : `/${path}`
      : '/';
    
    // Crear la URL de manera segura
    try {
      const url = new URL(cleanPath, cleanBase);
      return url.toString();
    } catch (error) {
      console.error(`Error al crear URL para ${cleanPath} con base ${cleanBase}:`, error);
      return 'https://chileaovivo.com/';
    }
  } catch (error) {
    console.error('Error inesperado en createValidUrl:', error);
    return 'https://chileaovivo.com/';
  }
};

// Función para generar el XML del sitemap
const generateSitemap = (routes = staticRoutes, baseUrl) => {
  try {
    // Obtener la URL base, usando el parámetro si se proporciona
    let siteUrl = baseUrl || getBaseUrl();
    
    // Limpiar y validar la URL base
    siteUrl = cleanBaseUrl(siteUrl);
    
    // Asegurarse de que siteUrl es una URL válida
    if (!siteUrl || typeof siteUrl !== 'string') {
      console.error('URL base inválida para el sitemap:', siteUrl);
      siteUrl = 'https://chileaovivo.com';
    }
    
    console.log('Generando sitemap con URL base:', siteUrl);
    
    // Validar que las rutas sean un array
    if (!Array.isArray(routes)) {
      console.error('Las rutas deben ser un array');
      routes = [];
    }
  
    const urlElements = routes.map(route => {
      try {
        // Validar que route sea un objeto y route.url sea una cadena
        if (!route || typeof route !== 'object' || !route.url || typeof route.url !== 'string') {
          console.warn('Ruta inválida en el sitemap:', route);
          return '';
        }
        
        // Validar que la URL no esté vacía
        const urlPath = route.url.trim();
        if (!urlPath) {
          console.warn('URL vacía en ruta del sitemap:', route);
          return '';
        }
        
        const url = createValidUrl(urlPath, siteUrl);
        return `
          <url>
            <loc>${url}</loc>
            <lastmod>${route.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
            <changefreq>${route.changefreq || 'weekly'}</changefreq>
            <priority>${route.priority || '0.5'}</priority>
          </url>`;
      } catch (error) {
        console.error('Error al procesar ruta del sitemap:', route, error);
        return '';
      }
    }).filter(Boolean).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urlElements}
      </urlset>`;
  } catch (error) {
    console.error('Error al generar el sitemap:', error);
    // Devolver un sitemap mínimo en caso de error
    return `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://chileaovivo.com/</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
      </urlset>`;
  }
};

// Exportar para uso en otros módulos
module.exports = {
  generateSitemap,
  staticRoutes,
  getBaseUrl
};

// Si se ejecuta directamente (node generateSitemap.js)
if (require.main === module) {
  try {
    // Obtener la ruta base
    const baseUrl = getBaseUrl();
    console.log('Sitemap - Generando sitemap para URL base:', baseUrl);

    // Generar el sitemap
    const sitemap = generateSitemap(staticRoutes, baseUrl);

    // Crear directorio dist si no existe
    const fs = require('fs');
    const path = require('path');
    const distDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // Escribir el archivo sitemap.xml
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
    console.log('Sitemap - sitemap.xml generado correctamente');
  } catch (error) {
    console.error('Error al generar el sitemap:', error);
    process.exit(1);
  }
}
