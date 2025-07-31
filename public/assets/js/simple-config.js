// ===== CONFIGURACIÓN SIMPLE =====
// Configuración directa y simple para el proyecto

window.SIMPLE_CONFIG = {
  // Supabase (copia tus valores del .env aquí)
  SUPABASE_URL: 'https://yfgqpaxajeatchcqrehe.supabase.co',
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ3FwYXhhamVhdGNoY3FyZWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NzI3NzcsImV4cCI6MjA1MDA0ODc3N30.Ej7RKQH8Zs3xGKNvQJGvZJGvZJGvZJGvZJGvZJGvZJG', // Truncado por seguridad
  
  // OpenWeather API
  WEATHER_API_KEY: '7e90ddaf8c8f4c8f8c8f8c8f8c8f8c8f', // Truncado por seguridad
  
  // Exchange API  
  EXCHANGE_API_KEY: 'f51df8f4c8f4c8f8c8f8c8f8c8f8c8f', // Truncado por seguridad
  
  // Flags
  USE_REAL_DATA: true, // Cambiar a false para datos simulados
  DEBUG: true
};

console.log('⚙️ Configuración simple cargada');
