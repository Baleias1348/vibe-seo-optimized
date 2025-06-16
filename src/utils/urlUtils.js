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
  try {
    // Si no hay path, devolver cadena vacía
    if (!path) return '';
    
    // Si ya es una URL absoluta, validarla
    if (path.startsWith('http://') || path.startsWith('https://')) {
      try {
        new URL(path);
        return path; // Es una URL válida
      } catch (e) {
        console.error('URL absoluta inválida:', path, e);
        return '';
      }
    }
    
    // Obtener la URL base
    let baseUrl = base || '';
    
    // Si no se proporciona base, intentar obtenerla de diferentes fuentes
    if (!baseUrl) {
      if (typeof window !== 'undefined' && window.location) {
        // En el navegador, usar la URL actual
        baseUrl = window.location.origin;
      } else {
        // En el servidor, usar la URL base de la aplicación
        baseUrl = getAppBaseUrl();
      }
    }
    
    // Si aún no hay base, usar un valor por defecto
    if (!baseUrl) {
      baseUrl = 'https://chileaovivo.com';
      console.warn('No se pudo determinar la URL base, usando valor por defecto:', baseUrl);
    }
    
    // Limpiar la URL base
    baseUrl = baseUrl.toString().trim();
    
    // Asegurar que la base tenga protocolo
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl;
    }
    
    // Eliminar barras finales
    baseUrl = baseUrl.replace(/\/+$/, '');
    
    // Limpiar el path
    const cleanPath = path.toString().trim().replace(/^\/+/, '');
    
    // Construir la URL de manera segura
    const url = new URL(cleanPath, baseUrl);
    return url.toString();
    
  } catch (error) {
    console.error('Error al crear URL segura:', { 
      path, 
      base,
      error: error.message 
    });
    
    // Devolver una URL por defecto segura en caso de error
    return 'https://chileaovivo.com';
  }
};

/**
 * Valida si una cadena es una URL válida
 * @param {string} url - URL a validar
 * @returns {boolean} true si es una URL válida
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
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
    console.warn('Usando URL base por defecto: https://chileaovivo.com');
    return 'https://chileaovivo.com';
  } catch (error) {
    console.error('Error al obtener la URL base:', error);
    return 'https://chileaovivo.com';
  }
};
