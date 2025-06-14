import { useState, useEffect, useMemo, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import { normalizeRestaurant, extractNeighborhood, getTodaysSchedule } from './utils/restaurantUtils';
import './RestaurantsPage.css';

const RestaurantsPage = () => {
  // Estados
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  // Cargar datos al montar el componente
  useEffect(() => {
    let isMounted = true;
    
    const loadRestaurants = async () => {
      try {
        setIsLoading(true);
        const { default: restaurantsData } = await import('./data/restaurants_updated.json');
        
        if (!isMounted) return;
        
        const normalizedRestaurants = Array.isArray(restaurantsData) 
          ? restaurantsData.map(restaurant => ({
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
              photoUrl: restaurant.photo || (restaurant.photos && restaurant.photos[0]) || 'https://via.placeholder.com/400x300?text=Imagen+no+disponible',
              description: restaurant.description || 'Sin descripción disponible',
              photos: restaurant.photos || []
            }))
          : [];


        if (isMounted) {
          setRestaurants(normalizedRestaurants);
          setFilteredRestaurants(normalizedRestaurants);
        }
      } catch (error) {
        console.error('Error loading restaurants:', error);
        alert('No se pudieron cargar los restaurantes. Por favor, intente recargar la página.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const loadFavorites = () => {
      try {
        const savedFavorites = JSON.parse(localStorage.getItem('restaurantFavorites') || '[]');
        if (isMounted && Array.isArray(savedFavorites)) {
          setFavorites(savedFavorites);
        }
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    };

    loadRestaurants();
    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, []);

  // Función para obtener el estado de apertura en portugués
  const getOpeningStatus = (schedule) => {
    if (!schedule) return { status: 'Horário não disponível', nextOpening: '' };
    
    const now = new Date();
    const currentDay = now.toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    // Mapeo de días en español a portugués
    const daysMap = {
      'lunes': 'segunda',
      'martes': 'terça',
      'miércoles': 'quarta',
      'jueves': 'quinta',
      'viernes': 'sexta',
      'sábado': 'sábado',
      'domingo': 'domingo'
    };
    
    // Convertir el día actual al formato en portugués
    const ptDay = daysMap[currentDay] || currentDay;
    
    // Buscar el horario de hoy
    const todaySchedule = Object.entries(schedule).find(([day]) => 
      day.toLowerCase().includes(ptDay)
    );
    
    if (!todaySchedule || !todaySchedule[1]) {
      return { status: 'Horário não disponível', nextOpening: '' };
    }
    
    const [open, close] = todaySchedule[1].split('-').map(time => {
      const [hours, minutes] = time.trim().split(':').map(Number);
      return hours * 100 + (minutes || 0);
    });
    
    if (currentTime >= open && currentTime < close) {
      return { 
        status: 'Aberto', 
        nextOpening: `Fecha às ${String(Math.floor(close/100)).padStart(2, '0')}:${String(close%100).padStart(2, '0')}h`
      };
    } else {
      return { 
        status: 'Fechado', 
        nextOpening: `Abre ${currentTime < open ? 'hoje' : 'amanhã'} às ${String(Math.floor(open/100)).padStart(2, '0')}:${String(open%100).padStart(2, '0')}h`
      };
    }
  };

  // Filtrar restaurantes cuando cambian los filtros
  useEffect(() => {
    let filtered = [...restaurants];
    
    if (selectedCuisine) {
      filtered = filtered.filter(restaurant => restaurant.cuisine === selectedCuisine);
    }
    
    if (selectedNeighborhood) {
      filtered = filtered.filter(restaurant => 
        extractNeighborhood(restaurant.address) === selectedNeighborhood
      );
    }
    
    setFilteredRestaurants(filtered);
  }, [restaurants, selectedCuisine, selectedNeighborhood]);

  // Obtener tipos de cocina únicos
  const cuisines = useMemo(() => {
    if (!Array.isArray(restaurants)) return [];
    const uniqueCuisines = new Set();
    restaurants.forEach((restaurant) => {
      if (restaurant.cuisine) {
        uniqueCuisines.add(restaurant.cuisine);
      }
    });
    return Array.from(uniqueCuisines);
  }, [restaurants]);
  
  // Ordenar y agrupar las cocinas
  const sortedCuisines = useMemo(() => {
    const maisProcuradas = ['Chilena', 'Frutos do Mar', 'Churrascaria', 'Peruana', 'Italiana', 'Pizzaria'];
    const outrasCozinhas = cuisines.filter(cuisine => !maisProcuradas.includes(cuisine)).sort();
    
    return { maisProcuradas, outrasCozinhas };
  }, [cuisines]);

  // Obtener barrios únicos
  const neighborhoods = useMemo(() => {
    if (!Array.isArray(restaurants)) return [];
    const uniqueNeighborhoods = new Set();
    restaurants.forEach((restaurant) => {
      if (restaurant.address) {
        const neighborhood = extractNeighborhood(restaurant.address);
        if (neighborhood) uniqueNeighborhoods.add(neighborhood);
      }
    });
    return Array.from(uniqueNeighborhoods).sort();
  }, [restaurants]);

  // Manejar clic en un restaurante
  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowMoreInfo(false);
  };

  // Alternar favorito
  const toggleFavorite = useCallback((restaurantId, e) => {
    if (e) e.stopPropagation();
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.includes(restaurantId)
        ? prevFavorites.filter((id) => id !== restaurantId)
        : [...prevFavorites, restaurantId];

      try {
        localStorage.setItem('restaurantFavorites', JSON.stringify(newFavorites));
      } catch (e) {
        console.error('Error saving favorites:', e);
      }

      return newFavorites;
    });
  }, []);

  // Limpiar filtros
  const clearFilters = () => {
    setSelectedCuisine('');
    setSelectedNeighborhood('');
  };

  // Renderizar estrellas de calificación
  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'star filled' : 'star'}>
            {star <= rating ? <FaStar /> : <FaRegStar />}
          </span>
        ))}
      </div>
    );
  };

  // Formatear nivel de precio
  const formatPriceLevel = (level) => {
    const priceLevels = {
      $: 'Económico',
      '$$': 'Moderado',
      '$$$': 'Caro',
      '$$$$': 'Muy caro'
    };
    return priceLevels[level] || level;
  };

  return (
    <div className="restaurants-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>Os Melhores Restaurantes de Santiago em 2025</h1>
          <p>Descubra os sabores da culinária chilena que estão bombando no TripAdvisor e no Instagram</p>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="main-content">
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
                >
                  <option value="">Todas</option>
                  <optgroup label="O mais procurado">
                    {sortedCuisines.maisProcuradas.map((cuisine) => (
                      <option key={cuisine} value={cuisine}>
                        {cuisine}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Outras opções">
                    {sortedCuisines.outrasCozinhas.map((cuisine) => (
                      <option key={cuisine} value={cuisine}>
                        {cuisine}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="neighborhood">Barrio:</label>
                <select
                  id="neighborhood"
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                >
                  <option value="">Todos</option>
                  {neighborhoods.map((neighborhood) => (
                    <option key={neighborhood} value={neighborhood}>
                      {neighborhood}
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
          
          {/* Contador de resultados */}
          <div className="results-count">
            {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'restaurante encontrado' : 'restaurantes encontrados'}
          </div>
          
          {/* Lista de restaurantes */}
          {isLoading ? (
            <div className="loading">Cargando restaurantes...</div>
          ) : filteredRestaurants.length > 0 ? (
            <div className="restaurants-grid">
              {filteredRestaurants.map((restaurant) => (
                <div 
                  key={restaurant.id} 
                  onClick={() => handleRestaurantClick(restaurant)}
                  className="cursor-pointer"
                >
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No se encontraron restaurantes</h3>
              <p>Intenta ajustar tus filtros de búsqueda</p>
              <button
                onClick={clearFilters}
                className="clear-filters-btn"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modal de detalles del restaurante */}
      {selectedRestaurant && (
        <div className="modal-overlay" onClick={() => setSelectedRestaurant(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedRestaurant.name}</h2>
              <button 
                className="modal-close"
                onClick={() => setSelectedRestaurant(null)}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="restaurant-gallery">
                <div 
                  className="main-image"
                  style={{ 
                    backgroundImage: `url(${selectedRestaurant.photoUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <button 
                    className={`favorite-btn ${favorites.includes(selectedRestaurant.id) ? 'active' : ''}`}
                    onClick={(e) => toggleFavorite(selectedRestaurant.id, e)}
                  >
                    <FaStar className="favorite-icon" />
                  </button>
                </div>
              </div>
              
              <div className="restaurant-details">
                <div className="restaurant-header">
                  <div className="rating-container">
                    {renderStars(selectedRestaurant.rating)}
                    <span className="review-count">({selectedRestaurant.reviewCount} reseñas)</span>
                  </div>
                  <div className="price-level">{formatPriceLevel(selectedRestaurant.priceLevel)}</div>
                </div>
                
                {selectedRestaurant.cuisine && (
                  <div className="cuisine-type">
                    <FaUtensils className="meta-icon" />
                    <span>{selectedRestaurant.cuisine}</span>
                  </div>
                )}
                
                {selectedRestaurant.description && (
                  <div className="restaurant-description">
                    <h3>Descripción</h3>
                    <p>{selectedRestaurant.description}</p>
                  </div>
                )}
                
                <div className="restaurant-info-grid">
                  {selectedRestaurant.address && (
                    <div className="info-item">
                      <FaMapMarkerAlt className="info-icon" />
                      <div>
                        <h4>Dirección</h4>
                        <p>{selectedRestaurant.address}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedRestaurant.phone && selectedRestaurant.phone !== 'Sin teléfono' && (
                    <div className="info-item">
                      <FaPhone className="info-icon" />
                      <div>
                        <h4>Teléfono</h4>
                        <p>
                          <a href={`tel:${selectedRestaurant.phone}`}>
                            {selectedRestaurant.phone}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {selectedRestaurant.website && (
                    <div className="info-item">
                      <FaGlobe className="info-icon" />
                      <div>
                        <h4>Sitio Web</h4>
                        <p>
                          <a 
                            href={selectedRestaurant.website.startsWith('http') ? selectedRestaurant.website : `https://${selectedRestaurant.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {selectedRestaurant.website.replace(/^https?:\/\//, '')}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {selectedRestaurant.schedule && (
                    <div className="info-item">
                      <FaClock className="info-icon" />
                      <div>
                        <h4>Horario de hoy</h4>
                        <p>{getTodaysSchedule(selectedRestaurant.schedule) || 'No disponible'}</p>
                        
                        <button 
                          className="show-more-btn"
                          onClick={() => setShowMoreInfo(!showMoreInfo)}
                        >
                          {showMoreInfo ? (
                            <>
                              <span>Menos información</span>
                              <FaChevronUp className="chevron-icon" />
                            </>
                          ) : (
                            <>
                              <span>Ver horario completo</span>
                              <FaChevronDown className="chevron-icon" />
                            </>
                          )}
                        </button>
                        
                        {showMoreInfo && selectedRestaurant.schedule && (
                          <div className="full-schedule">
                            <h5>Horario semanal:</h5>
                            <ul>
                              {Object.entries(selectedRestaurant.schedule).map(([day, hours]) => (
                                <li key={day}>
                                  <span className="day">{day}:</span>
                                  <span className="hours">{hours || 'Cerrado'}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="action-buttons">
                  <a 
                    href={`https://www.google.com/maps?q=${selectedRestaurant.latitude},${selectedRestaurant.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn directions-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Cómo llegar
                  </a>
                  
                  <button 
                    className={`btn favorite-btn ${favorites.includes(selectedRestaurant.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(selectedRestaurant.id, e);
                    }}
                  >
                    <FaStar className="favorite-icon" />
                    {favorites.includes(selectedRestaurant.id) ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;
