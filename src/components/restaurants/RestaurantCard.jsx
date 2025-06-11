import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Utensils, Globe, ExternalLink, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const RestaurantCard = ({ restaurant }) => {
  const {
    name,
    full_address,
    rating,
    review_count,
    photos, // Array of photo URLs
    website,
    place_link, // Google Maps link typically
    phone_number,
    types, // Array of type strings
    price_level
  } = restaurant;

  const mainPhotoUrl = photos && photos.length > 0 ? photos[0] : null;

  // Function to attempt to open a link, preferring place_link then website
  const handleOpenLink = () => {
    if (place_link) {
      window.open(place_link, '_blank');
    } else if (website) {
      window.open(website, '_blank');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col bg-card border border-border/50 hover:border-primary/50">
        <div className="relative h-52 w-full">
          {mainPhotoUrl ? (
            <img-replace src={mainPhotoUrl} alt={`Foto de ${name || 'Restaurante'}`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted via-card to-muted flex items-center justify-center text-muted-foreground">
              <Utensils className="w-16 h-16 opacity-70" />
            </div>
          )}
          {price_level && (
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
              {price_level}
            </div>
          )}
        </div>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold text-primary truncate" title={name || "Nombre no disponible"}>
            {name || "Nombre no disponible"}
          </CardTitle>
          {types && types.length > 0 && (
            <p className="text-xs text-muted-foreground truncate">
              {types.slice(0, 3).join(' • ')}
            </p>
          )}
        </CardHeader>
        <CardContent className="flex-grow space-y-2.5 text-sm">
          {full_address && (
            <div className="flex items-start text-muted-foreground">
              <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0 text-primary/80" />
              <span className="truncate" title={full_address}>{full_address}</span>
            </div>
          )}
          {typeof rating === 'number' && (
            <div className="flex items-center">
              <Star size={16} className="mr-1.5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
              {typeof review_count === 'number' && (
                <span className="ml-1.5 text-xs text-muted-foreground">({review_count} reseñas)</span>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-x-3 pt-3 border-t border-border/50">
          {(place_link || website) && (
            <Button
              variant="outline"
              className="w-full text-xs sm:text-sm"
              onClick={handleOpenLink}
              size="sm"
            >
              {place_link ? <ExternalLink size={14} className="mr-1.5" /> : <Globe size={14} className="mr-1.5" /> }
              {place_link ? "Ver en Mapa" : "Sitio Web"}
            </Button>
          )}
           {phone_number && (
             <Button
              variant="outline"
              className={`w-full text-xs sm:text-sm ${!(place_link || website) ? 'col-span-2' : ''}`}
              onClick={() => window.open(`tel:${phone_number}`, '_self')}
              size="sm"
            >
              <Phone size={14} className="mr-1.5" />
              Llamar
            </Button>
          )}
           {!(place_link || website) && !phone_number && (
             <div className="col-span-2 text-center text-xs text-muted-foreground py-2">
                Más información no disponible
             </div>
           )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default RestaurantCard;