import { useEffect, useState } from "react";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

/**
 * Hook para obtener la mejor foto de un restaurante usando Google Places API.
 * @param {string} placeId - El place_id de Google Places
 * @returns {string|null} - URL de la foto o null si no hay
 */
export function useGooglePlacePhoto(placeId) {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
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
          // Puedes mejorar el criterio de selección aquí si lo deseas
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
 * Componente para mostrar la foto de un restaurante usando Google Places.
 * @param {string} placeId - El place_id del restaurante
 * @param {string} alt - Texto alternativo para la imagen
 * @param {string} className - Clases CSS para la imagen
 * @param {string} fallback - URL de imagen por defecto
 */
export default function GooglePlacePhoto({ placeId, alt = "Foto restaurante", className = "", fallback = "/img/default-restaurant.jpg" }) {
  const photoUrl = useGooglePlacePhoto(placeId);
  return (
    <img
      src={photoUrl || fallback}
      alt={alt}
      className={className}
      loading="lazy"
      style={{ objectFit: "cover" }}
    />
  );
}
