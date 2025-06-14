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
  centrosEsqui: '/centros-esqui',
  centroEsquiDetail: (slug) => `/centros-esqui/${slug}`,
  clima: '/clima',
  climaDetallado: '/clima/detallado',
  conversorMoneda: '/conversor/moneda',
  casasCambio: '/casas-de-cambio',
  vinhosEVinhedos: '/vinhos-e-vinhedos',
  vinicolas: '/vinicolas',
  vinicolaDetail: (slug) => `/vinicolas/${slug}`,
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
    vinhosEVinhedos: '/vinhos-e-vinhedos',
  },
  
  // Redes sociales
  redesSociales: {
    facebook: 'https://www.facebook.com/ChileTravel',
    instagram: 'https://www.instagram.com/chiletravel/',
    twitter: 'https://twitter.com/chiletravel',
    youtube: 'https://www.youtube.com/chiletravel',
    pinterest: 'https://pinterest.com/chiletravel',
    tiktok: 'https://www.tiktok.com/@chiletravel',
    whatsapp: 'https://wa.me/56912345678',
    email: 'hola@chile.travel',
    telefono: '+56912345678',
  },
  
  // Vinhos e Vinhedos - Redes
  redesVinhos: {
    facebookVinhos: 'https://www.facebook.com/ChileWine',
    instagramVinhos: 'https://www.instagram.com/chilewine/',
  },
  
  // URLs completas para SEO
  canonical: {
    home: `${BASE_URL}/`,
    tours: `${BASE_URL}/tours`,
    casasCambio: `${BASE_URL}/casas-de-cambio`,
    vinhosEVinhedos: `${BASE_URL}/vinhos-e-vinhedos`,
    tourDetail: (tourId) => `${BASE_URL}/tours/${tourId}`,
    restaurantes: `${BASE_URL}/restaurantes`,
    centrosEsqui: `${BASE_URL}/centros-esqui`,
    centroEsquiDetail: (slug) => `${BASE_URL}/centros-esqui/${slug}`,
    blogPost: (slug) => `${BASE_URL}/blog/${slug}`,
  },
};

export default urls;
