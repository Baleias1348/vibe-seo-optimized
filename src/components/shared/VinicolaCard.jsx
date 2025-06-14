import React from 'react';
import { MapPin, Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VinicolaCard = ({ vinicola }) => {
  const rating = parseFloat(vinicola['Avaliação (Estrelas ★)']?.split(' ')[0] || '0');
  const reviewCount = vinicola['Nº de Avaliações (Aprox.)']?.replace(/[^0-9]/g, '') || '0';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
