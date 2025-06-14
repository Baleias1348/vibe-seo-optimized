import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MountainSnow } from 'lucide-react';
import TourCard from '@/components/shared/TourCard';
import TourCardSkeleton from '@/components/shared/TourCardSkeleton';
import { getAllTours } from '@/lib/tourData';

const ToursPage = () => {
    const [featuredTours, setFeaturedTours] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Datos simulados para los tours
    const simulatedTours = [
        { 
            id: "sim1", 
            nameLine1: "Aventura", 
            nameLine2: "no Deserto", 
            location: "Atacama, Chile", 
            duration: "3 dias", 
            pricePerAdult: 1200, 
            description: "Explore as paisagens lunares do deserto mais árido do mundo.", 
            image: "https://images.unsplash.com/photo-1508094361382-5f7c69a863c9?q=80&w=1470&auto=format&fit=crop" 
        },
        { 
            id: "sim2", 
            nameLine1: "Patagônia", 
            nameLine2: "Selvagem", 
            location: "Torres del Paine, Chile", 
            duration: "5 dias", 
            pricePerAdult: 2500, 
            description: "Caminhe por trilhas icônicas e admire glaciares imponentes.", 
            image: "https://images.unsplash.com/photo-1529973568089-a1968960c675?q=80&w=1470&auto=format&fit=crop" 
        },
        { 
            id: "sim3", 
            nameLine1: "Vinhos & Vales", 
            nameLine2: "Experiência", 
            location: "Vale de Colchagua", 
            duration: "1 dia", 
            pricePerAdult: 350, 
            description: "Deguste vinhos premiados em vinícolas charmosas.", 
            image: "https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?q=80&w=1470&auto=format&fit=crop" 
        },
    ];

    useEffect(() => {
        const fetchTours = async () => {
            setIsLoading(true);
            try {
                const allTours = await getAllTours();
                if (Array.isArray(allTours)) {
                    setFeaturedTours(allTours);
                } else {
                    console.error("getAllTours did not return an array:", allTours);
                    setFeaturedTours([]);
                }
            } catch (error) {
                console.error("Error fetching tours:", error);
                setFeaturedTours([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTours();
    }, []);

    const toursToShow = [...featuredTours, ...simulatedTours.slice(0, Math.max(0, 12 - featuredTours.length))].slice(0, 12);

    return (
        <div className="container py-8 md:py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12 text-center"
            >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <MountainSnow className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Passeios e Experiências no Chile</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Descubra as melhores experiências e aventuras que o Chile tem para oferecer. Desde desertos até geleiras, temos o passeio perfeito para você.
                </p>
            </motion.div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <TourCardSkeleton key={index} />
                    ))}
                </div>
            ) : toursToShow.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {toursToShow.map((tour, index) => (
                        <motion.div
                            key={tour.id || `sim-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            <TourCard tour={tour} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-6">Nenhum passeio disponível no momento.</p>
                    <Button asChild>
                        <Link to="/">Voltar para a página inicial</Link>
                    </Button>
                </div>
            )}

            <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-6">Não encontrou o que procura? Entre em contato conosco!</p>
                <Button asChild variant="outline">
                    <Link to="/contact">Fale Conosco</Link>
                </Button>
            </div>
        </div>
    );
};

export default ToursPage;
