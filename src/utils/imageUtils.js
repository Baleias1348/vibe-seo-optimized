// Local fallback image (stored in public/images)
const FALLBACK_IMAGE = '/images/restaurant-placeholder.svg';

/**
 * Gets a safe image URL for display in the application
 * @param {string} url - Original image URL
 * @returns {string} Safe URL to use in img tag
 */
export const getSafeImageUrl = (url) => {
  // If no URL is provided, return the fallback
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return FALLBACK_IMAGE;
  }

  // Clean up the URL
  const cleanUrl = url.trim();

  // If it's a data URL, http, https, or // (protocol-relative), return as is
  if (cleanUrl.startsWith('data:') || 
      cleanUrl.startsWith('http') || 
      cleanUrl.startsWith('//')) {
    return cleanUrl;
  }

  // If it's a relative URL without a leading slash, add one
  if (!cleanUrl.startsWith('/') && !cleanUrl.startsWith('.')) {
    return `/${cleanUrl}`;
  }

  // Otherwise return the URL as is
  return cleanUrl;
};

/**
 * Handles image loading errors
 * @param {Event} event - Image error event
 */
export const handleImageError = (event) => {
  if (!event.target) return;
  
  const img = event.target;
  
  // Prevent infinite loops in case the fallback also fails
  if (img.src === FALLBACK_IMAGE) return;
  
  // Set the fallback image
  img.src = FALLBACK_IMAGE;
  img.alt = 'Imagen no disponible';
  img.classList.add('object-contain', 'p-4', 'bg-gray-100');
  
  // Clean up the error handler to prevent memory leaks
  img.onerror = null;
};

/**
 * Preloads an image and returns a promise that resolves when loaded
 * @param {string} url - Image URL to preload
 * @returns {Promise<HTMLImageElement>} Promise that resolves with the loaded image
 */
export const preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = getSafeImageUrl(url);
    
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn(`Failed to load image: ${url}`);
      const fallbackImg = new Image();
      fallbackImg.src = FALLBACK_IMAGE;
      resolve(fallbackImg);
    };
  });
};
