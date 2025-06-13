import { format, parseISO, isToday, isAfter, isBefore, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

// Coordenadas de las principales ciudades chilenas organizadas en grupos
export const CHILEAN_CITIES = [
  // Ciudades principales (ya existentes)
  { name: 'Santiago', lat: -33.4489, lon: -70.6693 },
  { name: 'Valparaíso', lat: -33.0458, lon: -71.6197 },
  { name: 'Viña del Mar', lat: -33.0245, lon: -71.5518 },
  { name: 'Concepción', lat: -36.8269, lon: -73.0503 },
  
  // Otras ciudades importantes
  { name: 'Arica', lat: -18.4783, lon: -70.3126 },
  { name: 'Iquique', lat: -20.2307, lon: -70.1357 },
  { name: 'Antofagasta', lat: -23.6509, lon: -70.4000 },
  { name: 'Copiapó', lat: -27.3667, lon: -70.3333 },
  { name: 'La Serena', lat: -29.9027, lon: -71.2519 },
  { name: 'Coquimbo', lat: -29.9533, lon: -71.3436 },
  { name: 'Rancagua', lat: -34.1708, lon: -70.7444 },
  { name: 'Talca', lat: -35.4264, lon: -71.6556 },
  { name: 'Chillán', lat: -36.6067, lon: -72.1033 },
  { name: 'Temuco', lat: -38.7399, lon: -72.5901 },
  { name: 'Valdivia', lat: -39.8142, lon: -73.2459 },
  { name: 'Osorno', lat: -40.5667, lon: -73.1500 },
  { name: 'Puerto Montt', lat: -41.4689, lon: -72.9411 },
  { name: 'Chiloé', lat: -42.6021, lon: -73.9450 }, // Usando Castro como referencia para Chiloé
  { name: 'Coyhaique', lat: -45.5667, lon: -72.0667 },
  { name: 'Punta Arenas', lat: -53.1620, lon: -70.9331 }
];

// Grupos de ciudades para el selector
export const CITY_GROUPS = [
  {
    label: 'Ciudades principales',
    cities: ['Santiago', 'Valparaíso', 'Viña del Mar', 'Concepción']
  },
  {
    label: 'Otras ciudades',
    cities: [
      'Arica', 'Iquique', 'Antofagasta', 'Copiapó', 'La Serena', 'Coquimbo',
      'Rancagua', 'Talca', 'Chillán', 'Temuco', 'Valdivia', 'Osorno',
      'Puerto Montt', 'Chiloé', 'Coyhaique', 'Punta Arenas'
    ]
  }
];

// Función para obtener el ícono del clima según el código de OpenWeatherMap
export const getWeatherIcon = (iconCode) => {
  const iconMap = {
    '01d': 'clear-sky-day',
    '01n': 'clear-sky-night',
    '02d': 'few-clouds-day',
    '02n': 'few-clouds-night',
    '03d': 'scattered-clouds',
    '03n': 'scattered-clouds',
    '04d': 'broken-clouds',
    '04n': 'broken-clouds',
    '09d': 'shower-rain',
    '09n': 'shower-rain',
    '10d': 'rain-day',
    '10n': 'rain-night',
    '11d': 'thunderstorm',
    '11n': 'thunderstorm',
    '13d': 'snow',
    '13n': 'snow',
    '50d': 'mist',
    '50n': 'mist',
  };
  return iconMap[iconCode] || 'clear-sky-day';
};

// Procesar datos del pronóstico para agrupar por día y obtener máximos/mínimos
export const processForecastData = (forecastList) => {
  if (!forecastList || !Array.isArray(forecastList)) return [];
  
  const dailyData = {};
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Procesar cada elemento del pronóstico
  forecastList.forEach(item => {
    if (!item || !item.dt) return;
    
    const timestamp = item.dt * 1000; // Convertir a milisegundos
    const date = new Date(timestamp);
    // Usar la fecha local para agrupar por día
    const dateKey = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().split('T')[0];
    
    // Solo incluir pronósticos para hoy y los próximos 4 días
    const forecastDate = new Date(dateKey);
    const daysFromNow = Math.floor((forecastDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysFromNow < 0 || daysFromNow > 4) return;
    
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = {
        dt: timestamp,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        weather: [{
          ...item.weather[0],
          // Priorizar el ícono del día si está disponible
          icon: item.weather[0].icon.endsWith('d') ? item.weather[0].icon : (dailyData[dateKey]?.weather?.[0]?.icon || item.weather[0].icon)
        }],
        // Almacenar todas las temperaturas para cálculos posteriores
        temps: [item.main.temp],
        // Almacenar todos los iconos para determinar el más representativo
        icons: [item.weather[0].icon],
        // Almacenar descripciones para determinar la más común
        descriptions: [item.weather[0].description],
        // Almacenar información de lluvia si está disponible
        rain: item.rain ? item.rain['3h'] || 0 : 0,
        // Almacenar información de nieve si está disponible
        snow: item.snow ? item.snow['3h'] || 0 : 0,
        // Almacenar humedad
        humidity: item.main.humidity,
        // Almacenar velocidad del viento
        wind_speed: item.wind.speed,
        // Almacenar dirección del viento
        wind_deg: item.wind.deg,
        // Almacenar presión atmosférica
        pressure: item.main.pressure,
        // Almacenar sensación térmica
        feels_like: item.main.feels_like,
        // Almacenar hora del pronóstico
        time: date.getHours(),
      };
    } else {
      // Actualizar mínimos y máximos
      const dayData = dailyData[dateKey];
      dayData.temp_min = Math.min(dayData.temp_min, item.main.temp_min);
      dayData.temp_max = Math.max(dayData.temp_max, item.main.temp_max);
      
      // Añadir temperatura actual a la lista de temperaturas
      dayData.temps.push(item.main.temp);
      
      // Añadir ícono a la lista de íconos
      dayData.icons.push(item.weather[0].icon);
      
      // Añadir descripción a la lista de descripciones
      dayData.descriptions.push(item.weather[0].description);
      
      // Actualizar lluvia y nieve si hay valores más altos
      if (item.rain) {
        dayData.rain = Math.max(dayData.rain, item.rain['3h'] || 0);
      }
      if (item.snow) {
        dayData.snow = Math.max(dayData.snow, item.snow['3h'] || 0);
      }
      
      // Actualizar humedad, viento, presión, etc. con el valor del mediodía si está disponible
      // o mantener el valor existente
      const currentHour = date.getHours();
      if (currentHour >= 11 && currentHour <= 15) {
        dayData.humidity = item.main.humidity;
        dayData.wind_speed = item.wind.speed;
        dayData.wind_deg = item.wind.deg;
        dayData.pressure = item.main.pressure;
        dayData.feels_like = item.main.feels_like;
        dayData.weather[0] = { ...item.weather[0] };
      }
    }
  });
  
  // Procesar los datos diarios para determinar el clima más representativo
  return Object.values(dailyData).map(day => {
    // Calcular temperatura promedio
    const avgTemp = day.temps.reduce((sum, temp) => sum + temp, 0) / day.temps.length;
    
    // Encontrar el ícono más común
    const iconCounts = {};
    let mostCommonIcon = day.icons[0];
    let maxCount = 0;
    
    day.icons.forEach(icon => {
      iconCounts[icon] = (iconCounts[icon] || 0) + 1;
      if (iconCounts[icon] > maxCount) {
        maxCount = iconCounts[icon];
        mostCommonIcon = icon;
      }
    });
    
    // Encontrar la descripción más común
    const descCounts = {};
    let mostCommonDesc = day.descriptions[0];
    maxCount = 0;
    
    day.descriptions.forEach(desc => {
      descCounts[desc] = (descCounts[desc] || 0) + 1;
      if (descCounts[desc] > maxCount) {
        maxCount = descCounts[desc];
        mostCommonDesc = desc;
      }
    });
    
    // Retornar el objeto de día procesado
    return {
      dt: day.dt,
      temp: Math.round(avgTemp * 10) / 10, // Redondear a 1 decimal
      temp_min: Math.round(day.temp_min * 10) / 10,
      temp_max: Math.round(day.temp_max * 10) / 10,
      weather: [{
        ...day.weather[0],
        icon: mostCommonIcon,
        description: mostCommonDesc,
      }],
      rain: day.rain,
      snow: day.snow,
      humidity: day.humidity,
      wind_speed: day.wind_speed,
      wind_deg: day.wind_deg,
      pressure: day.pressure,
      feels_like: day.feels_like,
    };
  }).sort((a, b) => a.dt - b.dt); // Ordenar por fecha
};

/**
 * Formatea una fecha según el formato especificado
 * @param {number|string|Date} date - Fecha a formatear (timestamp en segundos o milisegundos, string ISO o objeto Date)
 * @param {string} formatStr - Formato de salida (ver documentación de date-fns/format)
 * @param {Object} options - Opciones adicionales para el formateo
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, formatStr = 'PPP', options = {}) => {
  try {
    let dateObj;
    
    // Manejar diferentes tipos de entrada
    if (typeof date === 'number') {
      // Si es un timestamp, verificar si está en segundos o milisegundos
      dateObj = date < 1e10 ? new Date(date * 1000) : new Date(date);
    } else if (typeof date === 'string') {
      // Si es un string, intentar parsearlo
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      // Si ya es un objeto Date, usarlo directamente
      dateObj = date;
    } else {
      // Si no es un tipo válido, devolver un mensaje de error
      console.error('Tipo de fecha no válido:', date);
      return 'Fecha inválida';
    }
    
    // Verificar si la fecha es válida
    if (isNaN(dateObj.getTime())) {
      console.error('Fecha inválida:', date);
      return 'Fecha inválida';
    }
    
    // Opciones por defecto para el formato
    const defaultOptions = {
      locale: es,
      ...options
    };
    
    // Formatear la fecha
    return format(dateObj, formatStr, defaultOptions);
  } catch (error) {
    console.error('Error al formatear la fecha:', error);
    return 'Error de formato';
  }
};
