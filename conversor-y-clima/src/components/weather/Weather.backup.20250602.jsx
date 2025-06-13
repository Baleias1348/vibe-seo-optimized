import React, { useState, useEffect } from 'react';
import { 
  FiMapPin, 
  FiSearch, 
  FiSun, 
  FiCloud, 
  FiCloudRain, 
  FiCloudSnow, 
  FiWind, 
  FiDroplet,
  FiCalendar,
  FiChevronRight,
  FiRefreshCw
} from 'react-icons/fi';

// Configuración de la API
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

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

// Función para obtener el íono del clima según el código de OpenWeatherMap
const getWeatherIcon = (iconCode) => {
  const iconMap = {
    '01d': 'clear-sky',
    '01n': 'clear-sky-night',
    '02d': 'few-clouds',
    '02n': 'few-clouds-night',
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

const Weather = () => {
  const [city, setCity] = useState('Santiago');
  const [weatherData, setWeatherData] = useState({
    current: null,
    forecast: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showForecast, setShowForecast] = useState(false);

  // Efecto para cargar los datos del clima al montar el componente
  useEffect(() => {
    fetchWeatherData();
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
      
      if (!selectedCity) {
        throw new Error('Ciudad no encontrada');
      }

      // Obtener clima actual
      const currentResponse = await fetch(
        `${BASE_URL}/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}&appid=${API_KEY}&units=metric&lang=es`
      );

      if (!currentResponse.ok) {
        throw new Error('Error al obtener los datos del clima actual');
      }

      const currentData = await currentResponse.json();

      // Obtener pronóstico de 5 días
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?lat=${selectedCity.lat}&lon=${selectedCity.lon}&appid=${API_KEY}&units=metric&lang=es&cnt=40`
      );

      if (!forecastResponse.ok) {
        throw new Error('Error al obtener el pronóstico del tiempo');
      }

      const forecastData = await forecastResponse.json();

      // Procesar pronóstico para agrupar por día
      const dailyForecast = processDailyForecast(forecastData.list);

      setWeatherData({
        current: currentData,
        forecast: dailyForecast
      });
      
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
          date: item.dt,
          temps: [],
          weather: {}
        };
      }
      
      dailyData[dateString].temps.push(item.main.temp);
      
      // Usar el pronóstico del mediodía como representativo del día
      if (date.getHours() === 12) {
        dailyData[dateString].weather = item.weather[0];
      }
    });
    
    // Convertir a array y calcular promedios
    return Object.values(dailyData).map(day => ({
      dt: day.date,
      temp: {
        day: Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length),
        min: Math.round(Math.min(...day.temps)),
        max: Math.round(Math.max(...day.temps))
      },
      weather: day.weather
    }));
  };

    setLoading(true);
    setError(null);
    
    try {
      // Obtener coordenadas de la ciudad
      const cityCoords = CHILEAN_CITIES[cityName];
      if (!cityCoords) {
        throw new Error('Ciudad no soportada. Prueba con una de las ciudades disponibles.');
      }

      // Obtener clima actual
      const currentResponse = await fetch(
        `${BASE_URL}/weather?lat=${cityCoords.lat}&lon=${cityCoords.lon}&appid=${API_KEY}&units=metric&lang=es`
      );

      if (!currentResponse.ok) {
        const errorData = await currentResponse.json();
        throw new Error(errorData.message || 'Error al obtener datos del clima');
      }

      const currentData = await currentResponse.json();

      // Obtener pronóstico de 5 días / 3 horas
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?lat=${cityCoords.lat}&lon=${cityCoords.lon}&appid=${API_KEY}&units=metric&lang=es&cnt=40`
      );

      if (!forecastResponse.ok) {
        throw new Error('No se pudo obtener el pronóstico del tiempo');
      }

      const forecastData = await forecastResponse.json();

      // Procesar pronóstico para mostrar un pronóstico diario
      const dailyForecast = processDailyForecast(forecastData.list);

      setWeatherData({
        current: currentData,
        forecast: dailyForecast
      });
      
      setCity(cityName);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error al obtener datos del clima:', err);
      setError(`Error: ${err.message || 'No se pudo cargar la información del clima. Intenta nuevamente.'}`);
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
          date: item.dt,
          temps: [],
          weather: {}
        };
      }
      
      dailyData[dateString].temps.push(item.main.temp);
      
      // Usar el pronóstico del mediodía como representativo del día
      if (date.getHours() === 12) {
        dailyData[dateString].weather = item.weather[0];
      }
    });
    
    // Convertir a array y calcular promedios
    return Object.values(dailyData).map(day => ({
      dt: day.date,
      temp: {
        day: Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length),
        min: Math.round(Math.min(...day.temps)),
        max: Math.round(Math.max(...day.temps))
      },
      weather: day.weather
    }));
  };
    weather: [
      { id: 500, description: 'lluvia ligera' }
    ],
    wind: {
      speed: 4.8
    },
    dt: Math.floor(Date.now() / 1000)
  },
  'Viña del Mar': {
    name: 'Viña del Mar',
    sys: { country: 'CL' },
    main: {
      temp: 20,
      feels_like: 19,
      temp_min: 18,
      temp_max: 22,
      humidity: 60,
    },
    weather: [
      { id: 802, description: 'nubes dispersas' }
    ],
    wind: {
      speed: 4.0
    },
    dt: Math.floor(Date.now() / 1000)
  },
  'Antofagasta': {
    name: 'Antofagasta',
    sys: { country: 'CL' },
    main: {
      temp: 25,
      feels_like: 24,
      temp_min: 22,
      temp_max: 27,
      humidity: 35,
    },
    weather: [
      { id: 800, description: 'cielo despejado' }
    ],
    wind: {
      speed: 3.2
    },
    dt: Math.floor(Date.now() / 1000)
  }
};

const Weather = () => {
  const [city, setCity] = useState('Santiago');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ciudades populares en Chile
  const popularCities = [
    { name: 'Santiago', country: 'CL' },
    { name: 'Valparaíso', country: 'CL' },
    { name: 'Concepción', country: 'CL' },
    { name: 'Viña del Mar', country: 'CL' },
    { name: 'Antofagasta', country: 'CL' },
  ];

  // Obtener datos del clima (datos simulados)
  const fetchWeatherData = (cityName = city) => {
    setLoading(true);
    setError(null);
    
    // Simular retraso de red
    setTimeout(() => {
      try {
        const normalizedCityName = cityName.toLowerCase();
        const cityKey = Object.keys(MOCK_WEATHER_DATA).find(
          key => key.toLowerCase() === normalizedCityName
        );
        
        if (cityKey) {
          setWeatherData(MOCK_WEATHER_DATA[cityKey]);
          setCity(cityKey);
        } else {
          throw new Error('Ciudad no encontrada en los datos de prueba');
        }
      } catch (err) {
        console.error('Error al cargar datos simulados:', err);
        setError('No se pudo cargar la información del clima. Prueba con: ' + 
          Object.keys(MOCK_WEATHER_DATA).join(', '));
      } finally {
        setLoading(false);
      }
    }, 500); // Medio segundo de retraso para simular carga
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchWeatherData('Santiago');
  }, []);

  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData(city);
    }
  };

  // Obtener ícono del clima
  const getWeatherIcon = (weatherId) => {
    if (!weatherId) return <FiSun className="w-16 h-16 text-yellow-400" />;
    
    // Códigos de clima de OpenWeatherMap
    if (weatherId >= 200 && weatherId < 300) {
      return <FiCloudRain className="w-16 h-16 text-blue-400" />; // Tormenta
    } else if (weatherId >= 300 && weatherId < 400) {
      return <FiCloudRain className="w-16 h-16 text-blue-300" />; // Llovizna
    } else if (weatherId >= 500 && weatherId < 600) {
      return <FiCloudRain className="w-16 h-16 text-blue-400" />; // Lluvia
    } else if (weatherId >= 600 && weatherId < 700) {
      return <FiCloudSnow className="w-16 h-16 text-blue-200" />; // Nieve
    } else if (weatherId >= 700 && weatherId < 800) {
      return <FiCloud className="w-16 h-16 text-gray-400" />; // Atmósfera (niebla, polvo, etc.)
    } else if (weatherId === 800) {
      return <FiSun className="w-16 h-16 text-yellow-400" />; // Despejado
    } else if (weatherId > 800) {
      return <FiCloud className="w-16 h-16 text-gray-400" />; // Nublado
    } else {
      return <FiSun className="w-16 h-16 text-yellow-400" />; // Por defecto
    }
  };

  // Formatear fecha
  const formatDate = (timestamp) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(timestamp * 1000).toLocaleDateString('es-CL', options);
  };

  return (
    <div className="w-full">
      {/* Barra de búsqueda */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Buscar ciudad..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiSearch className="mr-2 h-5 w-5" />
            Buscar
          </button>
        </form>

        {/* Ciudades populares */}
        <div className="mt-4 flex flex-wrap gap-2">
          {popularCities.map((city) => (
            <button
              key={city.name}
              onClick={() => {
                setCity(city.name);
                fetchWeatherData(city.name);
              }}
              className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjeta del clima */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del clima...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : weatherData ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Encabezado con ubicación y fecha */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{weatherData.name}, {weatherData.sys.country}</h2>
                <p className="text-blue-100">{formatDate(weatherData.dt)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Sensación térmica</p>
                <p className="text-2xl font-bold">{Math.round(weatherData.main.feels_like)}°C</p>
              </div>
            </div>
          </div>

          {/* Información principal del clima */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="mr-6">
                  {getWeatherIcon(weatherData.weather[0].id)}
                </div>
                <div>
                  <p className="text-5xl font-bold text-gray-800">{Math.round(weatherData.main.temp)}°C</p>
                  <p className="text-gray-600 capitalize">{weatherData.weather[0].description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <FiDroplet className="mr-2 text-blue-400" />
                    <span>Humedad</span>
                  </div>
                  <p className="text-xl font-semibold">{weatherData.main.humidity}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <FiWind className="mr-2 text-blue-400" />
                    <span>Viento</span>
                  </div>
                  <p className="text-xl font-semibold">{Math.round(weatherData.wind.speed * 3.6)} km/h</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12l4-4m-4 4l4 4" />
                    </svg>
                    <span>Mínima</span>
                  </div>
                  <p className="text-xl font-semibold">{Math.round(weatherData.main.temp_min)}°C</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span>Máxima</span>
                  </div>
                  <p className="text-xl font-semibold">{Math.round(weatherData.main.temp_max)}°C</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Weather;
