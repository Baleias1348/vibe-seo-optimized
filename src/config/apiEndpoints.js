import { createSafeUrl } from '../utils/urlUtils';

// URLs base de las APIs
export const EXCHANGE_RATE_API = 'https://open.er-api.com/v6/latest';

/**
 * Obtiene la URL segura para la API de tasas de cambio
 * @param {string} baseCurrency - Moneda base para la conversión
 * @returns {string} URL segura para la API de tasas de cambio
 */
export const getExchangeRateUrl = (baseCurrency = 'BRL') => {
  return createSafeUrl(`/${baseCurrency}`, EXCHANGE_RATE_API);
};

// Configuración de reintentos y timeouts
export const API_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 segundo
  timeout: 10000, // 10 segundos
};
