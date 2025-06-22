/**
 * Utilidad para generar sitemap.xml dinámico
 * Este archivo se puede ejecutar durante el build o como una ruta de API
 * 
 * Convertido a CommonJS para compatibilidad con el proceso de construcción
 */

// Usar process.env para Node.js o import.meta.env para Vite
const BASE_URL = (typeof process !== 'undefined' && process.env.VITE_BASE_URL) || 
                (typeof import.meta !== 'undefined' && import.meta.env.VITE_BASE_URL) || 
                'https://tudominio.com';

// Función segura para obtener la URL base
function getBaseUrl(customBaseUrl) {
  // Si se proporciona una URL base personalizada, validarla
  if (customBaseUrl) {
    const cleanUrl = createSafeUrl('', customBaseUrl);
    console.log(`Usando URL base personalizada: ${cleanUrl}`);
    return cleanUrl;
  }
  
  // Obtener la URL base de la aplicación
  const baseUrl = getAppBaseUrl();
  console.log(`URL base obtenida: ${baseUrl}`);
  
  return baseUrl;
}

// Obtenemos la URL base de manera segura
const BASE_URL = getBaseUrl();

// Función para validar y limpiar la URL base
const cleanBaseUrl = (url) => {
  if (!url) {
    console.warn('URL base no proporcionada, usando valor por defecto');
    return 'https://chileaovivo.com';
  }
  
  try {
    // Usar createSafeUrl para limpiar y validar la URL
    const cleanUrl = createSafeUrl('', url);
    
    // Si createSafeUrl devolvió una cadena vacía, usar valor por defecto
    if (!cleanUrl) {
      console.warn(`No se pudo limpiar la URL: ${url}, usando valor por defecto`);
      return 'https://chileaovivo.com';
    }
    
    return cleanUrl;
  } catch (error) {
    console.error('Error inesperado en cleanBaseUrl:', error);
    return 'https://chileaovivo.com';
  }
};

// Función para generar una URL válida de manera segura
const createValidUrl = (path, baseUrl) => {
  // Usar createSafeUrl para generar la URL de manera segura
  const url = createSafeUrl(path, baseUrl);
  
  // Si hay un error, createSafeUrl ya habrá registrado el error
  if (!url) {
    console.warn('No se pudo crear una URL válida, usando valor por defecto');
    return 'https://chileaovivo.com';
  }
  
  return url;
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
