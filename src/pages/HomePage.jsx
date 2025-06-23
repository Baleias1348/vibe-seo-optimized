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
    Thermometer, Cloud, CloudRain, MountainSnow, Sun, Utensils, Briefcase, AlertTriangle, Replace, 
    SunDim, Banknote, Flag, Globe, Map, HeartPulse, Shuffle, Newspaper, Plane, Wine
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';


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

const QuickAccessButton = ({ icon: Icon, label, onClick }) => {
    const words = label.split(' ');
    const isLongLabel = words.length > 2; // Para etiquetas con más de 2 palabras
    
    return (
        <motion.div
            whileHover={{ y: -3 }}
            className="flex flex-col items-center space-y-2 cursor-pointer group w-24"
            onClick={onClick}
        >
            <div className="p-3 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors flex-shrink-0">
                <Icon className="h-7 w-7 text-white" />
            </div>
            <span className={`text-sm font-medium text-white text-center min-h-[40px] flex items-center justify-center`}>
                {isLongLabel ? (
                    <span>
                        {words.slice(0, 2).join(' ')}<br />
                        {words.slice(2).join(' ')}
                    </span>
                ) : label}
            </span>
        </motion.div>
    );
};

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
    console.log('🔄 Obteniendo configuración del sitio...');
    let config;
    
    try {
      // 1. Intentar obtener de Supabase
      config = await getSiteConfig();
      console.log('✅ Configuración obtenida de Supabase:', config);
      
      // 2. Verificar si la configuración tiene datos válidos
      if (!config || (typeof config === 'object' && Object.keys(config).length === 0)) {
        throw new Error('La configuración devuelta está vacía');
      }
      
      // 3. Procesar las imágenes del carrusel
      const processedConfig = {
        ...config,
        // Asegurar que hero_images esté definido y sea un array
        hero_images: Array.isArray(config.hero_images) 
          ? config.hero_images 
          : []
      };
      
      // 4. Actualizar el estado solo si hay cambios
      setSiteConfigData(prev => {
        // Usar JSON.stringify para comparación profunda
        const prevStr = JSON.stringify({
          ...prev,
          _lastUpdated: undefined,
          _fetchId: undefined
        });
        
        const newStr = JSON.stringify({
          ...processedConfig,
          _lastUpdated: new Date().toISOString(),
          _fetchId: Math.random().toString(36).substr(2, 9)
        });
        
        // Solo actualizar si hay cambios reales
        if (prevStr !== newStr) {
          console.log('🔄 Actualizando configuración con nuevos datos');
          return {
            ...processedConfig,
            _lastUpdated: new Date().toISOString(),
            _fetchId: Math.random().toString(36).substr(2, 9)
          };
        }
        
        console.log('ℹ️ No hay cambios en la configuración');
        return prev;
      });
      
      return true;
      
    } catch (error) {
      console.error('❌ Error al obtener la configuración:', error);
      
      // Usar valores por defecto en caso de error
      const defaultConfig = {
        siteName: 'CHILE ao Vivo',
        logoUrl: 'https://placehold.co/120x50?text=CHILEaoVivo',
        hero_images: [
          {
            url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1470&auto=format&fit=crop',
            alt: 'Paisaje de Chile'
          },
          {
            url: 'https://images.unsplash.com/photo-1518509562904-e23f38707bcc?q=80&w=1470&auto=format&fit=crop',
            alt: 'Montañas de los Andes'
          },
          {
            url: 'https://images.unsplash.com/photo-1508005244291-519cf9555922?q=80&w=1470&auto=format&fit=crop',
            alt: 'Viñedos chilenos'
          },
          {
            url: 'https://images.unsplash.com/photo-1478827387698-1527781a4887?q=80&w=1470&auto=format&fit=crop',
            alt: 'Costa del Pacífico'
          }
        ],
        currencySymbol: 'R$',
        currencyCode: 'BRL',
        _lastUpdated: new Date().toISOString(),
        _isDefault: true
      };
      
      // Solo actualizar si es necesario
      setSiteConfigData(prev => {
        if (prev._isDefault) return prev; // Ya está usando valores por defecto
        return defaultConfig;
      });
      
      return false;
    }
  }, []);

  // Efecto para manejar la suscripción a cambios en tiempo real
  useEffect(() => {
    let isMounted = true;
    let unsubscribe;
    let retryCount = 0;
    const MAX_RETRIES = 5;

    const handleConfigUpdate = (newConfig) => {
      console.log('🔔 Cambio en tiempo real detectado:', newConfig);
      
      if (!isMounted) return;
      
      // Verificar si hay cambios reales antes de actualizar el estado
      setSiteConfigData(prev => {
        // Usar JSON.stringify para comparación profunda
        const prevStr = JSON.stringify({
          ...prev,
          // Excluir propiedades que pueden cambiar en cada render
          _lastUpdated: undefined,
          _subscriptionId: undefined
        });
        
        const newStr = JSON.stringify({
          ...newConfig,
          _lastUpdated: new Date().toISOString(),
          _subscriptionId: Math.random().toString(36).substr(2, 9)
        });
        
        // Solo actualizar si hay cambios reales
        if (prevStr !== newStr) {
          console.log('🔄 Actualizando configuración con cambios...');
          return {
            ...newConfig,
            _lastUpdated: new Date().toISOString(),
            _subscriptionId: Math.random().toString(36).substr(2, 9)
          };
        }
        
        console.log('ℹ️ No hay cambios significativos para actualizar');
        return prev;
      });
    };

    const initializeSubscription = async () => {
      if (!isMounted) return;
      
      try {
        // Cargar configuración inicial
        await fetchSiteConfig();
        
        if (!isMounted) return;
        
        console.log('🔍 Configurando suscripción a cambios en tiempo real...');
        
        // Configurar la suscripción
        unsubscribe = subscribeToConfigChanges(handleConfigUpdate);
        
        // Reiniciar el contador de reintentos en caso de éxito
        retryCount = 0;
      } catch (error) {
        console.error('❌ Error al inicializar la suscripción:', error);
        
        // Reintentar si no hemos alcanzado el máximo de reintentos
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          const delay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Backoff exponencial, máximo 30s
          console.log(`🔄 Reintentando en ${delay/1000} segundos... (${retryCount}/${MAX_RETRIES})`);
          
          setTimeout(() => {
            if (isMounted) initializeSubscription();
          }, delay);
        } else {
          console.error('❌ Se alcanzó el máximo número de reintentos');
        }
      }
    };
    
    // Inicializar la suscripción
    initializeSubscription();
    
    // Función de limpieza
    return () => {
      console.log('🧹 Limpiando suscripción...');
      isMounted = false;
      
      if (unsubscribe && typeof unsubscribe === 'function') {
        try {
          console.log('🔴 Cancelando suscripción...');
          unsubscribe();
        } catch (error) {
          console.error('Error al cancelar la suscripción:', error);
        }
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
    
    // Obtener imágenes del carrusel
    const getHeroImages = () => {
      // Si hay un array de hero_images, usarlo
      if (Array.isArray(siteConfigData.hero_images) && siteConfigData.hero_images.length > 0) {
        return siteConfigData.hero_images.map((img, index) => ({
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
      }
      
      // Si no hay hero_images, verificar las propiedades individuales (backward compatibility)
      const legacyImages = [];
      
      for (let i = 1; i <= 4; i++) {
        const url = siteConfigData[`heroImage${i}`] || siteConfigData[`hero_image_${i}`];
        const alt = siteConfigData[`heroAlt${i}`] || siteConfigData[`hero_alt_${i}`] || `Imagen ${i} del carrusel`;
        
        if (url && url.trim() !== '') {
          legacyImages.push({
            src: url,
            alt: alt,
            id: `hero-legacy-${i}`
          });
        }
      }
      
      if (legacyImages.length > 0) {
        return legacyImages;
      }
      
      // Si no hay imágenes, usar una por defecto
      return [{
        src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1470&auto=format&fit=crop',
        alt: 'Paisaje de Chile',
        id: 'default-hero'
      }];
    };
    
    const finalHeroImages = getHeroImages();
    console.log('Imágenes del carrusel procesadas:', finalHeroImages);

    // Hero Banner Estático
    const HeroBanner = () => (
      <section className="w-full" style={{ height: 400, overflow: 'hidden' }}>
        {siteConfigData.hero_images && siteConfigData.hero_images.length > 0 ? (
          <img
            src={siteConfigData.hero_images[0].url}
            alt={siteConfigData.hero_images[0].alt || 'Hero Banner'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1470&auto=format&fit=crop"
            alt="Hero Banner"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
      </section>
    );

    const quickAccessItems = [
        { icon: Thermometer, label: "Clima", link: "/clima" },
        { icon: Banknote, label: "Conversor de Moeda", link: "/conversor-moeda" },
        { icon: Utensils, label: "Guia Gastronômico", link: "/restaurantes" },
        { icon: Plane, label: "Estado do Voo", link: "/voos" },
        { icon: AlertTriangle, label: "Emergências", link: "/emergencias" },
        { icon: Map, label: "Mapas Úteis", link: "/mapas" },
        { icon: Banknote, label: "Casas de Cambio", link: "/casas-de-cambio" },
    ];

    const infoCards = [
        { title: "Pronóstico del Clima", description: "Detalhes do clima para planejar sua viagem.", icon: CloudRain, link: "/clima-detalhado", sim: true },
        { title: "Conversor de Moeda", description: "Calcule o câmbio em tempo real.", icon: Replace, link: "/conversor-moeda", sim: true },
        { title: "Centros de Ski", description: "Aventura na neve nos melhores picos.", icon: MountainSnow, link: "/centros-de-esqui" },
        { title: "Vinos y Vinícolas", description: "Descubre las mejores rutas del vino chileno.", icon: Wine, link: "/vinos-y-vinicolas" },
    ];
                    <Link to="/passeios">
                        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border-2 border-primary/20 hover:border-primary/40">
                            <CardHeader className="items-center text-center">
                                <div className="p-3 bg-primary/10 rounded-full mb-2">
                                    <MountainSnow className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle className="text-xl">Passeios e Experiências</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center flex-grow">
                                <p className="text-sm text-muted-foreground mb-4">Descubra as melhores experiências e passeios pelo Chile</p>
                                <Button variant="outline" className="mt-2">
                                    Ver todos os passeios
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>

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

    return (
        <>
            <HeroBanner />
            <section className="py-12 bg-white">
                <div className="container mx-auto p-4">
                    <h2 className="text-3xl font-bold mb-4">Acceso rápido</h2>
                    <div className="flex flex-wrap justify-center mb-4">
                        {quickAccessItems.map((item, index) => (
                            <Link to={item.link} key={index} className="m-2">
                                <div className="bg-white rounded-lg shadow-md p-4 w-40 h-40 flex flex-col items-center justify-center">
                                    <item.icon className="h-8 w-8 text-primary mb-2" />
                                    <span className="text-lg font-bold">{item.label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-12 bg-white">
                <div className="container mx-auto p-4">
                    <h2 className="text-3xl font-bold mb-4">Información útil</h2>
                    <div className="flex flex-wrap justify-center mb-4">
                        {infoCards.map((card, index) => (
                            <Link to={card.link} key={index} className="m-2">
                                <div className="bg-white rounded-lg shadow-md p-4 w-80 h-80 flex flex-col items-center justify-center">
                                    <card.icon className="h-8 w-8 text-primary mb-2" />
                                    <h3 className="text-lg font-bold">{card.title}</h3>
                                    <p className="text-sm text-muted-foreground">{card.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-12 bg-white">
                <div className="container mx-auto p-4">
                    <h2 className="text-3xl font-bold mb-4">Pronóstico del clima</h2>
                    <div className="flex flex-wrap justify-center mb-4">
                        {siteConfigData.hero_images && siteConfigData.hero_images.length > 0 ? (
                            <img
                                src={siteConfigData.hero_images[0].url}
                                alt={siteConfigData.hero_images[0].alt || 'Hero Banner'}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        ) : (
                            <img
                                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1470&auto=format&fit=crop"
                                alt="Hero Banner"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        )}
                    </div>
                </div>
            </section>
            <section className="py-12 bg-white">
                <div className="container mx-auto p-4">
                    <h2 className="text-3xl font-bold mb-4">Paseos y experiencias</h2>
                    <div className="flex flex-wrap justify-center mb-4">
                        <Link to="/paseos">
                            <div className="bg-white rounded-lg shadow-md p-4 w-80 h-80 flex flex-col items-center justify-center">
                                <MountainSnow className="h-8 w-8 text-primary mb-2" />
                                <h3 className="text-lg font-bold">Paseos y experiencias</h3>
                                <p className="text-sm text-muted-foreground">Descubre las mejores experiencias y paseos por Chile</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
            <section className="py-12 bg-white">
                <div className="container mx-auto p-4">
                    <h2 className="text-3xl font-bold mb-4">Noticias destacadas</h2>
                    <div className="flex flex-wrap justify-center mb-4">
                        <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
                            <div className="aspect-[16/9] w-full overflow-hidden">
                                <img-replace src="https://images.unsplash.com/photo-1558464876-94cf36537234?q=80&w=1374&auto=format&fit=crop" alt="Prato de mariscos chilenos frescos" className="w-full h-full object-cover" />
                            </div>
                            <CardContent className="p-6 flex-grow flex flex-col">
                                <p className="text-sm font-semibold text-secondary mb-1">Reportaje destacado</p>
                                <h3 className="text-xl font-semibold mb-2 text-primary">O Sabor dos Mariscos Chilenos</h3>
                                <p className="text-muted-foreground mb-4 flex-grow">Uma imersão na rica culinária costeira do Chile.</p>
                                <Button variant="link" asChild className="mt-auto self-start px-0"><Link to="/blog/mariscos-chilenos">Leia Mais &rarr;</Link></Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;