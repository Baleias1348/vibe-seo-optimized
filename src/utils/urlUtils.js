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
  if (!path && path !== '') {
    console.warn('createSafeUrl: No se proporcionó un path');
    return '';
  }
  
  // Convertir a string y limpiar
  const cleanPath = String(path || '').trim();
  
  // Si ya es una URL absoluta, validarla y devolverla
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    try {
      new URL(cleanPath);
      return cleanPath; // Es una URL válida
    } catch (e) {
      console.error('URL absoluta inválida:', cleanPath, e);
      return '';
    }
  }
  
  // Obtener la URL base
  let baseUrl = '';
  
  try {
    // Si se proporciona una base, usarla
    if (base) {
      baseUrl = String(base).trim();
    } 
    // Si no hay base, intentar obtenerla del entorno
    else if (typeof window !== 'undefined' && window.location) {
      // En el navegador, usar la URL actual
      baseUrl = window.location.origin || '';
    } 
    // Si estamos en el servidor, usar la URL base de la aplicación
    else {
      baseUrl = typeof getAppBaseUrl === 'function' ? getAppBaseUrl() : '';
    }
    
    // Si aún no hay base, usar un valor por defecto
    if (!baseUrl) {
      baseUrl = 'https://chileaovivo.com';
      console.warn('No se pudo determinar la URL base, usando valor por defecto:', baseUrl);
    }
    
    // Asegurar que la base sea un string
    baseUrl = String(baseUrl).trim();
    
    // Asegurar que la base tenga protocolo
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl;
    }
    
    // Eliminar barras finales
    baseUrl = baseUrl.replace(/\/+$/, '');
    
    // Si no hay path, devolver la base
    if (!cleanPath) {
      return baseUrl;
    }
    
    // Limpiar el path (eliminar barras iniciales)
    const cleanRelativePath = cleanPath.replace(/^\/+/, '');
    
    // Construir la URL de manera segura
    const url = new URL(cleanRelativePath, baseUrl);
    return url.toString();
    
  } catch (error) {
    console.error('Error al crear URL segura:', { 
      path: cleanPath, 
      base: base || 'no proporcionada',
      error: error.message 
    });
    
    // En producción, devolver una URL por defecto segura
    if (process.env.NODE_ENV === 'production') {
      return cleanPath ? `https://chileaovivo.com/${cleanPath.replace(/^\/+/, '')}` : 'https://chileaovivo.com';
    }
    
    // En desarrollo, devolver una cadena vacía para detectar problemas
    return '';
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
