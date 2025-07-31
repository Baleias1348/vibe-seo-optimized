// ===== WEATHER TICKER CLASS =====
class WeatherTicker {
  constructor() {
    this.tickerElement = document.getElementById('news-ticker');
    this.tickerContent = null;
    this.weatherData = {};
    this.exchangeRates = {};
    this.isRunning = false;
    this.refreshInterval = null;
    
    // Ciudades principales de Chile (igual que en React)
    this.cities = [
      { name: 'Santiago', q: 'Santiago,CL' },
      { name: 'Valparaíso', q: 'Valparaiso,CL' },
      { name: 'Viña del Mar', q: 'Vina del Mar,CL' },
      { name: 'Concepción', q: 'Concepcion,CL' },
      { name: 'La Serena', q: 'La Serena,CL' }
    ];

    this.init();
  }

  init() {
    if (!this.tickerElement) {
      console.error('Ticker element not found');
      return;
    }

    this.tickerContent = this.tickerElement.querySelector('.ticker-content');
    if (!this.tickerContent) {
      console.error('Ticker content element not found');
      return;
    }

    console.log('🎬 Ticker initialized');
  }

  async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    // Show loading state
    this.showLoading();
    
    // Fetch initial data
    await this.fetchAllData();
    
    // Update ticker display
    this.updateTickerDisplay();
    
    // Start refresh interval (every 5 minutes)
    this.refreshInterval = setInterval(() => {
      this.fetchAllData();
    }, 5 * 60 * 1000);

    console.log('▶️ Ticker started');
  }

  stop() {
    this.isRunning = false;
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    console.log('⏹️ Ticker stopped');
  }

  async refresh() {
    if (!this.isRunning) return;
    
    console.log('🔄 Refreshing ticker data...');
    await this.fetchAllData();
    this.updateTickerDisplay();
  }

  showLoading() {
    if (this.tickerContent) {
      this.tickerContent.innerHTML = `
        <div class="ticker-loading">
          <div class="loading-dots">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
          </div>
          <span style="margin-left: 10px;">Carregando informações...</span>
        </div>
      `;
    }
  }

  async fetchAllData() {
    try {
      // Fetch weather and exchange data in parallel
      const [weatherResult, exchangeResult] = await Promise.allSettled([
        this.fetchWeatherData(),
        this.fetchExchangeRates()
      ]);

      if (weatherResult.status === 'fulfilled') {
        this.weatherData = weatherResult.value;
      } else {
        console.error('Weather fetch failed:', weatherResult.reason);
      }

      if (exchangeResult.status === 'fulfilled') {
        this.exchangeRates = exchangeResult.value;
      } else {
        console.error('Exchange rates fetch failed:', exchangeResult.reason);
      }

    } catch (error) {
      console.error('Error fetching ticker data:', error);
    }
  }

  async fetchWeatherData() {
    const weatherData = {};
    
    // Fetch weather for each city
    for (const city of this.cities) {
      try {
        if (window.weatherAPI) {
          const data = await window.weatherAPI.getWeatherForCity(city.name);
          weatherData[city.name] = data.temperature;
        } else {
          weatherData[city.name] = await this.fetchCityWeather(city);
        }
      } catch (error) {
        console.error(`Error fetching weather for ${city.name}:`, error);
        weatherData[city.name] = '--';
      }
    }

    return weatherData;
  }

  async fetchCityWeather(city) {
    // Mock weather data - replace with actual API call
    const mockTemps = {
      'Santiago': Math.floor(Math.random() * 10) + 15,
      'Valparaíso': Math.floor(Math.random() * 8) + 12,
      'Viña del Mar': Math.floor(Math.random() * 8) + 12,
      'Concepción': Math.floor(Math.random() * 12) + 8,
      'La Serena': Math.floor(Math.random() * 8) + 18
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return mockTemps[city.name] || '--';
  }

  async fetchExchangeRates() {
    try {
      if (window.exchangeRateAPI) {
        return await window.exchangeRateAPI.getExchangeRates();
      } else {
        // Fallback to mock data
        const mockRates = {
          brl_clp: 150.25 + (Math.random() - 0.5) * 10,
          clp_brl: 0.0067 + (Math.random() - 0.5) * 0.001,
          brl_usd: 0.18 + (Math.random() - 0.5) * 0.02,
          usd_brl: 5.55 + (Math.random() - 0.5) * 0.5,
          clp_usd: 0.0012 + (Math.random() - 0.5) * 0.0002,
          usd_clp: 833.33 + (Math.random() - 0.5) * 50
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
        return mockRates;
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      return {};
    }
  }

  updateTickerDisplay() {
    if (!this.tickerContent) return;

    const tickerItems = this.generateTickerItems();
    
    this.tickerContent.innerHTML = tickerItems.map(item => `
      <div class="ticker-item ${item.className || ''}">
        <span class="ticker-icon">${item.icon}</span>
        <span class="ticker-text">${item.text}</span>
      </div>
    `).join('');

    console.log('📺 Ticker display updated');
  }

  generateTickerItems() {
    const items = [];
    
    // Add date and time info
    items.push(this.getDateTimeItem());
    
    // Add weather items
    items.push(...this.getWeatherItems());
    
    // Add exchange rate items
    items.push(...this.getExchangeItems());

    return items;
  }

  getDateTimeItem() {
    const now = new Date();
    
    // Format date in Portuguese
    const dateOptions = { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      locale: 'pt-BR'
    };
    const formattedDate = now.toLocaleDateString('pt-BR', dateOptions);
    
    // Brazil time (same as local)
    const brazilTime = now.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Chile time (1 hour behind)
    const chileTime = new Date(now.getTime() - 60 * 60 * 1000).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    return {
      icon: '🌅',
      text: `Informação do dia: ${formattedDate}, Hora do Brasil (São Paulo): ${brazilTime}, Hora do Chile (Santiago): ${chileTime}`,
      className: 'ticker-time'
    };
  }

  getWeatherItems() {
    return this.cities.map(city => ({
      icon: '☁️',
      text: `${city.name}: ${this.weatherData[city.name] || '--'}°C`,
      className: 'ticker-weather'
    }));
  }

  getExchangeItems() {
    const rates = [
      { 
        key: 'brl_clp', 
        icon: '💱', 
        text: `BRL → CLP: ${this.formatCurrency(this.exchangeRates.brl_clp, 'CLP')}` 
      },
      { 
        key: 'clp_brl', 
        icon: '💱', 
        text: `CLP → BRL: ${this.formatCurrency(this.exchangeRates.clp_brl, 'BRL')}` 
      },
      { 
        key: 'brl_usd', 
        icon: '💵', 
        text: `BRL → USD: ${this.formatCurrency(this.exchangeRates.brl_usd, 'USD')}` 
      },
      { 
        key: 'usd_brl', 
        icon: '💵', 
        text: `USD → BRL: ${this.formatCurrency(this.exchangeRates.usd_brl, 'BRL')}` 
      },
      { 
        key: 'clp_usd', 
        icon: '💵', 
        text: `CLP → USD: ${this.formatCurrency(this.exchangeRates.clp_usd, 'USD')}` 
      },
      { 
        key: 'usd_clp', 
        icon: '💵', 
        text: `USD → CLP: ${this.formatCurrency(this.exchangeRates.usd_clp, 'CLP')}` 
      }
    ];

    return rates.map(rate => ({
      icon: rate.icon,
      text: rate.text,
      className: 'ticker-currency'
    }));
  }

  formatCurrency(value, currency) {
    if (!value || isNaN(value)) return '--';

    const locales = {
      'BRL': 'pt-BR',
      'CLP': 'es-CL', 
      'USD': 'en-US'
    };

    try {
      return new Intl.NumberFormat(locales[currency] || 'pt-BR', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: currency === 'CLP' ? 0 : 2,
        maximumFractionDigits: currency === 'CLP' ? 0 : 4
      }).format(value);
    } catch (error) {
      return `${value.toFixed(2)} ${currency}`;
    }
  }

  // Public methods for external control
  pause() {
    if (this.tickerContent) {
      this.tickerContent.style.animationPlayState = 'paused';
    }
  }

  resume() {
    if (this.tickerContent) {
      this.tickerContent.style.animationPlayState = 'running';
    }
  }

  // Method to update weather data from external source
  updateWeatherData(cityName, temperature) {
    if (this.weatherData) {
      this.weatherData[cityName] = temperature;
      this.updateTickerDisplay();
    }
  }

  // Method to update exchange rates from external source
  updateExchangeRates(rates) {
    if (this.exchangeRates) {
      Object.assign(this.exchangeRates, rates);
      this.updateTickerDisplay();
    }
  }
}

// ===== EXPORT TO GLOBAL SCOPE =====
window.WeatherTicker = WeatherTicker;

// ===== AUTO-INITIALIZE IF TICKER EXISTS =====
document.addEventListener('DOMContentLoaded', () => {
  const tickerElement = document.getElementById('news-ticker');
  if (tickerElement && !window.globalTicker) {
    window.globalTicker = new WeatherTicker();
    console.log('🎬 Global ticker instance created');
  }
});
