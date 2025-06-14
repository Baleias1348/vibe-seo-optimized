import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Las variables de entorno de Supabase no están configuradas correctamente');
  console.log('Por favor, asegúrate de tener las siguientes variables en tu archivo .env:');
  console.log('VITE_SUPABASE_URL=tu_url_de_supabase');
  console.log('VITE_SUPABASE_ANON_KEY=tu_clave_anonima');
}

// Configuración de opciones para el cliente Supabase
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : null
  },
  realtime: {
    eventsPerSecond: 10,
    autoReconnect: true,
    heartbeatIntervalMs: 15000,
    timeoutMs: 10000
  },
  db: {
    schema: 'public'
  }
};

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);

// Función para verificar la conexión a Supabase
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .limit(1);
      
    if (error) throw error;
    console.log('✅ Conexión a Supabase exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con Supabase:', error.message);
    return false;
  }
};

// Función de utilidad para verificar la conexión en tiempo real
export const checkRealtimeConnection = async () => {
  try {
    const channel = supabase.channel('test-connection');
    
    // Suscribirse a un canal de prueba
    const subscription = channel
      .on('broadcast', { event: 'test' }, () => {})
      .subscribe((status) => {
        console.log('Estado de la suscripción:', status);
      });
    
    // Probar la suscripción
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Limpiar
    subscription.unsubscribe();
    return true;
  } catch (error) {
    console.error('Error en la conexión en tiempo real:', error);
    return false;
  }
};