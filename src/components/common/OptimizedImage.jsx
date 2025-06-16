import { useState } from 'react';

const OptimizedImage = ({ src, alt, className, fallbackSrc = '/images/restaurant-placeholder.jpg' }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  // Si la URL de la imagen es de Google, usamos un proxy para evitar problemas de CORS
  const getImageUrl = (url) => {
    if (!url) return fallbackSrc;
    
    // Si es una URL de Google, intentamos obtener la imagen directamente
    if (url.includes('googleusercontent.com') || url.includes('googleapis.com')) {
      // Intentamos extraer el ID de la foto de la URL de Google
      const match = url.match(/[^/]+(?=\?|$)/);
      if (match && match[0]) {
        return `https://lh3.googleusercontent.com/p/${match[0]}`;
      }
    }
    
    return url || fallbackSrc;
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <img
        src={getImageUrl(imgSrc)}
        alt={alt || 'Restaurante'}
        className="w-full h-full object-cover"
        onError={handleError}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

export default OptimizedImage;
