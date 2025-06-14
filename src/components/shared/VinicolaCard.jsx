import React from 'react';
import { MapPin, Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VinicolaCard = ({ vinicola }) => {
  const rating = parseFloat(vinicola['Avaliação (Estrelas ★)']?.split(' ')[0] || '0');
  const reviewCount = vinicola['Nº de Avaliações (Aprox.)']?.replace(/[^0-9]/g, '') || '0';
  
  // Mapeo de viñas a sus imágenes con descripciones alternativas
  const vinicolaImages = {
    'Viña Casas del Bosque': {
      url: 'https://www.casasdelbosque.cl/wp-content/uploads/2023/03/casas-del-bosque-vi%C3%B1a-exteriores-1.jpg',
      alt: 'Viña Casas del Bosque - Vista panorámica de los viñedos y el restaurante Tanino'
    },
    'Viña Emiliana Organic': {
      url: 'https://emiliana.cl/wp-content/uploads/2021/10/emiliana-organic-vineyards.jpg',
      alt: 'Viña Emiliana Organic - Viñedos orgánicos con montañas de fondo'
    },
    'Viña Lapostolle': {
      url: 'https://www.lapostolle.com/wp-content/uploads/2022/03/lapostolle-vineyard-aerial.jpg',
      alt: 'Viña Lapostolle - Vista aérea de la impresionante arquitectura de la bodega'
    },
    'Viña Casa Silva': {
      url: 'https://www.casasilva.cl/wp-content/uploads/2022/05/casa-silva-vineyard.jpg',
      alt: 'Viña Casa Silva - Vista de los viñedos y la casona histórica'
    },
    'Viña Concha y Toro': {
      url: 'https://www.conchaytoro.com/wp-content/uploads/2022/04/concha-y-toro-vineyard.jpg',
      alt: 'Viña Concha y Toro - Vista panorámica de los extensos viñedos'
    },
    'Viña Santa Rita': {
      url: 'https://www.santarita.cl/wp-content/uploads/2022/05/santa-rita-vineyard.jpg',
      alt: 'Viña Santa Rita - Vista de los viñedos con las montañas de los Andes al fondo'
    },
    'Viña Undurraga': {
      url: 'https://undurraga.cl/wp-content/uploads/2022/05/undurraga-vineyard.jpg',
      alt: 'Viña Undurraga - Vista de los hermosos jardines y viñedos'
    }
  };

  const defaultImage = {
    url: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Viñedo - Imagen genérica de viñedos en Chile'
  };

  const image = vinicolaImages[vinicola['Vinícola']] || defaultImage;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 md:h-56 overflow-hidden bg-gray-100">
        <img 
          src={image.url} 
          alt={image.alt}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
          width={400}
          height={250}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage.url;
            e.target.alt = defaultImage.alt;
          }}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900">{vinicola['Vinícola']}</h3>
          <div className="flex items-center bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded">
            <Star className="w-4 h-4 mr-1 fill-current" />
            {rating.toFixed(1)}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{vinicola['Cidade / Vale']}</span>
        </div>
        
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
          {vinicola['Resumo das Opiniões e Pontos Chave']}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>{reviewCount} {reviewCount === '1' ? 'avaliação' : 'avaliações'}</span>
        </div>
        
        <div className="flex space-x-2">
          {vinicola['Página no Google Maps'] && (
            <a 
              href={vinicola['Página no Google Maps'].startsWith('http') ? 
                    vinicola['Página no Google Maps'] : 
                    `https://${vinicola['Página no Google Maps']}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" size="sm" className="w-full">
                <MapPin className="w-4 h-4 mr-1" /> Mapa
              </Button>
            </a>
          )}
          
          {vinicola['Site Oficial'] && (
            <a 
              href={vinicola['Site Oficial'].startsWith('http') ? 
                    vinicola['Site Oficial'] : 
                    `https://${vinicola['Site Oficial']}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="w-4 h-4 mr-1" /> Site
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default VinicolaCard;
