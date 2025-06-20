import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// This is the same configuration as in vite.config.js but simplified for Netlify
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@services': path.resolve(__dirname, './src/services'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: ['@supabase/supabase-js']
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  server: {
    port: 8081,
    open: true,
    fs: {
      allow: ['..'],
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    global: 'window',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      target: 'es2020',
    },
  }
}));
