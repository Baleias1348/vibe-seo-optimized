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
app.use(cors());
app.use(express.json());

// Configuración de CSP simplificada
app.use((req, res, next) => {
  // Configuración de CSP permisiva para desarrollo
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https: data:; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; " +
    "style-src 'self' 'unsafe-inline' https:; " +
    "font-src 'self' https: data:; " +
    "img-src 'self' https: data: blob:; " +
    "connect-src 'self' https: ws: wss:; " +
    "frame-src 'self' https:; " +
    "media-src 'self' https: data:; "
  );
  
  // Otros encabezados de seguridad
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
    const { location, radius = 5000, type = 'restaurant' } = req.query;
    const apiKey = process.env.VITE_GOOGLE_PLACES_API_KEY;
    
    if (!apiKey || apiKey === 'TU_CLAVE_DE_GOOGLE_PLACES_AQUI') {
      console.log('Clave de API no configurada');
      return res.status(400).json({ 
        error: 'No se ha configurado la clave de Google Places API' 
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

// Ruta para obtener fotos de lugares
app.get('/api/places/photo', async (req, res) => {
  try {
    const { photo_reference, maxwidth = '400' } = req.query;
    const apiKey = process.env.VITE_GOOGLE_PLACES_API_KEY;
    
    if (!photo_reference) {
      return res.status(400).json({ error: 'Se requiere el parámetro photo_reference' });
    }
    
    if (!apiKey || apiKey === 'TU_CLAVE_DE_GOOGLE_PLACES_AQUI') {
      return res.status(400).json({ 
        error: 'No se ha configurado la clave de Google Places API' 
      });
    }
    
    const url = new URL('https://maps.googleapis.com/maps/api/place/photo');
    url.searchParams.append('photo_reference', photo_reference);
    url.searchParams.append('maxwidth', maxwidth);
    url.searchParams.append('key', apiKey);
    
    // Redirigir directamente a la URL de la imagen
    res.redirect(url.toString());
    
  } catch (error) {
    console.error('Error en la ruta /api/places/photo:', error);
    res.status(500).json({ 
      error: 'Error al obtener la foto',
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

export default app;
