import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Configuración básica de Vite
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8081,
    open: true,
    host: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
