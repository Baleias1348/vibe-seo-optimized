/**
 * Utilidad para manejo seguro de URLs
 * Proporciona funciones para crear y validar URLs de manera segura
 */

/**
 * Crea una URL segura a partir de un path y una base
 * @param {string} path - Ruta o URL relativa/absoluta
 * @param {string} [base] - URL base (opcional, por defecto usa la URL actual)
 * @returns {string} URL válida o cadena vacía si hay error
 */
export const createSafeUrl = (path, base) => {
  // Si no hay path, devolver cadena vacía
  if (path === null || path === undefined) {
    console.warn('createSafeUrl: No se proporcionó un path');
    return '';
  }
  
  // Convertir a string
  const pathStr = String(path);
  
  // Si es una cadena vacía después de convertir
  if (!pathStr.trim()) {
    console.warn('createSafeUrl: El path está vacío');
    return '';
  }
  
  // Limpiar espacios y caracteres de control
  const cleanPath = pathStr.trim().replace(/[\x00-\x1F\x7F]/g, '');
  
  try {
    // Si es una URL absoluta válida, devolverla directamente
    if (isValidUrl(cleanPath, { requireProtocol: true })) {
      try {
        const url = new URL(cleanPath);
        return url.toString();
      } catch (e) {
        console.warn('createSafeUrl: Error al analizar URL absoluta:', cleanPath, e);
        return '';
      }
    }
    
    // Obtener la URL base
    let baseUrl = '';
    
    // Si se proporciona una base, usarla
    if (base) {
      baseUrl = String(base).trim();
    } 
    // Si no hay base, intentar obtenerla de diferentes fuentes
    else {
      // En el navegador, usar la URL actual
      if (typeof window !== 'undefined' && window.location) {
        baseUrl = window.location.origin;
      } 
      // En el servidor, usar la URL base de la aplicación
      else {
        baseUrl = getAppBaseUrl();
      }
    }
    
    // Limpiar y validar la URL base
    baseUrl = String(baseUrl).trim();
    
    // Si no hay base después de limpiar, usar un valor por defecto
    if (!baseUrl) {
      baseUrl = 'https://chileaovivo.com';
      console.warn('createSafeUrl: Usando URL base por defecto:', baseUrl);
    }
    
    // Asegurar que la base tenga protocolo
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl;
      console.warn('createSafeUrl: Se agregó protocolo a la URL base:', baseUrl);
    }
    
    // Eliminar barras finales de la base
    baseUrl = baseUrl.replace(/\/+$/, '');
    
    // Si el path es solo un slash, devolver la base
    if (cleanPath === '/') {
      return baseUrl + '/';
    }
    
    // Eliminar barras iniciales del path
    const cleanRelativePath = cleanPath.replace(/^\/+/, '');
    
    try {
      // Intentar construir la URL
      const url = new URL(cleanRelativePath, baseUrl);
      return url.toString();
    } catch (error) {
      console.warn('createSafeUrl: Error al construir URL con base:', {
        baseUrl,
        path: cleanPath,
        error: error.message
      });
      return '';
    }
    
  } catch (error) {
    console.error('createSafeUrl: Error inesperado:', {
      path,
      base,
      error: error.message,
      stack: error.stack
    });
    
    // Devolver una cadena vacía en caso de error inesperado
    return '';
  }
};

/**
 * Valida si una cadena es una URL válida
 * @param {string} url - URL a validar
 * @param {Object} [options] - Opciones de validación
 * @param {boolean} [options.requireProtocol=true] - Si se requiere el protocolo (http:// o https://)
 * @param {string[]} [options.allowedProtocols=['http:', 'https:']] - Protocolos permitidos
 * @returns {boolean} true si es una URL válida
 */
export const isValidUrl = (url, options = {}) => {
  if (typeof url !== 'string' || !url.trim()) {
    return false;
  }

  const {
    requireProtocol = true,
    allowedProtocols = ['http:', 'https:']
  } = options;

  try {
    // Verificar si es una URL válida
    const parsedUrl = new URL(url);
    
    // Si se requiere protocolo, verificar que esté presente
    if (requireProtocol && !parsedUrl.protocol) {
      return false;
    }
    
    // Verificar si el protocolo está permitido
    if (parsedUrl.protocol && !allowedProtocols.includes(parsedUrl.protocol)) {
      return false;
    }
    
    // Verificar que el hostname no esté vacío para URLs absolutas
    if (requireProtocol && !parsedUrl.hostname) {
      return false;
    }
    
    return true;
  } catch (e) {
    // Si falla la validación de URL, podría ser una ruta relativa
    if (!requireProtocol) {
      // Verificar que no contenga caracteres inválidos
      const invalidChars = [' ', '<', '>', '{', '}', '|', '^', '`'];
      return !invalidChars.some(char => url.includes(char));
    }
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
