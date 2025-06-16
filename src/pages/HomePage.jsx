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
const NewsTicker = ({ tickerData: externalTickerData = [] }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [safeTickerData, setSafeTickerData] = useState([]);

  // Filtrar y limpiar los datos del ticker
  useEffect(() => {
    if (!Array.isArray(externalTickerData)) {
      console.warn('Datos del ticker no son un array:', externalTickerData);
      setSafeTickerData([]);
      return;
    }

    // Filtrar entradas inválidas
    const cleanedData = externalTickerData
      .filter(item => item && typeof item === 'object' && 'id' in item)
      .map(item => ({
        ...item,
        content: String(item.content || '').trim(),
        id: String(item.id || '').trim()
      }));

    setSafeTickerData(cleanedData);
  }, [externalTickerData]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Generate ticker content
  const getTickerContent = () => {
    try {
      const formattedDate = format(currentDateTime, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      const formattedTime = format(currentDateTime, "HH:mm");
      const dateAndTimeText = `Informações do dia: ${formattedDate}, Hora de Chile: ${formattedTime} horas`;
      
      if (!safeTickerData || safeTickerData.length === 0) {
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
          try {
            const data = safeTickerData.find(d => d.id === item.id);
            const content = data?.content || item.default;
            
            if (!content && item.id !== 'datetime') return null;
            
            const text = item.id === 'datetime' 
              ? item.text 
              : `${item.prefix || ''}${content || '--'}${item.suffix || ''}`;
            
            return {
              ...item,
              text: String(text || '').substring(0, 200), // Limitar longitud y asegurar string
              id: String(item.id || '').substring(0, 50) // Limitar longitud de ID
            };
          } catch (error) {
            console.error('Error procesando ítem del ticker:', { item, error });
            return null;
          }
        })
        .filter(Boolean)
        .filter(item => item && item.text && item.text.trim() !== '');
    } catch (error) {
      console.error('Error en getTickerContent:', error);
      return [
        { 
          id: 'error', 
          icon: AlertTriangle, 
          text: 'Error al cargar la información del ticker. Por favor, intente recargar la página.' 
        }
      ];
    }
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

  // Fetch ticker data with improved error handling
  const fetchTickerData = useCallback(async () => {
    try {
      console.log('🔍 Cargando datos del ticker...');
      
      // Verificar si supabase está disponible
      if (!supabase) {
        console.error('❌ Supabase no está disponible');
        setTickerData([]);
        return;
      }
      
      // Realizar la consulta con límite de tiempo
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Tiempo de espera agotado al cargar los datos del ticker')), 5000)
      );
      
      const fetchPromise = supabase
        .from('ticker_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (error) {
        throw new Error(`Error de Supabase: ${error.message}`);
      }
      
      // Validar y limpiar los datos
      const validatedData = (Array.isArray(data) ? data : [])
        .filter(item => item && typeof item === 'object')
        .map(item => ({
          id: String(item.id || '').trim().substring(0, 50),
          content: String(item.content || '').trim(),
          created_at: item.created_at || new Date().toISOString()
        }))
        .filter(item => item.id); // Filtrar ítems sin ID
      
      console.log('✅ Datos del ticker cargados:', validatedData.length, 'elementos');
      
      // Actualizar el estado solo si hay cambios
      setTickerData(prevData => {
        if (JSON.stringify(prevData) !== JSON.stringify(validatedData)) {
          return validatedData;
        }
        return prevData;
      });
      
    } catch (error) {
      console.error('❌ Error al cargar los datos del ticker:', error.message || error);
      
      // Solo actualizar si no hay datos o si hay un error específico que requiera actualización
      setTickerData(prevData => {
        if (prevData.length === 0) {
          return [{
            id: 'error',
            content: 'Error al cargar datos. Intentando nuevamente...',
            isError: true
          }];
        }
        return prevData;
      });
      
      // Reintentar después de un tiempo si falla
      setTimeout(fetchTickerData, 30000); // Reintentar después de 30 segundos
    }
  }, []); // Eliminamos la dependencia de tickerData.length para evitar bucles

  // Handle storage changes
  const handleStorageChange = useCallback((event) => {
    if (event.key === 'vibechile-site-config') {
      fetchSiteConfig();
    }
  }, [fetchSiteConfig]);

  // Initialize component
  useEffect(() => {
    let isMounted = true;
    let tickerInterval = null;
    let subscription = null;

    // Configurar suscripción a cambios en tiempo real
    const setupRealtimeSubscription = () => {
      try {
        // Si ya hay una suscripción, no hacer nada
        if (subscription) return;
        
        // Configurar la suscripción a cambios en la configuración
        // Nota: Asegúrate de que subscribeToConfigChanges esté definido
        if (typeof subscribeToConfigChanges === 'function') {
          subscription = subscribeToConfigChanges((newConfig) => {
            if (isMounted && newConfig) {
              setSiteConfigData(prev => ({
                ...prev,
                ...newConfig,
                hero_images: Array.isArray(newConfig.hero_images) ? newConfig.hero_images : []
              }));
            }
          });
        }
      } catch (error) {
        console.error('Error al configurar la suscripción en tiempo real:', error);
      }
    };

    const loadInitialData = async () => {
      if (!isMounted) return;
      
      try {
        console.log('🔄 Cargando datos iniciales...');
        
        // Configurar la suscripción en tiempo real
        setupRealtimeSubscription();
        
        // Cargar en paralelo pero con manejo de errores individual
        await Promise.allSettled([
          fetchFeaturedTours().catch(err => 
            console.error('Error al cargar tours destacados:', err)
          ),
          fetchSiteConfig().catch(err => 
            console.error('Error al cargar configuración del sitio:', err)
          ),
          fetchTickerData().catch(err => 
            console.error('Error al cargar datos del ticker:', err)
          )
        ]);
        
        console.log('✅ Datos iniciales cargados correctamente');
        
      } catch (error) {
        console.error('❌ Error crítico al cargar datos iniciales:', error);
      }
    };
    
    // Configurar event listeners
    window.addEventListener('storage', handleStorageChange);
    
    // Cargar datos iniciales
    loadInitialData();
    
    // Configurar actualización periódica del ticker (cada 5 minutos)
    if (typeof setInterval === 'function') {
      tickerInterval = setInterval(() => {
        if (isMounted) {
          fetchTickerData().catch(err => 
            console.error('Error en actualización periódica del ticker:', err)
          );
        }
      }, 5 * 60 * 1000);
    }
    
    // Limpieza al desmontar
    return () => {
      isMounted = false;
      
      // Cancelar la suscripción si existe
      if (subscription?.unsubscribe) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('Error al cancelar la suscripción:', error);
        }
      }
      
      // Limpiar intervalos y event listeners
      window.removeEventListener('storage', handleStorageChange);
      if (tickerInterval) {
        clearInterval(tickerInterval);
      }
    };
  }, [fetchFeaturedTours, fetchSiteConfig, fetchTickerData, handleStorageChange]);

  // Process hero images
  const getHeroImages = useCallback(() => {
    console.log('📝 siteConfigData:', siteConfigData);
    const { hero_images = [] } = siteConfigData || {};
    console.log('🖼️ hero_images:', hero_images);
    
    // Si hay imágenes en hero_images, usarlas
    if (Array.isArray(hero_images) && hero_images.length > 0) {
      const validImages = hero_images
        .filter(img => img && (img.url || img.src))
        .map(img => ({
          src: img.url || img.src || '',
          alt: img.alt || 'Imagem do carrossel',
          caption: img.caption || ''
        }));
      
      if (validImages.length > 0) {
        return validImages;
      }
    }
    
    // Intentar con los campos individuales de imagen
    const images = [];
    
    for (let i = 1; i <= 4; i++) {
      const url = siteConfigData?.[`heroImage${i}`];
      const alt = siteConfigData?.[`heroAlt${i}`] || `Imagem ${i}`;
      
      if (url) {
        images.push({
          src: url,
          alt: alt,
          caption: ''
        });
      }
    }
    
    // Si no hay imágenes, usar imágenes por defecto
    if (images.length === 0) {
      return [
        {
          src: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1794&q=80',
          alt: 'Paisagem do Chile',
          caption: 'Descubra as belezas do Chile'
        },
        {
          src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80',
          alt: 'Vinícolas do Chile',
          caption: 'Vinhos de classe mundial'
        },
        {
          src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80',
          alt: 'Montanhas e neve',
          caption: 'Aventuras na neve'
        },
        {
          src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80',
          alt: 'Cultura local',
          caption: 'Cultura e tradições'
        }
      ];
    }
    
    return images;
  }, [siteConfigData]);

  // Obtener las imágenes para el carrusel
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

      {/* Feature Cards Section */}
      <section className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Weather Card */}
          <Link to="/clima" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-blue-500">
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                  <Thermometer className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Previsão do Tempo</h3>
                <p className="text-gray-600 text-sm mb-4">Detalhes do clima para planejar sua viagem.</p>
                <Button variant="outline" size="sm" className="mt-2 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  Explorar
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Currency Converter Card */}
          <Link to="/conversor-moeda" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-green-500">
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-50 transition-colors">
                  <RefreshCw className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Conversor de Moeda</h3>
                <p className="text-gray-600 text-sm mb-4">Calcule o câmbio em tempo real.</p>
                <Button variant="outline" size="sm" className="mt-2 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                  Explorar
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Ski Centers Card */}
          <Link to="/centros-esqui" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-purple-500">
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-50 transition-colors">
                  <MountainSnow className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Centros de Esqui</h3>
                <p className="text-gray-600 text-sm mb-4">Aventura na neve nos melhores picos.</p>
                <Button variant="outline" size="sm" className="mt-2 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                  Explorar
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Wineries Card */}
          <Link to="/vinhos-e-vinhedos" className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-red-500">
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-50 transition-colors">
                  <Wine className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Vinhos e Vinícolas</h3>
                <p className="text-gray-600 text-sm mb-4">Descubra as melhores rotas do vinho chileno.</p>
                <Button variant="outline" size="sm" className="mt-2 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                  Explorar
                </Button>
              </CardContent>
            </Card>
          </Link>
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
