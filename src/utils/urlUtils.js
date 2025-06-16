/**
 * Utilidad para manejo seguro de URLs
 * Proporciona funciones para crear y validar URLs de manera segura
 * 
 * Este módulo implementa un enfoque defensivo para el manejo de URLs,
 * asegurando que nunca se produzcan errores de construcción de URL.
 */

// URL segura por defecto que se usará como respaldo
const DEFAULT_SAFE_URL = 'https://chileaovivo.com';

// Lista de dominios permitidos (seguridad adicional)
const ALLOWED_DOMAINS = new Set([
  'chileaovivo.com',
  'chileaovivo.net',
  'localhost',
  '127.0.0.1'
]);

// Clase de error personalizada para errores de URL
class URLError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'URLError';
    this.cause = cause;
  }
}

/**
 * Envoltura segura alrededor del constructor URL que nunca falla
 * @param {string} url - URL a analizar
 * @param {string} [base] - URL base opcional
 * @returns {URL} Objeto URL válido o un objeto con valores por defecto
 */
const safeURL = (url, base) => {
  // Objeto URL por defecto seguro
  const defaultURL = {
    href: DEFAULT_SAFE_URL,
    protocol: 'https:',
    hostname: 'chileaovivo.com',
    pathname: '/',
    search: '',
    hash: '',
    toString: () => DEFAULT_SAFE_URL
  };

  try {
    // Si no hay URL, devolver el valor por defecto
    if (!url) return defaultURL;
    
    // Si es una URL absoluta, intentar analizarla directamente
    if (/^https?:\/\//i.test(url)) {
      return new URL(url);
    }
    
    // Si tenemos una base, intentar construir la URL relativa
    if (base) {
      return new URL(url, base);
    }
    
    // Si no hay base, intentar con la URL actual
    if (typeof window !== 'undefined' && window.location) {
      return new URL(url, window.location.origin);
    }
    
    // Si todo falla, usar la URL por defecto
    return defaultURL;
  } catch (error) {
    console.warn('Error al analizar URL:', { url, base, error: error.message });
    return defaultURL;
  }
};

/**
 * Crea una URL segura a partir de un path y una base
 * @param {string} path - Ruta o URL relativa/absoluta
 * @param {string} [base] - URL base (opcional)
 * @returns {string} URL válida o cadena vacía si hay error
 */
export const createSafeUrl = (path, base) => {
  // 1. Validación básica del path
  if (path === null || path === undefined || path === '') {
    console.warn('URL Validation: No se proporcionó un path');
    return '';
  }

  const cleanPath = String(path).trim();
  if (!cleanPath) {
    console.warn('URL Validation: El path está vacío');
    return '';
  }

  // 2. Usar safeURL para construir la URL de manera segura
  const url = safeURL(cleanPath, base);
  
  // 3. Validar el dominio si es necesario
  if (ALLOWED_DOMAINS.size > 0 && url.hostname) {
    const domain = url.hostname.replace(/^www\./i, '').toLowerCase();
    if (!ALLOWED_DOMAINS.has(domain)) {
      console.warn(`URL Validation: Dominio no permitido: ${domain}`);
      return '';
    }
  }

  // 4. Devolver la URL como string
  return url.toString();
};

/**
 * Verifica si una URL es absoluta y válida
 * @param {string} url - URL a verificar
 * @returns {boolean} true si es una URL absoluta válida
 */
const isValidAbsoluteUrl = (url) => {
  if (typeof url !== 'string' || !url.trim()) {
    return false;
  }
  
  // Verificar si comienza con http:// o https://
  if (!/^https?:\/\//i.test(url)) {
    return false;
  }
  
  // Usar safeURL para validar sin lanzar excepciones
  const urlObj = safeURL(url);
  return urlObj.href !== DEFAULT_SAFE_URL;
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

      // 2. Intentar obtener de variables de entorno (Vite, React, Next.js, etc.)
    const envVars = [
      // Variables de Vite (import.meta.env)
      typeof import.meta !== 'undefined' && import.meta.env?.VITE_BASE_URL,
      
      // Variables de entorno de Node.js (process.env)
      typeof process !== 'undefined' && process.env?.REACT_APP_BASE_URL,
      typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_BASE_URL,
      typeof process !== 'undefined' && process.env?.BASE_URL,
      typeof process !== 'undefined' && process.env?.URL,
      typeof process !== 'undefined' && process.env?.VERCEL_URL
    ].filter(Boolean);  // Filtrar valores nulos o undefined

    // 3. Buscar la primera variable de entorno válida
    for (const envVar of envVars) {
      if (envVar) {
        const cleanUrl = String(envVar).trim();
        if (cleanUrl) {
          // Usar safeURL para validar la URL
          const url = safeURL(cleanUrl);
          if (url.href !== DEFAULT_SAFE_URL) {
            return url.href.replace(/\/+$/, '');
          }
        }
      }
    }

    // 4. Valor por defecto seguro
    console.warn('getAppBaseUrl: Usando URL base por defecto');
    return DEFAULT_SAFE_URL;
  } catch (error) {
    console.error('Error al obtener la URL base:', error);
    return DEFAULT_SAFE_URL;
  }
};
