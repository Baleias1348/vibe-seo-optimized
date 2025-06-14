import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Globe, Clock, Utensils, MapPin as MapPinIcon } from 'lucide-react';
import { getTodaysSchedule } from '@/utils/dateUtils';
import { restaurantCities } from '@/utils/restaurantCities';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const RestaurantCard = ({ restaurant, className = '' }) => {
  const {
    name,
    address = 'Dirección no disponible',
    rating = 0,
    photoUrl,
    photos = [],
    website,
    placeLink: place_link,
    priceLevel: price_level = '$$',
    cuisine: type = 'Sin tipo',
    description = 'Sin descripción',
    schedule = {}
  } = restaurant;
  
  // Obtener la ciudad del mapeo
  const city = restaurantCities[name] || 'Ubicación no disponible';

  const mainPhotoUrl = photoUrl || (photos && photos.length > 0 ? photos[0] : null);
  const todaySchedule = getTodaysSchedule(schedule);
  
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

          {/* Línea 2: Rating y Precio */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex">
              {renderStars(rating)}
            </div>
            {price_level && (
              <span className="text-green-600 font-medium">
                {price_level === 1 ? '$' : price_level === 2 ? '$$' : '$$$'}
              </span>
            )}
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
            {todaySchedule && (
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-orange-400 flex-shrink-0" />
                <span>{todaySchedule}</span>
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

          {/* Botones */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex space-x-2">
              {website && (
                <Button 
                  variant="outline" 
                  className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                  onClick={() => window.open(website, '_blank')}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Web
                </Button>
              )}
              {place_link && (
                <Button 
                  variant="outline" 
                  className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                  onClick={() => window.open(place_link, '_blank')}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Mapa
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default RestaurantCard;