import { supabase } from '@/utils/supabase';

// Obtener todos los restaurantes con opciones de filtrado
export const getRestaurants = async (filters = {}) => {
  // Especificar explícitamente los campos que necesitamos
  let query = supabase
    .from('restaurants')
    .select('*');

  // Aplicar filtros si están presentes
  if (filters.cuisine) {
    query = query.eq('cuisine', filters.cuisine);
  }

  if (filters.neighborhood) {
    query = query.ilike('address', `%${filters.neighborhood}%`);
  }

  // Ordenar por ranking por defecto
  query = query.order('ranking', { ascending: false });

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }

  // Asegurarse de que place_link esté presente en cada restaurante
  const restaurants = (data || []).map(restaurant => ({
    ...restaurant,
    place_link: restaurant.place_link || `https://www.google.com/maps/place/?q=place_id:${restaurant.place_id}`
  }));

  return restaurants;
};

// Obtener un restaurante por ID
export const getRestaurantById = async (id) => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching restaurant:', error);
    throw error;
  }

  // Asegurarse de que place_link esté presente
  return {
    ...data,
    place_link: data.place_link || `https://www.google.com/maps/place/?q=place_id:${data.place_id}`
  };
};

// Obtener todas las cocinas únicas para los filtros
export const getCuisines = async () => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('cuisine')
    .not('cuisine', 'is', null)
    .order('cuisine');

  if (error) {
    console.error('Error fetching cuisines:', error);
    return [];
  }

  // Eliminar duplicados y ordenar
  const uniqueCuisines = [...new Set(data.map(item => item.cuisine))];
  return uniqueCuisines.sort();
};

// Obtener todos los vecindarios únicos para los filtros
export const getNeighborhoods = async () => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('address');

  if (error) {
    console.error('Error fetching neighborhoods:', error);
    return [];
  }

  // Extraer vecindarios de las direcciones y eliminar duplicados
  const neighborhoods = data
    .map(item => {
      const address = item.address || '';
      // Extraer el vecindario de la dirección (última parte después de la última coma)
      const parts = address.split(',');
      return parts.length > 1 ? parts[parts.length - 1].trim() : null;
    })
    .filter(Boolean);

  return [...new Set(neighborhoods)].sort();
};

// Actualizar un restaurante
export const updateRestaurant = async (id, updates) => {
  const { data, error } = await supabase
    .from('restaurants')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating restaurant:', error);
    throw error;
  }

  return data[0];
};

// Marcar/desmarcar como favorito
export const toggleFavorite = async (id, isFavorite) => {
  return updateRestaurant(id, { is_favorite: isFavorite });
};
