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
let BASE_URL = 'https://chileaovivo.com';

try {
  // Obtener la URL base
  const baseUrl = getAppBaseUrl();
  
  // Validar la URL base
  if (baseUrl && typeof baseUrl === 'string' && baseUrl.trim() !== '') {
    // Asegurarse de que la URL tenga protocolo
    const urlWithProtocol = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
    // Validar la URL
    new URL(urlWithProtocol);
    BASE_URL = urlWithProtocol.endsWith('/') ? urlWithProtocol.slice(0, -1) : urlWithProtocol;
    console.log('URL base de la aplicación configurada a:', BASE_URL);
  } else {
    throw new Error('La URL base está vacía o no es válida');
  }
} catch (error) {
  console.warn('Error al configurar la URL base, usando valor por defecto. Razón:', error.message);
  // Asegurarse de que la URL base por defecto tenga el formato correcto
  BASE_URL = 'https://chileaovivo.com';
  console.log('Usando URL base por defecto:', BASE_URL);
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
