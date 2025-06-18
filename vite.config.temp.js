import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  define: {
    'process.env': {
      VITE_SUPABASE_URL: JSON.stringify('https://yfgqpaxajeatchcqrehe.supabase.co'),
      VITE_SUPABASE_ANON_KEY: JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ3FwYXhhamVhdGNoY3FyZWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQxMzQ0OTEsImV4cCI6MjAwOTcxMDQ5MX0.1JZYZYb-V1Cp1T7Zv7X7k5X7X8Q7qY9Q5Q5Q5Q5Q5Q5')
    }
  },
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/supabase': {
        target: 'https://yfgqpaxajeatchcqrehe.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ3FwYXhhamVhdGNoY3FyZWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQxMzQ0OTEsImV4cCI6MjAwOTcxMDQ5MX0.1JZYZYb-V1Cp1T7Zv7X7k5X7X8Q7qY9Q5Q5Q5Q5Q5Q5');
            proxyReq.setHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ3FwYXhhamVhdGNoY3FyZWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQxMzQ0OTEsImV4cCI6MjAwOTcxMDQ5MX0.1JZYZYb-V1Cp1T7Zv7X7k5X7X8Q7qY9Q5Q5Q5Q5Q5Q5');
          });
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
});
