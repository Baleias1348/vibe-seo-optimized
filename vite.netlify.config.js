// @ts-check
const react = require('@vitejs/plugin-react');

/** @type {import('vite').UserConfig} */
module.exports = {
  plugins: [react()],
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
        }
      }
    }
  },
  server: {
    port: 8081,
    open: true
  }
};
