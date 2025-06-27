import { useState, useEffect, useMemo } from 'react';
import { FaSpinner } from 'react-icons/fa';
import RestaurantCard from '../components/RestaurantCard';
import RestaurantFilters from '../components/RestaurantFilters';
import { getRestaurants, getCuisines } from '../services/restaurantService';
import './RestaurantsPage.css';

const RestaurantsPage = () => {
  // Estados
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cuisines, setCuisines] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');

  // Cargar datos al montar el componente
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Cargar datos en paralelo
        const [restaurantsData, cuisinesData] = await Promise.all([
          getRestaurants(),
          getCuisines()
        ]);
        
        if (!isMounted) return;
        
        // Mapear datos
        const normalizedRestaurants = Array.isArray(restaurantsData) 
          ? restaurantsData.map(restaurant => ({
              id: restaurant.id,
              name: restaurant.name || 'Sin nombre',
              phone: restaurant.phone || 'Sin teléfono',
              address: restaurant.address || 'Sin dirección',
              description: restaurant.description || '',
              rating: restaurant.rating || 0,
              review_count: restaurant.review_count || 0,
              cuisine: restaurant.cuisine || 'Sin categoría',
              price_level: restaurant.price_level || '',
              neighborhood: restaurant.neighborhood || 'Sin barrio',
              photo_url: restaurant.photo_url || '',
              photos: Array.isArray(restaurant.photos) ? restaurant.photos : [],
              website: restaurant.website || '',
              is_favorite: restaurant.is_favorite || false,
              schedule: restaurant.schedule || {},
              place_id: restaurant.place_id || '',
              place_link: restaurant.place_link || ''
            }))
          : [];

        if (isMounted) {
          setRestaurants(normalizedRestaurants);
          setFilteredRestaurants(normalizedRestaurants);
          setCuisines(cuisinesData || []);
        }
      } catch (error) {
        console.error('Error cargando restaurantes:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Función para normalizar texto (minúsculas y sin tildes)
  const normalize = (str) => str ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';

  // Filtrar restaurantes cuando cambia la especialidad seleccionada
  useEffect(() => {
    if (selectedCuisine) {
      const filtered = restaurants.filter(restaurant => normalize(restaurant.cuisine) === normalize(selectedCuisine));
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants(restaurants);
    }
  }, [restaurants, selectedCuisine]);

  // Manejar cambio de filtro de especialidad
  const handleSpecialtyChange = (value) => {
    setSelectedCuisine(value === 'all' ? '' : value);
  };

  // Normalizar el valor antes de enviarlo a Supabase (si se implementa filtro server-side)
  // Si quieres filtrar desde el backend, deberías enviar normalize(value) en la query

  return (
    <div className="restaurants-page">
      <header className="header">
        <div className="container">
          <h1>Os Melhores Restaurantes de Santiago em 2025</h1>
          <p>Descubra os sabores da culinária chilena que estão bombando no TripAdvisor e no Instagram</p>
        </div>
      </header>
      
      <div className="main-content">
        <div className="container">
          <RestaurantFilters 
            selectedSpecialty={selectedCuisine}
            setSelectedSpecialty={handleSpecialtyChange}
          />
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-2xl text-primary" />
              <span className="ml-2">Cargando restaurantes...</span>
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard 
                  key={restaurant.id} 
                  restaurant={restaurant} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No se encontraron restaurantes con los filtros seleccionados.</p>
              <button 
                onClick={() => setSelectedCuisine('')}
                className="mt-4 text-primary hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantsPage;
