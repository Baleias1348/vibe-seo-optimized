/**
 * Configuración de URLs canónicas para el sitio
 * 
 * Este archivo centraliza todas las URLs de la aplicación para mantener consistencia
 * y facilitar el mantenimiento.
 */

// Importar la variable de entorno de Vite
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://tudominio.com';

// Para compatibilidad con el código existente
const process = {
  env: {
    REACT_APP_BASE_URL: import.meta.env.VITE_BASE_URL || 'https://tudominio.com'
  }
};

const urls = {
  // Páginas principales
  home: '/',
  tours: '/tours',
  tourDetail: (tourId) => `/tours/${tourId}`,
  restaurantes: '/restaurantes',
  centrosEsqui: '/centros-de-esqui',
  centroEsquiDetail: (slug) => `/centros-de-esqui/${slug}`,
  clima: '/clima',
  climaDetallado: '/clima/detallado',
  conversorMoneda: '/conversor/moneda',
  casasCambio: '/casas-de-cambio',
  vinosVinicolas: '/vinos-y-vinicolas',
  emergencias: '/emergencias',
  inversion: '/inversion',
  blog: '/blog',
  blogPost: (slug) => `/blog/${slug}`,
  contacto: '/contacto',
  
  // Admin
  admin: {
    login: '/admin/login',
    actualizarContrasena: '/admin/actualizar-contrasena',
    dashboard: '/admin',
  },
  
  // Redirecciones para mantener compatibilidad
  redirecciones: {
    homeOriginal: '/home-original',
    passeios: '/passeios',
    passeioDetail: (tourId) => `/passeios/${tourId}`,
    centrosDeEsqui: '/centros-de-esqui',
    centroDeEsquiDetail: (slug) => `/centros-de-esqui/${slug}`,
    climaDetalhado: '/clima-detalhado',
    conversorMoeda: '/conversor-moeda',
    investirChile: '/investir-chile',
    contact: '/contact',
  },
  
  // URLs completas para SEO
  canonical: {
    home: `${BASE_URL}/`,
    tours: `${BASE_URL}/tours`,
    casasCambio: `${BASE_URL}/casas-de-cambio`,
    vinosVinicolas: `${BASE_URL}/vinos-y-vinicolas`,
    tourDetail: (tourId) => `${BASE_URL}/tours/${tourId}`,
    restaurantes: `${BASE_URL}/restaurantes`,
    centrosDeEsqui: `${BASE_URL}/centros-de-esqui`,
    centroDeEsquiDetail: (slug) => `${BASE_URL}/centros-de-esqui/${slug}`,
    blogPost: (slug) => `${BASE_URL}/blog/${slug}`,
  },
};

export default urls;
