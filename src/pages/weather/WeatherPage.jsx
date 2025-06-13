import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, Search, MapPin, Droplet, Wind, Gauge, 
  Sun, Moon, Thermometer, Cloud, CloudRain, CloudSnow, 
  CloudLightning, SunDim, Cloudy, Navigation, Sunrise, Sunset,
  Loader2, Clock, Calendar, Droplets, ThermometerSun, Wind as WindIcon,
  CloudSun, CloudMoon
} from 'lucide-react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { es } from 'date-fns/locale';
import { CHILEAN_CITIES, getWeatherIcon, processForecastData, formatDate } from '@/utils/weatherUtils';
import './weather.css';

// Configuración de la API
console.log('Variables de entorno:', import.meta.env);
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const BASE_URL = import.meta.env.VITE_OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';

console.log('Clave API:', API_KEY ? '***' + API_KEY.slice(-4) : 'No configurada');
console.log('URL base:', BASE_URL);

if (!API_KEY) {
  console.error('Error: No se ha configurado la clave de la API de OpenWeatherMap');
  console.log('Asegúrate de que el archivo .env contenga VITE_OPENWEATHER_API_KEY');
}

// Componente para renderizar el ícono del clima
const WeatherIcon = ({ iconCode, className = '', size = 'text-4xl' }) => {
  // Default icon in case the mapping fails
  const defaultIcon = <Cloud className={`${size} text-gray-400`} />;
  
  try {
    const iconMap = {
      '01d': <Sun className={`${size} text-yellow-400`} />,
      '01n': <Moon className={`${size} text-gray-300`} />,
      '02d': <CloudSun className={`${size} text-yellow-300`} />,
      '02n': <CloudMoon className={`${size} text-gray-300`} />,
      '03d': <Cloud className={`${size} text-gray-400`} />,
      '03n': <Cloud className={`${size} text-gray-500`} />,
      '04d': <Cloudy className={`${size} text-gray-500`} />,
      '04n': <Cloudy className={`${size} text-gray-600`} />,
      '09d': <CloudRain className={`${size} text-blue-400`} />,
      '09n': <CloudRain className={`${size} text-blue-500`} />,
      '10d': <CloudRain className={`${size} text-blue-500`} />,
      '10n': <CloudRain className={`${size} text-blue-600`} />,
      '11d': <CloudLightning className={`${size} text-yellow-500`} />,
      '11n': <CloudLightning className={`${size} text-yellow-600`} />,
      '13d': <CloudSnow className={`${size} text-blue-200`} />,
      '13n': <CloudSnow className={`${size} text-blue-200`} />,
      '50d': <Cloudy className={`${size} text-gray-400`} />,
      '50n': <Cloudy className={`${size} text-gray-500`} />,
    };

    return iconMap[iconCode] || defaultIcon;
  } catch (error) {
    console.error('Error rendering weather icon:', error);
    return defaultIcon;
  }
};

// Componente de carga
const LoadingSpinner = ({ text = 'Cargando...' }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
    <p className="text-gray-600">{text}</p>
  </div>
);

// Componente de error
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded-r">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm text-red-700">{message}</p>
        {onRetry && (
          <div className="mt-2">
            <button
              onClick={onRetry}
              className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

const WeatherPage = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(CHILEAN_CITIES[0]);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [featuredCities, setFeaturedCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState(CHILEAN_CITIES);

  // Filtrar ciudades según la búsqueda
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCities(CHILEAN_CITIES);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = CHILEAN_CITIES.filter(city => 
        city.name.toLowerCase().includes(query)
      );
      setFilteredCities(filtered);
    }
  }, [searchQuery]);

  // Obtener clima actual
  const fetchCurrentWeather = useCallback(async (lat, lon, cityName = '') => {
    if (!API_KEY) {
      throw new Error('No se ha configurado la clave de la API de OpenWeatherMap');
    }

    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'No se pudo obtener los datos del clima');
      }

      const data = await response.json();
      
      // Asegurarse de que el nombre de la ciudad sea consistente
      if (cityName) {
        data.name = cityName;
      }
      
      return data;
    } catch (err) {
      console.error('Error al obtener el clima actual:', err);
      throw err;
    }
  }, []);

  // Obtener pronóstico extendido
  const fetchForecast = useCallback(async (lat, lon) => {
    if (!API_KEY) return [];

    try {
      const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es&cnt=40`
      );

      if (!response.ok) {
        console.error('Error en la respuesta del pronóstico:', await response.text());
        return [];
      }

      const data = await response.json();
      return processForecastData(data.list || []);
    } catch (err) {
      console.error('Error al obtener el pronóstico:', err);
      return [];
    }
  }, []);

  // Cargar datos del clima
  const loadWeatherData = useCallback(async (city) => {
    if (!city) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Obtener clima actual y pronóstico en paralelo
      const [current, forecast] = await Promise.all([
        fetchCurrentWeather(city.lat, city.lon, city.name),
        fetchForecast(city.lat, city.lon)
      ]);
      
      setWeatherData(current);
      setForecastData(forecast);
      setLastUpdated(new Date());
      
      // Cargar ciudades destacadas (excluyendo la actual)
      const otherCities = CHILEAN_CITIES
        .filter(c => c.name !== city.name)
        .slice(0, 3);
      
      const featured = await Promise.all(
        otherCities.map(async (c) => {
          try {
            const weather = await fetchCurrentWeather(c.lat, c.lon, c.name);
            return { ...c, weather };
          } catch (err) {
            console.error(`Error al cargar datos para ${c.name}:`, err);
            return null;
          }
        })
      );
      
      setFeaturedCities(featured.filter(Boolean));
    } catch (err) {
      console.error('Error al cargar los datos del clima:', err);
      setError('Error al cargar los datos del clima. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchCurrentWeather, fetchForecast]);

  // Cargar datos cuando cambia la ciudad seleccionada
  useEffect(() => {
    if (selectedCity) {
      loadWeatherData(selectedCity);
    }
  }, [selectedCity, loadWeatherData]);

  // Manejar cambio de ciudad
  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSearchQuery('');
  };

  // Manejar retroceso
  const handleBack = () => {
    navigate(-1);
  };

  // Formatear fecha para mostrar
  const formatDisplayDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    
    if (isToday(date)) return 'Hoy';
    if (isTomorrow(date)) return 'Mañana';
    
    return format(date, 'EEEE d', { locale: es });
  };

  // Generar metadatos para SEO
  const pageTitle = weatherData 
    ? `Clima en ${weatherData.name}, Chile - Temperatura y Pronóstico` 
    : 'Clima en Chile - Pronóstico del tiempo';
    
  const pageDescription = weatherData
    ? `Información meteorológica actualizada para ${weatherData.name}, Chile. Temperatura, humedad, viento y pronóstico extendido.`
    : 'Consulta el pronóstico del tiempo para las principales ciudades de Chile. Información meteorológica precisa y actualizada.';

  // Renderizar el componente
  if (isLoading && !weatherData) {
    return (
      <div className="weather-container">
        <LoadingSpinner text="Cargando datos del clima..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-container p-4">
        <div className="container mx-auto py-8">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Volver
          </button>
          
          <ErrorMessage 
            message={error} 
            onRetry={() => selectedCity && loadWeatherData(selectedCity)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="weather-container">
      {/* Metadatos SEO */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`clima, tiempo, ${weatherData?.name || ''}, Chile, pronóstico, temperatura, humedad, viento`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_CL" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {/* Barra superior */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center text-white hover:text-blue-100 mr-4 transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Volver
          </button>
          <h1 className="text-xl font-semibold">Clima en Chile</h1>
          {lastUpdated && (
            <div className="ml-auto text-sm text-blue-100">
              Actualizado: {format(lastUpdated, 'HH:mm')}
            </div>
          )}
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Selector de ciudad */}
        <div className="mb-8 relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar ciudad en Chile..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              aria-label="Buscar ciudad"
            />
          </div>
          
          {searchQuery && filteredCities.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredCities.map((city) => (
                <button
                  key={`${city.name}-${city.lat}-${city.lon}`}
                  onClick={() => handleCitySelect(city)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center transition-colors"
                >
                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                  {city.name}
                </button>
              ))}
            </div>
          )}
          
          {searchQuery && filteredCities.length === 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-gray-500">
              No se encontraron ciudades que coincidan con "{searchQuery}"
            </div>
          )}
        </div>

        {/* Clima actual */}
        {weatherData && (
          <div className="weather-card mb-8 overflow-hidden animate-fade-in">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <div className="flex items-center mb-1">
                    <MapPin className="w-5 h-5 text-blue-500 mr-2" />
                    <h2 className="text-2xl font-bold text-gray-800">
                      {weatherData.name}, Chile
                    </h2>
                  </div>
                  <p className="text-gray-600">
                    {formatDate(weatherData.dt, 'EEEE d \'de\' MMMM', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 text-center md:text-right">
                  <div className="flex items-center justify-center md:justify-end">
                    {weatherData.weather[0]?.icon && (
                      <div className="mr-3">
                        <WeatherIcon iconCode={weatherData.weather[0].icon} />
                      </div>
                    )}
                    <div>
                      <div className="text-5xl font-bold text-blue-600">
                        {Math.round(weatherData.main.temp)}°C
                      </div>
                      <div className="text-lg text-gray-600 capitalize">
                        {weatherData.weather[0].description}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="weather-detail">
                  <ThermometerSun className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Sensación</p>
                    <p className="font-medium">{Math.round(weatherData.main.feels_like)}°C</p>
                  </div>
                </div>
                
                <div className="weather-detail">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Humedad</p>
                    <p className="font-medium">{weatherData.main.humidity}%</p>
                  </div>
                </div>
                
                <div className="weather-detail">
                  <WindIcon className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Viento</p>
                    <p className="font-medium">{Math.round(weatherData.wind.speed * 3.6)} km/h</p>
                  </div>
                </div>
                
                <div className="weather-detail">
                  <Gauge className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Presión</p>
                    <p className="font-medium">{weatherData.main.pressure} hPa</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div className="weather-detail">
                  <Sunrise className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-500">Amanecer</p>
                    <p className="font-medium">{formatDate(weatherData.sys.sunrise, 'HH:mm')}</p>
                  </div>
                </div>
                
                <div className="weather-detail">
                  <Sunset className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Atardecer</p>
                    <p className="font-medium">{formatDate(weatherData.sys.sunset, 'HH:mm')}</p>
                  </div>
                </div>
                
                <div className="weather-detail">
                  <Navigation className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Dirección viento</p>
                    <p className="font-medium">
                      {(() => {
                        const deg = weatherData.wind.deg;
                        if (deg >= 337.5 || deg < 22.5) return 'Norte';
                        if (deg >= 22.5 && deg < 67.5) return 'Noreste';
                        if (deg >= 67.5 && deg < 112.5) return 'Este';
                        if (deg >= 112.5 && deg < 157.5) return 'Sureste';
                        if (deg >= 157.5 && deg < 202.5) return 'Sur';
                        if (deg >= 202.5 && deg < 247.5) return 'Suroeste';
                        if (deg >= 247.5 && deg < 292.5) return 'Oeste';
                        return 'Noroeste';
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pronóstico extendido */}
        {forecastData.length > 0 && (
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Pronóstico extendido
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {forecastData.map((day, index) => (
                <div key={day.dt} className="weather-card p-4 text-center">
                  <h3 className="font-medium text-gray-800 mb-2">
                    {index === 0 ? 'Hoy' : formatDisplayDate(day.dt)}
                  </h3>
                  
                  {day.weather?.[0]?.icon && (
                    <div className="my-2 flex justify-center">
                      <WeatherIcon iconCode={day.weather[0].icon} size="text-3xl" />
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-blue-600 font-medium">{Math.round(day.temp_max)}°</span>
                    <span className="text-gray-500">{Math.round(day.temp_min)}°</span>
                  </div>
                  
                  <div className="mt-1 text-xs text-gray-500 capitalize">
                    {day.weather?.[0]?.description || ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ciudades destacadas */}
        {featuredCities.length > 0 && (
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              Otras ciudades
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredCities.map((city) => (
                <button
                  key={`featured-${city.name}`}
                  onClick={() => handleCitySelect(city)}
                  className="city-card text-left hover:border-blue-200 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">{city.name}</h3>
                      <p className="text-sm text-gray-500">
                        {city.weather?.weather?.[0]?.description || 'No disponible'}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {city.weather?.weather?.[0]?.icon && (
                        <div className="ml-2">
                          <WeatherIcon 
                            iconCode={city.weather.weather[0].icon} 
                            size="text-2xl" 
                          />
                        </div>
                      )}
                      <span className="text-xl font-semibold text-gray-800 ml-2">
                        {city.weather?.main?.temp ? `${Math.round(city.weather.main.temp)}°C` : '--'}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Pie de página */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Datos meteorológicos proporcionados por <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenWeatherMap</a></p>
          <p className="mt-1">Actualizado: {lastUpdated ? format(lastUpdated, "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es }) : 'Cargando...'}</p>
        </div>
      </footer>
    </div>
  );
};

export default WeatherPage;
