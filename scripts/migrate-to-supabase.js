import { supabase } from '../src/lib/supabaseClient.js';

async function migrateLocalStorageToSupabase() {
  try {
    console.log('Iniciando migración de localStorage a Supabase...');
    
    // 1. Obtener configuración actual del localStorage
    const localStorageConfig = JSON.parse(localStorage.getItem('vibechile-site-config') || '{}');
    
    if (Object.keys(localStorageConfig).length === 0) {
      console.log('No se encontró configuración en localStorage.');
      return;
    }
    
    console.log('Configuración encontrada en localStorage:', localStorageConfig);
    
    // 2. Preparar datos para Supabase
    const configData = {
      site_name: localStorageConfig.siteName || 'CHILE ao Vivo',
      logo_url: localStorageConfig.logoUrl || 'https://placehold.co/120x50?text=CHILEaoVivo',
      hero_images: [
        {
          url: localStorageConfig.heroImage1 || 'https://images.unsplash.com/photo-1518504680444-a75dce87508a?q=80&w=2070&auto=format&fit=crop',
          alt: localStorageConfig.heroAlt1 || 'Montanhas majestosas dos Andes no Chile'
        },
        {
          url: localStorageConfig.heroImage2 || 'https://images.unsplash.com/photo-1508005244291-519cf9555922?q=80&w=2020&auto=format&fit=crop',
          alt: localStorageConfig.heroAlt2 || 'Vinhedos exuberantes no vale central do Chile'
        },
        {
          url: localStorageConfig.heroImage3 || 'https://images.unsplash.com/photo-1478827387698-1527781a4887?q=80&w=2070&auto=format&fit=crop',
          alt: localStorageConfig.heroAlt3 || 'Costa cênica do Oceano Pacífico no Chile'
        },
        {
          url: localStorageConfig.heroImage4 || 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2070&auto=format&fit=crop',
          alt: localStorageConfig.heroAlt4 || 'Deserto do Atacama sob um céu estrelado'
        }
      ],
      currency_symbol: localStorageConfig.currencySymbol || 'R$',
      currency_code: localStorageConfig.currencyCode || 'BRL'
    };
    
    // 3. Insertar o actualizar en Supabase
    const { data, error } = await supabase
      .from('site_config')
      .upsert(
        { id: 'default', ...configData },
        { onConflict: 'id' }
      )
      .select();
    
    if (error) throw error;
    
    console.log('✅ Configuración migrada exitosamente a Supabase:', data);
    
    // 4. Opcional: Eliminar del localStorage
    // localStorage.removeItem('vibechile-site-config');
    // console.log('Configuración eliminada del localStorage');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  }
}

// Ejecutar la migración
migrateLocalStorageToSupabase();
