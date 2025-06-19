// Función para normalizar los datos del restaurante
export const normalizeRestaurant = (restaurant) => ({
  id: restaurant.id || '',
  name: restaurant.name || 'Nombre no disponible',
  phone: restaurant.phone || 'Sin teléfono',
  ranking: restaurant.ranking || 0,
  address: restaurant.address || 'Dirección no disponible',
  latitude: restaurant.latitude || 0,
  longitude: restaurant.longitude || 0,
  reviewCount: restaurant.reviewCount || 0,
  rating: restaurant.rating || 0,
  website: restaurant.website || '',
  placeId: restaurant.placeId || '',
  placeLink: restaurant.placeLink || '#',
  cuisine: restaurant.cuisine || 'Sin categoría',
  priceLevel: restaurant.priceLevel || '$$',
  schedule: restaurant.schedule || {},
  photoUrl: restaurant.photoUrl || 'https://via.placeholder.com/400x300?text=Imagen+no+disponible'
});

// Función para extraer barrios de la dirección
export const extractNeighborhood = (address = '') => {
  try {
    const match = address.match(/(Las Condes|Providencia|Santiago Centro|Ñuñoa|Vitacura|Lo Barnechea)/i);
    return match ? match[0] : null;
  } catch (e) {
    return null;
  }
};

// Función para formatear el nivel de precios
export const formatPriceLevel = (level) => {
  if (!level) return '';
  const priceLevels = {
    '1': '€',
    '2': '€€',
    '3': '€€€',
    '4': '€€€€',
    '5': '€€€€€',
    'bajo': '€',
    'moderado': '€€',
    'alto': '€€€',
    'muy alto': '€€€€',
    'lujo': '€€€€€'
  };
  return priceLevels[level.toLowerCase()] || level;
};

// Función para obtener el horario de hoy
export const getTodaysSchedule = (schedule = {}) => {
  const today = new Date().toLocaleDateString('es-CL', { weekday: 'long' }).toLowerCase();
  const dayMap = {
    'lunes': 'Lunes',
    'martes': 'Martes',
    'miércoles': 'Miércoles',
    'jueves': 'Jueves',
    'viernes': 'Viernes',
    'sábado': 'Sábado',
    'domingo': 'Domingo'
  };
  
  const dayName = dayMap[today] || '';
  return schedule[dayName] || 'Horario no disponible';
};
