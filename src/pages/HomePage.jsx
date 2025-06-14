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
  Thermometer, Cloud, CloudRain, MountainSnow, Sun, Utensils, Briefcase, 
  AlertTriangle, Replace, SunDim, Banknote, Flag, Globe, Map, HeartPulse, 
  Shuffle, Newspaper, Plane, Wine, RefreshCw 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import HeroCarousel from '@/components/HeroCarousel/HeroCarousel';

// TickerItem Component
const TickerItem = ({ icon: Icon, text, highlight = false }) => (
  <div className={`flex items-center space-x-3 mx-5 ${highlight ? 'text-yellow-300' : ''}`}>
    {Icon && <Icon className="h-6 w-6 flex-shrink-0" />}
    <span className="whitespace-nowrap text-lg md:text-xl italic font-arial font-bold">
      {text}
    </span>
  </div>
);

// NewsTicker Component
const NewsTicker = ({ tickerData = [] }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Generate ticker content
  const getTickerContent = () => {
    const formattedDate = format(currentDateTime, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    const formattedTime = format(currentDateTime, "HH:mm");
    const dateAndTimeText = `Informações do dia: ${formattedDate}, Hora de Chile: ${formattedTime} horas`;
    
    if (!tickerData || tickerData.length === 0) {
      return [
        { icon: SunDim, text: dateAndTimeText, id: 'datetime' },
        { icon: Cloud, text: 'Santiago: --º', id: 'weather_santiago' },
        { icon: Flag, text: 'Dólar (USD) em Reais: R$--', id: 'currency_usd_brl' },
        { icon: Flag, text: 'Dólar (USD) em Pesos: $--', id: 'currency_usd_clp' },
        { icon: Flag, text: 'Real (BRL): $--', id: 'currency_brl_clp' }
      ];
    }
    
    // Map of ticker items with their configurations
    const tickerItems = [
      { id: 'datetime', icon: SunDim, text: dateAndTimeText },
      { id: 'weather_santiago', icon: Cloud, prefix: 'Santiago: ', suffix: 'º' },
      { id: 'weather_vina', icon: Cloud, prefix: 'Viña del Mar: ', suffix: 'º' },
      { id: 'weather_valparaiso', icon: Cloud, prefix: 'Valparaíso: ', suffix: 'º' },
      { id: 'weather_concepcion', icon: CloudRain, prefix: 'Concepción: ', suffix: 'º' },
      { id: 'weather_chillan_city', icon: Cloud, prefix: 'Chillán (cidade): ', suffix: 'º' },
      { id: 'weather_antofagasta', icon: Sun, prefix: 'Antofagasta: ', suffix: 'º' },
      { id: 'ski_valle_nevado', icon: MountainSnow, prefix: 'Valle Nevado: ' },
      { id: 'ski_farellones', icon: MountainSnow, prefix: 'Farellones: ' },
      { id: 'ski_el_colorado', icon: MountainSnow, prefix: 'El Colorado: ' },
      { id: 'ski_portillo', icon: MountainSnow, prefix: 'Portillo: ' },
      { id: 'ski_la_parva', icon: MountainSnow, prefix: 'La Parva: ' },
      { id: 'ski_nevados_chillan', icon: MountainSnow, prefix: 'Nevados de Chillán: ' },
      { id: 'currency_brl_clp', icon: Flag, prefix: 'Real (BRL): ', default: '$--' },
      { id: 'currency_usd_brl', icon: Flag, prefix: 'Dólar (USD) em Reais: ', default: 'R$--' },
      { id: 'currency_usd_clp', icon: Flag, prefix: 'Dólar (USD) em Pesos: ', default: '$--' },
    ];

    return tickerItems
      .map(item => {
        const data = tickerData.find(d => d.id === item.id);
        const content = data?.content || item.default;
        
        if (!content && item.id !== 'datetime') return null;
        
        const text = item.id === 'datetime' 
          ? item.text 
          : `${item.prefix || ''}${content || '--'}${item.suffix || ''}`;
        
        return {
          ...item,
          text,
          id: item.id
        };
      })
      .filter(Boolean)
      .filter(item => item && item.text);
  };

  const tickerContent = getTickerContent();
  
  if (!tickerContent || tickerContent.length === 0) {
    return (
      <div className="bg-red-600 text-white py-3 overflow-hidden h-[50px] flex items-center font-arial">
        <div className="animate-pulse">Cargando información del tiempo...</div>
      </div>
    );
  }

  return (
    <div className="bg-red-600 text-white py-3 overflow-hidden h-[50px] flex items-center font-arial">
      <motion.div
        className="flex"
        animate={{ x: ['100%', '-100%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: tickerContent.length * 10,
            ease: "linear",
          },
        }}
        key={tickerContent.length}
      >
        {tickerContent.map((item, index) => (
          <TickerItem key={`${item.id}-${index}`} icon={item.icon} text={item.text} highlight={item.highlight} />
        ))}
        {tickerContent.map((item, index) => (
          <TickerItem key={`${item.id}-dup-${index}`} icon={item.icon} text={item.text} highlight={item.highlight} />
        ))}
      </motion.div>
    </div>
  );
};

// QuickAccessButton Component
const QuickAccessButton = ({ icon: Icon, label, onClick }) => {
  const words = label.split(' ');
  const isLongLabel = words.length > 2;
  
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

// Main HomePage Component
const HomePage = () => {
  // State management
  const [featuredTours, setFeaturedTours] = useState([]);
  const [isLoadingTours, setIsLoadingTours] = useState(true);
  const [tickerData, setTickerData] = useState([]);
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
    currencyCode: 'BRL',
    hero_images: []
  });

  // Fetch site configuration
  const fetchSiteConfig = useCallback(async () => {
    console.log('🔄 Fetching site configuration...');
    try {
      const config = await getSiteConfig();
      console.log('✅ Site configuration loaded:', config);
      
      if (config) {
        setSiteConfigData(prev => ({
          ...prev,
          ...config,
          hero_images: Array.isArray(config.hero_images) ? config.hero_images : []
        }));
      }
    } catch (error) {
      console.error('❌ Error loading site configuration:', error);
    }
  }, []);

  // Fetch featured tours
  const fetchFeaturedTours = useCallback(async () => {
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
  }, []);

  // Fetch ticker data
  const fetchTickerData = useCallback(async () => {
    try {
      console.log('🔍 Loading ticker data...');
      const { data, error } = await supabase
        .from('ticker_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      
      console.log('✅ Ticker data loaded:', data?.length || 0, 'items');
      
      setTickerData(prevData => {
        if (JSON.stringify(prevData) !== JSON.stringify(data)) {
          return data || [];
        }
        return prevData;
      });
    } catch (error) {
      console.error('❌ Error loading ticker data:', error);
      if (tickerData.length === 0) {
        setTickerData([{ id: 'error', content: 'Error loading data' }]);
      }
    }
  }, [tickerData.length]);

  // Handle storage changes
  const handleStorageChange = useCallback((event) => {
    if (event.key === 'vibechile-site-config') {
      fetchSiteConfig();
    }
  }, [fetchSiteConfig]);

  // Initialize component
  useEffect(() => {
    let isMounted = true;
    
    // Load initial data
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchTickerData(),
          fetchFeaturedTours(),
          fetchSiteConfig()
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    
    // Set up real-time subscription
    const subscription = subscribeToConfigChanges((newConfig) => {
      if (isMounted && newConfig) {
        setSiteConfigData(prev => ({
          ...prev,
          ...newConfig,
          hero_images: Array.isArray(newConfig.hero_images) ? newConfig.hero_images : []
        }));
      }
    });
    
    // Set up event listeners
    window.addEventListener('storage', handleStorageChange);
    
    // Initial load
    loadInitialData();
    
    // Set up periodic refresh
    const tickerInterval = setInterval(fetchTickerData, 5 * 60 * 1000);
    
    // Cleanup
    return () => {
      isMounted = false;
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(tickerInterval);
    };
  }, [fetchFeaturedTours, fetchSiteConfig, fetchTickerData, handleStorageChange]);

  // Process hero images
  const getHeroImages = () => {
    const { hero_images = [] } = siteConfigData;
    
    // If we have hero_images array, use it
    if (hero_images.length > 0) {
      return hero_images.map(img => ({
        src: img.url || '',
        alt: img.alt || 'Imagen del carrusel',
        caption: img.caption || ''
      }));
    }
    
    // Fallback to individual image fields
    const images = [];
    
    for (let i = 1; i <= 4; i++) {
      const url = siteConfigData[`heroImage${i}`];
      const alt = siteConfigData[`heroAlt${i}`] || `Imagen ${i}`;
      
      if (url) {
        images.push({
          src: url,
          alt: alt,
          caption: ''
        });
      }
    }
    
    // If no images found, use a default
    if (images.length === 0) {
      return [{
        src: 'https://placehold.co/1200x600?text=CHILEaoVivo',
        alt: 'Imagen predeterminada',
        caption: 'Bienvenido a CHILE ao Vivo'
      }];
    }
    
    return images;
  };

  const finalHeroImages = getHeroImages();
  
  // Quick access items
  const quickAccessItems = [
    { icon: Map, label: 'Mapa Turístico', path: '/mapa' },
    { icon: Utensils, label: 'Restaurantes', path: '/restaurantes' },
    { icon: Briefcase, label: 'Tours y Excursiones', path: '/tours' },
    { icon: Banknote, label: 'Conversor de Moeda', path: '/conversor-moeda' },
    { icon: Thermometer, label: 'Clima', path: '/clima' },
    { icon: Globe, label: 'Idioma', path: '/idioma' }
  ];

  return (
    <div className="bg-background">
      {/* News Ticker */}
      <NewsTicker tickerData={tickerData} />
      
      {/* Hero Carousel */}
      <HeroCarousel images={finalHeroImages} />

      {/* Quick Access Section */}
      <section className="w-full bg-[#0b64ee] py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {quickAccessItems.map((item, index) => (
              <Link to={item.path} key={index}>
                <QuickAccessButton 
                  icon={item.icon} 
                  label={item.label} 
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Tours Destacados</h2>
        
        {isLoadingTours ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <TourCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTours.slice(0, 6).map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No hay tours disponibles en este momento.</p>
          </div>
        )}
        
        {featuredTours.length > 0 && (
          <div className="text-center mt-8">
            <Link to="/tours">
              <Button variant="outline">Ver todos los tours</Button>
            </Link>
          </div>
        )}
      </section>

      {/* Info Sections */}
      <section className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Bienvenido a CHILE ao Vivo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Tu guía definitiva para explorar lo mejor de Chile. Descubre destinos increíbles, 
                  actividades emocionantes y toda la información que necesitas para planificar tu viaje.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>¿Por qué elegirnos?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>• Información actualizada en tiempo real</li>
                  <li>• Recomendaciones de locales</li>
                  <li>• Reservas fáciles y seguras</li>
                  <li>• Atención al cliente 24/7</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
