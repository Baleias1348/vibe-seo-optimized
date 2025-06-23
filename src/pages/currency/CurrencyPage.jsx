import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
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

  // Función para obtener tasas de cambio con reintentos
  const fetchRates = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    
    let lastError;
    
    // Intentar hasta el número máximo de reintentos
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
        
        const response = await fetch(getExchangeRateUrl('BRL'), {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          },
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.result !== 'success' || !data.rates) {
          throw new Error('No se pudieron obtener las tasas actualizadas');
        }
        
        // Si llegamos aquí, la solicitud fue exitosa
        setRates(data.rates);
        setLastUpdated(new Date().toLocaleTimeString());
        setIsError(false);
        
        // Mostrar notificación de éxito
        toast.success('Tasas de cambio actualizadas', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        return; // Salir de la función con éxito
        
      } catch (error) {
        lastError = error;
        console.error(`Intento ${attempt} fallido:`, error);
        
        // Si no es el último intento, esperar antes de reintentar
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay));
        }

    try {
      // Leer variables de entorno
      const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
      const apiBaseUrl = import.meta.env.VITE_EXCHANGE_API_URL || 'https://v6.exchangerate-api.com/v6';
      const baseCurrency = fromCurrency || 'USD'; // Usa la moneda seleccionada como base
      
      const url = `${apiBaseUrl}/${apiKey}/latest/${baseCurrency}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
    } catch (error) {
      // Si llegamos aquí, todos los intentos fallaron
      setIsError(true);
      
      // Mostrar notificación de error
      toast.error(`Error al obtener tasas: ${error.message || 'Error desconocido'}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      console.error('Error al obtener tasas:', error);
    }
  }, [fromCurrency]);
    
    // Mostrar notificación de error
    toast.error(`Error al obtener tasas: ${lastError?.message || 'Error desconocido'}`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    console.error('Todos los intentos fallaron:', lastError);
  }, []);

  // Efecto para cargar las tasas al montar el componente
  useEffect(() => {
    fetchRates();
  }, [fetchRates]);
  
  // Asegurarse de que siempre se quite el estado de carga
  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

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
    const result = brlAmount import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
 toRate;
    
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
    const interval = setInterval(fetchRates, 5 import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
 60 import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
 1000);
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
  const brlToClpRate = rates.CLP ? (1 / rates.BRL import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
 rates.CLP).toFixed(2) : '...';
  const clpToBrlRate = rates.BRL ? (1 / rates.CLP import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
 rates.BRL).toFixed(6) : '...';
  const lastUpdateFormatted = lastUpdated || 'Cargando...';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
 Header import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
/}
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

      {/import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
 Cartões de paridade fixa import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
/}
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
          {/import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
 Cartão BRL para CLP import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
/}
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

          {/import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
 Cartão CLP para BRL import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
/}
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
        {/import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
 Card de conversión import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
/}
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

        {/import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
 Conversiones populares import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
/}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-500" />
            Conversiones Populares
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {popularConversions.map((conv, index) => {
              const from = getCurrencyInfo(conv.from);
              const to = getCurrencyInfo(conv.to);
              const value = (rates[to.code] / rates[from.code] import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
 parseFloat(conv.amount)).toFixed(2);
              
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

        {/import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
 Información import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
/}
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
      
      {/import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
 Fuente de información import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_CONFIG = {
  endpoint: "https://v6.exchangerate-api.com/v6/",
  maxRetries: 3,
  retryDelay: 1000, // ms
};

const CurrencyPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch supported currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      setIsError(false);
      let lastError;
      for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
        try {
          // Leer variables de entorno
          const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
          if (!apiKey) {
            throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
          }
          const url = `${API_CONFIG.endpoint}${apiKey}/codes`;
          const response = await axios.get(url);
          setCurrencies(response.data.supported_codes);
          setIsLoading(false);
          return;
        } catch (error) {
          lastError = error;
          if (attempt < API_CONFIG.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
          }
        }
      }
      setIsError(true);
      setIsLoading(false);
      toast.error(
        `Error loading currencies: ${lastError?.message || "Unknown error"}`
      );
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const handleConvert = async () => {
    setIsLoading(true);
    setIsError(false);
    let lastError;
    for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
        if (!apiKey) {
          throw new Error("No API key provided in VITE_EXCHANGE_API_KEY");
        }
        const url = `${API_CONFIG.endpoint}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
        const response = await axios.get(url);
        setConverted(response.data.conversion_result);
        setIsLoading(false);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < API_CONFIG.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, API_CONFIG.retryDelay));
        }
      }
    }
    setIsError(true);
    setIsLoading(false);
    toast.error(
      `Error converting currency: ${lastError?.message || "Unknown error"}`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <span className="self-center">to</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {currencies.map(([code, name]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Convert
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">An error occurred. Please try again.</p>}
      {converted !== null && (
        <div className="mt-4 text-lg">
          Result: <span className="font-bold">{converted}</span> {toCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyPage;
/}
      <footer className="container mx-auto px-4 py-6 max-w-3xl text-center text-sm text-gray-500 border-t border-gray-100 mt-8">
        <p>Taxas de câmbio fornecidas por <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Exchange Rate API</a>. Atualizadas em tempo real.</p>
      </footer>
    </div>
  );
};

export default CurrencyPage;
