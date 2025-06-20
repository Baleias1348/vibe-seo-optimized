import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const isDev = process.env.NODE_ENV !== 'production';
let inlineEditPlugin, editModeDevPlugin;

if (isDev) {
  try {
    const { default: inlineEditor } = await import('./plugins/visual-editor/vite-plugin-react-inline-editor.js');
    const { default: editMode } = await import('./plugins/visual-editor/vite-plugin-edit-mode.js');
    inlineEditPlugin = inlineEditor;
    editModeDevPlugin = editMode;
  } catch (error) {
    console.warn('No se pudieron cargar los plugins de desarrollo:', error.message);
  }
}

const configHorizonsViteErrorHandler = `
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const addedNode of mutation.addedNodes) {
      if (
        addedNode.nodeType === Node.ELEMENT_NODE &&
        (
          addedNode.tagName?.toLowerCase() === 'vite-error-overlay' ||
          addedNode.classList?.contains('backdrop')
        )
      ) {
        handleViteOverlay(addedNode);
      }
    }
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

function handleViteOverlay(node) {
  if (!node.shadowRoot) {
    return;
  }

  const backdrop = node.shadowRoot.querySelector('.backdrop');

  if (backdrop) {
    const overlayHtml = backdrop.outerHTML;
    const parser = new DOMParser();
    const doc = parser.parseFromString(overlayHtml, 'text/html');
    const messageBodyElement = doc.querySelector('.message-body');
    const fileElement = doc.querySelector('.file');
    const messageText = messageBodyElement ? messageBodyElement.textContent.trim() : '';
    const fileText = fileElement ? fileElement.textContent.trim() : '';
    const error = messageText + (fileText ? ' File:' + fileText : '');

    window.parent.postMessage({
      type: 'horizons-vite-error',
      error,
    }, '*');
  }
}
`;

const configHorizonsRuntimeErrorHandler = `
window.onerror = (message, source, lineno, colno, errorObj) => {
  const errorDetails = errorObj ? JSON.stringify({
    name: errorObj.name,
    message: errorObj.message,
    stack: errorObj.stack,
    source,
    lineno,
    colno,
  }) : null;

  window.parent.postMessage({
    type: 'horizons-runtime-error',
    message,
    error: errorDetails
  }, '*');};
`;

const configHorizonsConsoleErrorHandler = `
const originalConsoleError = console.error;
console.error = function(...args) {
  originalConsoleError.apply(console, args);
  let errorString = '';
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg instanceof Error) {
      errorString = arg.stack || \`\${arg.name}: \${arg.message}\`;
      break;
    }
  }
  if (!errorString) {
    errorString = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
  }
  window.parent.postMessage({
    type: 'horizons-console-error',
    error: errorString
  }, '*');
};
`;

const addTransformIndexHtml = {
  name: 'add-transform-index-html',
  transformIndexHtml(html) {
    return {
      html,
      tags: [
        {
          tag: 'script',
          attrs: { type: 'module' },
          children: configHorizonsRuntimeErrorHandler,
          injectTo: 'head',
        },
        {
          tag: 'script',
          attrs: { type: 'module' },
          children: configHorizonsViteErrorHandler,
          injectTo: 'head',
        },
        {
          tag: 'script',
          attrs: { type: 'module' },
          children: configHorizonsConsoleErrorHandler,
          injectTo: 'head',
        }
      ],
    };
  },
};

export default defineConfig({  
  server: {
    port: 8081,
    https: false,
    host: true,
    open: true,
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'apikey', 'x-client-info'],
      credentials: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization, apikey, x-client-info',
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Content-Security-Policy': [
        "default-src 'self';",
        "connect-src 'self' https://yfgqpaxajeatchcqrehe.supabase.co https://*.supabase.co https://*.supabase.in https://api.openweathermap.org http://localhost:8081 https://www.google-analytics.com https://analytics.google.com https://play.google.com https://www.recaptcha.net https://www.gstatic.com https://*.ingest.sentry.io https://api.segment.io https://csp.withgoogle.com;",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.google-analytics.com https://analytics.google.com;",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
        "font-src 'self' https://fonts.gstatic.com;",
        "img-src 'self' data: https: http:;",
        "frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/;",
      ].join(' ').replace(/\s+/g, ' ').trim(),
    },
    proxy: {
      '/api': {
        target: 'https://yfgqpaxajeatchcqrehe.supabase.co',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  css: {
    postcss: './postcss.config.cjs'
  },
  plugins: [
    react(),
    ...(isDev && inlineEditPlugin && editModeDevPlugin ? [inlineEditPlugin(), editModeDevPlugin()] : []),
    addTransformIndexHtml
  ],
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
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      },
      external: [
        '@babel/parser',
        '@babel/traverse',
        '@babel/generator',
        '@babel/types'
      ]
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['lucide-react']
  }
});
