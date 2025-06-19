import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Globe, Clock, Utensils, MapPin as MapPinIcon, CheckCircle2, XCircle } from 'lucide-react';
import { getTodaysSchedule, isRestaurantOpen } from '@/utils/dateUtils';
import { restaurantCities } from '@/utils/restaurantCities';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const RestaurantCard = ({ restaurant, className = '' }) => {
  console.log('Datos completos del restaurante:', JSON.stringify(restaurant, null, 2));
  console.log('place_link:', restaurant.place_link);
  console.log('place_id:', restaurant.place_id);
  console.log('hasValidPlaceLink:', restaurant.place_link && isValidUrl(restaurant.place_link));
  const {
    name,
    address = 'Dirección no disponible',
    rating = 0,
    photo_url,
    photos = [],
    website,
    place_link,
    place_id,
    price_level = '$$',
    cuisine: type = 'Sin tipo',
    description = 'Sin descripción',
    schedule = {}
  } = restaurant;

  // Usar photo_url o la primera foto del array photos
  const mainPhotoUrl = photo_url || (Array.isArray(photos) && photos.length > 0 ? photos[0] : null);
  
  // Obtener el horario de hoy
  console.log('Schedule recibido:', JSON.stringify(schedule, null, 2));
  const todaySchedule = getTodaysSchedule(schedule);
  const isOpen = isRestaurantOpen(todaySchedule);
  
  // Depuración
  console.log('Restaurante:', { 
    name, 
    schedule, 
    scheduleType: typeof schedule,
    scheduleKeys: schedule ? Object.keys(schedule) : 'N/A',
    todaySchedule, 
    isOpen 
  });
  
  // Obtener la ciudad del mapeo
  const city = restaurantCities[name] || 'Ubicación no disponible';
  
  // Función para generar un enlace de Google Maps a partir de una dirección
  const generateMapsUrl = (address) => {
    if (!address) return null;
    // Eliminar el nombre del restaurante si está al principio de la dirección
    const cleanAddress = address.replace(/^[^-]+-\s*/, '');
    const encodedAddress = encodeURIComponent(cleanAddress.trim());
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  };
  
  // Generar enlace de mapa usando place_link, place_id o dirección
  const getMapUrl = () => {
    if (restaurant.place_link) return restaurant.place_link;
    if (restaurant.place_id) return `https://www.google.com/maps/place/?q=place_id:${restaurant.place_id}`;
    return generateMapsUrl(address);
  };
  
  const mapUrl = getMapUrl();
  
  // Función para renderizar las estrellas
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    
    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`h-full ${className}`}
    >
      <Card className="h-full flex flex-col overflow-hidden border-2 border-orange-100 rounded-xl hover:shadow-lg transition-shadow duration-300 max-w-full">
        {/* Imagen */}
        <div className="relative h-40 sm:h-48 w-full">
          {mainPhotoUrl ? (
            <img 
              src={mainPhotoUrl} 
              alt={name || 'Restaurante'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4 sm:p-5 flex-grow flex flex-col">
          {/* Línea 1: Nombre */}
          <h3 className="text-lg font-bold text-gray-900 mb-3">{name}</h3>
          <div className="h-px bg-gray-200 w-full mb-3"></div>

          {/* Línea 2: Rating, Precio y Estado */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              {renderStars(rating)}
              <span className="ml-2 text-sm text-gray-600">
                {rating.toFixed(1)} ({restaurant.review_count || 0})
              </span>
            </div>
            <div className="flex items-center gap-4">
              {price_level && (
                <span className="text-green-600 font-medium">
                  {price_level === 1 ? '$' : price_level === 2 ? '$$' : '$$$'}
                </span>
              )}
              <div className={`flex items-center text-sm font-medium ${
                isOpen ? 'text-green-600' : 'text-red-600'
              }`}>
                {isOpen ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    <span>Abierto</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-1" />
                    <span>Cerrado</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-200 w-full my-2"></div>

          {/* Línea 3: Dirección */}
          <div className="space-y-2 mb-3">
            {address && (
              <div className="text-sm text-gray-600">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-orange-400 flex-shrink-0" />
                  <span className="break-words">{address}</span>
                </div>
              </div>
            )}
            {city && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-orange-400 flex-shrink-0" />
                <span>{city}</span>
              </div>
            )}
          </div>
          <div className="h-px bg-gray-200 w-full my-2"></div>

          {/* Línea 4: Horario */}
          <div className="space-y-2 mb-3">
            {todaySchedule && todaySchedule !== 'Horario no disponible' ? (
              <div className="text-sm text-gray-600">
                <div className="flex items-start">
                  <Clock className="w-4 h-4 mr-2 mt-0.5 text-orange-400 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Horario de hoy:</div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isOpen ? 'Abierto' : 'Cerrado'}
                      </span>
                      <span className="ml-2">{todaySchedule}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-orange-400 flex-shrink-0" />
                <span>Horario no disponible</span>
              </div>
            )}
          </div>
          <div className="h-px bg-gray-200 w-full my-2"></div>

          {/* Línea 5: Tipo de cocina */}
          <div className="space-y-2 mb-3">
            {type && (
              <div className="flex items-center text-sm text-gray-600">
                <Utensils className="w-4 h-4 mr-2 text-orange-400 flex-shrink-0" />
                <span>Culinária: {type}</span>
              </div>
            )}
          </div>
          <div className="h-px bg-gray-200 w-full my-2"></div>

          {/* Línea 6: Descripción */}
          <div className="flex-grow flex flex-col">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Descripción:</h4>
            <p className="text-sm text-gray-600 flex-grow line-clamp-3 sm:line-clamp-4">
              {description}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-3">
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                <Globe className="w-4 h-4 mr-2" />
                Web
              </a>
            )}
            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                <MapPinIcon className="w-4 h-4 mr-2" />
                Mapa
              </a>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default RestaurantCard;