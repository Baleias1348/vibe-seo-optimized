// @ts-check
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Configuración básica de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Determinar el entorno
const isDev = process.env.NODE_ENV !== 'production';

// Cargar variables de entorno
const env = {
  VITE_BASE_URL: process.env.VITE_BASE_URL || 'https://chileaovivo.com',
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || '',
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || '',
  VITE_OPENWEATHER_API_KEY: process.env.VITE_OPENWEATHER_API_KEY || '',
  VITE_ENABLE_SPA_ROUTING: process.env.VITE_ENABLE_SPA_ROUTING || 'true',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

/** @type {import('vite').UserConfig} */
export default defineConfig({
  // Variables de entorno
  define: {
    'import.meta.env': JSON.stringify(env)
  },
  
  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    open: true,
    cors: true,
    strictPort: true
  },
  
  // Configuración de compilación
  build: {
    outDir: 'dist',
    sourcemap: isDev,
    minify: !isDev ? 'esbuild' : false,
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
    
    rollupOptions: {
      external: [
        '@babel/parser',
        '@babel/traverse',
        '@babel/generator',
        '@babel/types'
      ],
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: ['lodash', 'axios']
        }
      }
    },
    
    commonjsOptions: {
      esmExternals: true,
      transformMixedEsModules: true
    }
  },
  
  // Plugins
  plugins: [
    react({
      jsxImportSource: 'react',
      babel: {
        plugins: []
      }
    }),
    
    VitePWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Chile a OVIVO',
        short_name: 'ChileOVIVO',
        description: 'Información turística de Chile',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  
  // Optimización de dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: []
  },
  
  // Resolución de módulos
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './node_modules')
    }
  },
  
  // Configuración para manejar módulos ESM
  esbuild: {
    target: 'esnext',
    format: 'esm',
    jsx: 'automatic'
  }
});
