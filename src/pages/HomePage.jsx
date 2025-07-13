import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import TourCard from '@/components/shared/TourCard';
import HomeBoxModel from '@/components/homepage/HomeBoxModel';
import HomeBoxModel2 from '@/components/homepage/HomeBoxModel2';
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
import HomeQuickAccessBar from '@/components/HomeQuickAccessBar';
import HomeBoxModels from '@/components/HomeBoxModels';


const TickerItem = ({ icon: Icon, text, highlight = false }) => (
    <div className={`flex items-center space-x-3 mx-5 ${highlight ? 'text-yellow-300' : ''}`}>
        {Icon && <Icon className="h-6 w-6 flex-shrink-0" />}
        <span className="whitespace-nowrap text-lg md:text-xl italic font-arial font-bold">{text}</span>
    </div>
);

const NewsTicker = ({ weather, rates, loading, error }) => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    // Ciudades principales de Chile
    const cities = [
        { name: 'Santiago', q: 'Santiago,CL' },
        { name: 'Valparaíso', q: 'Valparaiso,CL' },
        { name: 'Viña del Mar', q: 'Vina del Mar,CL' },
        { name: 'Concepción', q: 'Concepcion,CL' },
        { name: 'La Serena', q: 'La Serena,CL' }
    ];
    useEffect(() => {
        const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Render ticker content
    const formattedDate = format(currentDateTime, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    // Hora do Brasil (São Paulo): igual à hora local
    const horaBrasil = format(currentDateTime, "HH:mm");
    // Hora do Chile (Santiago): uma hora a menos
    const currentDateChile = new Date(currentDateTime.getTime() - 60 * 60 * 1000);
    const horaChile = format(currentDateChile, "HH:mm");
    const dateAndTimeText = `Informação do dia: ${formattedDate}, Hora do Brasil (São Paulo): ${horaBrasil}, Hora do Chile (Santiago): ${horaChile}`;
    const weatherItems = cities.map(city => ({
        icon: Cloud,
        text: `${city.name}: ${weather[city.name] || '--ºC'}`,
        id: `weather_${city.name.toLowerCase().replace(/\s/g, '_')}`
    }));
    const rateItems = [
        { icon: Banknote, text: `BRL → CLP: ${rates.brl_clp ? rates.brl_clp.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) : '--'}`, id: 'brl_clp' },
        { icon: Banknote, text: `CLP → BRL: ${rates.clp_brl ? rates.clp_brl.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '--'}`, id: 'clp_brl' },
        { icon: Banknote, text: `BRL → USD: ${rates.brl_usd ? rates.brl_usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '--'}`, id: 'brl_usd' },
        { icon: Banknote, text: `USD → BRL: ${rates.usd_brl ? rates.usd_brl.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '--'}`, id: 'usd_brl' },
        { icon: Banknote, text: `CLP → USD: ${rates.clp_usd ? rates.clp_usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '--'}`, id: 'clp_usd' },
        { icon: Banknote, text: `USD → CLP: ${rates.usd_clp ? rates.usd_clp.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) : '--'}`, id: 'usd_clp' },
    ];
    const tickerContent = [
        { icon: SunDim, text: dateAndTimeText, id: 'datetime' },
        ...weatherItems,
        ...rateItems
    ];

    return (
        <div className="bg-red-600 text-white py-3 overflow-hidden">
            <motion.div
                className="flex items-center whitespace-nowrap animate-marquee"
                initial={{ x: '100%' }}
                animate={{ x: '-100%' }}
                transition={{
                    repeat: Infinity,
                    duration: 40,
                    ease: 'linear',
                }}
            >
                {tickerContent.map((item, idx) => (
                    <TickerItem key={item.id + idx} icon={item.icon} text={item.text} />
                ))}
            </motion.div>
            {loading && (
                <span className="absolute bottom-1 right-2 bg-gray-800/80 text-gray-100 text-xs px-2 py-1 rounded shadow z-30 pointer-events-none">
                    Atualizando cotações...
                </span>
            )}
            {error && <div className="text-yellow-200 text-xs text-center mt-1">{error.replace('No se pudo cargar toda la información.', 'Não foi possível carregar todas as informações.')}</div>}
        </div>
    );
};


import HeroCarousel from '@/components/HeroCarousel/HeroCarousel';

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
    
    // --- Estado para el ticker ---
    // (Ya está declarado, eliminada la duplicación)

    const finalHeroImages = getHeroImages();
    console.log('Imágenes del carrusel procesadas:', finalHeroImages);

    // Hero Banner Estático
    const HeroBanner = () => (
      <HeroCarousel images={finalHeroImages} />
    );

    // --- Fetch Ticker Data (con manejo de errores para exchange rate) ---
    const fetchTickerData = async () => {
        try {
            console.log('Buscando datos del ticker...');
            const { data, error } = await supabase.from('ticker_data').select('*');
            if (error) {
                console.error('Error al buscar datos del ticker:', error);
                setTickerData([]);
            } else {
                console.log('Datos del ticker recibidos:', data);
                setTickerData(data || []);
            }
        } catch (err) {
            console.error('Error inesperado al buscar ticker:', err);
            setTickerData([]);
        }
    };

    useEffect(() => {
        fetchTickerData();
        // Opcional: refresco periódico para ticker en tiempo real
        const interval = setInterval(fetchTickerData, 5 * 60 * 1000); // cada 5 minutos
        return () => clearInterval(interval);
    }, []);

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

    // Estado y lógica de clima y tasas (antes en NewsTicker)
    const [weather, setWeather] = useState({});
    const [rates, setRates] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Ciudades principales de Chile
    const cities = [
        { name: 'Santiago', q: 'Santiago,CL' },
        { name: 'Valparaíso', q: 'Valparaiso,CL' },
        { name: 'Viña del Mar', q: 'Vina del Mar,CL' },
        { name: 'Concepción', q: 'Concepcion,CL' },
        { name: 'La Serena', q: 'La Serena,CL' }
    ];

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // OpenWeatherMap
            const weatherResults = {};
            for (const city of cities) {
                try {
                    const res = await fetch(`${import.meta.env.VITE_OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(city.q)}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&lang=es`);
                    const data = await res.json();
                    if (data && data.main && typeof data.main.temp === 'number') {
                        weatherResults[city.name] = `${Math.round(data.main.temp)}ºC`;
                    } else {
                        weatherResults[city.name] = '--ºC';
                    }
                } catch {
                    weatherResults[city.name] = '--ºC';
                }
            }
            setWeather(weatherResults);

            // Fetch rates from open.er-api.com (no API key, no CSP issues)
            const [clpRes, brlRes, usdRes] = await Promise.all([
                fetch('https://open.er-api.com/v6/latest/CLP').then(r => r.json()),
                fetch('https://open.er-api.com/v6/latest/BRL').then(r => r.json()),
                fetch('https://open.er-api.com/v6/latest/USD').then(r => r.json()),
            ]);
            // Defensive: check API success
            if (clpRes.result !== 'success' || brlRes.result !== 'success' || usdRes.result !== 'success') {
                throw new Error('No se pudieron obtener tasas de cambio');
            }
            // CLP base
            const clp_brl = clpRes.rates.BRL || null;
            const clp_usd = clpRes.rates.USD || null;
            // BRL base
            const brl_clp = brlRes.rates.CLP || null;
            const brl_usd = brlRes.rates.USD || null;
            // USD base
            const usd_brl = usdRes.rates.BRL || null;
            const usd_clp = usdRes.rates.CLP || null;
            setRates({ brl_clp, clp_brl, brl_usd, usd_brl, clp_usd, usd_clp });
            setLoading(false);
        } catch (err) {
            setError('No se pudo cargar toda la información.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // 60s
        return () => clearInterval(interval);
    }, [fetchData]);

    return (
        <>
            {/* NewsTicker rojo inmediatamente debajo del encabezado */}
            <NewsTicker weather={weather} rates={rates} loading={loading} error={error} />
            <HeroBanner />
            <HomeQuickAccessBar />
            
            {/* Banner Culinario */}
            <div className="w-full bg-white py-4">
                <div className="container mx-auto px-0">
                    <Link 
                        to="/ranking-dos-melhores-restaurantes-de-Santiago-do-chile" 
                        className="block w-full hover:opacity-90 transition-opacity"
                        aria-label="Descubra os melhores restaurantes de Santiago do Chile"
                    >
                        <div className="relative w-full" style={{ aspectRatio: '1280/200' }}>
                            <img 
                                src="/images/banne-culinaria-chilena.png" 
                                alt="Gastronomia Chilena - Descubra os sabores do Chile"
                                className="w-full h-auto object-cover rounded-lg shadow-md"
                            />
                        </div>
                    </Link>
                </div>
            </div>
            
            {/* Box Models Editable - dos cajas alineadas */}
            <div className="w-full flex flex-col md:flex-row gap-3 justify-center items-stretch mt-[2px] mb-6">
              <div className="flex-[1.1] min-w-[320px] max-w-2xl">
                <HomeBoxModel />
              </div>
              <div className="flex-[1.1] min-w-[320px] max-w-2xl">
                <HomeBoxModel2 />
              </div>
            </div>

            <div className="bg-white w-full flex justify-center">
                <HomeBoxModels weatherData={{
                    'Santiago': {
                        temp: weather['Santiago'] || '--',
                        icon: <Cloud className="w-5 h-5" />, // Podrías mapear a iconos reales según estado
                        desc: 'Atualizado agora'
                    },
                    'Viña del Mar': {
                        temp: weather['Viña del Mar'] || '--',
                        icon: <Cloud className="w-5 h-5" />, // idem
                        desc: 'Atualizado agora'
                    },
                    'Valparaíso': {
                        temp: weather['Valparaíso'] || '--',
                        icon: <Cloud className="w-5 h-5" />, // idem
                        desc: 'Atualizado agora'
                    },
                    'Concepción': {
                        temp: weather['Concepción'] || '--',
                        icon: <Cloud className="w-5 h-5" />, // idem
                        desc: 'Atualizado agora'
                    }
                }}
                rates={{
                    clp_brl: rates.clp_brl ? rates.clp_brl.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '--',
                    brl_clp: rates.brl_clp ? rates.brl_clp.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) : '--',
                }} />
            </div>
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