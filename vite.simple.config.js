import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), '');
  
  // Variables de entorno que necesitan ser expuestas al cliente
  const envVars = {
    // Configuración base
    VITE_BASE_URL: JSON.stringify(env.VITE_BASE_URL || 'https://chileaovivo.com'),
    
    // Configuración de Supabase
    VITE_SUPABASE_URL: JSON.stringify(env.VITE_SUPABASE_URL || ''),
    VITE_SUPABASE_ANON_KEY: JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
    VITE_SUPABASE_SERVICE_KEY: JSON.stringify(env.VITE_SUPABASE_SERVICE_KEY || ''),
    
    // Configuración de OpenWeatherMap
    VITE_OPENWEATHER_API_KEY: JSON.stringify(env.VITE_OPENWEATHER_API_KEY || ''),
    VITE_OPENWEATHER_BASE_URL: JSON.stringify(env.VITE_OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5'),
    
    // Otras variables de entorno
    NODE_ENV: JSON.stringify(env.NODE_ENV || 'production')
  };
  
  // Mostrar variables de entorno en consola (solo en desarrollo)
  if (mode === 'development') {
    console.log('Variables de entorno cargadas:', Object.keys(envVars));
  }
  
  return {
    plugins: [react()],
    
    // Configuración de build
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: env.NODE_ENV === 'development',
      minify: env.NODE_ENV === 'production' ? 'terser' : false,
      chunkSizeWarningLimit: 1000,
      
      // Asegurar que las variables de entorno estén disponibles en el cliente
      define: {
        'process.env': envVars,
        // Soporte para import.meta.env
        'import.meta.env': Object.entries(envVars).reduce((prev, [key, val]) => {
          prev[key] = val;
          return prev;
        }, {})
      },
      
      // Optimizaciones de rollup
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['axios', 'date-fns'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-label']
          }
        }
      }
    },
    
    // Configuración de servidor
    server: {
      port: 8081,
      open: true,
      host: true,
      strictPort: true,
      hmr: {
        overlay: true
      }
    },
    
    // Configuración de preview
    preview: {
      port: 8082,
      host: true,
      strictPort: true
    },
    
    // Aliases para imports
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@pages': resolve(__dirname, 'src/pages'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@hooks': resolve(__dirname, 'src/hooks')
      }
    },
    
    // Optimizaciones de CSS
    css: {
      modules: {
        localsConvention: 'camelCase'
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        }
      }
    },
    
    // Configuración de optimización
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      exclude: ['@babel/runtime']
    }
  };
});
