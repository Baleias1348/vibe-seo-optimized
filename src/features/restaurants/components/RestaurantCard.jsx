import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Globe, Clock, Utensils, MapPin as MapPinIcon, CheckCircle2, XCircle, BookOpen } from 'lucide-react';
import { getTodaysSchedule, isRestaurantOpen } from '@/utils/dateUtils';
import { restaurantCities } from '../utils/restaurantCities';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const RestaurantCard = ({ restaurant, className = '' }) => {
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
    schedule = {},
    description = '' // Asegurarse de que description esté definido
  } = restaurant;

  // Usar photo_url o la primera foto del array photos
  const mainPhotoUrl = photo_url || (Array.isArray(photos) && photos.length > 0 ? photos[0] : null);
  
  // Obtener el horario de hoy
  const todaySchedule = getTodaysSchedule(schedule);
  const isOpen = isRestaurantOpen(todaySchedule);
  
  // Obtener la ciudad del mapeo
  const city = restaurantCities[name] || 'Ubicación no disponible';
  
  // Función para generar un enlace de Google Maps
  const generateMapsUrl = (address) => {
    if (!address) return null;
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
              loading="lazy"
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
              
            </div>
          </div>
          <div className="h-px bg-gray-200 w-full my-2"></div>

          {/* Línea 3: Dirección y Ciudad */}
          <div className="space-y-2 mb-3">
            {type && (
              <div className="text-xs font-bold mb-2">
                {type}
              </div>
            )}
            {address && (
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-orange-400 flex-shrink-0" />
                <span className="break-words">{address}</span>
              </div>
            )}
            {city && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-orange-400 flex-shrink-0" />
                <span>{city}</span>
              </div>
            )}
          </div>
          
          {/* Línea 4: Descripción */}
          {description && (
            <div className="space-y-2 mb-3">
              <div className="flex items-start text-sm text-gray-700">
                <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-orange-400 flex-shrink-0" />
                <div>
                  <div className="font-medium mb-1">Descrição:</div>
                  <p className="text-gray-600 whitespace-pre-line">{description}</p>
                </div>
              </div>
              <div className="h-px bg-gray-200 w-full my-2"></div>
            </div>
          )}

          {/* Línea 5: Horario */}
          <div className="space-y-2 mb-3">
            <div className="text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-full">
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span className="font-medium">Horario:</span>
                    {restaurant.place_link && (
                      <a
                        href={restaurant.place_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
                        style={{ textDecoration: 'none' }}
                      >
                        Verificar
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-200 w-full my-2"></div>

          {/* Línea 6: Tipo de cocina */}
          <div className="space-y-2 mb-3">
            {type && (
              <div className="flex items-center text-sm text-gray-600">
                <Utensils className="w-4 h-4 mr-2 text-orange-400 flex-shrink-0" />
                <span>Culinária: {type}</span>
              </div>
            )}
          </div>
          
          {/* Botones de acción */}
          <div className="mt-auto pt-3 flex flex-col sm:flex-row gap-2">
            {mapUrl && (
              <Button 
                asChild 
                variant="outline" 
                className="flex-1 bg-white text-orange-500 border-orange-300 hover:bg-orange-50 hover:text-orange-600"
              >
                <a 
                  href={mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  Mapa
                </a>
              </Button>
            )}
            {website && (
              <Button 
                asChild 
                variant="outline" 
                className="flex-1 bg-white text-orange-500 border-orange-300 hover:bg-orange-50 hover:text-orange-600"
              >
                <a 
                  href={website.startsWith('http') ? website : `https://${website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Sitio Web
                </a>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default RestaurantCard;
