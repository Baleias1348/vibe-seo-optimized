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
const mapToLegacyFormat = (config) => ({
  siteName: config.site_name,
  logoUrl: config.logo_url,
  heroImage1: config.hero_images?.[0]?.url || '',
  heroAlt1: config.hero_images?.[0]?.alt || '',
  heroImage2: config.hero_images?.[1]?.url || '',
  heroAlt2: config.hero_images?.[1]?.alt || '',
  heroImage3: config.hero_images?.[2]?.url || '',
  heroAlt3: config.hero_images?.[2]?.alt || '',
  heroImage4: config.hero_images?.[3]?.url || '',
  heroAlt4: config.hero_images?.[3]?.alt || '',
  defaultShareImage: config.default_share_image,
  currencySymbol: config.currency_symbol,
  currencyCode: config.currency_code,
});

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

export const getSiteConfig = async () => {
  try {
    // Intentar obtener de Supabase primero
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .eq('id', DEFAULT_CONFIG_ID)
      .single();

    if (error) throw error;
    
    if (data) {
      // Convertir al formato esperado por la aplicación
      return { ...defaultConfig, ...mapToLegacyFormat(data) };
    }
    
    // Si no hay datos en Supabase, devolver los valores por defecto
    return defaultConfig;
    
  } catch (error) {
    console.error('Error al obtener la configuración de Supabase:', error);
    // En caso de error, intentar obtener del localStorage como respaldo
    try {
      const storedConfig = localStorage.getItem('vibechile-site-config');
      if (storedConfig) {
        return { ...defaultConfig, ...JSON.parse(storedConfig) };
      }
    } catch (e) {
      console.error('Error al leer del localStorage:', e);
    }
    
    return defaultConfig;
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
      localStorage.setItem('vibechile-site-config', JSON.stringify(config));
      console.warn('Configuración guardada en localStorage como respaldo');
    } catch (e) {
      console.error('Error al guardar en localStorage:', e);
    }
    
    throw error;
  }
};

// Suscripción a cambios en tiempo real
export const subscribeToConfigChanges = (callback) => {
  console.log('Iniciando suscripción a cambios en tiempo real...');
  
  const channel = supabase
    .channel('site_config_changes', {
      config: {
        broadcast: { self: true },
        presence: { key: 'site-config' }
      }
    })
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
          const updatedConfig = { ...defaultConfig, ...mapToLegacyFormat(payload.new) };
          console.log('Nueva configuración:', updatedConfig);
          callback(updatedConfig);
        }
      }
    )
    .on('broadcast', { event: 'test' }, (payload) => {
      console.log('Mensaje de prueba recibido:', payload);
    })
    .on('presence', { event: 'sync' }, () => {
      console.log('Sincronización de presencia:', channel.presenceState());
    })
    .on('system', (event) => {
      console.log('Evento del sistema:', event);
    })
    .subscribe((status, err) => {
      console.log('Estado de la suscripción:', status);
      if (err) {
        console.error('Error en la suscripción:', err);
      }
      
      // Reconexión automática
      if (status === 'CHANNEL_ERROR') {
        console.log('Reconectando...');
        channel.unsubscribe().subscribe();
      }
      
      if (status === 'SUBSCRIBED') {
        console.log('Suscripción activa');
      }
    });
  
  // Devolver función para cancelar la suscripción
  return () => {
    console.log('Cancelando suscripción...');
    channel.unsubscribe();
  };
};