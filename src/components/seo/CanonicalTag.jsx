import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import urls from '@/config/urls';

/**
 * Componente para manejar la etiqueta canónica de manera dinámica
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.path] - Ruta canónica personalizada (opcional)
 * @returns {JSX.Element}
 */
const CanonicalTag = ({ path }) => {
  const location = useLocation();
  
  // Obtener la URL canónica basada en la ruta actual o usar la proporcionada
  const getCanonicalUrl = () => {
    if (path) return path;
    
    // Mapeo de rutas a sus versiones canónicas
    const pathname = location.pathname;
    
    // Buscar coincidencia exacta o parcial
    const matchedPath = Object.entries(urls.canonical).find(([key, value]) => {
      if (typeof value === 'function') {
        // Para rutas dinámicas, verificar si la ruta actual coincide con el patrón
        const pattern = key.replace(/\([^)]+\)/g, '([^/]+)');
        return new RegExp(`^${pattern}$`).test(pathname);
      }
      return value === pathname;
    });
    
    if (matchedPath) {
      const [key, value] = matchedPath;
      
      // Si es una función, extraer los parámetros de la URL
      if (typeof value === 'function') {
        const paramMatch = pathname.match(new RegExp(key.replace(/\//g, '\\/').replace(/\([^)]+\)/g, '([^/]+)')));
        if (paramMatch && paramMatch[1]) {
          return value(paramMatch[1]);
        }
      }
      
      return value;
    }
    
    // Si no se encuentra una coincidencia, usar la URL base + ruta actual
    return `${urls.canonical.home}${pathname.replace(/^\//, '')}`;
  };
  
  const canonicalUrl = getCanonicalUrl();
  
  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />
    </Helmet>
  );
};

export default CanonicalTag;
