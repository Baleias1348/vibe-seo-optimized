import { supabase } from '@/utils/supabase';

// Obtener todos los restaurantes con opciones de filtrado
export const getRestaurants = async (filters = {}) => {
  let query = supabase
    .from('restaurants')
    .select('*')
    .order('ranking', { ascending: false });

  // Aplicar filtros si existen
  if (filters.cuisine) {
    query = query.eq('cuisine', filters.cuisine);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }

  // Mostrar los datos de los primeros 2 restaurantes para depuración
  if (data && data.length > 0) {
    console.log('Datos de restaurantes (primeros 2):', JSON.stringify(data.slice(0, 2), null, 2));
  }

  return data || [];
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
    return null;
  }

  return data;
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

  // Devolver los valores únicos de cocina
  const uniqueCuisines = [...new Set(data.map(item => item.cuisine))];
  return uniqueCuisines;
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

  return data?.[0] || null;
};

// Marcar/desmarcar como favorito
export const toggleFavorite = async (id, isFavorite) => {
  return updateRestaurant(id, { is_favorite: isFavorite });
};
