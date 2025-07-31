// ===== SUPABASE CLIENT CONFIGURATION =====
class SupabaseClient {
  constructor() {
    // Obtener configuración desde config.js
    const config = window.CONFIG?.getSupabaseConfig() || {};
    this.supabaseUrl = config.url;
    this.supabaseKey = config.anonKey;
    this.client = null;
    
    // Usar datos simulados si no hay configuración válida
    this.useSimulatedData = !this.supabaseUrl || 
                           this.supabaseUrl === 'YOUR_SUPABASE_URL' ||
                           window.CONFIG?.DEV?.USE_SIMULATED_DATA;
    
    this.init();
  }

  async init() {
    if (this.useSimulatedData) {
      console.log('📊 Supabase client initialized with simulated data');
      return;
    }

    try {
      // Verificar que la librería de Supabase esté disponible
      if (typeof window.supabase === 'undefined') {
        throw new Error('Supabase library not loaded');
      }
      
      // Inicializar cliente de Supabase
      this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
      
      // Test de conexión
      const { data, error } = await this.client.from('content_boxes').select('count').limit(1);
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = tabla no existe, pero conexión OK
        throw error;
      }
      
      console.log('✅ Supabase client connected successfully');
    } catch (error) {
      console.warn('⚠️ Supabase connection failed, using simulated data:', error.message);
      this.useSimulatedData = true;
      this.client = null;
    }
  }

  // ===== CONTENT BOXES METHODS =====
  async getContentBox(boxId) {
    if (this.useSimulatedData) {
      return this.simulateContentBox(boxId);
    }

    try {
      const { data, error } = await this.client
        .from('content_boxes')
        .select('*')
        .eq('id', boxId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching content box ${boxId}:`, error);
      return this.simulateContentBox(boxId);
    }
  }

  async updateContentBox(boxId, content) {
    if (this.useSimulatedData) {
      console.log(`📝 Simulated update for box ${boxId}:`, content);
      return { success: true, data: content };
    }

    try {
      const { data, error } = await this.client
        .from('content_boxes')
        .update(content)
        .eq('id', boxId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error(`Error updating content box ${boxId}:`, error);
      return { success: false, error: error.message };
    }
  }

  async getAllContentBoxes() {
    if (this.useSimulatedData) {
      return [
        this.simulateContentBox(1),
        this.simulateContentBox(2)
      ];
    }

    try {
      const { data, error } = await this.client
        .from('content_boxes')
        .select('*')
        .order('id');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching all content boxes:', error);
      return [
        this.simulateContentBox(1),
        this.simulateContentBox(2)
      ];
    }
  }

  // ===== WEATHER DATA METHODS =====
  async getWeatherData() {
    if (this.useSimulatedData) {
      return this.simulateWeatherData();
    }

    try {
      const { data, error } = await this.client
        .from('weather_cache')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return this.simulateWeatherData();
    }
  }

  async saveWeatherData(weatherData) {
    if (this.useSimulatedData) {
      console.log('🌤️ Simulated weather data save:', weatherData);
      return { success: true };
    }

    try {
      const { data, error } = await this.client
        .from('weather_cache')
        .upsert(weatherData);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error saving weather data:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== EXCHANGE RATES METHODS =====
  async getExchangeRates() {
    if (this.useSimulatedData) {
      return this.simulateExchangeRates();
    }

    try {
      const { data, error } = await this.client
        .from('exchange_rates')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      return this.simulateExchangeRates();
    }
  }

  async saveExchangeRates(rates) {
    if (this.useSimulatedData) {
      console.log('💱 Simulated exchange rates save:', rates);
      return { success: true };
    }

    try {
      const { data, error } = await this.client
        .from('exchange_rates')
        .upsert({
          rates: rates,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error saving exchange rates:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== SIMULATION METHODS =====
  simulateContentBox(boxId) {
    const mockBoxes = {
      1: {
        id: 1,
        title: 'Descubra o Chile',
        content: '<h3>Descubra o Chile</h3><p>Informações essenciais para sua viagem ao Chile. Clima, câmbio, voos e muito mais em tempo real.</p><ul><li>Clima atualizado das principais cidades</li><li>Taxas de câmbio em tempo real</li><li>Status de voos Chile ↔ Brasil</li></ul>',
        image_url: '/assets/images/chile-landscape.jpg',
        is_active: true,
        updated_at: new Date().toISOString()
      },
      2: {
        id: 2,
        title: 'Turismo no Chile',
        content: '<h3>Turismo no Chile</h3><p>Explore os melhores destinos, vinícolas, centros de esqui e experiências únicas que o Chile tem a oferecer.</p><ul><li>Vinícolas do Vale do Maipo</li><li>Centros de esqui nos Andes</li><li>Deserto do Atacama</li><li>Patagônia Chilena</li></ul>',
        image_url: '/assets/images/chile-tourism.jpg',
        is_active: true,
        updated_at: new Date().toISOString()
      }
    };

    return mockBoxes[boxId] || {
      id: boxId,
      title: `Conteúdo ${boxId}`,
      content: `<p>Conteúdo simulado para a caixa ${boxId}</p>`,
      image_url: '/assets/images/placeholder.jpg',
      is_active: true,
      updated_at: new Date().toISOString()
    };
  }

  simulateWeatherData() {
    const cities = ['Santiago', 'Valparaíso', 'Viña del Mar', 'Concepción', 'La Serena'];
    
    return cities.map(city => ({
      city: city,
      temperature: Math.floor(Math.random() * 15) + 10, // 10-25°C
      description: ['Ensolarado', 'Parcialmente nublado', 'Nublado', 'Chuva leve'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      wind_speed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      updated_at: new Date().toISOString()
    }));
  }

  simulateExchangeRates() {
    const baseRates = {
      brl_clp: 150.25,
      clp_brl: 0.0067,
      brl_usd: 0.18,
      usd_brl: 5.55,
      clp_usd: 0.0012,
      usd_clp: 833.33
    };

    // Adicionar variação aleatória pequena
    const rates = {};
    Object.keys(baseRates).forEach(key => {
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      rates[key] = baseRates[key] * (1 + variation);
    });

    return {
      rates: rates,
      updated_at: new Date().toISOString()
    };
  }

  // ===== AUTHENTICATION METHODS (para admin) =====
  async signIn(email, password) {
    if (this.useSimulatedData) {
      // Simular login de admin
      if (email === 'admin@chile-ao-vivo.com' && password === 'admin123') {
        return {
          success: true,
          user: {
            id: 1,
            email: email,
            role: 'admin'
          }
        };
      } else {
        return {
          success: false,
          error: 'Credenciais inválidas'
        };
      }
    }

    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) throw error;
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error signing in:', error);
      return { success: false, error: error.message };
    }
  }

  async signOut() {
    if (this.useSimulatedData) {
      console.log('👋 Simulated sign out');
      return { success: true };
    }

    try {
      const { error } = await this.client.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return { success: false, error: error.message };
    }
  }

  async getCurrentUser() {
    if (this.useSimulatedData) {
      // Simular usuário logado (ou null se não logado)
      return null;
    }

    try {
      const { data: { user } } = await this.client.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
}

// ===== WEATHER API INTEGRATION =====
class WeatherAPI {
  constructor() {
    this.apiKey = window.CONFIG?.WEATHER?.API_KEY || 'your-weather-api-key';
    this.baseUrl = window.CONFIG?.WEATHER?.BASE_URL || 'https://api.openweathermap.org/data/2.5';
    this.useSimulatedData = !this.apiKey || this.apiKey === 'your-weather-api-key' || this.apiKey === 'VITE_OPENWEATHER_API_KEY';
  }

  async getWeatherForCity(city, countryCode = 'CL') {
    if (this.useSimulatedData) {
      return this.simulateWeatherForCity(city);
    }

    try {
      const url = `${this.baseUrl}/weather?q=${city},${countryCode}&appid=${this.apiKey}&units=metric&lang=pt`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        city: data.name,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        wind_speed: Math.round(data.wind.speed * 3.6), // m/s to km/h
        icon: data.weather[0].icon
      };
    } catch (error) {
      console.error(`Error fetching weather for ${city}:`, error);
      return this.simulateWeatherForCity(city);
    }
  }

  simulateWeatherForCity(city) {
    const temps = {
      'Santiago': Math.floor(Math.random() * 10) + 15,
      'Valparaíso': Math.floor(Math.random() * 8) + 12,
      'Viña del Mar': Math.floor(Math.random() * 8) + 12,
      'Concepción': Math.floor(Math.random() * 12) + 8,
      'La Serena': Math.floor(Math.random() * 8) + 18
    };

    return {
      city: city,
      temperature: temps[city] || Math.floor(Math.random() * 15) + 10,
      description: ['Ensolarado', 'Parcialmente nublado', 'Nublado'][Math.floor(Math.random() * 3)],
      humidity: Math.floor(Math.random() * 40) + 40,
      wind_speed: Math.floor(Math.random() * 20) + 5,
      icon: '01d'
    };
  }
}

// ===== EXCHANGE RATE API INTEGRATION =====
class ExchangeRateAPI {
  constructor() {
    this.apiKey = window.CONFIG?.EXCHANGE?.API_KEY || 'your-exchange-api-key';
    this.baseUrl = window.CONFIG?.EXCHANGE?.BASE_URL || 'https://api.exchangerate-api.com/v4/latest';
    this.useSimulatedData = !this.apiKey || this.apiKey === 'your-exchange-api-key' || this.apiKey === 'VITE_EXCHANGE_API_KEY';
  }

  async getExchangeRates() {
    if (this.useSimulatedData) {
      return this.simulateExchangeRates();
    }

    try {
      // Obtener tasas base desde USD
      const usdResponse = await fetch(`${this.baseUrl}/USD`);
      const usdData = await usdResponse.json();
      
      const brlResponse = await fetch(`${this.baseUrl}/BRL`);
      const brlData = await brlResponse.json();

      return {
        brl_clp: brlData.rates.CLP,
        clp_brl: 1 / brlData.rates.CLP,
        brl_usd: brlData.rates.USD,
        usd_brl: usdData.rates.BRL,
        clp_usd: usdData.rates.CLP ? (1 / usdData.rates.CLP) : 0.0012,
        usd_clp: usdData.rates.CLP
      };
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      return this.simulateExchangeRates();
    }
  }

  simulateExchangeRates() {
    const baseRates = {
      brl_clp: 150.25,
      clp_brl: 0.0067,
      brl_usd: 0.18,
      usd_brl: 5.55,
      clp_usd: 0.0012,
      usd_clp: 833.33
    };

    // Adicionar variação aleatória pequena
    const rates = {};
    Object.keys(baseRates).forEach(key => {
      const variation = (Math.random() - 0.5) * 0.05; // ±2.5% variation
      rates[key] = baseRates[key] * (1 + variation);
    });

    return rates;
  }
}

// ===== EXPORT TO GLOBAL SCOPE =====
window.SupabaseClient = SupabaseClient;
window.WeatherAPI = WeatherAPI;
window.ExchangeRateAPI = ExchangeRateAPI;

// ===== AUTO-INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  window.supabaseClient = new SupabaseClient();
  window.weatherAPI = new WeatherAPI();
  window.exchangeRateAPI = new ExchangeRateAPI();
  
  console.log('🔗 Data clients initialized');
});
