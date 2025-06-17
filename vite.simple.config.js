// @ts-check
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

// Configuración de Vite
export default {
  plugins: [react()],
  
  // Configuración de build
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: process.env.NODE_ENV === 'development',
    minify: process.env.NODE_ENV === 'production' ? 'terser' : false,
    chunkSizeWarningLimit: 1000,
    
    // Asegurar que las variables de entorno estén disponibles en el cliente
    define: {
      'process.env': {
        VITE_BASE_URL: JSON.stringify(process.env.VITE_BASE_URL || 'https://chileaovivo.com'),
        VITE_SUPABASE_URL: JSON.stringify(process.env.VITE_SUPABASE_URL || ''),
        VITE_SUPABASE_ANON_KEY: JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || ''),
        VITE_OPENWEATHER_API_KEY: JSON.stringify(process.env.VITE_OPENWEATHER_API_KEY || ''),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
      },
      'import.meta.env': {}
    },
    
    // Opciones de Rollup
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['lodash', 'axios']
        }
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  
  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  
  // Configuración de resolución de módulos
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  
  // Configuración de CSS
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variables.scss";`
      }
    }
  }
};
