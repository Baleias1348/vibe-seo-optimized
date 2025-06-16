const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react').default;
const { VitePWA } = require('vite-plugin-pwa');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';
let inlineEditPlugin, editModeDevPlugin;

if (isDev) {
  try {
    // Usando require en lugar de import() dinámico
    inlineEditPlugin = require('./plugins/visual-editor/vite-plugin-react-inline-editor.js').default;
    editModeDevPlugin = require('./plugins/visual-editor/vite-plugin-edit-mode.js').default;
  } catch (err) {
    console.error('Error al cargar los plugins de desarrollo:', err);
  }
}

// Configuración simplificada para manejo de errores
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
	}, '*');
};
`;

const configHorizonsConsoleErrroHandler = `
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

const configWindowFetchMonkeyPatch = `
const originalFetch = window.fetch;

window.fetch = function(...args) {
	const url = args[0] instanceof Request ? args[0].url : args[0];

	// Skip WebSocket URLs
	if (url.startsWith('ws:') || url.startsWith('wss:')) {
		return originalFetch.apply(this, args);
	}

	return originalFetch.apply(this, args)
		.then(async response => {
			const contentType = response.headers.get('Content-Type') || '';

			// Exclude HTML document responses
			const isDocumentResponse =
				contentType.includes('text/html') ||
				contentType.includes('application/xhtml+xml');

			if (!response.ok && !isDocumentResponse) {
					const responseClone = response.clone();
					const errorFromRes = await responseClone.text();
					const requestUrl = response.url;
					console.error(\`Fetch error from \${requestUrl}: \${errorFromRes}\`);
			}

			return response;
		})
		.catch(error => {
			if (!url.match(/\.html?$/i)) {
				console.error(error);
			}

			throw error;
		});
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
					attrs: {type: 'module'},
					children: configHorizonsConsoleErrroHandler,
					injectTo: 'head',
				},
				{
					tag: 'script',
					attrs: { type: 'module' },
					children: configWindowFetchMonkeyPatch,
					injectTo: 'head',
				},
			],
		};
	},
};

// Deshabilitar advertencias de consola
console.warn = () => {};

// Función para manejar errores personalizados
const handleError = (msg, options) => {
  // Ignorar errores específicos de CSS
  if (options?.error?.toString().includes('CssSyntaxError: [postcss]')) {
    return;
  }
  // Mostrar el error en la consola
  console.error(msg, options);
}

// Cargar variables de entorno
const env = {
  VITE_BASE_URL: process.env.VITE_BASE_URL || 'https://chileaovivo.com',
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || '',
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || '',
  VITE_OPENWEATHER_API_KEY: process.env.VITE_OPENWEATHER_API_KEY || '',
  VITE_OPENWEATHER_BASE_URL: process.env.VITE_OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5',
};

// Mostrar variables de entorno en consola (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  console.log('Variables de entorno cargadas:', env);
}

module.exports = defineConfig({
  // Inyectar variables de entorno en el cliente
  define: {
    'import.meta.env': JSON.stringify(env)
  },
  server: {
    port: 3003,
    open: true,
    cors: {
      origin: '*',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true,
    },
    headers: {
      'Content-Security-Policy': [
        "default-src 'self';",
        "img-src 'self' data: https: http: blob:;",
        "font-src 'self' https://fonts.gstatic.com;",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
        "connect-src 'self' https://*.googleapis.com https://*.google.com https://*.gstatic.com https://yfgqpaxajeatchcqrehe.supabase.co;",
      ].join(' '),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
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
  plugins: [
    react(),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      filename: 'sw.js',
      srcDir: 'src',
      manifest: {
        name: 'Vibe Chile',
        short_name: 'VibeChile',
        description: 'Descubre los mejores restaurantes y experiencias en Chile',
        theme_color: '#1268f5',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,woff,woff2,ttf,eot}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false
      }
    }),
		...(isDev ? [inlineEditPlugin?.(), editModeDevPlugin?.()] : []),
		addTransformIndexHtml
	],
	resolve: {
		extensions: ['.jsx', '.js', '.tsx', '.ts', '.json', ],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		rollupOptions: {
			external: [
				'@babel/parser',
				'@babel/traverse',
				'@babel/generator',
				'@babel/types'
			]
		}
	}
});
