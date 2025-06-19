import { useState, useEffect, useMemo } from 'react';
import { FaSpinner, FaTimes } from 'react-icons/fa';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import { getRestaurants, getCuisines, getNeighborhoods } from '@/services/restaurantService';
import './RestaurantsPage.css';

const RestaurantsPage = () => {
  // Estados
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cuisines, setCuisines] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar datos al montar el componente
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Cargar datos en paralelo
        const [restaurantsData, cuisinesData, neighborhoodsData] = await Promise.all([
          getRestaurants(),
          getCuisines(),
          getNeighborhoods()
        ]);
        
        if (!isMounted) return;
        
        // Mapear datos
        const normalizedRestaurants = Array.isArray(restaurantsData) 
          ? restaurantsData.map(restaurant => ({
              id: restaurant.id,
              name: restaurant.name || 'Sin nombre',
              phone: restaurant.phone || 'Sin teléfono',
              address: restaurant.address || 'Sin dirección',
              rating: restaurant.rating || 0,
              review_count: restaurant.review_count || 0,
              cuisine: restaurant.cuisine || 'Sin categoría',
              price_level: restaurant.price_level || '',
              neighborhood: restaurant.neighborhood || 'Sin barrio',
              photo_url: restaurant.photo_url || '',
              photos: Array.isArray(restaurant.photos) ? restaurant.photos : [],
              website: restaurant.website || '',
              description: restaurant.description || 'Sin descripción disponible',
              is_favorite: restaurant.is_favorite || false
            }))
          : [];

        if (isMounted) {
          setRestaurants(normalizedRestaurants);
          setFilteredRestaurants(normalizedRestaurants);
          setCuisines(cuisinesData || []);
          setNeighborhoods(neighborhoodsData || []);
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

  // Filtrar restaurantes cuando cambian los filtros
  useEffect(() => {
    let filtered = [...restaurants];
    
    if (selectedCuisine) {
      filtered = filtered.filter(restaurant => restaurant.cuisine === selectedCuisine);
    }
    
    if (selectedNeighborhood) {
      filtered = filtered.filter(restaurant => restaurant.city === selectedNeighborhood);
    }
    
    setFilteredRestaurants(filtered);
  }, [restaurants, selectedCuisine, selectedNeighborhood]);

  // Obtener ciudades únicas
  const cities = useMemo(() => {
    const uniqueCities = new Set();
    restaurants.forEach(restaurant => {
      if (restaurant.city) {
        uniqueCities.add(restaurant.city);
      }
    });
    return Array.from(uniqueCities).sort();
  }, [restaurants]);

  // Ordenar y agrupar las cocinas
  const sortedCuisines = useMemo(() => {
    if (!cuisines || !Array.isArray(cuisines)) return { maisProcuradas: [], outrasCozinhas: [] };
    
    const maisProcuradas = ['Chilena', 'Frutos do Mar', 'Churrascaria', 'Peruana', 'Italiana', 'Pizzaria'];
    const outrasCozinhas = cuisines.filter(cuisine => 
      cuisine && !maisProcuradas.includes(cuisine)
    ).sort();
    
    return { 
      maisProcuradas: maisProcuradas.filter(c => cuisines.includes(c)),
      outrasCozinhas 
    };
  }, [cuisines]);
  
  // Limpiar todos los filtros
  const clearFilters = () => {
    setSelectedCuisine('');
    setSelectedNeighborhood('');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Cargando restaurantes...</p>
      </div>
    );
  }

  return (
    <div className="restaurants-page">
      {/* Header con título y subtítulo */}
      <header className="header">
        <div className="container">
          <h1>Os Melhores Restaurantes de Santiago em 2025</h1>
          <p>Descubra os melhores lugares para comer em Santiago, com avaliações reais e informações atualizadas</p>
        </div>
      </header>
      
      <div className="main-content">
        <div className="container">
      
      {/* Filtros */}
      <div className="filters-container">
        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="cuisine">Tipo de cocina:</label>
            <select
              id="cuisine"
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="filter-select"
            >
              <option value="">Todas</option>
              {sortedCuisines.maisProcuradas.length > 0 && (
                <optgroup label="O mais procurado">
                  {sortedCuisines.maisProcuradas.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </optgroup>
              )}
              {sortedCuisines.outrasCozinhas.length > 0 && (
                <optgroup label="Outras opções">
                  {sortedCuisines.outrasCozinhas.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="neighborhood">Ciudad:</label>
            <select
              id="neighborhood"
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="filter-select"
            >
              <option value="">Todas</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          
          {(selectedCuisine || selectedNeighborhood) && (
            <button
              onClick={clearFilters}
              className="clear-filters"
            >
              <FaTimes className="mr-1" /> Limpiar filtros
            </button>
          )}
        </div>
      </div>
      
      {/* Lista de restaurantes */}
      <div className="restaurants-grid">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map(restaurant => (
            <RestaurantCard 
              key={restaurant.id} 
              restaurant={restaurant} 
            />
          ))
        ) : (
          <p>No se encontraron restaurantes con los filtros seleccionados.</p>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantsPage;
