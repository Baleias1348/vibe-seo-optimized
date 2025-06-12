import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yfgqpaxajeatchcqrehe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ3FwYXhhamVhdGNoY3FyZWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMTQ5OTcsImV4cCI6MjA2MzY5MDk5N30.bFOwBSoEm0ndeWxzvCXoOtfHxfVj2l4k9sHhNAlHKfk';

// Configuración de opciones para el cliente Supabase
const supabaseOptions = {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);

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