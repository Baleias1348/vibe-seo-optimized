/**
 * Configuración de URLs canónicas para el sitio
 * 
 * Este archivo centraliza todas las URLs de la aplicación para mantener consistencia
 * y facilitar el mantenimiento.
 */

import { createSafeUrl, getAppBaseUrl } from '../utils/urlUtils';

// Función segura para construir URLs
const buildUrl = (path, base) => {
  return createSafeUrl(path, base);
};

// Configuración de la URL base
let BASE_URL;

try {
  // Obtener la URL base
  BASE_URL = getAppBaseUrl();
  
  // Validar la URL base
  new URL(BASE_URL);
  
  // Mostrar la URL base que se está utilizando
  console.log('URL base de la aplicación:', BASE_URL);
} catch (error) {
  console.warn('Error al configurar la URL base, usando valor por defecto:', error);
  BASE_URL = 'https://chileaovivo.com';
}

// Para compatibilidad con el código existente
const process = {
  env: {
    REACT_APP_BASE_URL: BASE_URL
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
  
  // URLs completas para SEO - Usando la función segura buildUrl
  canonical: {
    home: buildUrl('/', BASE_URL),
    tours: buildUrl('/tours', BASE_URL),
    casasCambio: buildUrl('/casas-de-cambio', BASE_URL),
    vinhosEVinhedos: buildUrl('/vinhos-e-vinhedos', BASE_URL),
    tourDetail: (tourId) => buildUrl(`/tours/${tourId}`, BASE_URL),
    restaurantes: buildUrl('/restaurantes', BASE_URL),
    centrosEsqui: buildUrl('/centros-esqui', BASE_URL),
    centroEsquiDetail: (slug) => buildUrl(`/centros-esqui/${slug}`, BASE_URL),
    blogPost: (slug) => buildUrl(`/blog/${slug}`, BASE_URL),
  },
};

export default urls;
