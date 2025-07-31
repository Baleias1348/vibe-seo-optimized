// ===== CONFIGURACIÓN GENERADA AUTOMÁTICAMENTE =====
// Este archivo es generado por generate-config.js desde las variables de entorno
// NO EDITAR MANUALMENTE - Los cambios se perderán

window.ENV_CONFIG = {
  // Supabase Configuration
  SUPABASE_URL: 'https://yfgqpaxajeatchcqrehe.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ3FwYXhhamVhdGNoY3FyZWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMTQ5OTcsImV4cCI6MjA2MzY5MDk5N30.bFOwBSoEm0ndeWxzvCXoOtfHxfVj2l4k9sHhNAlHKfk',
  
  // Weather API Configuration (OpenWeather)
  OPENWEATHER_API_KEY: '7e90ddaf235cba0c3a0ce7f6a99c0af2',
  
  // Exchange Rate API Configuration
  EXCHANGE_API_KEY: 'f51df8f470348e547729945c',
  
  // Flight API Configuration
  FLIGHT_API_URL: '',
  
  // Generated at: 2025-07-21T15:56:22.761Z
};

// Actualizar configuración principal
if (window.CONFIG) {
  // Actualizar Supabase
  if (window.ENV_CONFIG.SUPABASE_URL) {
    window.CONFIG.SUPABASE.URL = window.ENV_CONFIG.SUPABASE_URL;
  }
  if (window.ENV_CONFIG.SUPABASE_ANON_KEY) {
    window.CONFIG.SUPABASE.ANON_KEY = window.ENV_CONFIG.SUPABASE_ANON_KEY;
  }
  
  // Actualizar Weather API
  if (window.ENV_CONFIG.OPENWEATHER_API_KEY) {
    window.CONFIG.WEATHER.API_KEY = window.ENV_CONFIG.OPENWEATHER_API_KEY;
  }
  
  // Actualizar Exchange API
  if (window.ENV_CONFIG.EXCHANGE_API_KEY) {
    window.CONFIG.EXCHANGE.API_KEY = window.ENV_CONFIG.EXCHANGE_API_KEY;
  }
  
  // Actualizar Flight API
  if (window.ENV_CONFIG.FLIGHT_API_URL) {
    window.CONFIG.FLIGHTS.BASE_URL = window.ENV_CONFIG.FLIGHT_API_URL;
  }
  
  // Desactivar datos simulados si tenemos configuración real
  const hasRealConfig = window.ENV_CONFIG.SUPABASE_URL && 
                       window.ENV_CONFIG.OPENWEATHER_API_KEY;
  
  if (hasRealConfig) {
    window.CONFIG.DEV.USE_SIMULATED_DATA = false;
    window.CONFIG.FLIGHTS.USE_SIMULATED_DATA = false;
  }
  
  console.log('⚙️ Configuración actualizada desde variables de entorno');
  console.log('📊 Usando datos simulados:', window.CONFIG.DEV.USE_SIMULATED_DATA);
}
