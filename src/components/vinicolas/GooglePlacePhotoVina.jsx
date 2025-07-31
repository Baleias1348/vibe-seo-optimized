import { useEffect, useState } from "react";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

/**
 * Hook para obtener la mejor foto de una viña usando Google Places API.
 * @param {string} placeId - El place_id de Google Places
 * @returns {string|null} - URL de la foto o null si no hay
 */
export function useGooglePlacePhotoVina(placeId) {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    // En desarrollo, nunca consultar la API externa
    if (import.meta.env.MODE === 'development') {
      setPhotoUrl(null);
      return;
    }
    if (!placeId) return;

    async function fetchPhoto() {
      try {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_API_KEY}`;
        const res = await fetch(detailsUrl);
        const data = await res.json();
        if (
          data.result &&
          data.result.photos &&
          data.result.photos.length > 0
        ) {
          const photoRef = data.result.photos[0].photo_reference;
          const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${GOOGLE_API_KEY}`;
          setPhotoUrl(url);
        } else {
          setPhotoUrl(null);
        }
      } catch (err) {
        setPhotoUrl(null);
      }
    }

    fetchPhoto();
  }, [placeId]);

  return photoUrl;
}

/**
 * Componente para mostrar la foto de una viña usando Google Places.
 * @param {string} placeId - El place_id de la viña
 * @param {string} alt - Texto alternativo para la imagen
 * @param {string} className - Clases CSS para la imagen
 * @param {string} fallback - URL de imagen por defecto
 */
export default function GooglePlacePhotoVina({ placeId, alt = "Foto viña", className = "", fallback = "/img/default-vina.jpg" }) {
  const photoUrl = useGooglePlacePhotoVina(placeId);
  return (
    photoUrl ? (
      <img
        src={photoUrl}
        alt={alt}
        className={className}
        loading="lazy"
        onError={handleImgError}
      />
    ) : (
      <div className={`flex flex-col items-center justify-center bg-gray-100 text-gray-500 ${className}`} style={{minHeight: 80}}>
        <img src={fallback || '/img/default-vina.jpg'} alt="Sin foto disponible" className="w-12 h-12 mb-1 opacity-60" />
        <span className="text-xs">Sin foto disponible</span>
      </div>
    )
  );
}
