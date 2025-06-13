import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración de rutas de archivo ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de CORS
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Configuración de CSP
app.use((req, res, next) => {
  // Configuración de CSP más permisiva para desarrollo
  const csp = [
    "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
    "style-src 'self' 'unsafe-inline' https: data:",
    "font-src 'self' https: data: 'unsafe-inline'",
    "img-src 'self' https: data: blob:",
    "connect-src 'self' https: ws: wss:",
    "frame-src 'self' https: data:",
    "media-src 'self' https: data:",
    "object-src 'none'"
  ].join('; ');
  
  // Configurar los encabezados de seguridad
  res.setHeader('Content-Security-Policy', csp);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  next();
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Ruta para buscar restaurantes cercanos
app.get('/api/places/nearbysearch', async (req, res) => {
  try {
    const { location, radius = process.env.VITE_SEARCH_RADIUS || 5000, type = 'restaurant' } = req.query;
    const apiKey = process.env.VITE_GOOGLE_PLACES_API_KEY;
    
    console.log('Clave de API:', apiKey ? 'Configurada' : 'No configurada');
    
    if (!apiKey) {
      console.error('Error: No se ha configurado la clave de Google Places API');
      return res.status(500).json({ 
        error: 'Error de configuración del servidor: No se ha configurado la clave de Google Places API',
        status: 'ERROR'
      });
    }
    
    console.log('Buscando restaurantes cerca de:', location);
    
    // Usar la API de Places de Google
    const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
    url.searchParams.append('location', location);
    url.searchParams.append('radius', radius);
    url.searchParams.append('type', type);
    url.searchParams.append('key', apiKey);
    
    console.log('URL de la API:', url.toString());
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    console.log('Respuesta de la API:', data.status);
    
    if (data.status === 'OK') {
      console.log(`Se encontraron ${data.results.length} resultados`);
      return res.json({
        results: data.results,
        status: 'OK'
      });
    } else {
      console.error('Error de la API de Google Places:', data.status, data.error_message || '');
      return res.status(400).json({
        error: data.error_message || 'Error al buscar lugares cercanos',
        status: data.status
      });
    }
  } catch (error) {
    console.error('Error en la ruta /api/places/nearbysearch:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// Ruta para obtener detalles de un lugar
app.get('/api/places/details/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    const apiKey = process.env.VITE_GOOGLE_PLACES_API_KEY;
    
    console.log(`Solicitando detalles para placeId: ${placeId}`);
    
    if (!apiKey) {
      console.error('Error: No se ha configurado la clave de Google Places API');
      return res.status(500).json({ 
        error: 'Error de configuración del servidor: No se ha configurado la clave de Google Places API',
        status: 'ERROR'
      });
    }
    
    if (!placeId) {
      console.error('Error: No se proporcionó un ID de lugar válido');
      return res.status(400).json({
        error: 'Se requiere un ID de lugar válido',
        status: 'INVALID_REQUEST'
      });
    }
    
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.append('place_id', placeId);
    url.searchParams.append('key', apiKey);
    url.searchParams.append('fields', [
      'name',
      'formatted_address',
      'formatted_phone_number',
      'website',
      'opening_hours',
      'geometry',
      'rating',
      'user_ratings_total',
      'photos',
      'vicinity',
      'international_phone_number',
      'reviews',
      'price_level',
      'types',
      'url',
      'utc_offset',
      'website'
    ].join(','));
    
    console.log('URL de la API de detalles:', url.toString());
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    console.log('Respuesta de la API de detalles:', data.status);
    
    if (data.status === 'OK') {
      return res.json(data);
    } else {
      console.error('Error de la API de Google Places (detalles):', data.status, data.error_message || '');
      return res.status(400).json({
        error: data.error_message || 'Error al obtener detalles del lugar',
        status: data.status || 'ERROR'
      });
    }
  } catch (error) {
    console.error('Error al obtener detalles del lugar:', error);
    res.status(500).json({ 
      error: 'Error al obtener detalles del lugar',
      details: error.message 
    });
  }
});

// Ruta para obtener fotos de lugares
app.get('/api/places/photo', async (req, res) => {
  try {
    const { photo_reference, maxwidth = '800' } = req.query;
    const apiKey = process.env.VITE_GOOGLE_PLACES_API_KEY;
    
    console.log(`Solicitando foto con referencia: ${photo_reference}`);
    
    if (!photo_reference) {
      console.error('Error: No se proporcionó photo_reference');
      return res.status(400).json({ 
        error: 'Se requiere el parámetro photo_reference',
        status: 'INVALID_REQUEST'
      });
    }
    
    if (!apiKey) {
      console.error('Error: No se ha configurado la clave de Google Places API');
      return res.status(500).json({ 
        error: 'Error de configuración del servidor: No se ha configurado la clave de Google Places API',
        status: 'ERROR'
      });
    }
    
    const url = new URL('https://maps.googleapis.com/maps/api/place/photo');
    url.searchParams.append('maxwidth', maxwidth);
    url.searchParams.append('photo_reference', photo_reference);
    url.searchParams.append('key', apiKey);
    
    console.log('URL de la foto:', url.toString());
    
    // Obtener la foto de la API de Google Places
    const response = await fetch(url.toString(), { method: 'HEAD' });
    
    if (!response.ok) {
      console.error('Error al obtener la foto. Estado:', response.status, response.statusText);
      return res.status(response.status).json({
        error: 'No se pudo obtener la foto del lugar',
        status: 'ERROR',
        details: response.statusText
      });
    }
    
    // Redirigir a la URL de la imagen
    res.redirect(url.toString());
    
  } catch (error) {
    console.error('Error al obtener la foto del lugar:', error);
    res.status(500).json({ 
      error: 'Error al obtener la foto del lugar',
      status: 'ERROR',
      details: error.message 
    });
  }
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// Manejar rutas de la aplicación React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// Iniciar el servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('Error no manejado (promesa rechazada):', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Excepción no capturada:', err);
  server.close(() => process.exit(1));
});

// Iniciar el servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    console.log('Clave de API de Google Places:', process.env.VITE_GOOGLE_PLACES_API_KEY ? 'Configurada' : 'No configurada');
  });
}

export default app;
