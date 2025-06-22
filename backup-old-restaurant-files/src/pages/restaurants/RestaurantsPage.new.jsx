import { useState, useEffect } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import { 
  getRestaurants, 
  getCuisines, 
  getNeighborhoods,
  toggleFavorite 
} from '@/services/restaurantService';
import './RestaurantsPage.css';

const RestaurantsPage = () => {
  // Estados
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [cuisines, setCuisines] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

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
        
        // Mapear datos para mantener compatibilidad con el componente
        const normalizedRestaurants = restaurantsData.map(restaurant => ({
          id: restaurant.id,
          name: restaurant.name || 'Nombre no disponible',
          phone: restaurant.phone || 'Sin teléfono',
          ranking: restaurant.ranking || 0,
          address: restaurant.address || 'Dirección no disponible',
          latitude: restaurant.latitude || 0,
          longitude: restaurant.longitude || 0,
          reviewCount: restaurant.review_count || 0,
          rating: restaurant.rating || 0,
          website: restaurant.website || '',
          placeId: restaurant.place_id || '',
          placeLink: restaurant.place_link || '#',
          cuisine: restaurant.cuisine || 'Sin categoría',
          priceLevel: restaurant.price_level || '$$',
          schedule: restaurant.schedule || {},
          photoUrl: restaurant.photo_url || 'https://via.placeholder.com/400x300?text=Imagen+no+disponible',
          description: restaurant.description || 'Sin descripción disponible',
          photos: restaurant.photos || [],
          isFavorite: restaurant.is_favorite || false,
          neighborhood: restaurant.neighborhood || ''
        }));
        
        setRestaurants(normalizedRestaurants);
        setFilteredRestaurants(normalizedRestaurants);
        setCuisines(cuisinesData);
        setNeighborhoods(neighborhoodsData);
        
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    let result = [...restaurants];
    
    // Aplicar filtro de cocina
    if (selectedCuisine) {
      result = result.filter(restaurant => 
        restaurant.cuisine === selectedCuisine
      );
    }
    
    // Aplicar filtro de vecindario
    if (selectedNeighborhood) {
      result = result.filter(restaurant => 
        restaurant.neighborhood === selectedNeighborhood
      );
    }
    
    // Aplicar filtro de favoritos
    if (favoritesOnly) {
      result = result.filter(restaurant => restaurant.isFavorite);
    }
    
    setFilteredRestaurants(result);
  }, [selectedCuisine, selectedNeighborhood, favoritesOnly, restaurants]);

  // Manejar el clic en un restaurante
  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowMoreInfo(true);
    // Desplazarse suavemente hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manejar el cierre del modal
  const handleCloseModal = () => {
    setShowMoreInfo(false);
    setSelectedRestaurant(null);
  };

  // Manejar el cambio de favorito
  const handleToggleFavorite = async (restaurantId, isCurrentlyFavorite) => {
    try {
      // Actualizar estado local primero para una respuesta más rápida
      const updatedRestaurants = restaurants.map(restaurant => 
        restaurant.id === restaurantId 
          ? { ...restaurant, isFavorite: !isCurrentlyFavorite } 
          : restaurant
      );
      
      setRestaurants(updatedRestaurants);
      
      // Actualizar en Supabase
      await toggleFavorite(restaurantId, !isCurrentlyFavorite);
      
    } catch (error) {
      console.error('Error actualizando favorito:', error);
      // Revertir cambios en caso de error
      const revertedRestaurants = restaurants.map(restaurant => 
        restaurant.id === restaurantId 
          ? { ...restaurant, isFavorite: isCurrentlyFavorite } 
          : restaurant
      );
      setRestaurants(revertedRestaurants);
    }
  };

  // Limpiar todos los filtros
  const clearFilters = () => {
    setSelectedCuisine('');
    setSelectedNeighborhood('');
    setFavoritesOnly(false);
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = selectedCuisine || selectedNeighborhood || favoritesOnly;

  // Obtener el horario de hoy para mostrar en el modal
  const getTodaysSchedule = (schedule) => {
    if (!schedule || typeof schedule !== 'object') return 'Horario no disponible';
    
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    const todaySchedule = schedule[days[today]];
    
    if (!todaySchedule || !todaySchedule.open) return 'Cerrado hoy';
    
    return `Abierto hoy: ${todaySchedule.open} - ${todaySchedule.close}`;
  };

  // Renderizado condicional del contenido
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Cargando restaurantes...</p>
        </div>
      );
    }
    
    if (filteredRestaurants.length === 0) {
      return (
        <div className="no-results">
          <p>No se encontraron restaurantes con los filtros seleccionados.</p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-clear-filters">
              Limpiar filtros
            </button>
          )}
        </div>
      );
    }
    
    return (
      <div className="restaurants-grid">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onClick={() => handleRestaurantClick(restaurant)}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={restaurant.isFavorite}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="restaurants-page">
      <div className="restaurants-header">
        <h1>Restaurantes en Chile</h1>
        <p>Descubre los mejores lugares para comer</p>
        
        <div className="filters-container">
          <button 
            className={`btn-filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
          </button>
          
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-clear-filters">
              Limpiar filtros
            </button>
          )}
        </div>
        
        {showFilters && (
          <div className="filters">
            <div className="filter-group">
              <label htmlFor="cuisine">Tipo de cocina:</label>
              <select
                id="cuisine"
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
              >
                <option value="">Todas las cocinas</option>
                {cuisines.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="neighborhood">Barrio:</label>
              <select
                id="neighborhood"
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
              >
                <option value="">Todos los barrios</option>
                {neighborhoods.map((neighborhood) => (
                  <option key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label className="favorites-filter">
                <input
                  type="checkbox"
                  checked={favoritesOnly}
                  onChange={(e) => setFavoritesOnly(e.target.checked)}
                />
                <span>Solo favoritos</span>
              </label>
            </div>
          </div>
        )}
      </div>
      
      {renderContent()}
      
      {/* Modal de detalles del restaurante */}
      {selectedRestaurant && showMoreInfo && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={handleCloseModal}>
              <FaTimes />
            </button>
            
            <div className="restaurant-details">
              <h2>{selectedRestaurant.name}</h2>
              
              <div className="restaurant-meta">
                <div className="rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      className={star <= Math.floor(selectedRestaurant.rating) ? 'star filled' : 'star'}
                    >
                      {star <= selectedRestaurant.rating ? '★' : '☆'}
                    </span>
                  ))}
                  <span className="review-count">({selectedRestaurant.reviewCount})</span>
                </div>
                
                <div className="price-level">{selectedRestaurant.priceLevel}</div>
                <div className="cuisine">{selectedRestaurant.cuisine}</div>
              </div>
              
              <div className="restaurant-info">
                <p className="address">
                  <strong>Dirección:</strong> {selectedRestaurant.address}
                </p>
                
                <p className="phone">
                  <strong>Teléfono:</strong>{' '}
                  {selectedRestaurant.phone === 'Sin teléfono' ? (
                    <span>No disponible</span>
                  ) : (
                    <a href={`tel:${selectedRestaurant.phone}`}>{selectedRestaurant.phone}</a>
                  )}
                </p>
                
                <p className="schedule">
                  <strong>Horario:</strong> {getTodaysSchedule(selectedRestaurant.schedule)}
                </p>
                
                {selectedRestaurant.website && (
                  <p className="website">
                    <strong>Sitio web:</strong>{' '}
                    <a 
                      href={selectedRestaurant.website.startsWith('http') 
                        ? selectedRestaurant.website 
                        : `https://${selectedRestaurant.website}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Visitar sitio web
                    </a>
                  </p>
                )}
              </div>
              
              <div className="restaurant-actions">
                <button 
                  className={`btn-favorite ${selectedRestaurant.isFavorite ? 'active' : ''}`}
                  onClick={() => handleToggleFavorite(selectedRestaurant.id, selectedRestaurant.isFavorite)}
                >
                  {selectedRestaurant.isFavorite ? '★ Guardado' : '☆ Guardar en favoritos'}
                </button>
                
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedRestaurant.latitude},${selectedRestaurant.longitude}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-directions"
                >
                  Cómo llegar
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;
