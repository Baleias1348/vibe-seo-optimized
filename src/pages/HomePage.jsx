import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import TourCard from '@/components/shared/TourCard';
import TourCardSkeleton from '@/components/shared/TourCardSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllTours, getSiteConfig, subscribeToConfigChanges } from '@/lib/tourData';
import { supabase } from '@/lib/supabaseClient';
import { 
    Thermometer, Cloud, CloudRain, MountainSnow, Sun, Landmark, Briefcase, AlertTriangle, Replace, 
    SunDim, Banknote, Flag, Globe, Map, HeartPulse, Shuffle, Newspaper
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import HeroCarousel from '@/components/HeroCarousel/HeroCarousel';

const TickerItem = ({ icon: Icon, text, highlight = false }) => (
    <div className={`flex items-center space-x-3 mx-5 ${highlight ? 'text-yellow-300' : ''}`}>
        {Icon && <Icon className="h-6 w-6 flex-shrink-0" />}
        <span className="whitespace-nowrap text-lg md:text-xl italic font-arial font-bold">{text}</span>
    </div>
);

const NewsTicker = ({ tickerData }) => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentDateTime(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    if (!tickerData || tickerData.length === 0) {
        return (
            <div className="bg-red-600 text-white py-3 overflow-hidden">
                <p className="text-center italic text-sm">Carregando informações do ticker...</p>
            </div>
        );
    }
    
    const formattedDate = format(currentDateTime, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    const formattedTime = format(currentDateTime, "HH:mm");

    const dateAndTimeText = `Informações do dia: ${formattedDate}, Hora de Chile: ${formattedTime} horas`;
    
    const tickerContent = [
        { icon: SunDim, text: dateAndTimeText, id: 'datetime' },
        { icon: Cloud, text: `Santiago: ${tickerData.find(d => d.id === 'weather_santiago')?.content || '--º'}`, id: 'weather_santiago' },
        { icon: Cloud, text: `Viña del Mar: ${tickerData.find(d => d.id === 'weather_vina')?.content || '--º'}`, id: 'weather_vina' },
        { icon: Cloud, text: `Valparaíso: ${tickerData.find(d => d.id === 'weather_valparaiso')?.content || '--º'}`, id: 'weather_valparaiso' },
        { icon: CloudRain, text: `Concepción: ${tickerData.find(d => d.id === 'weather_concepcion')?.content || '--º'}`, id: 'weather_concepcion' },
        { icon: Cloud, text: `Chillán (cidade): ${tickerData.find(d => d.id === 'weather_chillan_city')?.content || '--º'}`, id: 'weather_chillan_city' },
        { icon: Sun, text: `Antofagasta: ${tickerData.find(d => d.id === 'weather_antofagasta')?.content || '--º'}`, id: 'weather_antofagasta' },
        { icon: MountainSnow, text: `Valle Nevado: ${tickerData.find(d => d.id === 'ski_valle_nevado')?.content || '--'}`, id: 'ski_valle_nevado' },
        { icon: MountainSnow, text: `Farellones: ${tickerData.find(d => d.id === 'ski_farellones')?.content || '--'}`, id: 'ski_farellones' },
        { icon: MountainSnow, text: `El Colorado: ${tickerData.find(d => d.id === 'ski_el_colorado')?.content || '--'}`, id: 'ski_el_colorado' },
        { icon: MountainSnow, text: `Portillo: ${tickerData.find(d => d.id === 'ski_portillo')?.content || '--'}`, id: 'ski_portillo' },
        { icon: MountainSnow, text: `La Parva: ${tickerData.find(d => d.id === 'ski_la_parva')?.content || '--'}`, id: 'ski_la_parva' },
        { icon: MountainSnow, text: `Nevados de Chillán: ${tickerData.find(d => d.id === 'ski_nevados_chillan')?.content || '--'}`, id: 'ski_nevados_chillan' },
        { icon: Flag, text: `Real (BRL): ${tickerData.find(d => d.id === 'currency_brl_clp')?.content || '$--'}`, id: 'currency_brl_clp' },
        { icon: Flag, text: `Dólar (USD) em Reais: ${tickerData.find(d => d.id === 'currency_usd_brl')?.content || 'R$--'}`, id: 'currency_usd_brl' },
        { icon: Flag, text: `Dólar (USD) em Pesos: ${tickerData.find(d => d.id === 'currency_usd_clp')?.content || '$--'}`, id: 'currency_usd_clp' },
    ].filter(item => item.text && (item.id === 'datetime' || (tickerData.find(d => d.id === item.id)?.content || '').trim() !== '--'));


    return (
        <div className="bg-red-600 text-white py-3 overflow-hidden h-[50px] flex items-center font-arial">
            <motion.div
                className="flex"
                animate={{ x: ['100%', '-100%'] }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 200, // Aumentado para hacer más lento el ticker
                        ease: "linear",
                    },
                }}
            >
                {tickerContent.map((item, index) => (
                    <TickerItem key={index} icon={item.icon} text={item.text} highlight={item.highlight} />
                ))}
                 {tickerContent.map((item, index) => (
                    <TickerItem key={`dup-${index}`} icon={item.icon} text={item.text} highlight={item.highlight} />
                ))}
            </motion.div>
        </div>
    );
};

// HeroCarousel ha sido movido a un componente separado en @/components/HeroCarousel/HeroCarousel

const QuickAccessButton = ({ icon: Icon, label, onClick }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.05 }}
        className="flex flex-col items-center space-y-2 cursor-pointer group"
        onClick={onClick}
    >
        <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
            <Icon className="h-8 w-8 text-primary" />
        </div>
        <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">{label}</span>
    </motion.div>
);

const HomePage = () => {
    const [featuredTours, setFeaturedTours] = useState([]);
    const [siteConfigData, setSiteConfigData] = useState({
        heroImage1: '',
        heroImage2: '',
        heroImage3: '',
        heroImage4: '',
        heroAlt1: '',
        heroAlt2: '',
        heroAlt3: '',
        heroAlt4: '',
        siteName: 'CHILE ao Vivo',
        logoUrl: 'https://placehold.co/120x50?text=CHILEaoVivo',
        currencySymbol: 'R$',
        currencyCode: 'BRL'
    });
    const [isLoadingTours, setIsLoadingTours] = useState(true);
    const [tickerData, setTickerData] = useState([]);

    // Obtener configuración del sitio
    const fetchSiteConfig = useCallback(async () => {
        try {
            console.log('Obteniendo configuración del sitio...');
            const config = await getSiteConfig();
            console.log('Configuración obtenida:', config);
            setSiteConfigData(config);
        } catch (error) {
            console.error('Error al obtener la configuración:', error);
            // Usar valores por defecto en caso de error
            setSiteConfigData({
                heroImage1: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1470&auto=format&fit=crop',
                heroAlt1: 'Paisaje de Chile',
                heroImage2: 'https://images.unsplash.com/photo-1518509562904-e23f38707bcc?q=80&w=1470&auto=format&fit=crop',
                heroAlt2: 'Montañas de los Andes',
                heroImage3: 'https://images.unsplash.com/photo-1508005244291-519cf9555922?q=80&w=1470&auto=format&fit=crop',
                heroAlt3: 'Viñedos chilenos',
                heroImage4: 'https://images.unsplash.com/photo-1478827387698-1527781a4887?q=80&w=1470&auto=format&fit=crop',
                heroAlt4: 'Costa del Pacífico',
                siteName: 'CHILE ao Vivo',
                logoUrl: 'https://placehold.co/120x50?text=CHILEaoVivo',
                currencySymbol: 'R$',
                currencyCode: 'BRL'
            });
        }
    }, []);

    useEffect(() => {
        fetchSiteConfig();
        
        // Suscribirse a cambios en tiempo real
        const unsubscribe = subscribeToConfigChanges((newConfig) => {
            console.log('Cambio en tiempo real detectado:', newConfig);
            setSiteConfigData(prev => ({
                ...prev,
                ...newConfig
            }));
        });
        
        return () => {
            if (unsubscribe && typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, [fetchSiteConfig]);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'vibechile-site-config') {
                fetchSiteConfig(); // Re-fetch on storage change
            }
        };
        window.addEventListener('storage', handleStorageChange);
        
        const fetchTickerData = async () => {
            console.log('Buscando datos del ticker...');
            const { data, error } = await supabase.from('ticker_data').select('*');
            if (error) {
                console.error('Erro ao buscar dados do ticker:', error);
            } else {
                console.log('Datos del ticker recibidos:', data);
                setTickerData(data || []);
            }
        };
        
        // Llamar a fetchTickerData
        fetchTickerData();

        const fetchFeaturedTours = async () => {
            setIsLoadingTours(true);
            try {
                const allTours = await getAllTours();
                if (Array.isArray(allTours)) {
                    setFeaturedTours(allTours); 
                } else {
                    console.error("getAllTours did not return an array:", allTours);
                    setFeaturedTours([]);
                }
            } catch (error) {
                console.error("Error fetching tours for HomePage:", error);
                setFeaturedTours([]);
            } finally {
                setIsLoadingTours(false);
            }
        };

        fetchTickerData();
        fetchFeaturedTours();
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [fetchSiteConfig]);

    // Log para depuración de imágenes
    console.log('siteConfigData:', siteConfigData);
    
    // Obtener imágenes del carrusel desde hero_images o usar un array vacío si no existe
    const heroImagesArray = Array.isArray(siteConfigData.hero_images) 
        ? siteConfigData.hero_images 
        : [];
    
    // Mapear las imágenes al formato esperado por el carrusel
    const heroImages = heroImagesArray.map((img, index) => ({
        src: img.url || '',
        alt: img.alt || `Imagen ${index + 1} del carrusel`,
        id: `hero-${index}`
    })).filter(img => {
        const isValid = img && img.src && img.src.trim() !== '';
        if (!isValid) {
            console.warn(`Imagen inválida en el carrusel:`, img);
        }
        return isValid;
    });
    
    // Si no hay imágenes, usar una imagen por defecto
    const defaultHeroImage = [{
        src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1470&auto=format&fit=crop',
        alt: 'Paisaje de Chile',
        id: 'default-hero'
    }];
    
    const finalHeroImages = heroImages.length > 0 ? heroImages : defaultHeroImage;
    
    console.log('Imágenes del carrusel procesadas:', finalHeroImages);
    
    console.log('Imágenes del carrusel:', heroImages);

    const quickAccessItems = [
        { icon: Thermometer, label: "Clima", link: "/clima" },
        { icon: Banknote, label: "Câmbio", link: "/cambio" },
        { icon: Landmark, label: "Gastronomia", link: "/restaurantes-santiago" },
        { icon: Briefcase, label: "Voos", link: "/voos" },
        { icon: AlertTriangle, label: "Emergências", link: "/emergencias" },
        { icon: Map, label: "Mapas Úteis", link: "/mapas" }, // New Icon
        { icon: Newspaper, label: "Notícias", link: "/noticias" }, // New Icon
    ];

    const infoCards = [
        { title: "Pronóstico del Clima", description: "Detalhes do clima para planejar sua viagem.", icon: CloudRain, link: "/clima-detalhado", sim: true },
        { title: "Conversor de Moeda", description: "Calcule o câmbio em tempo real.", icon: Replace, link: "/conversor-moeda", sim: true },
        { title: "Centros de Ski", description: "Aventura na neve nos melhores picos.", icon: MountainSnow, link: "/centros-de-esqui" },
        { title: "Restaurantes", description: "Sabores do Chile: guia gastronômico.", icon: Landmark, link: "/restaurantes-santiago" },
    ];

    const simulatedTours = [
        { id: "sim1", nameLine1: "Aventura", nameLine2:"no Deserto", location: "Atacama, Chile", duration: "3 dias", pricePerAdult: 1200, description: "Explore as paisagens lunares do deserto mais árido do mundo.", image: "https://images.unsplash.com/photo-1508094361382-5f7c69a863c9?q=80&w=1470&auto=format&fit=crop" },
        { id: "sim2", nameLine1: "Patagônia", nameLine2:"Selvagem", location: "Torres del Paine, Chile", duration: "5 dias", pricePerAdult: 2500, description: "Caminhe por trilhas icônicas e admire glaciares imponentes.", image: "https://images.unsplash.com/photo-1529973568089-a1968960c675?q=80&w=1470&auto=format&fit=crop" },
        { id: "sim3", nameLine1: "Vinhos & Vales", nameLine2:"Experiência", location: "Vale de Colchagua", duration: "1 dia", pricePerAdult: 350, description: "Deguste vinhos premiados em vinícolas charmosas.", image: "https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?q=80&w=1470&auto=format&fit=crop" },
    ];

    const toursToShow = [...featuredTours, ...simulatedTours.slice(0, Math.max(0, 4 - featuredTours.length))].slice(0, 4);

    return (
        <div className="bg-background">
            <NewsTicker tickerData={tickerData} />
            <HeroCarousel images={finalHeroImages} />

            <section className="container py-12 md:py-16">
                <div className="flex justify-center items-center flex-wrap gap-x-8 gap-y-10 md:gap-x-12">
                    {quickAccessItems.map(item => (
                        <Link to={item.link} key={item.label}>
                             <QuickAccessButton icon={item.icon} label={item.label} />
                        </Link>
                    ))}
                </div>
            </section>

            <section className="container py-8 md:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {infoCards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="items-center text-center">
                                    <div className="p-3 bg-primary/10 rounded-full mb-2">
                                        <card.icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg">{card.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center flex-grow">
                                    <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
                                </CardContent>
                                <div className="p-4 pt-0 text-center">
                                    <Button asChild variant="outline" className="w-full">
                                        <Link to={card.link}>{card.sim ? "Saiba Mais (Simulado)" : "Explorar"}</Link>
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>
            
            <section className="container py-8 md:py-12">
                <Card className="bg-card shadow-xl border">
                    <CardHeader>
                        <CardTitle className="text-2xl md:text-3xl text-center text-primary">Passeios em Destaque</CardTitle>
                    </CardHeader>
                    <CardContent>
                         {isLoadingTours ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <TourCardSkeleton key={index} />
                                ))}
                            </div>
                         ) : toursToShow.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                {toursToShow.map((tour, index) => (
                                     <motion.div
                                        key={tour.id || `sim-${index}`}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <TourCard tour={tour} />
                                    </motion.div>
                                ))}
                            </div>
                         ) : (
                            <p className="text-center text-muted-foreground py-8">Nenhum passeio em destaque disponível no momento.</p>
                         )}
                    </CardContent>
                </Card>
            </section>

            <section className="container py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
                            <div className="aspect-[16/9] w-full overflow-hidden">
                                <img-replace src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop" alt="Pessoas em reunião de negócios planejando investimento" className="w-full h-full object-cover" />
                            </div>
                            <CardContent className="p-6 flex-grow flex flex-col">
                                <h3 className="text-xl font-semibold mb-2 text-primary">Invista no Chile</h3>
                                <p className="text-muted-foreground mb-4 flex-grow">Saiba como investir no Chile passo a passo. Oportunidades e guias.</p>
                                <Button variant="link" asChild className="mt-auto self-start px-0"><Link to="/investir-chile">Leia Mais &rarr;</Link></Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
                            <div className="aspect-[16/9] w-full overflow-hidden">
                                <img-replace src="https://images.unsplash.com/photo-1558464876-94cf36537234?q=80&w=1374&auto=format&fit=crop" alt="Prato de mariscos chilenos frescos" className="w-full h-full object-cover" />
                            </div>
                            <CardContent className="p-6 flex-grow flex flex-col">
                                <p className="text-sm font-semibold text-secondary mb-1">Reportagem Destacada</p>
                                <h3 className="text-xl font-semibold mb-2 text-primary">O Sabor dos Mariscos Chilenos</h3>
                                <p className="text-muted-foreground mb-4 flex-grow">Uma imersão na rica culinária costeira do Chile.</p>
                                <Button variant="link" asChild className="mt-auto self-start px-0"><Link to="/blog/mariscos-chilenos">Leia Mais &rarr;</Link></Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default HomePage;