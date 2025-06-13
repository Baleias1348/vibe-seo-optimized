import React, { useState, useEffect } from 'react';
import { 
  FiSun, 
  FiCloud, 
  FiCloudRain, 
  FiCloudSnow, 
  FiWind, 
  FiDroplet,
  FiRefreshCw
} from 'react-icons/fi';
import logo from '../../assets/images/logo.svg';

// Configuración de la API
console.log('Variables de entorno:', import.meta.env);
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const BASE_URL = import.meta.env.VITE_OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';

if (!API_KEY) {
  console.error('Error: No se encontró la clave de la API de OpenWeatherMap');
  console.log('Asegúrate de que el archivo .env contenga VITE_OPENWEATHER_API_KEY');
}

console.log('URL base de la API:', BASE_URL);

// Coordenadas de las principales ciudades chilenas
const CHILEAN_CITIES = [
  { name: 'Santiago', lat: -33.4489, lon: -70.6693 },
  { name: 'Valparaíso', lat: -33.0458, lon: -71.6197 },
  { name: 'Concepción', lat: -36.8269, lon: -73.0503 },
  { name: 'Viña del Mar', lat: -33.0245, lon: -71.5518 },
  { name: 'Antofagasta', lat: -23.6509, lon: -70.4000 },
  { name: 'La Serena', lat: -29.9027, lon: -71.2519 },
  { name: 'Rancagua', lat: -34.1706, lon: -70.7444 },
  { name: 'Temuco', lat: -38.7359, lon: -72.5904 },
  { name: 'Puerto Montt', lat: -41.4689, lon: -72.9411 },
  { name: 'Arica', lat: -18.4783, lon: -70.3126 }
];

// Función para obtener el ícono del clima según el código de OpenWeatherMap
const getWeatherIcon = (iconCode) => {
  const iconMap = {
    '01d': 'clear-sky',
    '01n': 'clear-sky',
    '02d': 'few-clouds',
    '02n': 'few-clouds',
    '03d': 'scattered-clouds',
    '03n': 'scattered-clouds',
    '04d': 'broken-clouds',
    '04n': 'broken-clouds',
    '09d': 'shower-rain',
    '09n': 'shower-rain',
    '10d': 'rain',
    '10n': 'rain',
    '11d': 'thunderstorm',
    '11n': 'thunderstorm',
    '13d': 'snow',
    '13n': 'snow',
    '50d': 'mist',
    '50n': 'mist',
  };
  return iconMap[iconCode] || 'clear-sky';
};

// Componente principal del clima
const Weather = () => {
  const [city, setCity] = useState('Santiago');
  const [weatherData, setWeatherData] = useState({
    current: null,
    forecast: [],
    featured: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Función para obtener el clima de una ciudad
  const fetchCityWeather = async (cityData) => {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${cityData.lat}&lon=${cityData.lon}&appid=${API_KEY}&units=metric&lang=es`
      );

      if (!response.ok) {
        throw new Error('Error al obtener los datos del clima');
      }

      return await response.json();
    } catch (err) {
      console.error(`Error al obtener datos del clima para ${cityData.name}:`, err);
      return null;
    }
  };

  // Función para obtener el pronóstico de una ciudad
  const fetchCityForecast = async (cityData) => {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?lat=${cityData.lat}&lon=${cityData.lon}&appid=${API_KEY}&units=metric&lang=es`
      );

      if (!response.ok) {
        throw new Error('Error al obtener el pronóstico extendido');
      }

      const data = await response.json();
      return processDailyForecast(data.list || []);
    } catch (err) {
      console.error(`Error al obtener pronóstico para ${cityData.name}:`, err);
      return [];
    }
  };

  // Actualizar datos de ciudades destacadas
  const updateFeaturedCities = async () => {
    const featuredCities = CHILEAN_CITIES.slice(0, 4);
    const featuredData = {};
    
    for (const cityData of featuredCities) {
      const data = await fetchCityWeather(cityData);
      if (data) {
        featuredData[cityData.name] = data;
      }
    }
    
    setWeatherData(prev => ({
      ...prev,
      featured: featuredData
    }));
  };

  // Efecto para cargar los datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      await updateFeaturedCities();
      await fetchWeatherData();
    };
    
    loadData();
  }, []);

  // Obtener datos del clima actual y pronóstico
  const fetchWeatherData = async (cityName = city) => {
    if (!API_KEY) {
      setError('Error: No se ha configurado la clave de la API de OpenWeatherMap');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Buscar la ciudad seleccionada
      const selectedCity = CHILEAN_CITIES.find(c => c.name === cityName) || CHILEAN_CITIES[0];
      
      // Obtener clima actual
      const currentData = await fetchCityWeather(selectedCity);
      if (!currentData) throw new Error('No se pudieron obtener los datos del clima actual');
      
      // Obtener pronóstico extendido
      const forecastList = await fetchCityForecast(selectedCity);
      
      setWeatherData(prev => ({
        ...prev,
        current: currentData,
        forecast: forecastList
      }));
      
      setCity(selectedCity.name);
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error('Error al obtener datos del clima:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Procesar pronóstico para agrupar por día
  const processDailyForecast = (forecastList) => {
    const dailyData = {};
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateString = date.toLocaleDateString('es-CL');
      
      if (!dailyData[dateString]) {
        dailyData[dateString] = {
          date: date,
          temps: [],
          weather: {},
          humidity: [],
          wind: []
        };
      }
      
      dailyData[dateString].temps.push(item.main.temp);
      dailyData[dateString].humidity.push(item.main.humidity);
      dailyData[dateString].wind.push(item.wind.speed);
      
      // Usar el pronóstico del mediodía como representativo del día
      if (date.getHours() === 12) {
        dailyData[dateString].weather = item.weather[0];
      }
    });
    
    // Convertir a array y calcular promedios
    return Object.values(dailyData).map(day => ({
      date: day.date,
      temp: Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length),
      temp_min: Math.min(...day.temps),
      temp_max: Math.max(...day.temps),
      humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      wind: Math.round(day.wind.reduce((a, b) => a + b, 0) / day.wind.length * 10) / 10,
      weather: day.weather
    }));
  };

  // Renderizar ícono del clima
  const renderWeatherIcon = (weatherCode, size = 'text-4xl') => {
    const weatherIcons = {
      'clear-sky': <FiSun className={`${size} text-yellow-400`} />,
      'few-clouds': <FiCloud className={`${size} text-gray-400`} />,
      'scattered-clouds': <FiCloud className={`${size} text-gray-500`} />,
      'broken-clouds': <FiCloud className={`${size} text-gray-600`} />,
      'shower-rain': <FiCloudRain className={`${size} text-blue-400`} />,
      'rain': <FiCloudRain className={`${size} text-blue-500`} />,
      'thunderstorm': <FiCloudRain className={`${size} text-purple-600`} />,
      'snow': <FiCloudSnow className={`${size} text-blue-200`} />,
      'mist': <FiCloud className={`${size} text-gray-400`} />
    };
    
    return weatherIcons[getWeatherIcon(weatherCode)] || <FiSun className={`${size} text-yellow-400`} />;
  };

  // Formatear fecha en español
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('es-CL', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Manejar cambio de ciudad
  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setCity(newCity);
    fetchWeatherData(newCity);
  };

  // Mostrar estado de carga inicial
  if (loading && !weatherData.current) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Mostrar mensaje de error
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => fetchWeatherData()}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Mostrar carga durante actualización
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Encabezado */}
        <div className="bg-black text-white rounded-t-lg p-6">
          <div className="flex flex-col items-center">
            <img src={logo} alt="Logo de la empresa" className="h-16 mb-4" />
            <h1 className="text-3xl font-bold text-center">Clima en Chile</h1>
          </div>
        </div>
        
        {/* Contenido */}
        <div className="bg-white p-6 rounded-b-lg shadow-md">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3">Actualizando datos del clima...</span>
          </div>
        </div>
      </div>
    );
  }

  // Ciudades destacadas (primeras 4 ciudades de la lista)
  const featuredCities = CHILEAN_CITIES.slice(0, 4);

  // Renderizar datos del clima
  return (
    <div className="max-w-4xl mx-auto">
      {/* Encabezado */}
      <div className="bg-black text-white rounded-t-lg p-6">
        <div className="flex justify-between items-center">
          <img src={logo} alt="Logo de la empresa" className="h-12" />
          <h1 className="text-3xl font-bold">Clima en Chile</h1>
        </div>
      </div>
      
      {/* Contenido */}
      <div className="bg-white p-6 rounded-b-lg shadow-md">
        {/* Tarjetas de ciudades destacadas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {featuredCities.map((cityData) => {
            const cityWeather = weatherData.featured[cityData.name];
            const isSelected = city === cityData.name;
            
            return (
              <div 
                key={cityData.name}
                className={`bg-blue-600 text-white rounded-lg p-2 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-blue-300' : ''
                }`}
                onClick={() => {
                  setCity(cityData.name);
                  fetchWeatherData(cityData.name);
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-sm text-white">{cityData.name}</h3>
                    {cityWeather?.main && (
                      <p className="text-lg font-bold text-white">
                        {Math.round(cityWeather.main.temp)}°C
                      </p>
                    )}
                  </div>
                  {cityWeather?.weather?.[0]?.icon && (
                    <div className="text-2xl">
                      {renderWeatherIcon(cityWeather.weather[0].icon, 'text-2xl')}
                    </div>
                  )}
                </div>
                {cityWeather?.main && (
                  <div className="mt-1 text-xs text-blue-100">
                    <p>Máx: {Math.round(cityWeather.main.temp_max)}°</p>
                    <p>Mín: {Math.round(cityWeather.main.temp_min)}°</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selector de ciudad */}
        <div className="mb-6">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar ciudad:
          </label>
          <select
            id="city"
            value={city}
            onChange={handleCityChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {CHILEAN_CITIES.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Clima actual */}
        {weatherData.current && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {city}, {weatherData.current.sys.country}
              </h2>
              <button 
                onClick={() => fetchWeatherData()}
                className="text-blue-500 hover:text-blue-700"
                title="Actualizar"
              >
                <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start">
            {/* Temperatura actual */}
            <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
              <div className="flex items-center justify-center md:justify-start">
                <div className="text-6xl font-bold text-gray-800">
                  {Math.round(weatherData.current.main.temp)}°C
                </div>
                <div className="ml-4">
                  {weatherData.current.weather[0]?.icon && (
                    <div className="text-5xl">
                      {renderWeatherIcon(weatherData.current.weather[0].icon, 'text-5xl')}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-lg text-gray-600 capitalize">
                {weatherData.current.weather[0]?.description}
              </div>
              <div className="text-sm text-gray-500">
                Sensación térmica: {Math.round(weatherData.current.main.feels_like)}°C
              </div>
            </div>

            {/* Detalles adicionales */}
            <div className="bg-gray-50 rounded-lg p-4 w-full md:w-64">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-gray-500 text-sm">Mínima</div>
                  <div className="text-lg font-semibold">{Math.round(weatherData.current.main.temp_min)}°C</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-sm">Máxima</div>
                  <div className="text-lg font-semibold">{Math.round(weatherData.current.main.temp_max)}°C</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-sm">Humedad</div>
                  <div className="text-lg font-semibold flex items-center justify-center">
                    <FiDroplet className="text-blue-400 mr-1" />
                    {weatherData.current.main.humidity}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-sm">Viento</div>
                  <div className="text-lg font-semibold flex items-center justify-center">
                    <FiWind className="text-blue-400 mr-1" />
                    {Math.round(weatherData.current.wind.speed * 3.6)} km/h
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pronóstico extendido */}
      {weatherData.forecast.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Pronóstico para los próximos días</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {weatherData.forecast.slice(0, 5).map((day, index) => (
              <div key={index} className="border rounded-lg p-4 text-center">
                <div className="font-medium text-gray-700">
                  {day.date.toLocaleDateString('es-CL', { weekday: 'short' })}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  {day.date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                </div>
                <div className="my-2">
                  {day.weather?.icon && renderWeatherIcon(day.weather.icon, 'text-3xl')}
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {day.weather?.description || 'N/A'}
                </div>
                <div className="mt-2">
                  <span className="font-semibold">{Math.round(day.temp)}°C</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {Math.round(day.temp_min)}° / {Math.round(day.temp_max)}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

        {/* Última actualización */}
        {lastUpdated && (
          <div className="text-xs text-gray-500 text-center mt-4">
            Última actualización: {formatDate(lastUpdated)}
          </div>
        )}
        
        {/* Atribución a OpenWeatherMap */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            Fuente:{" "}
            <a 
              href="https://openweathermap.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              OpenWeatherMap
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Weather;
