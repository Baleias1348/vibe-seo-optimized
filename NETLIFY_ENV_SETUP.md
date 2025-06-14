# Configuración de Variables de Entorno en Netlify

Este archivo contiene las instrucciones para configurar las variables de entorno necesarias en Netlify para el correcto funcionamiento de la aplicación.

## Variables Obligatorias

### Configuración Base
- `VITE_BASE_URL`: URL base de la aplicación (ej: `https://chileaovivo.com`)

### Supabase
- `VITE_SUPABASE_URL`: URL de tu proyecto Supabase
- `VITE_SUPABASE_ANON_KEY`: Clave anónima de Supabase
- `VITE_SUPABASE_SERVICE_KEY`: Clave de servicio de Supabase (solo para operaciones del lado del servidor)

### OpenWeatherMap
- `VITE_OPENWEATHER_API_KEY`: Tu clave de API de OpenWeatherMap
- `VITE_OPENWEATHER_BASE_URL`: `https://api.openweathermap.org/data/2.5`

## Cómo Configurar en Netlify

1. Ve al panel de control de Netlify
2. Selecciona tu sitio
3. Ve a "Site settings" > "Build & deploy" > "Environment"
4. Haz clic en "Edit variables"
5. Agrega cada variable con su valor correspondiente
6. Haz clic en "Save"

## Variables de Entorno de Desarrollo

Para desarrollo local, copia el archivo `.env.example` a `.env` y completa los valores:

```bash
cp .env.example .env
```

## Verificación

Después de configurar las variables, reinicia el despliegue en Netlify para asegurarte de que los cambios surtan efecto.

## Solución de Problemas

Si el despliegue falla, verifica:
1. Que todas las variables obligatorias estén configuradas
2. Que los valores sean correctos y no contengan espacios en blanco adicionales
3. Los logs de despliegue en Netlify para mensajes de error específicos
