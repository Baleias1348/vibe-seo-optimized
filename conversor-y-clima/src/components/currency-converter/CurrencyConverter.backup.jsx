import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiArrowRight, FiInfo, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Monedas soportadas con banderas y formato
const CURRENCIES = [
  { code: 'BRL', name: 'Real Brasileño', symbol: 'R$', flag: '🇧🇷' },
  { code: 'CLP', name: 'Peso Chileno', symbol: '$', flag: '🇨🇱' },
  { code: 'USD', name: 'Dólar Estadounidense', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$', flag: '🇲🇽' },
  { code: 'PEN', name: 'Sol Peruano', symbol: 'S/', flag: '🇵🇪' },
  { code: 'ARS', name: 'Peso Argentino', symbol: '$', flag: '🇦🇷' },
  { code: 'GBP', name: 'Libra Esterlina', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Yen Japonés', symbol: '¥', flag: '🇯🇵' },
  { code: 'CNY', name: 'Yuan Chino', symbol: '¥', flag: '🇨🇳' },
];

// Tasas de cambio por defecto (se actualizarán desde la API)
const DEFAULT_RATES = {
  BRL: 1,
  CLP: 890,
  USD: 4.95,
  EUR: 4.55,
  MXN: 16.5,
  PEN: 3.7,
  ARS: 820,
  GBP: 0.79,
  JPY: 151.5,
  CNY: 7.23
};

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('BRL');
  const [toCurrency, setToCurrency] = useState('CLP');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [lastUpdated, setLastUpdated] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Obtener tasas de cambio
  const fetchRates = async () => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/BRL');
      
      if (!response.ok) {
        throw new Error('Error al obtener las tasas de cambio');
      }
      
      const data = await response.json();
      
      if (!data.rates) {
        throw new Error('Formato de respuesta inesperado');
      }
      
      const newRates = {};
      CURRENCIES.forEach(currency => {
        if (data.rates[currency.code]) {
          newRates[currency.code] = data.rates[currency.code];
        } else {
          newRates[currency.code] = DEFAULT_RATES[currency.code] || 1;
        }
      });
      
      setRates(newRates);
      setLastUpdated(new Date().toLocaleTimeString());
      
      toast.success('Tasas de cambio actualizadas', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error('Error al obtener tasas de cambio:', error);
      setIsError(true);
      toast.error('Usando tasas de cambio locales (podrían no estar actualizadas)', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Convertir moneda
  const convertCurrency = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setConvertedAmount('0.00');
      return;
    }

    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;
    const brlAmount = parseFloat(amount) / fromRate;
    const result = brlAmount * toRate;
    
    setConvertedAmount(result.toFixed(4));
  };

  // Intercambiar monedas
  const swapCurrencies = () => {
    setIsSwapping(true);
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    
    setTimeout(() => {
      setIsSwapping(false);
    }, 300);
  };

  // Formatear número con separadores de miles
  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
  };

  // Efectos
  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency, toCurrency, rates]);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Obtener información de la moneda
  const getCurrencyInfo = (code) => {
    return CURRENCIES.find(c => c.code === code) || { code, name: code, symbol: '', flag: '' };
  };

  const fromCurrencyInfo = getCurrencyInfo(fromCurrency);
  const toCurrencyInfo = getCurrencyInfo(toCurrency);
  const rate = (rates[toCurrency] / rates[fromCurrency]) || 1;

  // Conversiones populares
  const popularConversions = [
    { from: 'BRL', to: 'CLP', amount: '1' },
    { from: 'BRL', to: 'USD', amount: '1' },
    { from: 'BRL', to: 'EUR', amount: '1' },
    { from: 'USD', to: 'CLP', amount: '1' },
  ];

  const handlePopularConversion = (conv) => {
    setFromCurrency(conv.from);
    setToCurrency(conv.to);
    setAmount(conv.amount);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ordenar monedas
  const sortedCurrencies = [...CURRENCIES].sort((a, b) => {
    if (a.code === 'BRL') return -1;
    if (b.code === 'BRL') return 1;
    if (a.code === 'CLP') return -1;
    if (b.code === 'CLP') return 1;
    return a.code.localeCompare(b.code);
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Encabezado con logo */}
      <div className="bg-black text-white rounded-t-lg p-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center mb-4 bg-white rounded-full p-2">
            <FiDollarSign className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-center">Conversor de Moneda</h1>
          <p className="text-gray-300 mt-2">Convierte entre diferentes monedas con tasas actualizadas</p>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="bg-white p-6 rounded-b-lg shadow-md">
        {/* Conversiones populares */}
        <div className="mb-8">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Conversiones populares</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {popularConversions
            .filter(conv => conv.from !== conv.to)
            .map((conv, index) => {
              const fromInfo = getCurrencyInfo(conv.from);
              const toInfo = getCurrencyInfo(conv.to);
              return (
                <button
                  key={`popular-${index}`}
                  onClick={() => handlePopularConversion(conv)}
                  className="bg-white border border-gray-200 rounded-lg p-3 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">
                      {fromInfo.flag} {conv.from}
                    </span>
                    <FiArrowRight className="h-4 w-4 text-gray-400 mx-1" />
                    <span className="text-sm font-medium text-gray-800">
                      {toInfo.flag} {conv.to}
                    </span>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-base font-semibold text-blue-600">
                        {conv.amount} {conv.from} = {((rates[conv.to] / rates[conv.from]) * parseFloat(conv.amount) || 0).toFixed(2)} {conv.to}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      </div>
      
      {/* Contenedor principal */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Sección de actualización */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">Conversor de Monedas</h2>
          <div className="flex items-center">
            {lastUpdated && (
              <span className="text-xs text-gray-500 mr-3">
                Actualizado: {lastUpdated}
              </span>
            )}
            <button
              onClick={fetchRates}
              disabled={isLoading}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${isLoading ? 'animate-spin' : ''}`}
              title="Actualizar tasas"
            >
              <FiRefreshCw className={`h-5 w-5 ${isLoading ? 'text-blue-500' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>

        {/* Mensaje de error */}
        {isError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error al cargar tasas actualizadas. Estás viendo tasas de cambio locales que podrían no estar actualizadas.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Monto a convertir */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Monto a convertir
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {fromCurrencyInfo.symbol}
                </span>
              </div>
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setAmount(value);
                  }
                }}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 0) {
                    setAmount(value.toString());
                  } else {
                    setAmount('1');
                  }
                }}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md h-12 text-lg"
                placeholder="0.00"
                inputMode="decimal"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 h-full py-0 pl-2 pr-8 border-transparent bg-transparent text-gray-700 sm:text-sm rounded-r-md"
                >
                  {sortedCurrencies.map((currency) => (
                    <option key={`from-${currency.code}`} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Botón de intercambio */}
          <div className="flex justify-center my-4">
            <button
              onClick={swapCurrencies}
              disabled={isLoading || isSwapping}
              className={`p-2 rounded-full bg-gray-100 border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${isSwapping ? 'rotate-180' : ''}`}
              title="Intercambiar monedas"
            >
              <FiArrowRight className="h-5 w-5" />
            </button>
          </div>

          {/* Resultado de la conversión */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label htmlFor="convertedAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Resultado de la conversión
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {toCurrencyInfo.symbol}
                </span>
              </div>
              <input
                type="text"
                id="convertedAmount"
                value={formatNumber(convertedAmount)}
                readOnly
                className="bg-gray-50 border border-gray-300 text-gray-900 block w-full pl-7 pr-12 sm:text-sm rounded-md h-12 text-lg font-medium"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 h-full py-0 pl-2 pr-8 border-transparent bg-transparent text-gray-700 sm:text-sm rounded-r-md"
                >
                  {CURRENCIES.filter(c => c.code !== fromCurrency).map((currency) => (
                    <option key={`to-${currency.code}`} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tasa de cambio */}
          <div className="text-center text-sm text-gray-600 mt-6">
            <p className="text-lg font-medium text-gray-800">
              1 {fromCurrency} = {rate.toFixed(6)} {toCurrency}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tasa de cambio actualizada el {new Date().toLocaleDateString()}
            </p>
          </div>



          {/* Información adicional */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-start">
              <FiInfo className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Las tasas de cambio se actualizan automáticamente. Las conversiones son aproximadas y pueden variar según la entidad financiera.
              </p>
            </div>
            
            {/* Atribución a ExchangeRate-API */}
            <div className="mt-4 text-center text-xs text-gray-500">
              <p>
                Tasas de cambio proporcionadas por{' '}
                <a
                  href="https://www.exchangerate-api.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  ExchangeRate-API
                </a>
              </p>
            </div>
          </div>
        </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
