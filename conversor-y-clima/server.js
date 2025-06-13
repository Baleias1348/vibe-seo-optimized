import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Cargar variables de entorno
dotenv.config({ path: './.env' });

// Mostrar información de depuración
console.log('Directorio actual:', process.cwd());
console.log('GOOGLE_PLACES_API_KEY:', process.env.GOOGLE_PLACES_API_KEY ? 'Configurada' : 'No configurada');
console.log('VITE_GOOGLE_PLACES_API_KEY:', process.env.VITE_GOOGLE_PLACES_API_KEY ? 'Configurada' : 'No configurada');

// Usar VITE_GOOGLE_PLACES_API_KEY si está disponible, de lo contrario usar GOOGLE_PLACES_API_KEY
const API_KEY = process.env.VITE_GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY;

if (!API_KEY) {
  console.error('ERROR: No se ha configurado la clave de Google Places API');
  process.exit(1);
}

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

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

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

// Ruta para obtener los 10 mejores restaurantes en una ciudad
app.get('/api/places/nearbysearch', async (req, res) => {
  console.log('\n=== Nueva solicitud a /api/places/nearbysearch ===');
  console.log('Hora:', new Date().toISOString());
  
  try {
    const { location, radius = 5000, type = 'restaurant' } = req.query;
    
    console.log('Parámetros recibidos:', { 
      location, 
      radius, 
      type,
      hasApiKey: !!API_KEY,
      keyPrefix: API_KEY ? API_KEY.substring(0, 10) + '...' : 'No hay clave'
    });
    
    if (!API_KEY) {
      const errorMsg = 'Error: No se ha configurado la clave de Google Places API';
      console.error(errorMsg);
      return res.status(500).json({ 
        error: errorMsg,
        status: 'ERROR',
        details: 'Verifica que la variable de entorno GOOGLE_PLACES_API_KEY esté configurada correctamente en el archivo .env'
      });
    }
    
    // Usar coordenadas fijas de Santiago si no se proporcionan
    let lat, lng;
    if (location) {
      const [latStr, lngStr] = location.split(',');
      lat = parseFloat(latStr);
      lng = parseFloat(lngStr);
    } else {
      // Coordenadas del centro de Santiago, Chile
      lat = -33.4489;
      lng = -70.6693;
    }
    
    console.log(`Buscando restaurantes cerca de (${lat}, ${lng}) con radio ${radius}m...`);
    
    // Usar la API de Places v1
    const url = 'https://places.googleapis.com/v1/places:searchNearby';
    
    const requestBody = {
      includedTypes: ['restaurant'],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: { 
            latitude: lat, 
            longitude: lng 
          },
          radius: parseFloat(radius)
        }
      },
      rankPreference: 'POPULARITY',
      languageCode: 'es',
      minRating: 4.0
    };
    
    console.log('URL de la API:', url);
    console.log('Cuerpo de la solicitud:', JSON.stringify(requestBody, null, 2));
    
    try {
      const startTime = Date.now();
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.types,places.location,places.photos,places.id,places.priceLevel,places.websiteUri,places.currentOpeningHours,places.primaryTypeDisplayName',
        },
        body: JSON.stringify(requestBody)
      });
      
      const responseTime = Date.now() - startTime;
      console.log(`Respuesta recibida en ${responseTime}ms`);
      console.log('Estado de la respuesta:', response.status, response.statusText);
      
      const data = await response.json().catch(e => {
        console.error('Error al analizar la respuesta JSON:', e);
        throw new Error('Respuesta no válida de la API de Google Places');
      });
      
      console.log('Datos de la respuesta:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
      
      if (!response.ok) {
        const errorMsg = `Error de la API de Google Places: ${response.status} ${response.statusText}`;
        console.error(errorMsg, data);
        return res.status(response.status).json({
          status: 'ERROR',
          error: data.error?.message || errorMsg,
          details: data.error || {},
          timestamp: new Date().toISOString()
        });
      }
      
      return data;
      
    } catch (error) {
      console.error('Error en la petición a Google Places:', error);
      throw error; // El manejador de errores global se encargará de esto
    }
    
    console.log(`Se encontraron ${data.places?.length || 0} restaurantes`);
    
    // Formatear la respuesta para que coincida con lo que espera el frontend
    const formattedResults = (data.places || []).map((place, index) => {
      const photo = place.photos?.[0]; // Tomar la primera foto si existe
      
      return {
        id: place.id || `place-${index}`,
        name: place.displayName?.text || 'Restaurante sin nombre',
        address: place.formattedAddress || 'Dirección no disponible',
        location: {
          lat: place.location?.latitude || lat,
          lng: place.location?.longitude || lng
        },
        rating: place.rating || 0,
        user_ratings_total: place.userRatingCount || 0,
        price_level: place.priceLevel || 0,
        types: place.types || [],
        photos: photo ? [{
          photo_reference: photo.name.split('/').pop(),
          width: photo.widthPx,
          height: photo.heightPx,
          html_attributions: photo.authorAttributions || []
        }] : [],
        opening_hours: {
          open_now: place.currentOpeningHours?.openNow || false,
          weekday_text: place.currentOpeningHours?.weekdayDescriptions || []
        }
      };
    });
    
    // Ordenar por rating (más alto primero) y luego por número de reseñas
    const sortedResults = [...formattedResults].sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return b.user_ratings_total - a.user_ratings_total;
    });
    
    res.json({
      status: 'OK',
      results: sortedResults,
      next_page_token: data.nextPageToken
    });
    
  } catch (error) {
    console.error('Error en /api/places/nearbysearch:', error);
    res.status(500).json({
      status: 'ERROR',
      error: 'Error interno del servidor al buscar restaurantes',
      details: error.message
    });
  }
});

// Ruta para obtener detalles de un lugar (usando la nueva API v1)
app.get('/api/places/details/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    const apiKey = API_KEY; // Usar la constante definida al inicio
    
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
    
    // Usar la nueva API de Google Places (v1) para obtener detalles
    const url = `https://places.googleapis.com/v1/places/${placeId}`;
    
    console.log('Solicitando detalles a la API de Google Places v1...');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,rating,userRatingCount,types,location,photos,priceLevel,websiteUri,currentOpeningHours,regularOpeningHours,internationalPhoneNumber,reviews,primaryTypeDisplayName,utcOffsetMinutes,goodForChildren,servesVegetarianFood,servesCuisine,menuForChildren,editorialSummary',
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error de la API de Google Places (detalles):', data);
      return res.status(response.status).json({
        error: data.error?.message || 'Error al obtener detalles del lugar',
        status: 'ERROR',
        details: data.error
      });
    }
    
    // Formatear la respuesta para mantener compatibilidad con el frontend
    const formattedResult = {
      result: {
        place_id: data.id,
        name: data.displayName?.text || 'Sin nombre',
        formatted_address: data.formattedAddress,
        formatted_phone_number: data.internationalPhoneNumber,
        website: data.websiteUri,
        opening_hours: data.currentOpeningHours ? {
          open_now: data.currentOpeningHours.openNow,
          weekday_text: data.currentOpeningHours.weekdayDescriptions || [],
          periods: data.regularOpeningHours?.periods?.map(period => ({
            open: {
              day: period.open?.day,
              time: period.open?.time
            },
            close: period.close ? {
              day: period.close.day,
              time: period.close.time
            } : null
          }))
        } : null,
        geometry: {
          location: {
            lat: data.location?.latitude,
            lng: data.location?.longitude
          }
        },
        rating: data.rating,
        user_ratings_total: data.userRatingCount,
        photos: data.photos?.map(photo => ({
          photo_reference: photo.name.split('/').pop(),
          width: photo.widthPx,
          height: photo.heightPx,
          html_attributions: photo.authorAttributions?.map(a => a.displayName) || []
        })) || [],
        vicinity: data.formattedAddress,
        international_phone_number: data.internationalPhoneNumber,
        price_level: data.priceLevel,
        types: data.types,
        url: `https://www.google.com/maps/place/?q=place_id:${data.id}`,
        utc_offset: data.utcOffsetMinutes ? data.utcOffsetMinutes / 60 : 0,
        // Campos adicionales
        editorial_summary: data.editorialSummary?.text,
        serves_vegetarian_food: data.servesVegetarianFood,
        serves_cuisine: data.servesCuisine,
        good_for_children: data.goodForChildren,
        menu_for_children: data.menuForChildren,
        current_opening_hours: data.currentOpeningHours,
        regular_opening_hours: data.regularOpeningHours,
        reviews: data.reviews?.map(review => ({
          author_name: review.author,
          rating: review.rating,
          relative_time_description: review.relativePublishTimeDescription,
          time: review.publishTime,
          text: review.text?.text || '',
          author_url: review.authorUri,
          profile_photo_url: review.authorPhotoUri,
          language: review.languageCode
        })) || []
      },
      status: 'OK'
    };
    
    return res.json(formattedResult);
    
  } catch (error) {
    console.error('Error al obtener detalles del lugar:', error);
    res.status(500).json({ 
      error: 'Error al obtener detalles del lugar',
      status: 'ERROR',
      details: error.message 
    });
  }
});

// Ruta para obtener fotos de lugares (usando la nueva API v1)
app.get('/api/places/photo', async (req, res) => {
  try {
    const { photo_reference, maxwidth = '800' } = req.query;
    const apiKey = API_KEY; // Usar la constante definida al inicio
    
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
    
    // Usar la nueva API de Google Places Photos (v1)
    const url = `https://places.googleapis.com/v1/${photo_reference}/media`;
    
    const response = await fetch(`${url}?key=${apiKey}&maxWidthPx=${maxwidth}`, {
      method: 'GET',
      redirect: 'manual' // No seguir redirecciones automáticamente
    });
    
    // La API devuelve un 307 con la URL de la imagen en la cabecera Location
    if (response.status === 307) {
      const imageUrl = response.headers.get('location');
      if (imageUrl) {
        return res.redirect(imageUrl);
      }
    }
    
    // Si no se pudo obtener la URL de la imagen, devolver error
    console.error('Error al obtener la URL de la foto. Estado:', response.status);
    return res.status(500).json({
      error: 'No se pudo obtener la URL de la foto del lugar',
      status: 'ERROR',
      details: 'No se recibió una URL de imagen válida'
    });
    
  } catch (error) {
    console.error('Error al obtener la foto del lugar:', error);
    res.status(500).json({ 
      error: 'Error al obtener la foto del lugar',
      status: 'ERROR',
      details: error.message 
    });
  }
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Manejador para señales de terminación
process.on('SIGTERM', () => {
  console.log('Recibida señal SIGTERM. Cerrando el servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('Excepción no capturada:', err);
  server.close(() => process.exit(1));
});

// Iniciar el servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log('Clave de API de Google Places:', process.env.VITE_GOOGLE_PLACES_API_KEY ? 'Configurada' : 'No configurada');
});

export default app;
