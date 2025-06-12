import { supabase } from '../supabaseClient';

// ID de configuración por defecto
const DEFAULT_CONFIG_ID = 'default';

// Configuración por defecto
const defaultConfig = {
  siteName: 'CHILE ao Vivo',
  logoUrl: 'https://placehold.co/120x50?text=CHILEaoVivo',
  heroImages: [
    {
      url: 'https://images.unsplash.com/photo-1518504680444-a75dce87508a?q=80&w=2070&auto=format&fit=crop',
      alt: 'Montanhas majestosas dos Andes no Chile'
    },
    {
      url: 'https://images.unsplash.com/photo-1508005244291-519cf9555922?q=80&w=2020&auto=format&fit=crop',
      alt: 'Vinhedos exuberantes no vale central do Chile'
    },
    {
      url: 'https://images.unsplash.com/photo-1478827387698-1527781a4887?q=80&w=2070&auto=format&fit=crop',
      alt: 'Costa cênica do Oceano Pacífico no Chile'
    },
    {
      url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2070&auto=format&fit=crop',
      alt: 'Deserto do Atacama sob um céu estrelado'
    }
  ],
  defaultShareImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&h=630&auto=format&fit=crop',
  currencySymbol: 'R$',
  currencyCode: 'BRL',
};

// Mapeo para compatibilidad con el formato anterior
const mapToLegacyFormat = (config) => {
  try {
    if (!config) {
      console.warn('⚠️ mapToLegacyFormat recibió un valor nulo o indefinido');
      return {};
    }

    // Si ya está en formato legado, devolver como está
    if (config.siteName !== undefined || config.heroImage1 !== undefined) {
      console.log('ℹ️ El formato ya es legado, devolviendo sin cambios');
      return { ...config };
    }

    console.log('🔄 Convirtiendo configuración al formato legado:', config);
    
    // Si hay un array de hero_images, usarlo
    let heroImages = [];
    if (Array.isArray(config.hero_images)) {
      heroImages = config.hero_images;
    } else if (config.hero_images && typeof config.hero_images === 'object') {
      // Si hero_images es un objeto (puede pasar con algunas versiones de Supabase)
      heroImages = Object.values(config.hero_images);
    }
    
    // Crear el objeto con los campos legados
    const legacyConfig = {
      // Campos directos
      siteName: config.site_name || config.siteName || 'CHILE ao Vivo',
      logoUrl: config.logo_url || config.logoUrl || 'https://placehold.co/120x50?text=CHILEaoVivo',
      defaultShareImage: config.default_share_image || config.defaultShareImage || '',
      currencySymbol: config.currency_symbol || config.currencySymbol || 'R$',
      currencyCode: config.currency_code || config.currencyCode || 'BRL',
      
      // Mapear las imágenes
      hero_images: heroImages,
      
      // Mantener compatibilidad con el formato antiguo
      ...(heroImages[0] && { heroImage1: heroImages[0].url }),
      ...(heroImages[0] && { heroAlt1: heroImages[0].alt }),
      ...(heroImages[1] && { heroImage2: heroImages[1].url }),
      ...(heroImages[1] && { heroAlt2: heroImages[1].alt }),
      ...(heroImages[2] && { heroImage3: heroImages[2].url }),
      ...(heroImages[2] && { heroAlt3: heroImages[2].alt }),
      ...(heroImages[3] && { heroImage4: heroImages[3].url }),
      ...(heroImages[3] && { heroAlt4: heroImages[3].alt })
    };
    
    console.log('✅ Configuración convertida a formato legado:', legacyConfig);
    return legacyConfig;
    
  } catch (error) {
    console.error('❌ Error en mapToLegacyFormat:', error);
    // En caso de error, devolver un objeto vacío para que se usen los valores por defecto
    return {};
  }
};

// Mapeo para el formato de Supabase
const mapToSupabaseFormat = (config) => ({
  site_name: config.siteName,
  logo_url: config.logoUrl,
  hero_images: [
    { url: config.heroImage1, alt: config.heroAlt1 },
    { url: config.heroImage2, alt: config.heroAlt2 },
    { url: config.heroImage3, alt: config.heroAlt3 },
    { url: config.heroImage4, alt: config.heroAlt4 },
  ].filter(img => img.url),
  default_share_image: config.defaultShareImage,
  currency_symbol: config.currencySymbol,
  currency_code: config.currencyCode,
});

// Cache en memoria para la configuración
let cachedConfig = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

export const getSiteConfig = async (forceRefresh = false) => {
  // Usar caché si está disponible y no se fuerza la actualización
  const now = Date.now();
  if (!forceRefresh && cachedConfig && (now - lastFetchTime) < CACHE_DURATION) {
    console.log('📦 Usando configuración en caché');
    return { ...defaultConfig, ...cachedConfig };
  }

  try {
    console.log('🌐 Obteniendo configuración desde Supabase...');
    
    // Intentar obtener de Supabase
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .eq('id', DEFAULT_CONFIG_ID)
      .single();

    if (error) throw error;
    
    if (data) {
      console.log('✅ Configuración obtenida de Supabase');
      
      // Convertir al formato esperado por la aplicación
      const config = { ...defaultConfig, ...mapToLegacyFormat(data) };
      
      // Actualizar caché
      cachedConfig = { ...config };
      lastFetchTime = now;
      
      // Guardar en localStorage como respaldo
      try {
        localStorage.setItem('vibechile-site-config', JSON.stringify(config));
      } catch (e) {
        console.warn('⚠️ No se pudo guardar en localStorage:', e.message);
      }
      
      return config;
    }
    
    console.log('ℹ️ No se encontró configuración en Supabase, usando valores por defecto');
    return { ...defaultConfig };
    
  } catch (error) {
    console.error('❌ Error al obtener la configuración de Supabase:', error);
    
    // En caso de error, intentar obtener del localStorage como respaldo
    try {
      const storedConfig = localStorage.getItem('vibechile-site-config');
      if (storedConfig) {
        console.log('📱 Usando configuración del localStorage como respaldo');
        return { ...defaultConfig, ...JSON.parse(storedConfig) };
      }
    } catch (e) {
      console.error('❌ Error al leer del localStorage:', e);
    }
    
    console.log('⚠️ Usando configuración por defecto debido a errores');
    return { ...defaultConfig };
  }
};

export const saveSiteConfig = async (config) => {
  try {
    const supabaseData = {
      id: DEFAULT_CONFIG_ID,
      ...mapToSupabaseFormat(config)
    };
    
    const { data, error } = await supabase
      .from('site_config')
      .upsert(supabaseData, { onConflict: 'id' })
      .select();
      
    if (error) throw error;
    
    // Opcional: Mantener una copia en localStorage como respaldo
    try {
      localStorage.setItem('vibechile-site-config', JSON.stringify(config));
    } catch (e) {
      console.warn('No se pudo guardar en localStorage:', e);
    }
    
    return data;
    
  } catch (error) {
    console.error('Error al guardar la configuración en Supabase:', error);
    
    // En caso de error, guardar en localStorage como respaldo
    try {
      const backupConfig = { ...config, _lastUpdated: new Date().toISOString(), _source: 'local-backup' };
      localStorage.setItem('vibechile-site-config', JSON.stringify(backupConfig));
      console.warn('Configuración guardada en localStorage como respaldo', backupConfig);
      
      // Mostrar notificación al usuario
      if (typeof window !== 'undefined') {
        alert(`Error al guardar en Supabase. Se guardó localmente como respaldo. Error: ${error.message}`);
      }
    } catch (e) {
      console.error('Error al guardar en localStorage:', e);
    }
    
    throw error;
  }
};

// Suscripción a cambios en tiempo real
export const subscribeToConfigChanges = (callback) => {
  console.log('Iniciando suscripción a cambios en tiempo real...');
  
  if (!supabase) {
    console.error('Error: supabase client no está inicializado');
    return () => {}; // Retorna una función vacía si no hay cliente
  }
  
  let isSubscribed = true;
  let reconnectTimeout;
  let channel;
  
  const setupSubscription = () => {
    try {
      // Usar el método de suscripción de Supabase Realtime
      channel = supabase
        .channel('site_config_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'site_config',
            filter: `id=eq.${DEFAULT_CONFIG_ID}`
          },
          (payload) => {
            console.log('Cambio detectado en la configuración:', payload);
            if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
              try {
                // Usar payload.new o payload.record según la versión de Supabase
                const record = payload.new || payload.record;
                if (!record) {
                  console.error('No se encontraron datos en el payload:', payload);
                  return;
                }
                
                // Convertir al formato esperado por la aplicación
                const updatedConfig = { 
                  ...defaultConfig, 
                  ...mapToLegacyFormat(record)
                };
                
                console.log('Nueva configuración procesada:', updatedConfig);
                
                // Llamar al callback con los nuevos datos
                if (typeof callback === 'function') {
                  callback(updatedConfig);
                }
              } catch (error) {
                console.error('Error al procesar la actualización:', error);
              }
            }
          }
        )
        .subscribe((status, err) => {
          console.log('Estado de la suscripción:', status);
          
          if (err) {
            console.error('Error en la suscripción:', err);
            if (isSubscribed) {
              attemptReconnect();
            }
            return;
          }
          
          if (status === 'SUBSCRIBED') {
            console.log('✅ Suscripción activa a cambios en tiempo real');
          }
        });
      
      return channel;
    } catch (error) {
      console.error('Error al configurar la suscripción:', error);
      if (isSubscribed) {
        attemptReconnect();
      }
      return null;
    }
  };
  
  const attemptReconnect = () => {
    if (!isSubscribed) return;
    
    console.log('🔁 Intentando reconectar en 3 segundos...');
    
    // Limpiar el timeout anterior si existe
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
    
    // Desuscribir el canal actual si existe
    if (channel) {
      try {
        channel.unsubscribe();
      } catch (e) {
        console.error('Error al desuscribir el canal:', e);
      }
    }
    
    // Intentar reconectar después de un retraso
    reconnectTimeout = setTimeout(() => {
      if (isSubscribed) {
        console.log('🔄 Reconectando...');
        setupSubscription();
      }
    }, 3000);
  };
  
  // Iniciar la primera suscripción
  setupSubscription();
  
  // Devolver función para cancelar la suscripción
  return () => {
    console.log('🛑 Cancelando suscripción...');
    isSubscribed = false;
    
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
    
    if (channel) {
      try {
        channel.unsubscribe();
      } catch (e) {
        console.error('Error al desuscribir el canal:', e);
      }
    }
  };
};