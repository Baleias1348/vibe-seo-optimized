import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Wine } from 'lucide-react';
import { motion } from 'framer-motion';

const VineyardCard = ({ vineyard }) => {
    if (!vineyard) {
        return (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="animate-pulse">
                    <div className="h-48 bg-muted w-full"></div>
                    <div className="p-4">
                        <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                        <div className="h-10 bg-muted rounded w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    // Limpiar y asegurar los textos para mostrar
    const cleanText = (text) => {
        if (!text) return '';
        return String(text).replace(/\s+/g, ' ').trim();
    };

    // Mapeo de campos según la estructura proporcionada
    const valle = cleanText(vineyard.valle || vineyard['Cidade / Vale'] || '');
    const nombre = cleanText(vineyard.nombre_vinicola || vineyard['Vinícola'] || 'Vinícola sin nombre');
    const rating = parseFloat(vineyard.valoracion || vineyard['Avaliação (Estrelas ★)'] || 0);
    const numResenas = parseInt(vineyard.num_resenas || vineyard['Nº de Avaliações (Aprox.)'] || 0, 10);
    const resumen = cleanText(vineyard.resumen || vineyard['Resumo das Opiniões e Pontos Chave'] || '');
    const sitioWeb = cleanText(vineyard.sitio_web || vineyard['Site Oficial'] || '');
    const googleMaps = cleanText(vineyard.google_maps || vineyard['Página no Google Maps'] || '');
    const tripadvisor = cleanText(vineyard.tripadvisor || vineyard['Página no Tripadvisor'] || '');
    
    // Generar estrellas de valoración
    const estrellas = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

    return (
        <motion.div 
            variants={cardVariants} 
            initial="hidden" 
            animate="visible" 
            whileHover={{ y: -5, scale: 1.03 }} 
            transition={{ type: "spring", stiffness: 300 }}
            className="h-full"
        >
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col bg-card">
                <div className="relative h-48 bg-muted">
                    <Link to={`/vinas/${vineyard.id || ''}`} className="block w-full h-full">
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                            <Wine className="h-12 w-12 text-muted-foreground" />
                        </div>
                    </Link>
                </div>
                <CardContent className="flex-1 p-4 flex flex-col">
                    <div className="space-y-2 flex-1">
                        <h3 className="font-semibold text-lg leading-tight">{nombre}</h3>
                        
                        {valle && (
                            <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{valle}</span>
                            </div>
                        )}

                        <div className="flex items-center text-sm">
                            <div className="flex text-amber-400 mr-2">
                                {estrellas}
                            </div>
                            <span className="text-muted-foreground">
                                ({numResenas} {numResenas === 1 ? 'avaliação' : 'avaliações'})
                            </span>
                        </div>

                        {resumen && (
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {resumen}
                            </p>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                        {sitioWeb && (
                            <a 
                                href={sitioWeb.startsWith('http') ? sitioWeb : `https://${sitioWeb}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-primary hover:underline"
                            >
                                🌐 Sitio Web
                            </a>
                        )}
                        {googleMaps && (
                            <a 
                                href={googleMaps}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-primary hover:underline ml-4"
                            >
                                🗺️ Ver en Mapa
                            </a>
                        )}
                        {tripadvisor && (
                            <a 
                                href={tripadvisor}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-primary hover:underline ml-4"
                            >
                                🟢 Tripadvisor
                            </a>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default VineyardCard;
