import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';

const ITEMS_PER_PAGE = 25; // Keep this consistent or pass as arg

const useRestaurants = () => {
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all'); // Corresponds to 'city' field

  useEffect(() => {
    const fetchRestaurantsFromDb = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Consultar la tabla 'restaurants'
        const { data, error: dbError } = await supabase
          .from('restaurants')
          .select('*')
          .order('name', { ascending: true });

        if (dbError) throw dbError;
        
        if (!Array.isArray(data)) {
          console.error("Data received from Supabase is not an array:", data);
          throw new Error("Formato de datos inesperado del servidor.");
        }
        
        // Asegurarse de que el campo schedule sea un objeto JavaScript válido
        const processedData = data.map(restaurant => {
          try {
            // Si schedule es un string, intentar parsearlo a objeto
            if (restaurant.schedule && typeof restaurant.schedule === 'string') {
              return {
                ...restaurant,
                schedule: JSON.parse(restaurant.schedule)
              };
            }
            // Si es un objeto, asegurarse de que no sea null
            return {
              ...restaurant,
              schedule: restaurant.schedule || {}
            };
          } catch (error) {
            console.error('Error al procesar el horario para', restaurant.name, error);
            return {
              ...restaurant,
              schedule: {}
            };
          }
        });
        
        // Depuración: Mostrar los primeros 3 restaurantes para ver su estructura
        console.log('Datos de restaurantes procesados:', processedData.slice(0, 3));
        
        setAllRestaurants(processedData);
      } catch (err) {
        console.error("Error fetching restaurants from DB:", err);
        setError(err.message || "Falha ao buscar restaurantes. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurantsFromDb();
  }, []);

  const filteredRestaurants = useMemo(() => {
    let restaurants = [...allRestaurants];
    const lowerSearchTerm = searchTerm.toLowerCase();

    if (lowerSearchTerm) {
      restaurants = restaurants.filter(r => 
        (r.name?.toLowerCase() || '').includes(lowerSearchTerm) ||
        (r.full_address?.toLowerCase() || '').includes(lowerSearchTerm) ||
        (r.types?.some(type => type.toLowerCase().includes(lowerSearchTerm))) // Search in types array
      );
    }

    if (selectedSpecialty !== 'all') {
      restaurants = restaurants.filter(r => 
        r.types?.some(type => type.toLowerCase().includes(selectedSpecialty.toLowerCase()))
      );
    }
    
    // Filter by 'city' column, which is represented by 'selectedNeighborhood' state
    if (selectedNeighborhood !== 'all') {
      restaurants = restaurants.filter(r => 
        r.city?.toLowerCase().includes(selectedNeighborhood.toLowerCase())
      );
    }
    
    return restaurants;
  }, [allRestaurants, searchTerm, selectedSpecialty, selectedNeighborhood]);

  useEffect(() => {
    setCurrentPage(1); 
  }, [searchTerm, selectedSpecialty, selectedNeighborhood]);

  const paginatedRestaurants = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRestaurants.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRestaurants, currentPage]);

  const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);

  return {
    paginatedRestaurants,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    selectedSpecialty,
    setSelectedSpecialty,
    selectedNeighborhood,
    setSelectedNeighborhood,
    // Expose filter states to be used by RestaurantFilters component
    filters: {
      searchTerm,
      selectedSpecialty,
      selectedNeighborhood
    },
    setters: {
      setSearchTerm,
      setSelectedSpecialty,
      setSelectedNeighborhood
    }
  };
};

export default useRestaurants;