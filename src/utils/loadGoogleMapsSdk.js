// Utilidad para cargar el Google Maps JS SDK dinámicamente en React (si no está ya cargado)
// Usa la variable de entorno VITE_GOOGLE_PLACES_API_KEY

export function loadGoogleMapsSdk() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps && window.google.maps.places) {
      resolve(window.google);
      return;
    }
    const existingScript = document.getElementById('google-maps-sdk');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google));
      existingScript.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-maps-sdk';
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&libraries=places&language=es&region=CL`;
    script.onload = () => resolve(window.google);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}
