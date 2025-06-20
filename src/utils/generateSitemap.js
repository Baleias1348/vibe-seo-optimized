/**
 * Utilidad para generar sitemap.xml dinámico
 * Este archivo se puede ejecutar durante el build o como una ruta de API
 */

// Función para obtener la URL base de manera segura
const getBaseUrl = () => {
  try {
    // Si estamos en Netlify, usar la URL de Netlify
    if (process?.env?.NETLIFY === 'true' || process?.env?.CONTEXT === 'production') {
      return process.env.URL || 'https://tudominio.com';
    }
    
    // Si estamos en desarrollo local, usar la URL de desarrollo
    if (process?.env?.NODE_ENV === 'development') {
      return 'http://localhost:8081';
    }
    
    // Intentar obtener la URL base de las variables de entorno de Vite
    if (process?.env?.VITE_BASE_URL) {
      return process.env.VITE_BASE_URL;
    }
    
    // Si estamos en el navegador, intentar obtener la URL base de la ubicación actual
    if (typeof window !== 'undefined' && window.location) {
      return `${window.location.protocol}//${window.location.host}`;
    }
  } catch (error) {
    console.error('Error obteniendo la URL base:', error);
  }
  
  // Valor por defecto si todo lo demás falla
  return 'https://tudominio.com';
};

// Obtener la URL base
const BASE_URL = getBaseUrl().replace(/\/$/, ''); // Asegurarse de que no haya una barra al final

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

// Función para generar el XML del sitemap
export const generateSitemap = (routes = staticRoutes) => {
  const urlElements = routes.map(route => {
    try {
      let fullUrl;
      const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
      const cleanPath = route.url.startsWith('/') ? route.url : `/${route.url}`;
      
      // Solo intentar crear URL completa si el base es una URL válida
      try {
        // Verificar si el base parece una URL
        if (cleanBase.match(/^https?:\/\//)) {
          fullUrl = `${cleanBase}${cleanPath}`;
        } else {
          fullUrl = cleanPath;
        }
      } catch (e) {
        console.warn(`No se pudo crear URL completa para ${route.url}:`, e);
        fullUrl = cleanPath;
      }
      
      return `
    <url>
      <loc>${fullUrl}</loc>
      ${route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : ''}
      <changefreq>${route.changefreq}</changefreq>
      <priority>${route.priority}</priority>
    </url>`;
    } catch (error) {
      console.error(`Error procesando ruta: ${route.url}`, error);
      return ''; // Omitir esta URL si hay un error
    }
  }).filter(Boolean).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${urlElements}
</urlset>`;
};

// Si este archivo se ejecuta directamente, generar el sitemap
if (import.meta.url === `file://${process.argv[1]}`) {
  const fs = await import('fs');
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  
  const sitemap = generateSitemap();
  const outputPath = path.join(process.cwd(), 'public');
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  fs.writeFileSync(path.join(outputPath, 'sitemap.xml'), sitemap);
  console.log('Sitemap generado exitosamente en', path.join(outputPath, 'sitemap.xml'));
}
