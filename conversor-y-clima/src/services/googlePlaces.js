// Servicio para interactuar con la API de Google Places a través de nuestro servidor proxy

// Datos de ejemplo para usar cuando la API falle o esté en desarrollo
const SAMPLE_RESTAURANTS = [
  {
    place_id: 'sample1',
    name: 'Restaurante La Moneda',
    address: 'Plaza de la Constitución 123, Santiago',
    rating: 4.5,
    user_ratings_total: 1280,
    price_level: 3,
    types: ['restaurant', 'food', 'point_of_interest'],
    photos: [
      {
        photo_reference: 'sample1',
        html_attributions: []
      }
    ],
    geometry: {
      location: {
        lat: -33.4489,
        lng: -70.6693
      }
    },
    opening_hours: {
      open_now: true
    },
    rank: 1,
    platforms: {
      google: 4.5,
      tripadvisor: 4.3,
      instagram: 4.7
    },
    cuisine: 'Comida chilena',
    distance: 350
  },
  {
    place_id: 'sample2',
    name: 'Barrio Lastarria Bistro',
    address: 'José Victorino Lastarria 123, Santiago',
    rating: 4.7,
    user_ratings_total: 890,
    price_level: 2,
    types: ['restaurant', 'bar', 'food', 'point_of_interest'],
    photos: [
      {
        photo_reference: 'sample2',
        html_attributions: []
      }
    ],
    geometry: {
      location: {
        lat: -33.4389,
        lng: -70.6393
      }
    },
    opening_hours: {
      open_now: true
    },
    rank: 2,
    platforms: {
      google: 4.7,
      tripadvisor: 4.6,
      instagram: 4.8
    },
    cuisine: 'Fusión internacional',
    distance: 1200
  },
  {
    place_id: 'sample3',
    name: 'El Hoyo',
    address: 'San Camilo 1, Santiago',
    rating: 4.3,
    user_ratings_total: 2150,
    price_level: 1,
    types: ['restaurant', 'food', 'point_of_interest'],
    photos: [
      {
        photo_reference: 'sample3',
        html_attributions: []
      }
    ],
    geometry: {
      location: {
        lat: -33.4289,
        lng: -70.6593
      }
    },
    opening_hours: {
      open_now: true
    },
    rank: 3,
    platforms: {
      google: 4.3,
      tripadvisor: 4.1,
      instagram: 4.5
    },
    cuisine: 'Comida típica chilena',
    distance: 800
  }
];

// URL base para las llamadas a nuestro servidor proxy
const API_BASE_URL = 'http://localhost:3001/api/places';

// Clave de API - Debe ser configurada en las variables de entorno
const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

// Cache para almacenar resultados de búsqueda
const searchCache = new Map();
const detailsCache = new Map();

// Tiempo de vida de la caché en milisegundos (5 minutos)
const CACHE_TTL = 5 * 60 * 1000;

// Verificar configuración de la API
if (!API_KEY || API_KEY === 'TU_CLAVE_DE_GOOGLE_PLACES_AQUI') {
  console.error('Error: No se ha configurado una clave válida para Google Places API');
  console.log('Por favor, actualiza la variable VITE_GOOGLE_PLACES_API_KEY en el archivo .env');
}

/**
 * Limpia la caché de búsquedas antiguas
 */
const cleanCache = (cache) => {
  const now = Date.now();
  for (const [key, { timestamp }] of cache.entries()) {
    if (now - timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
};

// Limpiar caché periódicamente
setInterval(() => {
  cleanCache(searchCache);
  cleanCache(detailsCache);
}, CACHE_TTL);

/**
 * Busca restaurantes cercanos a una ubicación a través de nuestro servidor
 * @param {Object} location - Objeto con latitud y longitud
 * @param {number} radius - Radio de búsqueda en metros (máx. 50000)
 * @param {string} type - Tipo de lugar (por defecto: 'restaurant')
 * @returns {Promise<{results: Array, nextPageToken: string}>} - Resultados y token para la siguiente página
 */
export const searchNearbyRestaurants = async (location, radius = 5000, type = 'restaurant') => {
  try {
    console.log('Solicitando restaurantes a la API de Google Places...');
    
    // Construir la URL de la API de nuestro servidor
    const params = new URLSearchParams({
      location: `${location.latitude},${location.longitude}`,
      radius: Math.min(radius, 50000), // Asegurarse de no exceder el límite
      type: type
    });
    
    const url = new URL(`${API_BASE_URL}/nearbysearch`);
    url.search = params.toString();

    console.log('Obteniendo restaurantes cercanos:', url.toString());
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error al obtener restaurantes cercanos:', response.status, response.statusText, errorData);
      throw new Error(`Error en la petición: ${response.status} ${response.statusText}`, { cause: errorData });
    }

    const data = await response.json();
    
    // Verificar si hay errores en la respuesta
    if (data.status !== 'OK') {
      const errorMsg = `Error de la API: ${data.status} - ${data.error_message || 'Error desconocido'}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    // Formatear resultados
    const formattedResults = data.results.map((place) => formatPlaceToRestaurant(place));
    
    // Almacenar en caché
    searchCache.set(`${location.latitude},${location.longitude}`, {
      timestamp: Date.now(),
      data: formattedResults
    });

    return {
      results: formattedResults,
      nextPageToken: data.next_page_token
    };
  } catch (error) {
    console.error('Error al buscar restaurantes cercanos:', error);
    
    // En caso de error, devolver datos de muestra
    console.warn('Usando datos de muestra debido a un error');
    return {
      results: SAMPLE_RESTAURANTS,
      nextPageToken: null
    };
  }
};

/**
 * Obtiene detalles adicionales de un lugar específico con soporte para caché
 * @param {string} placeId - ID del lugar en Google Places
 * @returns {Promise<Object>} - Detalles del lugar
 */
export const getPlaceDetails = async (placeId) => {
  try {
    // Verificar si los detalles están en caché
    const cached = detailsCache.get(placeId);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      console.log('Usando detalles en caché para:', placeId);
      return cached.data;
    }
    
    // Datos de ejemplo para restaurantes
    const SAMPLE_RESTAURANTS = [
      {
        id: '1',
        name: 'Restaurante La Moneda',
        address: 'Plaza de la Constitución 123, Santiago',
        rating: 4.5,
        user_ratings_total: 1280,
        price_level: 3,
        types: ['restaurant', 'food', 'point_of_interest'],
        photos: [
          {
            photo_reference: 'sample1',
            html_attributions: []
          }
        ],
        place_id: 'sample1',
        geometry: {
          location: {
            lat: -33.4489,
            lng: -70.6693
          }
        },
        opening_hours: {
          open_now: true
        },
        rank: 1,
        platforms: {
          google: 4.5,
          tripadvisor: 4.3,
          instagram: 4.7
        },
        cuisine: 'Comida chilena',
        distance: 350
      },
      {
        id: '2',
        name: 'Barrio Lastarria Bistro',
        address: 'José Victorino Lastarria 123, Santiago',
        rating: 4.7,
        user_ratings_total: 890,
        price_level: 2,
        types: ['restaurant', 'bar', 'food', 'point_of_interest'],
        photos: [
          {
            photo_reference: 'sample2',
            html_attributions: []
          }
        ],
        place_id: 'sample2',
        geometry: {
          location: {
            lat: -33.4389,
            lng: -70.6393
          }
        },
        opening_hours: {
          open_now: true
        },
        rank: 2,
        platforms: {
          google: 4.7,
          tripadvisor: 4.6,
          instagram: 4.8
        },
        cuisine: 'Fusión internacional',
        distance: 1200
      },
      {
        id: '3',
        name: 'El Hoyo',
        address: 'San Camilo 1, Santiago',
        rating: 4.3,
        user_ratings_total: 2150,
        price_level: 1,
        types: ['restaurant', 'food', 'point_of_interest'],
        photos: [
          {
            photo_reference: 'sample3',
            html_attributions: []
          }
        ],
        place_id: 'sample3',
        geometry: {
          location: {
            lat: -33.4289,
            lng: -70.6593
          }
        },
        opening_hours: {
          open_now: true
        },
        rank: 3,
        platforms: {
          google: 4.3,
          tripadvisor: 4.1,
          instagram: 4.5
        },
        cuisine: 'Comida típica chilena',
        distance: 800
      }
    ];
    
    const url = new URL(`${API_BASE_URL}/details`);
    url.searchParams.append('place_id', placeId);
    
    // Incluir campos específicos para optimizar la respuesta
    url.searchParams.append('fields', [
      'name',
      'formatted_address',
      'formatted_phone_number',
      'international_phone_number',
      'website',
      'rating',
      'user_ratings_total',
      'reviews',
      'photos',
      'opening_hours',
      'price_level',
      'types',
      'geometry',
      'url',
      'vicinity',
      'plus_code',
      'utc_offset',
      'website',
      'wheelchair_accessible_entrance'
    ].join(','));

    console.log('Obteniendo detalles para:', placeId);
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error al obtener detalles:', response.status, response.statusText, errorData);
      throw new Error(`Error en la petición: ${response.status} ${response.statusText}`, { cause: errorData });
    }

    const data = await response.json();
    
    // Verificar si hay errores en la respuesta
    if (data.status !== 'OK') {
      const errorMsg = `Error de la API: ${data.status} - ${data.error_message || 'Error desconocido'}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    // Almacenar en caché
    detailsCache.set(placeId, {
      timestamp: Date.now(),
      data: data.result
    });

    return data.result;
  } catch (error) {
    console.error('Error al obtener detalles del lugar:', error);
    throw error;
  }
};

/**
 * Formatea los datos de Google Places a nuestro modelo de restaurante
 * @param {Object} place - Datos del lugar de Google Places
 * @returns {Object} - Restaurante formateado
 */
export const formatPlaceToRestaurant = (place) => {
  if (!place) return null;
  
  // Extraer datos básicos
  const restaurant = {
    // Identificación
    id: place.place_id,
    placeId: place.place_id,
    
    // Información básica
    name: place.name || 'Sin nombre',
    description: '', // Se puede completar con datos adicionales
    
    // Ubicación
    address: place.vicinity || place.formatted_address || 'Dirección no disponible',
    location: place.geometry?.location || { lat: 0, lng: 0 },
    formattedAddress: place.formatted_address || place.vicinity || '',
    
    // Calificaciones
    rating: place.rating ? parseFloat(place.rating.toFixed(1)) : 0,
    userRatingsTotal: place.user_ratings_total || 0,
    priceLevel: place.price_level || 0,
    
    // Categorías y tipos
    types: Array.isArray(place.types) ? place.types : [],
    cuisine: place.types ? 
      place.types
        .filter(t => !['establishment', 'point_of_interest', 'food'].includes(t))
        .map(t => t.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '))
      : [],
    
    // Multimedia
    photos: Array.isArray(place.photos) ? place.photos.map(p => ({
      photoReference: p.photo_reference,
      width: p.width,
      height: p.height,
      htmlAttributions: p.html_attributions || []
    })) : [],
    
    // Horario
    openingHours: place.opening_hours ? {
      openNow: place.opening_hours.open_now,
      periods: place.opening_hours.periods || [],
      weekdayText: place.opening_hours.weekday_text || []
    } : null,
    
    // Contacto
    website: place.website || '',
    phone: place.formatted_phone_number || place.international_phone_number || '',
    url: place.url || '',
    
    // Estado actual
    permanentlyClosed: place.permanently_closed || false,
    businessStatus: place.business_status || 'OPERATIONAL',
    
    // Metadatos adicionales
    utcOffset: place.utc_offset || 0,
    plusCode: place.plus_code ? {
      globalCode: place.plus_code.global_code,
      compoundCode: place.plus_code.compound_code
    } : null,
    
    // Accesibilidad
    wheelchairAccessibleEntrance: place.wheelchair_accessible_entrance || false,
    
    // Votaciones y reseñas propias
    ourRating: 0,
    ourReviewCount: 0,
    userVotes: [],
    
    // Metadatos
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: 'google_places',
    
    // Datos originales (para referencia)
    _originalData: place
  };
  
  // Calcular la calificación combinada si hay reseñas propias
  if (restaurant.userVotes && restaurant.userVotes.length > 0) {
    const totalVotes = restaurant.userVotes.length;
    const sumVotes = restaurant.userVotes.reduce((sum, vote) => sum + vote.rating, 0);
    restaurant.ourRating = parseFloat((sumVotes / totalVotes).toFixed(1));
    restaurant.ourReviewCount = totalVotes;
  }

  return restaurant;
};
