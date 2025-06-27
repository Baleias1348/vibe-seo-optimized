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
import es from 'date-fns/locale/es';
import { CHILEAN_CITIES, CITY_GROUPS, getWeatherIcon, processForecastData, formatDate } from '@/utils/weatherUtils';
import './weather.css';

// Configuración de la API
console.log('Variables de entorno en el módulo:', import.meta.env);

// Usar valores de las variables de entorno o valores predeterminados
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '7e90ddaf235cba0c3a0ce7f6a99c0af2';
const BASE_URL = import.meta.env.VITE_OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';

// Efecto para depurar las variables de entorno en el navegador
const DebugEnvVars = () => {
  useEffect(() => {
    console.log('=== DEBUG - Variables de entorno en el navegador ===');
    console.log('VITE_OPENWEATHER_API_KEY:', API_KEY ? '***' + API_KEY.slice(-4) : 'No configurada');
    console.log('VITE_OPENWEATHER_BASE_URL:', BASE_URL);
    console.log('Todas las variables:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
    console.log('==================================================');
  }, []);
  
  return null;
};

// Componente para renderizar o ícone do clima
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
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

const WeatherPage = () => {
  // Forzar fondo negro SOLO en esta página
  useEffect(() => {
    const prevBg = document.body.style.backgroundColor;
    const prevColor = document.body.style.color;
    document.body.style.backgroundColor = '#000';
    document.body.style.color = '#fff';
    return () => {
      document.body.style.backgroundColor = prevBg;
      document.body.style.color = prevColor;
    };
  }, []);
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [featuredCities, setFeaturedCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Obtener clima actual
  const fetchCurrentWeather = useCallback(async (lat, lon, cityName = '') => {
    console.log(`[fetchCurrentWeather] Iniciando para lat=${lat}, lon=${lon}, cityName=${cityName}`);
    
    if (!API_KEY) {
      const errorMsg = 'No se ha configurado la clave de la API de OpenWeatherMap';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
      console.log(`[fetchCurrentWeather] URL de la API: ${url}`);
      
      const response = await fetch(url);
      console.log(`[fetchCurrentWeather] Respuesta recibida, estado: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'No se pudo obtener los datos del clima';
        console.error(`[fetchCurrentWeather] Error en la respuesta:`, { status: response.status, errorData });
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log('[fetchCurrentWeather] Datos recibidos:', data);
      
      // Asegurarse de que el nombre de la ciudad sea consistente
      if (cityName) {
        data.name = cityName;
        console.log(`[fetchCurrentWeather] Nombre de ciudad actualizado a: ${cityName}`);
      }
      
      return data;
    } catch (err) {
      console.error('Error al obtener el clima actual:', err);
      throw err;
    }
  }, []);

  // Obtener pronóstico extendido
  const fetchForecast = useCallback(async (lat, lon) => {
    console.log(`[fetchForecast] Iniciando para lat=${lat}, lon=${lon}`);
    
    if (!API_KEY) {
      const errorMsg = 'No se ha configurado la clave de la API de OpenWeatherMap';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es&cnt=40`;
      console.log(`[fetchForecast] URL de la API: ${url}`);
      
      const response = await fetch(url);
      console.log(`[fetchForecast] Respuesta recibida, estado: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'No se pudo obtener el pronóstico';
        console.error(`[fetchForecast] Error en la respuesta:`, { status: response.status, errorData });
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log('[fetchForecast] Datos recibidos, procesando...');
      const processedData = processForecastData(data.list || []);
      console.log('[fetchForecast] Datos procesados:', processedData);
      return processedData;
    } catch (err) {
      console.error('Error al obtener el pronóstico:', err);
      return [];
    }
  }, []);

  // Cargar datos del clima
  const loadWeatherData = useCallback(async (city) => {
    console.log('Cargando datos para la ciudad:', city);
    if (!city) {
      console.error('No se proporcionó una ciudad');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Iniciando carga de datos...');
      // Obtener clima actual y pronóstico en paralelo
      const [current, forecast] = await Promise.all([
        fetchCurrentWeather(city.lat, city.lon, city.name),
        fetchForecast(city.lat, city.lon)
      ]);
      
      console.log('Datos del clima actual recibidos:', current);
      console.log('Datos del pronóstico recibidos:', forecast);
      
      setWeatherData(current);
      setForecastData(forecast);
      setLastUpdated(new Date());
      
      console.log('Cargando ciudades destacadas...');
      // Carregar cidades em destaque (excluindo a atual)
      const otherCities = CHILEAN_CITIES
        .filter(c => c.name !== city.name)
        .slice(0, 3);
      
      console.log('Otras ciudades a cargar:', otherCities);
      
      const featured = await Promise.all(
        otherCities.map(async (c) => {
          try {
            console.log(`Cargando datos para ciudad destacada: ${c.name}`);
            const weather = await fetchCurrentWeather(c.lat, c.lon, c.name);
            console.log(`Datos cargados para ${c.name}:`, weather);
            return { ...c, weather };
          } catch (err) {
            console.error(`Error al cargar datos para ${c.name}:`, err);
            return null;
          }
        })
      );
      
      console.log('Ciudades destacadas cargadas:', featured.filter(Boolean));
      setFeaturedCities(featured.filter(Boolean));
    } catch (err) {
      console.error('Error al cargar los datos del clima:', err);
      setError('Error al cargar los datos del clima. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchCurrentWeather, fetchForecast]);

  // Buscar ciudad por nombre
  const findCityByName = (name) => {
    return CHILEAN_CITIES.find(c => c.name === name);
  };

  // Manejar selección de ciudad
  const handleCitySelect = (cityName) => {
    console.log('handleCitySelect - Ciudad seleccionada:', cityName);
    if (!cityName) {
      console.log('handleCitySelect - No se proporcionó nombre de ciudad');
      return;
    }
    const city = findCityByName(cityName);
    console.log('handleCitySelect - Ciudad encontrada:', city);
    if (city) {
      console.log('handleCitySelect - Estableciendo ciudad seleccionada:', city.name);
      setSelectedCity(city);
    } else {
      console.error('handleCitySelect - No se encontró la ciudad:', cityName);
    }
  };

  // Cargar datos cuando cambia la ciudad seleccionada
  useEffect(() => {
    if (selectedCity) {
      loadWeatherData(selectedCity);
    }
  }, [selectedCity]);

  // Cargar datos de la ciudad por defecto al inicio
  useEffect(() => {
    console.log('useEffect - Cargando ciudad por defecto');
    // Seleccionar Santiago por defecto solo si no hay una ciudad seleccionada
    if (!selectedCity) {
      console.log('No hay ciudad seleccionada, buscando Santiago...');
      const defaultCity = findCityByName('Santiago');
      console.log('Ciudad por defecto encontrada:', defaultCity);
      if (defaultCity) {
        console.log('Estableciendo ciudad por defecto:', defaultCity.name);
        setSelectedCity(defaultCity);
      } else {
        console.error('No se pudo encontrar la ciudad por defecto (Santiago)');
      }
    } else {
      console.log('Ya hay una ciudad seleccionada:', selectedCity.name);
    }
  }, []); // Eliminamos selectedCity de las dependencias para evitar bucles

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
      <div className="weather-container min-h-screen bg-black text-black">
        <LoadingSpinner text="Cargando datos del clima..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-container min-h-screen bg-black text-black">
        <ErrorMessage 
          message={error} 
          onRetry={() => selectedCity && loadWeatherData(selectedCity)} 
        />
      </div>
    );
  }

  return (
    <div className="weather-container min-h-screen bg-white text-black">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      <div className="container mx-auto py-8">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Volver
        </button>
      </div>
      <main className="container mx-auto py-8">
        <div className="mb-8 max-w-2xl mx-auto w-full bg-white rounded-lg shadow">
          <label 
            htmlFor="city-select" 
            className="block text-sm font-medium text-gray-800 mb-2 font-bold"
          >
            Selecione uma cidade
          </label>
          <div className="relative">
            <select
              id="city-select"
              value={selectedCity?.name || ''}
              onChange={(e) => {
                handleCitySelect(e.target.value);
              }}
              className="block w-full pl-3 pr-10 py-3 text-base border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg shadow-sm appearance-none bg-white text-gray-900"
              aria-label="Selecione uma cidade"
              style={{
                backgroundColor: '#fff',
                borderColor: '#3b82f6',
                color: '#1f2937',
                padding: '12px',
                fontSize: '16px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              <option value="">(Selecione uma cidade)</option>
              {CITY_GROUPS.map((group, groupIndex) => (
                <optgroup key={groupIndex} label={group.label}>
                  {group.cities.map((cityName) => {
                    const city = CHILEAN_CITIES.find(c => c.name === cityName);
                    return city ? (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ) : null;
                  })}
                </optgroup>
              ))}
            </select>
            <div 
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
              style={{
                pointerEvents: 'none',
                position: 'absolute',
                top: 0,
                right: '8px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                color: '#6b7280'
              }}
            >
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        {weatherData && (
          <div className="bg-gradient-to-br from-blue-500 to-blue-400 rounded-2xl shadow-xl px-8 py-8 flex flex-col items-center w-full max-w-2xl mx-auto animate-fade-in mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-2">
              {weatherData.name}, Chile
            </h2>
            <p className="text-black text-base md:text-lg mb-3 text-center">
              {formatDate(weatherData.dt, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
            <div className="flex flex-col items-center justify-center mb-4">
              {weatherData.weather[0]?.icon && (
                <span className="mb-2">
                  <WeatherIcon iconCode={weatherData.weather[0].icon} size="text-6xl md:text-7xl" />
                </span>
              )}
              <span className="text-6xl md:text-7xl font-bold text-black leading-none">
                {Math.round(weatherData.main.temp)}°
              </span>
              <span className="text-black text-lg md:text-2xl font-medium mt-2 capitalize">
                {weatherData.weather[0]?.description ? weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1) : ''}
              </span>
            </div>
            {/* Franja de detalles completa */}
            <div className="bg-white/20 rounded-lg flex flex-wrap justify-center gap-6 px-6 py-3 mb-2 w-full max-w-xl">
              <div className="flex flex-col items-center">
                <Thermometer className="w-5 h-5 text-black mb-1" />
                <span className="text-xs text-black">Sensação</span>
                <span className="text-sm font-semibold text-black">{Math.round(weatherData.main.feels_like)}°</span>
              </div>
              <div className="flex flex-col items-center">
                <Droplet className="w-5 h-5 text-black mb-1" />
                <span className="text-xs text-black">Umidade</span>
                <span className="text-sm font-semibold text-black">{weatherData.main.humidity}%</span>
              </div>
              <div className="flex flex-col items-center">
                <Wind className="w-5 h-5 text-black mb-1" />
                <span className="text-xs text-black">Vento</span>
                <span className="text-sm font-semibold text-black">{Math.round(weatherData.wind.speed * 3.6)} km/h</span>
              </div>
              <div className="flex flex-col items-center">
                <Gauge className="w-5 h-5 text-black mb-1" />
                <span className="text-xs text-black">Pressão</span>
                <span className="text-sm font-semibold text-black">{weatherData.main.pressure} hPa</span>
              </div>
            </div>
          </div>
        )}
        {forecastData.length > 0 && (
          <div className="mb-8 animate-fade-in max-w-2xl mx-auto w-full" style={{ animationDelay: '100ms' }}>
            <h2 className="text-xl font-bold text-black mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Pronóstico extendido
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {forecastData.map((day, index) => (
                <div key={day.dt} className="weather-card p-4 text-center">
                  <h3 className="font-medium text-gray-800 mb-2">
                    {index === 0 ? 'Hoje' : formatDisplayDate(day.dt)}
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
        {featuredCities.length > 0 && (
          <div className="animate-fade-in max-w-2xl mx-auto w-full" style={{ animationDelay: '200ms' }}>
            <h2 className="text-xl font-bold text-black mb-4 flex items-center">
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
      <footer className="container mx-auto py-8 text-black">
        <p>Dados meteorológicos fornecidos por <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">OpenWeatherMap</a></p>
        <p className="mt-1">Atualizado: {lastUpdated ? format(lastUpdated, "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: es }) : 'Carregando...'}</p>
      </footer>
    </div>
  );
};

export default WeatherPage;
