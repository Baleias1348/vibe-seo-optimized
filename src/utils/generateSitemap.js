/**
 * Utilidad para generar sitemap.xml dinámico
 * Este archivo se puede ejecutar durante el build o como una ruta de API
 */

// Función segura para obtener la URL base
function getBaseUrl() {
  try {
    // 1. Primero intentamos con Netlify (si está disponible)
    if (process.env.NETLIFY && process.env.URL) {
      return `https://${process.env.URL}`.replace(/^https?:\/\//, 'https://');
    }
    
    // 2. Luego con Node.js process.env (para Netlify y otros entornos)
    if (process.env.VITE_BASE_URL) {
      return process.env.VITE_BASE_URL;
    }
    
    // 3. Luego intentamos con Vite (en el navegador o SSR)
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BASE_URL) {
      return import.meta.env.VITE_BASE_URL;
    }
    
    // 4. Valor por defecto seguro
    return 'https://chileaovivo.com';
  } catch (error) {
    console.error('Error al obtener la URL base:', error);
    return 'https://chileaovivo.com';
  }
}

// Obtenemos la URL base de manera segura
const BASE_URL = getBaseUrl().replace(/\/+$/, ''); // Aseguramos que no termine en /

// Función para depuración
console.log('Sitemap - URL base:', BASE_URL);

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
    const url = new URL(route.url, getBaseUrl()).toString();
    return `
    <url>
      <loc>${url}</loc>
      ${route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : ''}
      <changefreq>${route.changefreq}</changefreq>
      <priority>${route.priority}</priority>
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
  
  const sitemap = generateSitemap();
  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  
  fs.writeFileSync(outputPath, sitemap);
  console.log('Sitemap generado en:', outputPath);
}
