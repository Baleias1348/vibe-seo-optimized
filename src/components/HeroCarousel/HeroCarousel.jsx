import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroCarousel = ({ images = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [slides, setSlides] = useState(() => {
        // Estado inicial con manejo de imágenes por defecto
        return images.length > 0 ? images : [{ 
            src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1470&auto=format&fit=crop", 
            alt: 'Imagen de portada',
            id: 'default-hero'
        }];
    });
    
    // Efecto para manejar cambios en las imágenes
    useEffect(() => {
        if (!Array.isArray(images) || images.length === 0) {
            // Si no hay imágenes, usar la imagen por defecto
            setSlides([{ 
                src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1470&auto=format&fit=crop", 
                alt: 'Imagen de portada',
                id: 'default-hero'
            }]);
            return;
        }
        
        // Verificar si las imágenes han cambiado realmente
        const imagesChanged = JSON.stringify(images) !== JSON.stringify(slides);
        
        if (imagesChanged) {
            console.log('🖼️ Actualizando imágenes del carrusel:', images);
            // Filtrar solo las imágenes válidas
            const validImages = images.filter(img => 
                img && 
                typeof img === 'object' && 
                img.src && 
                typeof img.src === 'string' && 
                img.src.trim() !== ''
            );
            
            if (validImages.length > 0) {
                // Asegurar que cada imagen tenga un ID único
                const processedImages = validImages.map((img, index) => ({
                    ...img,
                    id: img.id || `img-${index}-${Date.now()}`,
                    alt: img.alt || `Imagen ${index + 1}`
                }));
                
                setSlides(processedImages);
                
                // Si el índice actual es mayor que el nuevo número de imágenes, reiniciar a 0
                if (currentIndex >= processedImages.length) {
                    setCurrentIndex(0);
                }
            } else {
                // Si no hay imágenes válidas, usar la imagen por defecto
                setSlides([{ 
                    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1470&auto=format&fit=crop", 
                    alt: 'Imagen de portada',
                    id: 'default-hero'
                }]);
                setCurrentIndex(0);
            }
        }
    }, [images]); // Solo se ejecuta cuando cambia la prop images

    // Precargar todas las imágenes al montar el componente
    useEffect(() => {
        slides.forEach(slide => {
            if (slide.src) {
                const img = new Image();
                img.src = slide.src;
            }
        });
    }, [slides]);

    // Efecto para el avance automático
    useEffect(() => {
        if (slides.length <= 1 || isHovered) return;
        
        const timer = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % slides.length);
                setTimeout(() => setIsAnimating(false), 50);
            }, 20);
        }, 5000);
        
        return () => clearInterval(timer);
    }, [slides.length, isHovered, currentIndex]);

    const goToSlide = (index) => {
        if (isAnimating || index === currentIndex) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setTimeout(() => setIsAnimating(false), 50);
        }, 20);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const goToPrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    return (
        <div 
            className="relative w-full bg-black hero-carousel-container h-[132px] md:h-[374px] lg:h-[462px] overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence initial={false} mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: '2%' }}
                    animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { 
                            duration: 0.7,
                            ease: [0.33, 1, 0.68, 1],
                            opacity: { duration: 0.6 }
                        }
                    }}
                    exit={{ 
                        opacity: 0, 
                        x: '-2%',
                        transition: { 
                            duration: 0.6,
                            ease: [0.33, 1, 0.68, 1],
                            opacity: { duration: 0.5 }
                        }
                    }}
                    className="absolute inset-0 w-full h-full"
                    style={{
                        willChange: 'transform, opacity',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)'
                    }}
                >
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
                        <img 
                            src={slides[currentIndex].src} 
                            alt={slides[currentIndex].alt || `Slide ${currentIndex + 1}`}
                            className="w-full h-full object-cover object-center block absolute inset-0"
                            loading="eager"
                            onLoad={(e) => {
                                const nextIndex = (currentIndex + 1) % slides.length;
                                if (slides[nextIndex]) {
                                    const img = new Image();
                                    img.src = slides[nextIndex].src;
                                }
                            }}
                            onError={(e) => {
                                console.error(`Error al cargar la imagen: ${slides[currentIndex].src}`);
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1470&auto=format&fit=crop";
                            }}
                        />
                    </div>
                </motion.div>
            </AnimatePresence>
            

            
            <div className="relative z-10 h-full"></div>
        </div>
    );
};

export default HeroCarousel;
