import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Info, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './currency.css';

// Moedas suportadas com bandeiras e formato
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

const CurrencyPage = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('BRL');
  const [toCurrency, setToCurrency] = useState('CLP');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [rates, setRates] = useState({});
  const [lastUpdated, setLastUpdated] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  // Obter taxas de câmbio
  const fetchRates = async () => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/BRL');
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.result !== 'success' || !data.rates) {
        throw new Error('No se pudieron obtener las tasas actualizadas');
      }
      
      setRates(data.rates);
      setLastUpdated(new Date().toLocaleTimeString());
      
      toast.success('Taxas de câmbio atualizadas', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
      
    } catch (error) {
      console.error('Erro ao obter taxas de câmbio:', error);
      setIsError(true);
      toast.error('Error al cargar tasas. Intenta recargar la página.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Converter moeda
  const convertCurrency = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setConvertedAmount('0.00');
      return;
    }

    if (!rates[fromCurrency] || !rates[toCurrency]) {
      setConvertedAmount('Carregando...');
      return;
    }

    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];
    const brlAmount = parseFloat(amount) / fromRate;
    const result = brlAmount * toRate;
    
    setConvertedAmount(result.toFixed(4));
  };

  // Inverter moedas
  const swapCurrencies = () => {
    setIsSwapping(true);
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    
    setTimeout(() => {
      setIsSwapping(false);
    }, 300);
  };

  // Formatar número com separadores de milhares
  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString('pt-BR', {
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

  // Obter informações da moeda
  const getCurrencyInfo = (code) => {
    return CURRENCIES.find(c => c.code === code) || { code, name: code, symbol: '', flag: '' };
  };

  const fromCurrencyInfo = getCurrencyInfo(fromCurrency);
  const toCurrencyInfo = getCurrencyInfo(toCurrency);
  const rate = (rates[toCurrency] / rates[fromCurrency]) || 1;

  // Conversões populares
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

  const handleBack = () => {
    navigate(-1);
  };

  // Obtener tasas específicas para las tarjetas de paridad
  const brlToClpRate = rates.CLP ? (1 / rates.BRL * rates.CLP).toFixed(2) : '...';
  const clpToBrlRate = rates.BRL ? (1 / rates.CLP * rates.BRL).toFixed(6) : '...';
  const lastUpdateFormatted = lastUpdated || 'Cargando...';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <button 
            onClick={handleBack}
            className="flex items-center text-white hover:text-blue-100 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Volver
          </button>
          <h1 className="text-xl font-semibold">Conversor de Moeda</h1>
          <button 
            onClick={fetchRates}
            className="ml-auto flex items-center text-white hover:text-blue-100"
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Convertendo...' : 'Converter'}
          </button>
        </div>
      </header>

      {/* Cartões de paridade fixa */}
      <div className="container mx-auto px-4 py-4 max-w-3xl">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-gray-800">Cotações Principais</h2>
          <span className="text-sm font-medium text-gray-800">
            em: {new Date().toLocaleString('pt-BR', {
              day: '2-digit',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }).replace(',', ' às')}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Cartão BRL para CLP */}
          <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 hover:border-blue-100 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xl">🇧🇷</span>
                <span className="mx-2 text-gray-600 text-sm">1 BRL</span>
                <ArrowRight className="text-gray-400 w-4 h-4" />
                <span className="mx-2 text-xl">🇨🇱</span>
                <span className="font-semibold text-blue-600">{brlToClpRate} CLP</span>
              </div>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              <span>1 CLP = {(1 / brlToClpRate).toFixed(6)} BRL</span>
              <span className="mx-1.5">•</span>
              <span className="text-gray-400">{lastUpdateFormatted}</span>
            </div>
          </div>

          {/* Cartão CLP para BRL */}
          <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 hover:border-blue-100 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xl">🇨🇱</span>
                <span className="mx-2 text-gray-600 text-sm">100 CLP</span>
                <ArrowRight className="text-gray-400 w-4 h-4" />
                <span className="mx-2 text-xl">🇧🇷</span>
                <span className="font-semibold text-blue-600">{(100 / brlToClpRate).toFixed(4)} BRL</span>
              </div>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              <span>1 BRL = {brlToClpRate} CLP</span>
              <span className="mx-1.5">•</span>
              <span className="text-gray-400">{lastUpdateFormatted}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto p-4 max-w-3xl">
        <h2 className="text-xl font-semibold mb-3 text-gray-800 px-1">Conversor de Moeda</h2>
        {/* Card de conversión */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">De:</label>
              <div className="relative">
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {CURRENCIES.map((currency) => (
                    <option key={`from-${currency.code}`} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={swapCurrencies}
              className={`p-2 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200 transition-colors ${isSwapping ? 'transform rotate-180' : ''}`}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">A:</label>
              <div className="relative">
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {CURRENCIES.map((currency) => (
                    <option key={`to-${currency.code}`} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese el monto"
              min="0"
              step="0.01"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Resultado:</div>
            <div className="text-2xl font-bold text-blue-700">
              {formatNumber(convertedAmount || '0.00')} {toCurrency}
            </div>
            <div className="text-sm text-gray-500 mt-2">
            </div>
          </div>
        </div>

        {/* Conversiones populares */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-500" />
            Conversiones Populares
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {popularConversions.map((conv, index) => {
              const from = getCurrencyInfo(conv.from);
              const to = getCurrencyInfo(conv.to);
              const value = (rates[to.code] / rates[from.code] * parseFloat(conv.amount)).toFixed(2);
              
              return (
                <button
                  key={index}
                  onClick={() => handlePopularConversion(conv)}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="font-medium">
                    {from.flag} {conv.amount} {from.code} = {to.flag} {value} {to.code}
                  </div>
                  <div className="text-sm text-gray-500">
                    1 {from.code} = {(rates[to.code] / rates[from.code] || 0).toFixed(4)} {to.code}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Información */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Las tasas de cambio se actualizan automáticamente cada 5 minutos</p>
          {lastUpdated && (
            <p className="mt-1">Última actualización: {lastUpdated}</p>
          )}
          {isError && (
            <div className="mt-2 flex items-center justify-center text-red-500">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Error al cargar tasas. Mostrando valores locales.</span>
            </div>
          )}
        </div>
      </main>
      
      {/* Fuente de información */}
      <footer className="container mx-auto px-4 py-6 max-w-3xl text-center text-sm text-gray-500 border-t border-gray-100 mt-8">
        <p>Taxas de câmbio fornecidas por <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Exchange Rate API</a>. Atualizadas em tempo real.</p>
      </footer>
    </div>
  );
};

export default CurrencyPage;
