import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    // Configuración de build
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      // Asegurar que las variables de entorno estén disponibles en el cliente
      define: {
        'process.env': {
          VITE_BASE_URL: JSON.stringify(env.VITE_BASE_URL || 'https://chileaovivo.com'),
          VITE_SUPABASE_URL: JSON.stringify(env.VITE_SUPABASE_URL || ''),
          VITE_SUPABASE_ANON_KEY: JSON.stringify(env.VITE_SUPABASE_ANON_KEY || '')
        }
      }
    },
    
    // Configuración de servidor
    server: {
      port: 8081,
      open: true,
      host: true,
      strictPort: true
    },
    
    // Configuración de preview
    preview: {
      port: 8082,
      host: true,
      strictPort: true
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  };
});
