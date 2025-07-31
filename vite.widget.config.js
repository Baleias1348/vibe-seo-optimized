import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/pages/SkiCentersPage.jsx'),
      name: 'SkiCentersWidget',
      fileName: 'ski-centers-widget',
      formats: ['umd'],
    },
    outDir: 'public/react-widgets/widget-build',
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    sourcemap: true,
    minify: false
  },
  plugins: [react()],
});
