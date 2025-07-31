// ===== CONFIGURATION VARIABLES =====
// En producción, estas variables deberían venir de variables de entorno
// Por ahora, las definimos aquí para desarrollo

window.CONFIG = {
  // Supabase Configuration
  SUPABASE: {
    URL: 'YOUR_SUPABASE_URL', // Reemplazar con tu URL de Supabase
    ANON_KEY: 'YOUR_SUPABASE_ANON_KEY', // Reemplazar con tu clave anónima
  },
  
  // Weather API Configuration (OpenWeather)
  WEATHER: {
    API_KEY: 'VITE_OPENWEATHER_API_KEY', // Se cargará desde .env
    BASE_URL: 'https://api.openweathermap.org/data/2.5'
  },
  
  // Exchange Rate API Configuration
  EXCHANGE: {
    API_KEY: 'VITE_EXCHANGE_API_KEY', // Se cargará desde .env (opcional)
    BASE_URL: 'https://api.exchangerate-api.com/v4/latest'
  },
  
  // Flight API Configuration
  FLIGHTS: {
    BASE_URL: 'https://tu-vps.com/api', // Tu backend de vuelos
    USE_SIMULATED_DATA: true // Cambiar a false cuando el backend esté listo
  },
  
  // Development flags
  DEV: {
    USE_SIMULATED_DATA: true, // Cambiar a false en producción
    ENABLE_CONSOLE_LOGS: true,
    ENABLE_ERROR_REPORTING: false
  }
};

// Helper function to check if we're in development mode
window.CONFIG.isDevelopment = () => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.CONFIG.DEV.USE_SIMULATED_DATA;
};

// Helper function to get environment-specific config
window.CONFIG.getSupabaseConfig = () => {
  // En desarrollo, usar variables de configuración
  if (window.CONFIG.isDevelopment()) {
    return {
      url: window.CONFIG.SUPABASE.URL,
      anonKey: window.CONFIG.SUPABASE.ANON_KEY
    };
  }
  
  // En producción, estas variables vendrían del servidor o build process
  return {
    url: process.env.VITE_SUPABASE_URL || window.CONFIG.SUPABASE.URL,
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || window.CONFIG.SUPABASE.ANON_KEY
  };
};

console.log('⚙️ Configuration loaded:', {
  isDevelopment: window.CONFIG.isDevelopment(),
  supabaseConfigured: !!(window.CONFIG.SUPABASE.URL && window.CONFIG.SUPABASE.URL !== 'YOUR_SUPABASE_URL'),
  simulatedData: window.CONFIG.DEV.USE_SIMULATED_DATA
});
