/**
 * Configuración de URLs canónicas para el sitio
 * 
 * Este archivo centraliza todas las URLs de la aplicación para mantener consistencia
 * y facilitar el mantenimiento.
 */

// Función segura para construir URLs
const buildUrl = (path, base) => {
  try {
    // Si no hay base, usar la predeterminada
    const baseUrl = base || 'https://chileaovivo.com';
    
    // Limpiar la URL base
    let cleanBase = baseUrl.toString().trim();
    
    // Asegurar que la base tenga protocolo
    if (!cleanBase.startsWith('http://') && !cleanBase.startsWith('https://')) {
      cleanBase = 'https://' + cleanBase;
    }
    
    // Eliminar barras finales
    cleanBase = cleanBase.replace(/\/+$/, '');
    
    // Limpiar el path
    const cleanPath = path ? path.toString().trim() : '/';
    
    // Construir la URL de manera segura
    const url = new URL(cleanPath, cleanBase);
    return url.toString();
    
  } catch (error) {
    console.error('Error al construir URL:', { path, base, error });
    // Devolver una URL por defecto segura en caso de error
    return `https://chileaovivo.com${path ? `/${path.toString().replace(/^\/+/, '')}` : ''}`;
  }
};

// Configuración de la URL base
let BASE_URL = 'https://chileaovivo.com';

// Intentar obtener la URL base del entorno de manera segura
try {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.VITE_BASE_URL) {
      BASE_URL = process.env.VITE_BASE_URL;
    } else if (process.env.REACT_APP_BASE_URL) {
      BASE_URL = process.env.REACT_APP_BASE_URL;
    }
  }
} catch (error) {
  console.warn('No se pudo cargar la URL base del entorno:', error);
}

// Asegurar que la URL base sea válida
try {
  new URL(BASE_URL);
} catch (e) {
  console.warn(`URL base inválida: ${BASE_URL}, usando valor por defecto`);
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
