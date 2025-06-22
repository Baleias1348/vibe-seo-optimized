import React, { useState, useEffect } from 'react';

// Función para generar un slug a partir de un texto
const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSkiCenterBySlug, getSiteConfig, getAllSkiCenters } from '@/lib/tourData';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, MountainSnow, Info, MapPin, ExternalLink, Image as ImageIcon, AlertTriangle, Loader2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DetailSection = ({ title, content, icon: Icon, delay = 0.2, isHtml = false, className = '', cardNumber = 0 }) => {
    if (!content || content.trim() === '' || (isHtml && content.trim() === '<p><br></p>')) return null;
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`mb-6 ${className}`}
        >
            {isHtml ? (
                <div className="bg-card rounded-lg border shadow-sm overflow-hidden h-full flex flex-col">
                    <div className="p-4 sm:p-6" style={{ backgroundColor: '#0d7ef6' }}>
                        <div className="flex items-center">
                            {Icon && <Icon className="w-5 h-5 md:w-6 md:h-6 mr-2 text-white" />}
                            <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
                        </div>
                    </div>
                    <div className="relative">
                        <div 
                            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-muted-foreground p-4 sm:p-6 flex-1"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                        <span className="absolute bottom-1 right-2 text-xs text-gray-200 select-none">{cardNumber}</span>
                    </div>
                </div>
            ) : (
                <div className="bg-card rounded-lg border shadow-sm overflow-hidden h-full flex flex-col">
                    <div className="p-4 sm:p-6" style={{ backgroundColor: '#0d7ef6' }}>
                        <div className="flex items-center">
                            {Icon && <Icon className="w-5 h-5 md:w-6 md:h-6 mr-2 text-white" />}
                            <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
                        </div>
                    </div>
                    <div className="relative text-muted-foreground p-4 sm:p-6 flex-1">
                        <p className="m-0">{content}</p>
                        <span className="absolute bottom-1 right-2 text-xs text-gray-200 select-none">{cardNumber}</span>
                    </div>
                </div>
            )}
        </motion.section>
    );
};

const GallerySection = ({ galleryUrls, skiCenterName }) => {
    if (!galleryUrls || galleryUrls.length === 0) return null;
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-8 md:mb-12"
        >
            <div className="bg-card rounded-lg border shadow-sm overflow-hidden mb-6">
                <div className="p-4 sm:p-6" style={{ backgroundColor: '#0d7ef6' }}>
                    <div className="flex items-center">
                        <ImageIcon className="w-5 h-5 md:w-6 md:h-6 mr-2 text-white" />
                        <h2 className="text-xl md:text-2xl font-bold text-white">Galería de Fotos</h2>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
                {galleryUrls.map((url, index) => (
                    <div key={index} className="rounded-lg overflow-hidden shadow-md border aspect-square">
                        <img 
                            src={url} 
                            alt={`${skiCenterName} - Imagem da galeria ${index + 1}`} 
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            onError={(e) => {
                                console.error('Error loading gallery image:', url);
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
                            }}
                        />
                    </div>
                ))}
            </div>
        </motion.section>
    );
};

const SkiCenterDetailPage = () => {
    const { skiCenterSlug } = useParams();
    const [skiCenter, setSkiCenter] = useState(null);
    const [allSkiCenters, setAllSkiCenters] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const siteConfig = getSiteConfig();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllSkiCenters = async () => {
            try {
                const centers = await getAllSkiCenters();
                setAllSkiCenters(centers);
            } catch (err) {
                console.error("Erro ao buscar a lista de centros de ski:", err);
            }
        };
        fetchAllSkiCenters();
    }, []);

    useEffect(() => {
        const fetchSkiCenter = async () => {
            if (!skiCenterSlug) {
                setError("Identificador del centro de ski no proporcionado.");
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                // Primero intentamos buscar por el slug exacto
                let data = await getSkiCenterBySlug(skiCenterSlug);
                
                // Si no encontramos por slug exacto, buscamos en todos los centros
                if (!data && allSkiCenters.length > 0) {
                    const matchingCenter = allSkiCenters.find(center => 
                        generateSlug(center.name) === skiCenterSlug
                    );
                    if (matchingCenter) {
                        data = matchingCenter;
                    }
                }
                
                if (data) {
                    setSkiCenter(data);
                    // Encontrar el índice actual en la lista de centros
                    if (allSkiCenters.length > 0) {
                        const index = allSkiCenters.findIndex(center => 
                            center.id === data.id
                        );
                        if (index !== -1) {
                            setCurrentIndex(index);
                        }
                    }
                } else {
                    setError('Centro de Ski não encontrado.');
                }
            } catch (err) {
                console.error("Erro ao buscar dados do centro de ski:", err);
                setError('Falha ao carregar dados do centro de ski.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSkiCenter();
    }, [skiCenterSlug, allSkiCenters]);

    const navigateToAdjacentCenter = (direction) => {
        if (allSkiCenters.length === 0) return;
        
        let newIndex;
        if (direction === 'prev') {
            newIndex = (currentIndex - 1 + allSkiCenters.length) % allSkiCenters.length;
        } else {
            newIndex = (currentIndex + 1) % allSkiCenters.length;
        }
        
        const nextCenter = allSkiCenters[newIndex];
        if (nextCenter) {
            // Usar el slug existente si está disponible, de lo contrario generarlo
            const nextSlug = nextCenter.slug || generateSlug(nextCenter.name);
            navigate(`/centros-de-esqui/${nextSlug}`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-100px)] p-4">
                <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
                <p className="text-xl text-muted-foreground">Carregando detalhes do centro de ski...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 text-center min-h-[calc(100vh-100px)] flex flex-col justify-center items-center">
                <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-6" />
                <h1 className="text-3xl font-bold mb-4 text-destructive">Erro ao Carregar</h1>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">{error}</p>
                <Button onClick={() => navigate('/centros-de-esqui')}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Centros de Ski</Button>
            </div>
        );
    }

    if (!skiCenter) {
        return (
             <div className="container mx-auto px-4 py-12 text-center min-h-[calc(100vh-100px)] flex flex-col justify-center items-center">
                <MountainSnow className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
                <h1 className="text-3xl font-bold mb-4">Centro de Ski Não Encontrado</h1>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    O centro de ski que você está procurando não foi encontrado.
                </p>
                <Button onClick={() => navigate('/centros-de-esqui')}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Centros de Ski</Button>
            </div>
        );
    }

    const pageTitle = `${skiCenter.metaTitle || skiCenter.name} | ${siteConfig.siteName || 'Vibe Chile'}`;
    const pageDescription = skiCenter.metaDescription || (skiCenter.generalDescription ? skiCenter.generalDescription.replace(/<[^>]+>/g, '').substring(0, 160) : `Descubra ${skiCenter.name}, um dos incríveis centros de ski do Chile.`);
    const pageImage = skiCenter.mainImageUrl || siteConfig.defaultShareImage;

    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={pageImage} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={window.location.href} />
            </Helmet>

            <div className="bg-background text-foreground">
                {/* Sticky Back Button - visible on ski detail pages as header is hidden */}
                 <div className="sticky top-0 left-0 z-40 p-4 bg-background/80 backdrop-blur-md border-b border-border">
                    <div className="container mx-auto flex items-center justify-between">
                        <Button variant="outline" onClick={() => navigate('/centros-de-esqui')} className="shadow-md">
                            <ChevronLeft className="mr-2 h-5 w-5" />
                            Voltar para Centros de Ski
                        </Button>
                        
                        {allSkiCenters.length > 0 && (
                            <div className="flex items-center space-x-2">
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => navigateToAdjacentCenter('prev')}
                                    className="rounded-full h-10 w-10"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    {currentIndex + 1} / {allSkiCenters.length}
                                </span>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => navigateToAdjacentCenter('next')}
                                    className="rounded-full h-10 w-10"
                                >
                                    <ChevronLeft className="h-5 w-5 transform rotate-180" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Hero Section */}
                <section className="relative h-[40vh] md:h-[50vh] text-white flex flex-col justify-center items-center text-center">
                    <div className="absolute inset-0 z-0">
                        <img
                            src={skiCenter.mainImageUrl || 'https://images.unsplash.com/photo-1549788018-908599281086?q=80&w=1470&auto=format&fit=crop'}
                            alt={`Vista panorâmica de ${skiCenter.name}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                console.error('Error loading main image:', skiCenter.mainImageUrl);
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/1920x1080?text=Imagen+no+disponible';
                            }}
                        />
                    </div>
                    <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative z-10 container px-4"
                    >
                        <h1
                            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
                            style={{ textShadow: '2px 3px 10px rgba(0,0,0,0.8)' }}
                        >
                            {skiCenter.name}
                        </h1>
                    </motion.div>
                </section>

                {/* Main content with padding to account for potentially hidden header */}
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <DetailSection 
                            cardNumber={1}
                            title="Sobre o Centro" 
                            content={skiCenter.generalDescription} 
                            icon={Info} 
                            delay={0.1} 
                            isHtml={true} 
                        />
                        <DetailSection 
                            cardNumber={2}
                            title="Perfil e Pistas" 
                            content={skiCenter.profileAndTracks} 
                            icon={MountainSnow} 
                            delay={0.2} 
                            isHtml={true} 
                        />
                        <DetailSection 
                            cardNumber={3}
                            title="A Experiência Única" 
                            content={skiCenter.uniqueExperience} 
                            icon={MapPin} 
                            delay={0.3} 
                            isHtml={true} 
                        />
                        <DetailSection 
                            cardNumber={4}
                            title="Dicas Valiosas" 
                            content={skiCenter.valuableTips} 
                            icon={Info} 
                            delay={0.4} 
                            isHtml={true} 
                        />
                        <DetailSection 
                            cardNumber={5}
                            title="Informações Práticas" 
                            content={skiCenter.practicalInfo} 
                            icon={Info} 
                            delay={0.5} 
                            isHtml={true} 
                            className="md:col-span-2"
                        />
                    </div>
                    
                    <GallerySection galleryUrls={skiCenter.galleryUrls} skiCenterName={skiCenter.name} />

                    {skiCenter.websiteUrl && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="text-center mt-12"
                        >
                            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <a href={skiCenter.websiteUrl} target="_blank" rel="noopener noreferrer">
                                    Visitar Site Oficial <ExternalLink className="ml-2 h-5 w-5" />
                                </a>
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SkiCenterDetailPage;
