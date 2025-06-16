/**
 * Utilidad para manejo seguro de URLs
 * Proporciona funciones para crear y validar URLs de manera segura
 */

// URL segura por defecto
const DEFAULT_SAFE_URL = 'https://chileaovivo.com';

// Lista de dominios permitidos (opcional, para validación adicional)
const ALLOWED_DOMAINS = [
  'chileaovivo.com',
  'chileaovivo.net',
  'localhost',
  '127.0.0.1'
];

/**
 * Crea una URL segura a partir de un path y una base
 * @param {string} path - Ruta o URL relativa/absoluta
 * @param {string} [base] - URL base (opcional)
 * @returns {string} URL válida o cadena vacía si hay error
 */
export const createSafeUrl = (path, base) => {
  try {
    // 1. Validar y limpiar el path
    if (path === null || path === undefined || path === '') {
      console.warn('URL Validation: No se proporcionó un path');
      return '';
    }

    const cleanPath = String(path).trim();
    if (!cleanPath) {
      console.warn('URL Validation: El path está vacío');
      return '';
    }

    // 2. Si ya es una URL absoluta válida, devolverla
    if (isValidAbsoluteUrl(cleanPath)) {
      return cleanPath;
    }

    // 3. Obtener la URL base
    let baseUrl = '';
    
    // Usar la base proporcionada o obtenerla del entorno
    if (base) {
      baseUrl = String(base).trim();
    } else if (typeof window !== 'undefined' && window.location) {
      baseUrl = window.location.origin;
    } else {
      baseUrl = getAppBaseUrl();
    }

    // Asegurar que la base sea válida
    baseUrl = baseUrl.trim();
    if (!baseUrl) {
      console.warn('URL Base: Usando URL base por defecto');
      baseUrl = DEFAULT_SAFE_URL;
    }

    // Asegurar que la base tenga protocolo
    if (!/^https?:\/\//i.test(baseUrl)) {
      baseUrl = 'https://' + baseUrl.replace(/^\/\//, '');
    }

    // Limpiar la URL base
    baseUrl = baseUrl.replace(/\/+$/, '');

    // Manejar el caso especial de path raíz
    if (cleanPath === '/') {
      return baseUrl + '/';
    }

    // Limpiar el path
    const cleanRelativePath = cleanPath.replace(/^\/+/, '');

    // Construir la URL final
    try {
      // Usar el constructor URL con base
      const url = new URL(cleanRelativePath, baseUrl);
      
      // Validar el dominio si es necesario
      if (ALLOWED_DOMAINS.length > 0) {
        const domain = url.hostname.replace(/^www\./, '');
        if (!ALLOWED_DOMAINS.includes(domain)) {
          console.warn(`URL Validation: Dominio no permitido: ${domain}`);
          return '';
        }
      }
      
      return url.toString();
    } catch (error) {
      console.warn('URL Construction: Error al construir URL:', {
        base: baseUrl,
        path: cleanPath,
        error: error.message
      });
      return '';
    }
  } catch (error) {
    console.error('URL Error: Error inesperado:', error);
    return '';
  }
};

/**
 * Verifica si una URL es absoluta y válida
 * @param {string} url - URL a verificar
 * @returns {boolean} true si es una URL absoluta válida
 */
const isValidAbsoluteUrl = (url) => {
  try {
    // Verificar si comienza con http:// o https://
    if (!/^https?:\/\//i.test(url)) return false;
    
    // Validar la URL
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Valida si una cadena es una URL válida
 * @param {string} url - URL a validar
 * @param {Object} [options] - Opciones de validación
 * @param {boolean} [options.requireProtocol=true] - Si se requiere el protocolo (http:// o https://)
 * @param {string[]} [options.allowedProtocols=['http:', 'https:']] - Protocolos permitidos
 * @param {boolean} [options.checkDomain=true] - Si se debe verificar el dominio contra la lista de permitidos
 * @returns {boolean} true si es una URL válida
 */
export const isValidUrl = (url, options = {}) => {
  // Validación básica de entrada
  if (typeof url !== 'string' || !url.trim()) {
    return false;
  }

  const {
    requireProtocol = true,
    allowedProtocols = ['http:', 'https:'],
    checkDomain = true
  } = options;

  const cleanUrl = url.trim();
  
  // Verificar si es una ruta relativa
  if (!requireProtocol && !/^[a-z]+:\/\//i.test(cleanUrl)) {
    // Validar que no contenga caracteres inválidos para una ruta relativa
    const invalidChars = [' ', '<', '>', '{', '}', '|', '^', '`', '\\', '"', '\\'];
    if (invalidChars.some(char => cleanUrl.includes(char))) {
      return false;
    }
    return true;
  }

  try {
    // Verificar si es una URL absoluta válida
    const parsedUrl = new URL(cleanUrl);
    
    // Verificar protocolo requerido
    if (requireProtocol && !parsedUrl.protocol) {
      return false;
    }
    
    // Verificar protocolos permitidos
    if (parsedUrl.protocol && !allowedProtocols.includes(parsedUrl.protocol.toLowerCase())) {
      return false;
    }
    
    // Verificar hostname para URLs absolutas
    if (requireProtocol && !parsedUrl.hostname) {
      return false;
    }
    
    // Verificar dominio contra la lista de permitidos si es necesario
    if (checkDomain && ALLOWED_DOMAINS.length > 0 && parsedUrl.hostname) {
      const domain = parsedUrl.hostname.replace(/^www\./i, '').toLowerCase();
      if (!ALLOWED_DOMAINS.some(allowed => domain === allowed.toLowerCase())) {
        return false;
      }
    }
    
    return true;
  } catch (e) {
    // Si llegamos aquí, la URL no es válida
    return false;
  }
};

/**
 * Obtiene la URL base de la aplicación
 * @returns {string} URL base
 */
export const getAppBaseUrl = () => {
  try {
    // 1. En el navegador, usar la URL actual
    if (typeof window !== 'undefined' && window.location) {
      return window.location.origin;
    }

    // 2. Verificar variables de entorno de Vite (import.meta.env)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      const env = import.meta.env;
      if (env.VITE_BASE_URL) return env.VITE_BASE_URL;
      if (env.REACT_APP_BASE_URL) return env.REACT_APP_BASE_URL;
      if (env.NEXT_PUBLIC_BASE_URL) return env.NEXT_PUBLIC_BASE_URL;
    }

    // 3. Verificar variables de entorno de Node.js (process.env)
    if (typeof process !== 'undefined' && process.env) {
      // Verificar variables de Netlify
      if (process.env.NETLIFY === 'true' && process.env.URL) {
        return process.env.URL;
      }
      
      // Verificar otras variables de entorno comunes
      if (process.env.VITE_BASE_URL) return process.env.VITE_BASE_URL;
      if (process.env.REACT_APP_BASE_URL) return process.env.REACT_APP_BASE_URL;
      if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
      if (process.env.BASE_URL) return process.env.BASE_URL;
      if (process.env.URL) {
        const url = process.env.URL.toString().trim();
        return url.startsWith('http') ? url : `https://${url}`;
      }
    }

    // 4. Valor por defecto seguro
    console.warn('getAppBaseUrl: Usando URL base por defecto: https://chileaovivo.com');
    return 'https://chileaovivo.com';
  } catch (error) {
    console.error('Error al obtener la URL base:', error);
    return 'https://chileaovivo.com';
  }
};
