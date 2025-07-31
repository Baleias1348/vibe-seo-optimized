// ===== HOMEPAGE EXACTO - COPIA DEL REACT ORIGINAL =====

class HomePage {
  constructor() {
    this.weather = {};
    this.rates = {};
    this.loading = true;
    this.error = null;
    this.currentDateTime = new Date();
    
    // Ciudades principales de Chile (exacto del original)
    this.cities = [
      { name: 'Santiago', q: 'Santiago,CL' },
      { name: 'Valparaíso', q: 'Valparaiso,CL' },
      { name: 'Viña del Mar', q: 'Vina del Mar,CL' },
      { name: 'Concepción', q: 'Concepcion,CL' },
      { name: 'La Serena', q: 'La Serena,CL' }
    ];
    
    this.init();
  }

  async init() {
    // Inicializar ticker de tiempo
    this.startTimeUpdater();
    
    // Fetch data inicial
    await this.fetchData();
    
    // Actualizar ticker
    this.updateTicker();
    
    // Inicializar flight widget
    this.initFlightWidget();
    
    // Cargar boxes desde Supabase
    this.loadSupabaseBoxes();
    
    // Cargar banner homepage
    this.loadHomepageBanner();
    
    // Intervalo de actualización (60s como el original)
    setInterval(() => {
      this.fetchData();
    }, 60000);
    
    console.log('✅ HomePage exacto inicializado');
  }

  startTimeUpdater() {
    // Actualizar cada minuto como el original
    setInterval(() => {
      this.currentDateTime = new Date();
      this.updateTicker();
    }, 60000);
  }

  async fetchData() {
    this.loading = true;
    this.error = null;
    
    try {
      // OpenWeatherMap (exacto del original)
      const weatherResults = {};
      for (const city of this.cities) {
        try {
          const apiKey = window.ENV_CONFIG?.OPENWEATHER_API_KEY || 'demo_key';
          const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city.q)}&units=metric&appid=${apiKey}&lang=es`);
          const data = await res.json();
          
          if (data && data.main && typeof data.main.temp === 'number') {
            weatherResults[city.name] = `${Math.round(data.main.temp)}ºC`;
          } else {
            weatherResults[city.name] = '--ºC';
          }
        } catch {
          weatherResults[city.name] = '--ºC';
        }
      }
      this.weather = weatherResults;

      // Fetch rates from open.er-api.com (exacto del original)
      const [clpRes, brlRes, usdRes] = await Promise.all([
        fetch('https://open.er-api.com/v6/latest/CLP').then(r => r.json()),
        fetch('https://open.er-api.com/v6/latest/BRL').then(r => r.json()),
        fetch('https://open.er-api.com/v6/latest/USD').then(r => r.json()),
      ]);
      
      // Defensive: check API success (exacto del original)
      if (clpRes.result !== 'success' || brlRes.result !== 'success' || usdRes.result !== 'success') {
        throw new Error('No se pudieron obtener tasas de cambio');
      }
      
      // Rates calculation (exacto del original)
      const clp_brl = clpRes.rates.BRL || null;
      const clp_usd = clpRes.rates.USD || null;
      const brl_clp = brlRes.rates.CLP || null;
      const brl_usd = brlRes.rates.USD || null;
      const usd_brl = usdRes.rates.BRL || null;
      const usd_clp = usdRes.rates.CLP || null;
      
      this.rates = { brl_clp, clp_brl, brl_usd, usd_brl, clp_usd, usd_clp };
      this.loading = false;
      
      // Actualizar ticker después de fetch
      this.updateTicker();
      this.updateWeatherCards();
      this.updateRatesCards();
      this.updateSystemStatus();
      
    } catch (err) {
      this.error = 'No se pudo cargar toda la información.';
      this.loading = false;
      this.updateSystemStatus();
      console.error('Error fetching data:', err);
    }
  }

  updateTicker() {
    const tickerContent = document.getElementById('ticker-content');
    if (!tickerContent) return;

    // Formatear fecha exacto como el original
    const formattedDate = this.formatDate(this.currentDateTime);
    const horaBrasil = this.formatTime(this.currentDateTime);
    const currentDateChile = new Date(this.currentDateTime.getTime() - 60 * 60 * 1000);
    const horaChile = this.formatTime(currentDateChile);
    const dateAndTimeText = `Informação do dia: ${formattedDate}, Hora do Brasil (São Paulo): ${horaBrasil}, Hora do Chile (Santiago): ${horaChile}`;

    // Weather items (exacto del original)
    const weatherItems = this.cities.map(city => ({
      icon: '☁️',
      text: `${city.name}: ${this.weather[city.name] || '--ºC'}`,
      id: `weather_${city.name.toLowerCase().replace(/\s/g, '_')}`
    }));

    // Rate items (exacto del original con formateo)
    const rateItems = [
      { icon: '💰', text: `BRL → CLP: ${this.rates.brl_clp ? this.formatCurrency(this.rates.brl_clp, 'CLP') : '--'}`, id: 'brl_clp' },
      { icon: '💰', text: `CLP → BRL: ${this.rates.clp_brl ? this.formatCurrency(this.rates.clp_brl, 'BRL') : '--'}`, id: 'clp_brl' },
      { icon: '💰', text: `BRL → USD: ${this.rates.brl_usd ? this.formatCurrency(this.rates.brl_usd, 'USD') : '--'}`, id: 'brl_usd' },
      { icon: '💰', text: `USD → BRL: ${this.rates.usd_brl ? this.formatCurrency(this.rates.usd_brl, 'BRL') : '--'}`, id: 'usd_brl' },
      { icon: '💰', text: `CLP → USD: ${this.rates.clp_usd ? this.formatCurrency(this.rates.clp_usd, 'USD') : '--'}`, id: 'clp_usd' },
      { icon: '💰', text: `USD → CLP: ${this.rates.usd_clp ? this.formatCurrency(this.rates.usd_clp, 'CLP') : '--'}`, id: 'usd_clp' },
    ];

    // Ticker content (exacto del original)
    const tickerItems = [
      { icon: '🌅', text: dateAndTimeText, id: 'datetime' },
      ...weatherItems,
      ...rateItems
    ];

    // Render ticker items
    tickerContent.innerHTML = tickerItems.map(item => `
      <div class="flex items-center space-x-3 mx-5">
        <span class="text-xl">${item.icon}</span>
        <span class="whitespace-nowrap text-lg md:text-xl italic font-bold">${item.text}</span>
      </div>
    `).join('');

    // Agregar indicador de loading si está cargando
    if (this.loading) {
      const loadingIndicator = document.createElement('span');
      loadingIndicator.className = 'absolute bottom-1 right-2 bg-gray-800/80 text-gray-100 text-xs px-2 py-1 rounded shadow z-30 pointer-events-none';
      loadingIndicator.textContent = 'Atualizando cotações...';
      document.getElementById('news-ticker').appendChild(loadingIndicator);
    }

    // Agregar error si existe
    if (this.error) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'text-yellow-200 text-xs text-center mt-1';
      errorDiv.textContent = this.error.replace('No se pudo cargar toda la información.', 'Não foi possível carregar todas as informações.');
      document.getElementById('news-ticker').appendChild(errorDiv);
    }
  }

  // Helpers para formateo (replicando date-fns del original)
  formatDate(date) {
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} de ${month} de ${year}`;
  }

  formatTime(date) {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  formatCurrency(value, currency) {
    const locales = {
      'BRL': 'pt-BR',
      'CLP': 'es-CL',
      'USD': 'en-US'
    };

    try {
      return value.toLocaleString(locales[currency], {
        style: 'currency',
        currency: currency
      });
    } catch (error) {
      return `${value.toFixed(4)} ${currency}`;
    }
  }

  updateWeatherCards() {
    const weatherCards = document.getElementById('weather-cards');
    if (!weatherCards) return;

    const cities = [
      { name: "Santiago", key: "Santiago" },
      { name: "Viña del Mar", key: "Viña del Mar" },
      { name: "Valparaíso", key: "Valparaíso" },
      { name: "Concepción", key: "Concepción" }
    ];

    weatherCards.innerHTML = cities.map(city => {
      const temp = this.weather[city.key] || '--ºC';
      return `
        <div class="flex flex-col items-center justify-between bg-[#0c37e6] rounded-xl p-5 text-white shadow-md w-full h-full min-h-[90px] max-h-[120px]">
          <div class="font-semibold text-sm mb-2 text-white/80">${city.name}</div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-2xl">☁️</span>
            <span class="text-3xl md:text-4xl font-bold">${temp}</span>
          </div>
          <div class="text-xs text-white/70 italic">Atualizado agora</div>
        </div>
      `;
    }).join('');
  }

  updateRatesCards() {
    const ratesCards = document.getElementById('rates-cards');
    if (!ratesCards) return;

    const rateItems = [
      { from: 'CLP', to: 'BRL', value: this.rates.clp_brl, flagFrom: '🇨🇱', flagTo: '🇧🇷' },
      { from: 'BRL', to: 'CLP', value: this.rates.brl_clp, flagFrom: '🇧🇷', flagTo: '🇨🇱' }
    ];

    let ratesHTML = rateItems.map(rate => {
      const formattedValue = rate.value ? this.formatCurrency(rate.value, rate.to) : '--';
      return `
        <div class="bg-[#05882f] rounded-xl p-5 flex flex-col items-center justify-center text-white shadow-md w-full h-full min-h-[90px] max-h-[120px]">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">${rate.flagFrom}</span>
            <span class="font-bold text-lg">${rate.from}</span>
            <span class="w-5 h-5 mx-2">→</span>
            <span class="font-bold text-lg">${rate.to}</span>
            <span class="text-lg">${rate.flagTo}</span>
          </div>
          <div class="text-2xl font-bold mb-2 text-center w-full">${formattedValue}</div>
          <a href="/converter-reais-em-pesos-chilenos" class="text-xs underline hover:text-yellow-300 text-center w-full block">Vá para o conversor de moedas</a>
        </div>
      `;
    }).join('');

    // Agregar card de casas de cambio
    ratesHTML += `
      <div class="bg-[#05882f] rounded-xl p-5 flex flex-col items-center justify-center text-white shadow-md cursor-pointer hover:bg-green-700 transition-colors w-full h-full min-h-[90px] max-h-[120px]">
        <div class="font-bold text-lg mb-1 text-center w-full">Casas de Câmbio</div>
        <div class="text-xs mb-2 text-center w-full">Classificação com avaliações reais</div>
      </div>
    `;

    ratesCards.innerHTML = ratesHTML;
  }

  initFlightWidget() {
    const flightWidget = document.getElementById('flight-search-widget');
    if (!flightWidget) return;

    flightWidget.innerHTML = `
      <div class="space-y-6">
        <!-- Búsqueda por número de vuelo -->
        <form id="flight-number-form" class="space-y-4">
          <label class="block text-gray-700 font-semibold">Pesquisar voo por número</label>
          <div class="flex gap-2">
            <input
              type="text"
              id="flight-number-input"
              placeholder="Ex: LA800, SKY401"
              class="p-3 rounded-lg border border-gray-300 focus:outline-none flex-1"
              required
            />
            <button
              type="submit"
              class="bg-orange-400 hover:bg-orange-500 text-white font-bold px-5 py-2 rounded-lg shadow"
            >Buscar</button>
          </div>
          <div class="text-gray-500 text-xs">Ingrese o número exato do voo, por exemplo <b>LA800</b> ou <b>SKY401</b>.</div>
          <div id="flight-error" class="text-red-500 text-sm hidden"></div>
        </form>

        <!-- Búsqueda por ruta -->
        <div>
          <h3 class="text-gray-700 font-semibold text-lg mb-4">Pesquisar voos por rota</h3>
          <form id="route-form" class="space-y-4">
            <select id="origin-select" class="p-3 rounded-lg border border-gray-300 focus:outline-none w-full bg-white">
              <option value="">Origem</option>
              <optgroup label="Chile">
                <option value="SCL">Santiago (SCL)</option>
                <option value="CCP">Concepción (CCP)</option>
                <option value="ANF">Antofagasta (ANF)</option>
              </optgroup>
              <optgroup label="Brasil">
                <option value="GRU">São Paulo - Guarulhos (GRU)</option>
                <option value="CGH">São Paulo - Congonhas (CGH)</option>
                <option value="VCP">São Paulo - Viracopos (VCP)</option>
                <option value="GIG">Rio de Janeiro - Galeão (GIG)</option>
                <option value="SDU">Rio de Janeiro - Santos Dumont (SDU)</option>
                <option value="FLN">Florianópolis (FLN)</option>
                <option value="POA">Porto Alegre (POA)</option>
                <option value="CNF">Belo Horizonte (CNF)</option>
              </optgroup>
            </select>
            
            <select id="dest-select" class="p-3 rounded-lg border border-gray-300 focus:outline-none w-full bg-white">
              <option value="">Destino</option>
              <optgroup label="Chile">
                <option value="SCL">Santiago (SCL)</option>
                <option value="CCP">Concepción (CCP)</option>
                <option value="ANF">Antofagasta (ANF)</option>
              </optgroup>
              <optgroup label="Brasil">
                <option value="GRU">São Paulo - Guarulhos (GRU)</option>
                <option value="CGH">São Paulo - Congonhas (CGH)</option>
                <option value="VCP">São Paulo - Viracopos (VCP)</option>
                <option value="GIG">Rio de Janeiro - Galeão (GIG)</option>
                <option value="SDU">Rio de Janeiro - Santos Dumont (SDU)</option>
                <option value="FLN">Florianópolis (FLN)</option>
                <option value="POA">Porto Alegre (POA)</option>
                <option value="CNF">Belo Horizonte (CNF)</option>
              </optgroup>
            </select>
            
            <button
              type="submit"
              class="bg-orange-400 hover:bg-orange-500 text-white font-bold px-5 py-2 rounded-lg shadow w-full"
            >Buscar voos</button>
            <div id="route-error" class="text-red-500 text-sm hidden"></div>
          </form>
        </div>
      </div>
    `;

    // Event listeners
    document.getElementById('flight-number-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFlightSearch();
    });

    document.getElementById('route-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleRouteSearch();
    });
  }

  handleFlightSearch() {
    const input = document.getElementById('flight-number-input');
    const errorDiv = document.getElementById('flight-error');
    
    const flightNumber = input.value.trim();
    if (!flightNumber) {
      this.showError(errorDiv, 'Deve inserir o número do voo');
      return;
    }

    // Simular búsqueda (en producción conectaría con la API real)
    this.showError(errorDiv, 'Funcionalidade em desenvolvimento. Em breve conectaremos com a API de voos.');
  }

  handleRouteSearch() {
    const origin = document.getElementById('origin-select').value;
    const dest = document.getElementById('dest-select').value;
    const errorDiv = document.getElementById('route-error');
    
    if (!origin || !dest) {
      this.showError(errorDiv, 'Deve selecionar origem e destino');
      return;
    }

    // Simular búsqueda (en producción conectaría con la API real)
    this.showError(errorDiv, 'Funcionalidade em desenvolvimento. Em breve conectaremos com a API de voos.');
  }

  showError(errorDiv, message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    setTimeout(() => {
      errorDiv.classList.add('hidden');
    }, 5000);
  }

  async loadSupabaseBoxes() {
    try {
      // Inicializar Supabase client
      const supabaseUrl = window.ENV_CONFIG?.SUPABASE_URL || 'https://demo.supabase.co';
      const supabaseKey = window.ENV_CONFIG?.SUPABASE_ANON_KEY || 'demo_key';
      
      if (supabaseUrl === 'https://demo.supabase.co' || supabaseKey === 'demo_key') {
        console.log('📊 Supabase no configurado, usando contenido simulado');
        this.loadMockBoxes();
        return;
      }
      
      const { createClient } = supabase;
      const supabaseClient = createClient(supabaseUrl, supabaseKey);
      
      // Cargar box 1
      const { data: box1Data, error: box1Error } = await supabaseClient
        .from('homepage_boxes')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (!box1Error && box1Data) {
        this.renderBox(1, box1Data);
      } else {
        console.error('Error cargando box 1:', box1Error);
        this.renderBox(1, { id: 1, image_url: '', content: 'Erro ao carregar conteúdo do Box 1' });
      }
      
      // Cargar box 2
      const { data: box2Data, error: box2Error } = await supabaseClient
        .from('homepage_boxes')
        .select('*')
        .eq('id', 2)
        .single();
      
      if (!box2Error && box2Data) {
        this.renderBox(2, box2Data);
      } else {
        console.error('Error cargando box 2:', box2Error);
        this.renderBox(2, { id: 2, image_url: '', content: 'Erro ao carregar conteúdo do Box 2' });
      }
      
    } catch (error) {
      console.error('Error general cargando boxes:', error);
      this.loadMockBoxes();
    }
  }

  loadMockBoxes() {
    // Contenido simulado para desarrollo
    const mockBox1 = {
      id: 1,
      image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1470&auto=format&fit=crop',
      content: '<h3>Descubra o Chile</h3><p>Explore as maravilhas do Chile, desde os desertos do norte até as geleiras do sul. Uma experiência única espera por você.</p><ul><li>Paisagens incríveis</li><li>Cultura rica</li><li>Gastronomia excepcional</li></ul>'
    };
    
    const mockBox2 = {
      id: 2,
      image_url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?q=80&w=1470&auto=format&fit=crop',
      content: '<h3>Vinhos Chilenos</h3><p>Descubra os melhores vinhos do Chile, produzidos nos vales mais prestigiosos do país.</p><ul><li>Valle de Casablanca</li><li>Valle de Colchagua</li><li>Valle del Maipo</li></ul><p><strong>Degustações disponíveis!</strong></p>'
    };
    
    this.renderBox(1, mockBox1);
    this.renderBox(2, mockBox2);
  }

  renderBox(boxNumber, boxData) {
    const imageContainer = document.getElementById(`box${boxNumber}-image`);
    const contentContainer = document.getElementById(`box${boxNumber}-content`);
    
    if (imageContainer) {
      if (boxData.image_url) {
        imageContainer.innerHTML = `
          <img 
            src="${boxData.image_url}" 
            alt="" 
            class="w-full h-full object-cover"
            onerror="this.parentElement.innerHTML='<span class=&quot;text-gray-500&quot;>Erro ao carregar imagem</span>'"
          />
        `;
      } else {
        imageContainer.innerHTML = '<span class="text-gray-500">Sem imagem</span>';
      }
    }
    
    if (contentContainer) {
      if (boxData.content) {
        contentContainer.innerHTML = boxData.content;
      } else {
        contentContainer.innerHTML = '<p class="text-gray-500 italic">Não há conteúdo disponível</p>';
      }
    }
  }

  async loadHomepageBanner() {
    try {
      // Inicializar Supabase client
      const supabaseUrl = window.ENV_CONFIG?.SUPABASE_URL || 'https://demo.supabase.co';
      const supabaseKey = window.ENV_CONFIG?.SUPABASE_ANON_KEY || 'demo_key';
      
      if (supabaseUrl === 'https://demo.supabase.co' || supabaseKey === 'demo_key') {
        console.log('🎨 Supabase no configurado, usando banner simulado');
        this.loadMockBanner();
        return;
      }
      
      const { createClient } = supabase;
      const supabaseClient = createClient(supabaseUrl, supabaseKey);
      
      // Cargar banner desde homepage_banners
      const { data: bannerData, error: bannerError } = await supabaseClient
        .from('homepage_banners')
        .select('*')
        .eq('slug', 'boxbanner1')
        .single();
      
      if (!bannerError && bannerData) {
        this.renderBanner(bannerData);
      } else {
        console.error('Error cargando banner:', bannerError);
        this.loadMockBanner();
      }
      
    } catch (error) {
      console.error('Error general cargando banner:', error);
      this.loadMockBanner();
    }
  }

  loadMockBanner() {
    // Banner simulado para desarrollo
    const mockBanner = {
      slug: 'boxbanner1',
      image_url_left: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1470&auto=format&fit=crop',
      image_url_right: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1470&auto=format&fit=crop'
    };
    
    this.renderBanner(mockBanner);
  }

  renderBanner(bannerData) {
    const leftImageContainer = document.getElementById('banner-left-image');
    const rightImageContainer = document.getElementById('banner-right-image');
    
    if (leftImageContainer) {
      if (bannerData.image_url_left) {
        leftImageContainer.innerHTML = `
          <img
            src="${bannerData.image_url_left}"
            alt="Banner esquerdo"
            class="w-full h-full object-contain"
            style="max-height: 100%; max-width: 100%"
            onerror="this.parentElement.innerHTML='<span class=&quot;text-gray-400&quot;>Erro ao carregar imagem</span>'"
          />
        `;
      } else {
        leftImageContainer.innerHTML = '<span class="text-gray-400">Sem imagem</span>';
      }
    }
    
    if (rightImageContainer) {
      if (bannerData.image_url_right) {
        rightImageContainer.innerHTML = `
          <img
            src="${bannerData.image_url_right}"
            alt="Banner direito"
            class="w-full h-full object-contain"
            style="max-height: 100%; max-width: 100%"
            onerror="this.parentElement.innerHTML='<span class=&quot;text-gray-400&quot;>Erro ao carregar imagem</span>'"
          />
        `;
      } else {
        rightImageContainer.innerHTML = '<span class="text-gray-400">Sem imagem</span>';
      }
    }
  }

  updateSystemStatus() {
    const weatherStatus = document.getElementById('weather-status');
    const exchangeStatus = document.getElementById('exchange-status');
    
    if (weatherStatus) {
      const hasWeatherData = Object.keys(this.weather).length > 0 && 
                            Object.values(this.weather).some(temp => temp !== '--ºC');
      weatherStatus.textContent = hasWeatherData ? 'Funcionando' : 'Erro/Simulado';
      weatherStatus.className = hasWeatherData ? 'text-green-600' : 'text-red-600';
    }
    
    if (exchangeStatus) {
      const hasExchangeData = Object.keys(this.rates).length > 0 && 
                             Object.values(this.rates).some(rate => rate !== null);
      exchangeStatus.textContent = hasExchangeData ? 'Funcionando' : 'Erro/Simulado';
      exchangeStatus.className = hasExchangeData ? 'text-green-600' : 'text-red-600';
    }
  }
}

// Agregar animación CSS para el ticker (exacto del original)
const style = document.createElement('style');
style.textContent = `
  @keyframes marquee {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
  
  .animate-marquee {
    animation: marquee 40s linear infinite;
  }
  
  .animate-marquee:hover {
    animation-play-state: paused;
  }
`;
document.head.appendChild(style);

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.homePage = new HomePage();
  console.log('🏠 HomePage exacto cargado');
});
