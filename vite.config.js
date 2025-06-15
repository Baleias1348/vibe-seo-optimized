const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react').default;
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

module.exports = defineConfig({
	server: {
		port: 8081,
		https: false,
		headers: {
			'Content-Security-Policy': `
				default-src 'self';
				connect-src 'self' https://*.supabase.co https://*.supabase.in https://*.supabase.com;
				img-src 'self' data: https:;
				script-src 'self' 'unsafe-inline' 'unsafe-eval';
				style-src 'self' 'unsafe-inline';
				font-src 'self' data:;
				frame-src 'self';
			`.replace(/\s+/g, ' ').trim()
		},
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
				"connect-src 'self' https://yfgqpaxajeatchcqrehe.supabase.co https://*.supabase.co https://*.supabase.in https://*.supabase.co https://api.openweathermap.org http://localhost:8081 https://www.google-analytics.com https://analytics.google.com https://play.google.com https://www.recaptcha.net https://www.gstatic.com https://*.ingest.sentry.io https://api.segment.io https://csp.withgoogle.com;",
				"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.google-analytics.com https://analytics.google.com;",
				"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://js.stripe.com;",
				"style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://js.stripe.com;",
				"font-src 'self' data: https: https://fonts.gstatic.com https://js.stripe.com;",
				"img-src 'self' data: https: http:;",
				"frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/ https://js.stripe.com;",
				"frame-ancestors 'self';",
				"form-action 'self';",
				"base-uri 'self';",
				"object-src 'none';",
			].join(' ').replace(/\s+/g, ' ').replace(/\n\s*/g, ' ').trim(),
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
