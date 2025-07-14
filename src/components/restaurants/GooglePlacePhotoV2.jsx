import { useEffect, useState } from "react";
import { loadGoogleMapsSdk } from "@/utils/loadGoogleMapsSdk";

/**
 * Hook para obtener detalles de un lugar de Google Places usando el SDK JS
 * @param {string} placeId - El place_id de Google Places
 * @returns {{ photoUrl: string|null, openingHours: string[]|null, openNow: boolean|null, loading: boolean, error: string|null }}
 */
export function useGooglePlaceDetails(placeId) {
  const [details, setDetails] = useState({
    photoUrl: null,
    openingHours: null,
    openNow: null,
    loading: !!placeId,
    error: null,
  });

  useEffect(() => {
    let ignore = false;
    if (!placeId) {
      setDetails(d => ({ ...d, loading: false, error: null }));
      return;
    }

    setDetails(d => ({ ...d, loading: true, error: null }));

    loadGoogleMapsSdk()
      .then((google) => {
        const mapDiv = document.createElement("div");
        // No es necesario agregarlo al DOM
        const service = new google.maps.places.PlacesService(mapDiv);
        service.getDetails(
          {
            placeId,
            fields: ["photos", "opening_hours", "name", "utc_offset_minutes"],
          },
          (result, status) => {
            if (ignore) return;
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              setDetails(d => ({ ...d, loading: false, error: `Google Places error: ${status}` }));
              return;
            }
            let photoUrl = null;
            if (result.photos && result.photos.length > 0) {
              photoUrl = result.photos[0].getUrl({ maxWidth: 800 });
            }
            setDetails({
              photoUrl,
              openingHours: result.opening_hours?.weekday_text || null,
              openNow: result.opening_hours?.isOpen() ?? null,
              loading: false,
              error: null,
            });
          }
        );
      })
      .catch((e) => {
        if (!ignore) setDetails(d => ({ ...d, loading: false, error: e.message || "Error cargando SDK Google Maps" }));
      });
    return () => {
      ignore = true;
    };
  }, [placeId]);

  return details;
}

/**
 * Componente para mostrar la foto y horarios usando Google Places SDK
 * @param {string} placeId - El place_id del restaurante
 * @param {string} alt - Texto alternativo para la imagen
 * @param {string} className - Clases CSS para la imagen
 * @param {string} fallback - URL de imagen por defecto
 */
export default function GooglePlacePhotoV2({ placeId, alt = "Foto restaurante", className = "", fallback = "/img/default-restaurant.jpg" }) {
  const { photoUrl, loading, error } = useGooglePlaceDetails(placeId);
  return (
    <img
      src={photoUrl || fallback}
      alt={alt}
      className={className}
      loading="lazy"
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  );
}

