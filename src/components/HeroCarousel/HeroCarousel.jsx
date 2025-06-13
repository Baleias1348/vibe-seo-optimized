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
            className="relative w-full overflow-hidden bg-black hero-carousel-container"
            style={{
                width: '100%',
                paddingTop: '42.85%', // 21:9 aspect ratio (9/21 ≈ 0.4285)
                position: 'relative',
                overflow: 'hidden'
            }}
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
                            className="w-full h-full"
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                display: 'block',
                                willChange: 'transform',
                                transform: 'translateZ(0) translate(-50%, -50%)',
                                maxWidth: '100%',
                                maxHeight: '100%'
                            }}
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
            
            {slides.length > 1 && (
                <>
                    <button 
                        onClick={goToPrev}
                        className="absolute left-2 top-2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors transform hover:scale-110"
                        aria-label="Imagen anterior"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button 
                        onClick={goToNext}
                        className="absolute right-2 top-2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors transform hover:scale-110"
                        aria-label="Siguiente imagen"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 flex space-x-2 z-20 bg-black/30 px-3 py-1 rounded-full">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50 w-2'}`}
                                aria-label={`Ir a la imagen ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
            
            <div className="relative z-10 h-full"></div>
        </div>
    );
};

export default HeroCarousel;
